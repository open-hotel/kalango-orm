import { Database } from "arangojs";
import { LoadBalancingStrategy } from "arangojs/lib/cjs/connection";
import {
  ENTITY_WAIT_FOR_SYNC,
  ENTITY_INDEXES,
  ENTITY_NAME
} from "./keys/entity.keys";
import { ArangoIndex } from "./types/Indexes";
import { Metadata } from "./metadata/MetadataManager";
import { Repository } from "./Repository";

function arrayIsEqual(arrA: any[], arrB: any[]) {
  return arrA.length === arrB.length && arrA.every((a, i) => arrB[i] === a);
}

function containsIn(a: Object, b: Object) {
  for (let k in a) {
    if (a[k] !== b[k]) {
      if (Array.isArray(a[k]) && arrayIsEqual(a[k], b[k])) {
        continue;
      }
      return false;
    }
  }
  return true;
}

export interface ArangoConfig {
  url?: string | string[];
  isAbsolute?: boolean;
  arangoVersion?: number;
  loadBalancingStrategy?: LoadBalancingStrategy;
  maxRetries?: false | number;
  agent?: any;
  agentOptions?: {
    [key: string]: any;
  };
  headers?: {
    [key: string]: string;
  };
}

export interface ConnectionOptions extends ArangoConfig {
  database?: string;
  username?: string;
  password?: string;
  syncronize?: boolean;
  log?: boolean;
  entities?: Function[];
}

export class Connection {
  public options: ConnectionOptions;
  public db: Database = new Database();

  constructor(options: ConnectionOptions) {
    this.options = {
      url: "arangodb://localhost:8529",
      username: "root",
      password: "root",
      database: "db",
      syncronize: false,
      log: true,
      entities: [],
      ...options
    };

    this.db = new Database(this.options);
  }

  getEntity(name: string | Function) {
    return this.options.entities.find(
      e => e === name || Metadata.get(e, ENTITY_NAME) === name
    );
  }

  repositoryFor<T extends object>(entity: string | Function) {
    return new Repository<T>(this, entity)
  }

  async sync() {
    this.log("Sync...");

    const { entities } = this.options;
    const entityLen = entities.length;

    for (let i = 0; i < entityLen; i++) {
      const entity = entities[i];
      const name = Metadata.get(entity, ENTITY_NAME);
      const indexes = Metadata.get(entity, ENTITY_INDEXES);
      const collection = this.db.collection(name);

      if (!(await collection.exists())) {
        this.log(`Creating "${name}" collection...`);
        await collection.create({
          waitForSync: !!Metadata.get(entity, ENTITY_WAIT_FOR_SYNC)
        });
      }

      const collectionIndexes: ArangoIndex[] = await collection.indexes();
      const excludedIndexes = collectionIndexes.filter(
        idx => idx.name !== "primary" && !indexes.find(i => i.name === idx.name)
      );

      for (let index of excludedIndexes) {
        this.log(`Droping Index "${index.name}" in "${name}" collection...`);
        collection.dropIndex(index.name);
      }

      for (let index of indexes) {
        const findIndex = collectionIndexes.find(
          idx => idx.id === index.id || idx.name === index.name
        );

        if (findIndex) {
          if (containsIn(index, findIndex)) continue;
          this.log(`Updating Index ${index.name} in "${name}" collection...`);
          collection.dropIndex(index.name);
          collection.createIndex(index);
          continue;
        }
        this.log(`Creating Index ${index.name} in "${name}" collection...`);
        collection.createIndex(index);
      }
    }
  }

  log(...args: any[]) {
    if (this.options.log) {
      console.log(`\x1b[32;4mCALANGO:\x1b[0m`, ...args);
    }

    return this;
  }

  async connect() {
    this.db.useBasicAuth(this.options.username, this.options.password);
    this.db.useDatabase(this.options.database);

    if (this.options.syncronize) {
      await this.sync();
    }

    return this;
  }
}

export function createConnection(options: Partial<ConnectionOptions>) {
  return new Connection(options).connect();
}

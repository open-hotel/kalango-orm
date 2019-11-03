import { Database } from "arangojs";
import { LoadBalancingStrategy } from "arangojs/lib/cjs/connection";
import { ENTITY_ATTRIBUTES, ENTITY_WAIT_FOR_SYNC, ENTITY_INDEXES } from "./keys/entity.keys";
import { ArangoIndex } from "./types/Index";

export interface ArangoConfig {
  url: string | string[];
  isAbsolute: boolean;
  arangoVersion: number;
  loadBalancingStrategy: LoadBalancingStrategy;
  maxRetries: false | number;
  agent: any;
  agentOptions: {
    [key: string]: any;
  };
  headers: {
    [key: string]: string;
  };
}

export interface ConnectionOptions extends ArangoConfig {
  database: string;
  username: string;
  password: string;
  syncronize: boolean;
  log: boolean;
  entities: Function[];
}

export class Connection {
  public options: ConnectionOptions;
  public db: Database;

  constructor(options: Partial<ConnectionOptions>) {
    // this.options = {
    //   url: "arangodb://localhost:8529",
    //   username: "root",
    //   password: "root",
    //   database: "db",
    //   syncronize: false,
    //   log: true,
    //   entities: [],
    //   ...options
    // };
  }

  async sync() {
    const { entities } = this.options

    if (!(await this.db.exists())) {
      await this.db.createDatabase(this.options.database)
    }

    const entityLen = entities.length
    
    for (let i = 0; i < entityLen; i++) {
      const entity = entities[i]
      const name = Reflect.getMetadata(ENTITY_ATTRIBUTES, entity)
      const indexes = Reflect.getMetadata(ENTITY_INDEXES, entity)
      const collection = this.db.collection(name)

      if (!(await collection.exists())) {
        this.log(`Creating "${name}" collection...`)
        await collection.create({
          waitForSync: !!Reflect.getMetadata(ENTITY_WAIT_FOR_SYNC, entity),
        })
      }

      const collectionIndexes: ArangoIndex[] = await collection.indexes()
      
      for (let index of indexes) {
        if (collectionIndexes.find(idx => index.id === idx.id || index.name === idx.name)) {
          continue
        }
        this.log(`Creating Index "${index.name}" in "${name}" collection...`)
      }
    }
  }

  log (...args) {
    if (this.options.log) {
      console.log(`CALANGO: `, ...args)
    }

    return this
  }

  async connect() {
    this.db = new Database(this.options);
    this.db.useDatabase(this.options.database);

    if (this.options.syncronize) {
      await this.sync();
    }
  }
}

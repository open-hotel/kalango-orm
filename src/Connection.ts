import { Database } from "arangojs";
import { LoadBalancingStrategy } from "arangojs/lib/cjs/connection";

export interface ArangoConfig {
  url: string | string[]
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

  connect() {
    this.db = new Database({});
  }
}

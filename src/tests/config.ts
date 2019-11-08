import { ConnectionOptions } from "..";

const config:Partial<ConnectionOptions> = {
  database: '_system',
  password: 'root',
  username: 'root',
  url: 'arangodb://localhost:8529',
  log: true,
  syncronize: true
}

export default config
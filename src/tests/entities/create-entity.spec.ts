import { createConnection, Connection, Entity, Attribute } from "../../index";
import config from "../config";
import { expect } from "chai";
import { HashIndex } from "../../decorators";
import { ENTITY_INDEXES } from "../../keys/entity.keys";
import { MetadataManager } from "../../metadata/MetadataManager";

@Entity()
class TestEntity {
  @Attribute()
  name: string;

  @HashIndex({ unique: true, name: 'TEST' })
  @Attribute()
  email: string;
}

console.log('INDEXES', MetadataManager.get(TestEntity, ENTITY_INDEXES))

describe("Connection", () => {
  it("Should be create a connection", done => {
    createConnection(config)
      .then(async con => {
        expect(con).instanceOf(Connection);
        expect(await con.db.query("RETURN 1"));
        con.db.close();
        done();
      })
      .catch(done);
  });
  it("Should be create a Entity", done => {
    createConnection({
      ...config,
      entities: [TestEntity]
    })
      .then(async con => {
        expect(con).instanceOf(Connection);
        expect(await con.db.query("RETURN 1"));
        done();
      })
      .catch(done);
  });
});

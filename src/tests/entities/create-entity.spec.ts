import { createConnection, Connection, Entity, Attribute } from "../../index";
import config from "../config";
import { expect } from "chai";
import { HashIndex } from "../../decorators";

@Entity("test")
class TestEntity {
  @Attribute()
  name: string;

  @HashIndex({ unique: true, name: "TEST" })
  @Attribute("test_email")
  email: string;
}

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
        const TestRepository = con.repositoryFor<TestEntity>("test");
        const result = await TestRepository.create({
          email: "test@test.com",
          name: "Test"
        });

        console.log("CREATE", result);

        result.name = "Updated";

        console.log("READ", await TestRepository.findByKey(result._key));
        console.log("UPDATE", await TestRepository.update(result));
        console.log("DELETE", await TestRepository.deleteByKey(result._key));

        done();
      })
      .catch(done);
  });
});

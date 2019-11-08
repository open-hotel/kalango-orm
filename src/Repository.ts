import { Database, DocumentCollection } from "arangojs";
import { AqlQuery, AqlLiteral } from "arangojs/lib/cjs/aql-query";
import { ArrayCursor } from "arangojs/lib/cjs/cursor";
import { QueryOptions } from "arangojs/lib/cjs/database";
import { DeepPartial } from "./types/DeepPartial";
import { Document } from "arangojs/lib/cjs/util/types";
import { DocumentHandle } from "arangojs/lib/cjs/collection";
import { MetadataManager } from "./metadata/MetadataManager";
import { ENTITY_NAME } from "./keys/entity.keys";

export class Repository {
  protected collection: DocumentCollection

  constructor(
    private connection: Database,
    entity: string | Function
  ) {
    if (typeof entity === 'function') {
      entity = MetadataManager.get(entity, ENTITY_NAME)
    }

    this.collection = connection.collection(entity as string)
  }

  query(query: string | AqlQuery | AqlLiteral): Promise<ArrayCursor>;
  query(query: AqlQuery, opts?: QueryOptions): Promise<ArrayCursor>;
  query(
    query: string | AqlLiteral,
    bindVars?: any,
    opts?: QueryOptions
  ): Promise<ArrayCursor>;
  query(query, bindVarsOrOptions?, opts?): Promise<ArrayCursor> {
    if (opts) {
      return this.connection.query(query, bindVarsOrOptions, opts);
    }
    return this.connection.query(query, bindVarsOrOptions);
  }

  create<Entity>(
    entityName: string,
    plainObject?: DeepPartial<Entity> | DeepPartial<Entity>[]
  ): Promise<Entity> {
    return this.collection.save(plainObject, {
      returnNew: true
    });
  }

  update<Entity extends Document>(
    entityName: string,
    documentHandler: DocumentHandle,
    newValue: Entity,
  ): Promise<Entity> {
    return this.collection.update(documentHandler, newValue);
  }

  delete (entityName: string, documentHandler: DocumentHandle) {
    return this.collection.remove(documentHandler)
  }
}

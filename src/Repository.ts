import { DocumentCollection } from "arangojs";
import { DeepPartial } from "./types/DeepPartial";
import { Metadata } from "./metadata/MetadataManager";
import { ENTITY_NAME, ENTITY_ATTRIBUTES } from "./keys/entity.keys";
import { Connection } from "./Connection";
import { Document, DocumentData } from "arangojs/lib/cjs/util/types";
import { normalizeDataForWrite, normalizeDataForRead } from "./lib/util";
import { ArrayOr } from "./types/ArrayOrType";

export type EntityDocument<T extends object> = DeepPartial<DocumentData<T>>;

export class Repository<T extends object> {
  protected collection: DocumentCollection;
  protected entity: Function;

  constructor(protected connection: Connection, entity: string | Function) {
    if (typeof entity === "function") {
      entity = Metadata.get(entity, ENTITY_NAME);
    }

    this.entity = this.connection.getEntity(entity);
    this.collection = connection.db.collection(entity as string);
  }

  async create(data: EntityDocument<T>): Promise<EntityDocument<T>>;
  async create(data: EntityDocument<T>[]): Promise<EntityDocument<T>[]>;
  async create(
    data: ArrayOr<EntityDocument<T>>
  ): Promise<ArrayOr<EntityDocument<T>>> {
    const dataToWrite = normalizeDataForWrite(this.entity, data);
    const result = await this.collection.save(dataToWrite, { returnNew: true });
    return normalizeDataForRead<EntityDocument<T>>(this.entity, result.new);
  }

  async update(data: EntityDocument<T>) {
    const dataToWrite = normalizeDataForWrite(this.entity, data);
    return this.collection.update(dataToWrite, dataToWrite, {
      mergeObjects: true
    });
  }

  async deleteByKey(key: string);
  async deleteByKey(keys: string[]);
  async deleteByKey(keys: ArrayOr<string>) {
    keys = Array.isArray(keys) ? keys : [keys];
    return this.collection.removeByKeys(keys, { returnOld: true });
  }

  async findByKey(key: string);
  async findByKey(keys: string[]);
  async findByKey(keys: ArrayOr<string>) {
    const isMulti = Array.isArray(keys);
    keys = (isMulti ? keys : [keys]) as string[];
    const result = await this.collection.lookupByKeys(keys)
    const data = normalizeDataForRead(this.entity, result);
    return isMulti ? data : data[0]
  }

  async findBy(doc: ArrayOr<EntityDocument<T>>) {
    const result = await this.collection.byExample(doc);
    return normalizeDataForRead(this.entity, result);
  }
}

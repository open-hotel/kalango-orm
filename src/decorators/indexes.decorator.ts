import crypto from 'crypto'
import { ENTITY_INDEXES, ENTITY_ATTRIBUTES } from "../keys/entity.keys";
import { ArangoIndex } from "../types/Indexes";
import { Metadata } from "../metadata/MetadataManager";

const createIndexName = (index: Partial<ArangoIndex>) => {
  return crypto.createHash('md5').update(JSON.stringify(index)).digest('hex')
}

export function Index(options: Partial<ArangoIndex>) {
  options.fields = options.fields || [];
  return function(target: Object, key: string | symbol) {
    target = key === undefined ? target : target.constructor

    if (key) {
      const field = Metadata.get(target, ENTITY_ATTRIBUTES).find(attr => attr.as === key).key
      options.fields.push(field)
    }

    const indexes = Metadata.get(target, ENTITY_INDEXES) || [];

    options.name = options.name || `IDX_${createIndexName(options)}`
    indexes.push(options);

    Metadata.set(target, ENTITY_INDEXES, indexes);
  };
}

export const HashIndex = (options: Partial<ArangoIndex> = {}) =>
  Index({
    type: "hash",
    ...options
  });

export const SkipListIndex = (options: Partial<ArangoIndex> = {}) =>
  Index({
    type: "ttl",
    ...options
  });

export const TTLIndex = (options: Partial<ArangoIndex> = {}) =>
  Index({
    type: "ttl",
    ...options
  });

export const GeoIndex = (options: Partial<ArangoIndex> = {}) =>
  Index({
    type: "geo",
    ...options
  });

export const FullTextIndex = (options: Partial<ArangoIndex> = {}) =>
  Index({
    type: "fulltext",
    ...options
  });

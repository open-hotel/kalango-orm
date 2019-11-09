import { Metadata } from "../metadata/MetadataManager";
import { ENTITY_ATTRIBUTES } from "../keys/entity.keys";
import { ArrayOr } from "../types/ArrayOrType";
import { DocumentMetadata, Document } from "arangojs/lib/cjs/util/types";
import { DeepPartial } from "../types/DeepPartial";

export function getEntityAttributes(entity: Function) {
  return [
    { key: "_key", as: "_key" },
    { key: "_id", as: "_id" },
    { key: "_rev", as: "_rev" },
    { key: "_from", as: "_from" },
    { key: "_to", as: "_to" }
  ].concat(Metadata.get(entity, ENTITY_ATTRIBUTES));
}

export function normalizeDataForRead<T>(
  entity: Function,
  data: Object | Object[]
): T[] | T {
  const attrs = getEntityAttributes(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeDataForRead(entity, item)) as T[];

  return attrs.reduce((obj, attr) => {
    if (attr.key in data) obj[attr.as] = data[attr.key];
    return obj;
  }, {}) as T;
}

export function normalizeDataForWrite<T = object>(
  entity,
  data: T
): DocumentMetadata;
export function normalizeDataForWrite<T = object>(
  entity,
  data: T[]
): DocumentMetadata[];
export function normalizeDataForWrite<T = object>(
  entity,
  data: ArrayOr<T>
): ArrayOr<DocumentMetadata> {
  const attrs = getEntityAttributes(entity);

  if (Array.isArray(data))
    return data.map(item => normalizeDataForWrite(entity, item));

  return attrs.reduce((obj, attr) => {
    if (attr.as in data) obj[attr.key] = data[attr.as];
    return obj;
  }, {}) as DocumentMetadata;
}

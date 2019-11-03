import { ENTITY_INDEXES } from "../keys/entity.keys";
import { ArangoIndex } from "../types/Index";

export function Index(
  options: Partial<ArangoIndex>
): PropertyDecorator | ClassDecorator {
  options.fields = options.fields || [];
  return function(target, key: string) {
    if (key) options.fields.push(key);

    const indexes = Reflect.getMetadata(ENTITY_INDEXES, target);

    options.name =
      options.name ||
      `IDX_${options.type}_${
        options.unique ? "UNIQUE_" : ""
      }${options.fields.join("_")}`;
    indexes.push(options);

    Reflect.defineMetadata(ENTITY_INDEXES, indexes, target);
  };
}

export const HashIndex = (
  attributes: string | string[],
  options: Partial<ArangoIndex> = {}
) =>
  Index(attributes, {
    type: "hash",
    ...options
  });

export const SkipListIndex = (
  attributes: string | string[],
  options: Partial<ArangoIndex> = {}
) =>
  Index(attributes, {
    type: "ttl",
    ...options
  });

export const TTLIndex = (
  attributes: string | string[],
  options: Partial<ArangoIndex> = {}
) =>
  Index(attributes, {
    type: "ttl",
    ...options
  });

export const GeoIndex = (
  attributes: string | string[],
  options: Partial<ArangoIndex> = {}
) =>
  Index(attributes, {
    type: "geo",
    ...options
  });

export const FullTextIndex = (
  attributes: string | string[],
  options: Partial<ArangoIndex> = {}
) =>
  Index(attributes, {
    type: "fulltext",
    ...options
  });

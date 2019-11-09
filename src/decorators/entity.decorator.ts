import {
  ENTITY_NAME,
  ENTITY_ATTRIBUTES,
  ENTITY_WAIT_FOR_SYNC,
  ENTITY_INDEXES
} from "../keys/entity.keys";
import { Metadata } from "../metadata/MetadataManager";

export function Entity(
  name?: string,
  { waitForSync = false } = {}
): ClassDecorator {
  return function(target) {
    name = name || target.name.toLocaleLowerCase();

    Metadata.set(target, ENTITY_NAME, name);

    const attrs = Metadata.get(target, ENTITY_ATTRIBUTES) || [];

    Metadata.set(target, ENTITY_ATTRIBUTES, attrs);
    Metadata.set(target, ENTITY_WAIT_FOR_SYNC, waitForSync);

    const indexes = Metadata.get(target, ENTITY_INDEXES) || [];

    Metadata.set(target, ENTITY_INDEXES, indexes);
  };
}

export function Attribute(name?: string | symbol): PropertyDecorator {
  return function(target, key) {
    name = name || key;

    const attributes = Metadata.get(target.constructor, ENTITY_ATTRIBUTES) || [];
    attributes.push({
      key: name,
      as: key,
    })

    Metadata.set(target.constructor, ENTITY_ATTRIBUTES, attributes);
  };
}

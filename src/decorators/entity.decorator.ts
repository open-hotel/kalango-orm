import {
  ENTITY_NAME,
  ENTITY_ATTRIBUTES,
  ENTITY_WAIT_FOR_SYNC,
  ENTITY_INDEXES
} from "../keys/entity.keys";
import { MetadataManager } from "../metadata/MetadataManager";

export function Entity(
  name?: string,
  { waitForSync = false } = {}
): ClassDecorator {
  return function(target) {
    name = name || target.name.toLocaleLowerCase();

    MetadataManager.set(target, ENTITY_NAME, name);

    const attrs = MetadataManager.get(ENTITY_ATTRIBUTES, target) || {};

    MetadataManager.set(target, ENTITY_ATTRIBUTES, attrs);
    MetadataManager.set(target, ENTITY_WAIT_FOR_SYNC, waitForSync);

    const indexes = MetadataManager.get(target, ENTITY_INDEXES) || [];

    MetadataManager.set(target, ENTITY_INDEXES, indexes);
  };
}

export function Attribute(alias?: string | symbol): PropertyDecorator {
  return function(target, key) {
    console.log("ATTRIBUTE");

    alias = alias || key;

    const attributes = MetadataManager.get(target, ENTITY_ATTRIBUTES) || {};
    attributes[alias] = key;
    MetadataManager.set(target, ENTITY_ATTRIBUTES, attributes);
  };
}

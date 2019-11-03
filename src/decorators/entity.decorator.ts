import { ENTITY_NAME, ENTITY_ATTRIBUTES, ENTITY_WAIT_FOR_SYNC, ENTITY_INDEXES } from "../keys/entity.keys";

export function Entity(name?: string, { waitForSync = false } = {}): ClassDecorator {
  return function(target) {
    name = name || target.name;
    Reflect.defineMetadata(ENTITY_NAME, name, target);
    Reflect.defineMetadata(ENTITY_ATTRIBUTES, {}, target);
    Reflect.defineMetadata(ENTITY_WAIT_FOR_SYNC, waitForSync, target);
    Reflect.defineMetadata(ENTITY_INDEXES, {}, target)
  };
}

export function Attribute(alias?: string | symbol): PropertyDecorator {
  return function(target, key) {
    alias = alias || key;

    const attributes = Reflect.getMetadata(ENTITY_ATTRIBUTES, target);
    attributes[alias] = key;
    Reflect.defineMetadata(ENTITY_ATTRIBUTES, attributes, target);
  };
}

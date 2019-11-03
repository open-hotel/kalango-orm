export function Entity (name?:string) : ClassDecorator {
  return function (target) {
    name = name || target.name
    Reflect.defineMetadata('arango:entity', name, target)
    Reflect.defineMetadata('arango:properties', {}, target)
  }
}
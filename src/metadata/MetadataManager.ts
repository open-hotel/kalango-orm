
export class Metadata {
  private static metas: WeakMap<Object, Map<any, any>> = new WeakMap()

  static getAll(target:Object) {
    return this.metas.get(target) || new Map<any, any>()
  }

  static setAll(target:Object, metadata: Map<any, any>) {
    return this.metas.set(target, metadata)
  }

  static set(target: Object, key:any, value:any) {
    const meta = this.getAll(target)
    meta.set(key, value)
    if (!this.metas.has(target)) this.setAll(target, meta)
    return this
  }

  static get(target: Object, key:any) {
    const meta = this.getAll(target)
    return meta.get(key)
  }

  static delete (target: Object, key: any) {
    const meta = this.getAll(target)
    meta.delete(key)
    return this
  }

  static deleteAll (target: Object) {
    this.metas.delete(target)
    return this
  }

  static getKeys (target: Object) {
    return this.getAll(target).keys()
  }
}

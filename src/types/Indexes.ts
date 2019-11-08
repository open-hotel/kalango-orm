export interface ArangoIndex {
  fields: Array<string|symbol>
  id: string
  name: string
  sparse: boolean
  type: 'primary' | 'hash' | 'skiplist' | 'persistent' | 'ttl' | 'geo' | 'fulltext'
  unique: boolean
  deduplicate: boolean
  expireAfter: number
}
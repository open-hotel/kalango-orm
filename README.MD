# Kalango

Kalango is an ORM for ArangoDB that utilizes TypeScript language features to make modeling your database easier.

## Installation
```bash
# With NPM
$ npm install --save kalango

# With Yarn
$ yarn add kalango
```

## Create a new database connection

```typescript
// index.ts
import { createConnection } from 'kalango';

createConnection({
  url: 'arangodb://localhost:8529',
  user: 'root',
  password: 'root',
  database: 'root',
  syncronize: true, // Disable in production
}).then((db) => {
  // db is ready!
})
```

## Define entities

Entities are a way of representing your collections.

```typescript
// user.entity.ts
import { Entity, Attribute } from 'kalango';

@Entity()
export class User {
  @Attribute()
  name: string

  @Attribute()
  email: string
}
```

## Register entities

Entities must be added to the connection before they can be used.


```typescript
// index.ts
import { createConnection } from 'kalango';
import { User } from './user.entity.ts'; // Import here

createConnection({
  url: 'arangodb://localhost:8529',
  user: 'root',
  password: 'root',
  database: 'mydb',
  syncronize: true,
  entities: [User], // Add this,
  // entities: ['./**/*.entity.js'], // Or add this to import all files with the extension .entity.ts
}).then((db) => {
  // db is ready!
})
```
## Repositories

Repositories are used to manage the data of an entity.


```typescript
// index.ts
import { createConnection } from 'kalango';
import { User } from './user.entity.ts'; // Import here

createConnection({
  url: 'arangodb://localhost:8529',
  user: 'root',
  password: 'root',
  database: 'mydb',
  syncronize: true,
  entities: [User],
}).then((db) => {
  const UserRepository = db.repositoryFor('User')

  // Create a new user
  const john = await UserRepository.save({
    name: 'John',
    email: 'john@email.com'
  })

  john.email = 'contact@john.com'

  // Updates a user
  await UserRepository.save(john)

  // List users
  const users = await UserRepository.findAll()

  // Delete a user
  await UserRepository.delete(john)
})
```
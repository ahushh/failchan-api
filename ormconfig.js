module.exports = [
  {
    "name": "development",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "develop",
    "entities": ["src/domain/entity/**/*.ts"],
    "migrations": ["src/infra/migration/**/*.ts"],
    "subscribers": ["src/app/subscriber/**/*.ts"],
    "logging": true,
    "logger": "advanced-console",
    "synchronize": true,
    "cli": {
      "migrationsDir": "src/infra/migration",
      "entitiesDir": "src/domain/entity",
      "subscribersDir": "src/app/subscriber"
    }
  },
  {
    "name": "test",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "test",
    "entities": ["src/domain/entity/**/*.ts"],
    "migrations": ["src/infra/migration/**/*.ts"],
    "subscribers": ["src/app/subscriber/**/*.ts"],
    "logging": false,
    "dropSchema": true,
    "synchronize": true,
    "cli": {
      "migrationsDir": "src/infra/migration",
      "entitiesDir": "src/domain/entity",
      "subscribersDir": "src/app/subscriber"
    }
  }
  
]

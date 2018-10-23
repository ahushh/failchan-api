module.exports = {
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "postgres",
  "database": "test",
  "entities": ["src/domain/entity/**/*.ts"],
  "migrations": ["src/infra/migration/**/*.ts"],
  "subscribers": ["src/app/subscriber/**/*.ts"],
  "logging": true,
  "logger": "advanced-console",
  "synchronize": false, //process.env.NODE_ENV !== 'production',
  "cli": {
    "migrationsDir": "src/infra/migration"
}
}

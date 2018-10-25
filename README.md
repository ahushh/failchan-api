# Setup

`npm ci`

`cp .env.example .env`

# Run in dev mode

npm start

# Run DB

`docker-compose up postgres`

# Create test DB

`docker-compose exec postgres createdb -Upostgres test`

# TODO

* attachments - удаление неиспользованных
* attachments create - transaction & rollback
* Events and websockets
* Event bus
* слой обработки ошибок
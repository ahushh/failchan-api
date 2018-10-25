# Setup

`npm ci`

`mkdir /tmp/attachment`

`cp .env.example .env`

# Run in dev mode

npm start

# Run DB

`docker-compose up postgres`

# Create test DB

`docker-compose exec postgres createdb -Upostgres test`

# TODO

* Events and websockets
* Event bus
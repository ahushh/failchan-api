
`mkdir /tmp/attachment`

`cp .env.example .env`

# Create test DB

`docker-compose exec postgres createdb -Upostgres test`
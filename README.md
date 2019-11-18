# Setup

`npm ci`

`cp .env.example .env`

# Run in dev mode

`docker-compose up`

`npm start`

# Run tests

`docker-compose up`

`docker-compose exec postgres createdb -Upostgres test`

`npm test`

# Run in production mode

`docker-compose -f docker-compose.yml -f docker-compose.prod.yml up`

# Clean DB

In case of error kinda

`QueryFailedError: duplicate key value violates unique constraint`

try to recreate DB:

`docker-compose exec postgres dropdb -Upostgres test && docker-compose exec postgres createdb -Upostgres test`

# TODO

* заменить typedi на inversify по всему проекту
* опечатки referencies -> references
* обновить пакеты
* заменить tslint на eslint
* добавить логирование, например через morgan
* Перенести интерфейсы (например репозиторий) в слой домена
* разделить тесты на unit и e2e
* дописать изначальные условия в тест-кейсах, типа дано: ...
* interfaces refactoring: IAttachmentFile
* attachments create - transaction & rollback
* Events and websockets
* Event bus
* слой обработки ошибок

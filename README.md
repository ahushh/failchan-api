# What is it?

Yet Another Imageboard (forum with pictures) API which I'm trying to build during researching in backend development, software design and DDD in particular, OOP and DB.

# Initial setup

`npm ci`

`cp .env.example .env`

**Do not forget about .env file!**

# Run in dev mode

`npm run db:run`

`npm start`

# Run e2e tests to test each endpoint

`npm run db:run`

`npm run test:db:create`

`npm e2e`

# Run in production mode through Docker

`npm run start:docker`

# Troubles during e2e tests

- Some tests fails with output `QueryFailedError: duplicate key value violates unique constraint`

-- Try to recreate DB

`npm run test:db:drop && npm run test:db:create`

-- Run tests again

-- Wait and try something again

# TODO

* заменить сущности (сервисы, репозитории) на интерфейсы
* нужно ли экшены класть в контейнер?
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


# Inspired by

https://hsto.org/webt/wp/gk/2w/wpgk2wxy5fgyjtrwuzctapvv19y.png

https://github.com/citerus/dddsample-core

https://github.com/dmiseev/ddd-node-starter

https://github.com/inversify/inversify-express-example

https://stackoverflow.com/questions/37534890/inversify-js-reflect-hasownmetadata-is-not-a-function

https://github.com/joshuaalpuerto/node-ddd-boilerplate

https://stackoverflow.com/questions/36636957/where-should-i-configure-my-di-container-for-domain-infrastructure-services-in-d

https://cqrs.nu/Faq

https://stackoverflow.com/questions/47991017/understanding-the-command-pattern-in-a-ddd-context

https://medium.com/@qasimsoomro/building-microservices-using-node-js-with-ddd-cqrs-and-event-sourcing-part-1-of-2-52e0dc3d81df

https://habr.com/ru/company/ruvds/blog/434114/

https://github.com/joshuaalpuerto/node-ddd-boilerplate

https://github.com/talyssonoc/node-api-boilerplate

https://emacsway.github.io/ru/service-layer/
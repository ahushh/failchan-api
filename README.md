# What is it?

Yet Another Imageboard (forum with pictures) API which I'm trying to build during researching in backend development, databases, software design and DDD/Onion/Hexagonal/Clean architectures in particular, OOP and FP paradigmes.

# API Docs

https://documenter.getpostman.com/view/5005722/RzZ4qh3t?version=latest

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

- All tests failed with output `error: database "test" does not exist`

-- Need to create test DB first

`npm run e2e:db:create`

- Some or all tests failed with output `QueryFailedError: duplicate key value violates unique constraint`

-- Try to recreate DB

`npm run e2e:reset`

-- Try to stop and run Docker

`npm run db:stop && npm run db:start`

-- Run tests again

-- Wait and try something again

# TODO

* calculate file size
* [WIP] заменить сущности (сервисы, репозитории) на интерфейсы
* (?) should actions (use cases) be placed in IoC
* update deps
* tslint -> eslint
* add logging, (?) use morgan 
* add unit tests
* (?) use BDD
* attachments create - transaction & rollback
* Events and websockets
* Event bus
* Error handling layer


# Inspired by

https://hsto.org/webt/wp/gk/2w/wpgk2wxy5fgyjtrwuzctapvv19y.png

https://github.com/citerus/dddsample-core

https://github.com/dmiseev/ddd-node-starter

https://github.com/inversify/inversify-express-example

https://github.com/joshuaalpuerto/node-ddd-boilerplate

https://stackoverflow.com/questions/36636957/where-should-i-configure-my-di-container-for-domain-infrastructure-services-in-d

https://cqrs.nu/Faq

https://stackoverflow.com/questions/47991017/understanding-the-command-pattern-in-a-ddd-context

https://medium.com/@qasimsoomro/building-microservices-using-node-js-with-ddd-cqrs-and-event-sourcing-part-1-of-2-52e0dc3d81df

https://habr.com/ru/company/ruvds/blog/434114/

https://github.com/joshuaalpuerto/node-ddd-boilerplate

https://github.com/talyssonoc/node-api-boilerplate

https://emacsway.github.io/ru/service-layer/
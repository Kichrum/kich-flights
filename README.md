# Kich Flights

This project was implemented using [Nx](https://nx.dev).

## Configure

Update `apps/kichflights/src/environments/environment.ts` with the Redis config and link of sources provided separately.

The Redis Password has to be taken by the app from Secure Vault or similar service as a part of CI/CD process.

By default, instance's in-memory cache will be used.

## Install dependencies

Run `npm install` to install all the dependencies.

## Run

Run `npm start` to start the project locally.

Run `PORT=3334 npm start` to run a second instance.

## Test manually

To test the project, use the following endpoint:
http://localhost:3333/api/v1/aggregator

To reset the cache send the header: `Cache-Control: 'no-cache'`
(or refresh the page in browser with "Empty cache and hard reload").

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-- --prod` flag for a production build.

## Running unit tests

Run `npm run test:all` to execute the unit tests via [Jest](https://jestjs.io).

Run `npx nx affected:test` to execute the unit tests affected by a change.

## Understand your workspace

Run `npx nx graph` to see a diagram of the dependencies of your projects.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

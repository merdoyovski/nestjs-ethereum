<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A simple [Nest](https://github.com/nestjs/nest) app written in TypeScript with a single end-point to get given Ethereum addresses in ascending order.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Test Coverage

| File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                 | 100     | 100      | 100     | 100     |
| **src**                   | 100     | 100      | 100     | 100     |
| app.controller.ts         | 100     | 100      | 100     | 100     |
| app.module.ts             | 100     | 100      | 100     | 100     |
| app.service.ts            | 100     | 100      | 100     | 100     |
| main.ts                   | 100     | 100      | 100     | 100     |
| **src/eth**               | 100     | 100      | 100     | 100     |
| eth.controller.ts         | 100     | 100      | 100     | 100     |
| eth.module.ts             | 100     | 100      | 100     | 100     |
| eth.service.ts            | 100     | 100      | 100     | 100     |
| **src/eth/dto**           | 100     | 100      | 100     | 100     |
| sortedBalances-eth.dto.ts | 100     | 100      | 100     | 100     |

## Notes

- In order to check balances faster, the eth service utilizes promise.all and tries to get all the balances concurrently.
  - This results in, if given multiple addresses, the server printing **Request-Rate Exceeded**. It is due to our default provider accepting limited concurrent requests.

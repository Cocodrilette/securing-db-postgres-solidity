# Teslo Shop API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

## Installation

```bash
$ yarn install
```

## Configuration

### 1. Clone the repo

```bash
$ git clone https://github.com/Cocodrilette/eCommerce-API.git
```

### 2. Create a `.env` file in the root directory from the `.example.env`

## Starting DB

```bash
# start db
$ docker-compose up -d
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Running the SEED

```bash
GET http://localhost:5000/api/v1/products/seed
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

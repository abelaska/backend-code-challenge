# Coding Exercise Backend

This repository contains a coding exercise for new developers joining the backend development team.

Fork this repository and create your own exercise!

## What we want you to build

We have provided you with Pokemon data in a json file. Your mission is to create a database and expose the database to an API. Basically, you need to:

- Design the database to store information for the Pokemon data
- Load the database with the data
- Implement the API Interface with the following features:
  - Query pokemons with the options:
    - Pagination
    - Search by name
    - Filter by pokemon type
    - Filter by favorite
  - Query a pokemon by id
  - Query a pokemon by name
  - Query list of pokemon types
  - Mutation to mark/unmark pokemon as favorite
- Test are important and if time allows it, we'd like to see some test coverage

## Technology

Remember that our technology stack is:

- Node.js (Typescript, Fastify)
- GraphQL (Nexus)
- PostgreSQL (Objection.js)

You can use the framework that you prefer, but please write the challenge in JS or TS. You can choose PostgreSQL / MongoDB like database, be free but take in consideration the best database to store the data.

# Solution

Libraries do not have to be compiled to CommonJS because they are not supposed to be publicly available via an NPM registry.

Used [Pothos](https://pothos-graphql.dev) GraphQL framework in favor of Nexus. Why? I always wanted to try Pothos and see how the code would look with this library; this was a great opportunity.

## How to start this beast

1. `nvm use` switch to required Node.js version
2. `npm install -g pnpm` install `pnpm` tool (see <https://pnpm.io/installation>)
3. `pnpm i` install project dependencies 
4. `pnpm demo` build and run the project, or you can do it manually step by step:
   1. build the project `pnpm build`
   2. run unit and e2e tests `pnpm test` (optional)
   3. init database `pnpm db:init`
   4. seed database `pnpm db:seed`
   5. and start the API service `pnpm start`

GraphQL endpoint is available at `http://localhost:3000/graphql`

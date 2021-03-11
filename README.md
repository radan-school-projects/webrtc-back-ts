# api-express-ts

A Standalone Api Server built with Express

This repo is intended as a starting point for futures api-server projects based on express and mongodb via mongoose. And also we will be using **typescript**.

Maybe later support for mysql will be added?

## How to use?

* prerequisites: **node** and **mongodb** must be installed on your machine

* install dependencies: `npm install`

* development: `npm run dev`

* production: `npm run build` then `npm run start`

* clean dist folder: `npm run clean`

## about connecting to mongodb:

You will need **MongoDB** installed on your machine for local development.

The mongo uri in our [config file](https://github.com/radandevist/standalone-api-express-server/blob/master/src/config/config.ts) is best suited for [mongoDB Atlas](https://www.mongodb.com/cloud), to continue with this config you'll need to register an account there.

Althought, you're free to use any mongo host or any database management system also.

## about environment variable:

In development mode(!! Only in development mode !!), this repo uses [dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack) for loading environment in a `.env` file at the root folder.
The `.env` file is intentionnaly gitignored for security concerns.

## Todo next:

* [X] functionning CRUD Api routes with Authentication and role based authorizations

* [ ] add authors field in tutorials model

* [ ]  detailed authorization:
  * [ ]  only admin can delete user and update role
  * [ ]  admins can also create users
  * [ ]  moderators and admins can unpublish tutorial
  * [ ]  only user can update his email and username

* [ ]  generate api-docs using swagger-ui
* [ ]  revise all status code responses in the appe case

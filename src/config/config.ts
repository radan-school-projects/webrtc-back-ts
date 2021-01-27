import sensitive from "./sensitive";

// const pkg = require("../package.json");

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  database: {
    mongodb: {
      url: {
        dev: `mongodb://localhost:27017/${sensitive.dbName}`,
        prod: `mongodb+srv://${sensitive.dbUser}:${sensitive.dbPassword}@cluster0.ac2tb.mongodb.net/${sensitive.dbName}?retryWrites=true&w=majority`,
      },
    },
  },
};

export default config;

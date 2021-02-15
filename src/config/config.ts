// const pkg = require("../package.json");

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  db: {
    mongoUri:
        process.env.MONGODB_URI ||
        process.env.MONGO_HOST ||
        `mongodb://${process.env.IP || "localhost"}:${process.env.MONGO_PORT || "27017"}/${process.env.DB_NAME || "api-express"}`,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "api-secret-key",
    tokenLife: "2h",
    cookieName: "api-express-token",
    cookieMaxAge: 24 * 60 * 60 * 1000, // 24h in milliseconds
  },
};

export default config;

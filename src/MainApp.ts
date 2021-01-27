import express, { Application } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import config from "./config/config";
import ApiRoutes from "./routes/api";

/**
 * Main Application class
 */
class MainApp {
  private app: Application = express();

  public PORT: Number = Number(config.port) || 3000;

  private mongoUri: string = (config.env == "development") ?
    config.database.mongodb.url.dev :
    config.database.mongodb.url.prod;

  // private mongoUri: string = config.database.mongodb.url.dev;

  // eslint-disable-next-line require-jsdoc
  constructor() {
    this.middlewares();
    this.routes();
    this.mongoDatabase();
  }

  /**
   * Set up all middleware
   * @return {void}
   */
  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(compress());
    // secure apps by setting various HTTP headers
    this.app.use(helmet());
    // enable CORS - Cross Origin Resource Sharing
    this.app.use(cors());
  }

  /**
   * Routes definition
   */
  public routes(): void {
    this.app.use(ApiRoutes.prefixPath, ApiRoutes.getRouter());
  }

  /**
   * Connection to  mongodb
   */
  private mongoDatabase(): void {
    try {
      mongoose.connect(
          this.mongoUri,
          {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
          },
      );

      console.info("Connected to the database");
    } catch (err) {
      console.error(`A connection error occured:\n${err}`);
    }
  }

  /**
   * Serve this application
   * @param  {MainApp} mainApp
   */
  public serve():void {
    this.app.listen(
        this.PORT,
        () => console.info(`Started at port ${this.PORT}, bouuia!`),
    );
  }
}

export default MainApp;

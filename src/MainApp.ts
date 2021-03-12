import express, { Application } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import config from "./config/config";
import ApiRoutes from "./routes/api";
import RolesModel, { IRoles } from "./models/roles.model";
import UsersModel from "./models/users.model";

const Roles = RolesModel.getModel();
const Users = UsersModel.getModel();

/**
 * Main Application class
 */
class MainApp {
  private app: Application = express();

  public PORT: Number = Number(config.port) || 3000;

  private mongoUri: string = config.db.mongoUri;

  // eslint-disable-next-line require-jsdoc
  constructor() {
    this.mongoDatabase();
    // * Be aware of the order, this is important
    this.middlewares();
    this.routes();
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
  private async mongoDatabase(): Promise<void> {
    try {
      await mongoose.connect(
          this.mongoUri,
          {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
          },
      );
      console.info("Connected to the database");

      // initial
      // set essential documents collection
      await this.createPrimitiveRoles();
      console.info("Primitives roles set");

      await this.createParentAdmin();
      console.info("Admin parent created");
    } catch (err) {
      console.error(`A database error connection occured:\n${err}`);
    }
  }

  /**
   * set the primitive roles
   * @return {Promise<void>}
   */
  private async createPrimitiveRoles(): Promise<void> {
    const primitiveRoles: PrimitiveRoles[] =
          config.primitiveRoles as PrimitiveRoles[];

    for (const role of primitiveRoles) {
      if (!await Roles.findOne({ name: role })) {
        await Roles.create({ name: role });
      }
    }
  }

  /**
   * set the first administrator
   * @return {Promise<void>}
   */
  public async createParentAdmin(): Promise<void> {
    const foundRole = await Roles.findOne({ name: "admin" }) as IRoles;

    const { name: userName, email, password } = config.siteAdmin;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    if (!await Users.findOne({ email })) {
      const toCreate = {
        userName,
        email,
        password: hashedPass,
        roleID: foundRole._id,
      };
      await Users.create(toCreate);
    };
  }

  /**
   * Serve this application
   */
  public serve():void {
    this.app.listen(
        this.PORT,
        () => console.info(`Started at port ${this.PORT}, hourray!`),
    );
  }
}

export default MainApp;

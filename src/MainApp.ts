import express, { Application } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcryptjs";
import config from "./config/config";
import ApiRoutes from "./routes/api";
import RolesModel, { IRoles, PrimitiveRoles } from "./models/roles.model";
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
      mongoose.connect(
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
      // initial
      // set essential documents collection
      await this.createPrimitiveRoles();
      console.info("Primitives roles set");
      await this.createParentAdmin();
      console.info("admin parent created");
    } catch (err) {
      console.error(`A database error connection occured:\n${err.message}`);
    }
  }

  /**
   * set the first administrator
   * @return {Promise<void>}
   */
  public async createParentAdmin(): Promise<void> {
    let foundRole: IRoles;
    do {
      foundRole = await Roles.findOne({ name: "admin" }) as IRoles;
    } while (!foundRole);
    // console.log(foundRole);

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
   * set the primitive roles
   * @return {Promise<void>}
   */
  private async createPrimitiveRoles(): Promise<void> {
    const primitiveRoles: Array<PrimitiveRoles> =
        ["user", "moderator", "admin"];

    for (const role of primitiveRoles) {
      if (!await Roles.findOne({ name: role })) Roles.create({ name: role });
    }
  }

  /**
   * Serve this application
   * @param  {MainApp} mainApp
   */
  public serve():void {
    this.app.listen(
        this.PORT,
        () => console.info(`Started at port ${this.PORT}, hourray!`),
    );
  }
}

export default MainApp;

import { Router } from "express";
import UsersController from "../../controllers/users.controller";

const usersController = new UsersController();

/**
 * Users CRUD endpoints
 */
class UserRoutes {
  public static prefixPath: string = "/users";

  // eslint-disable-next-line new-cap
  private router: Router = Router();

  // eslint-disable-next-line require-jsdoc
  private constructor() {
    this.routes();
  }

  /**
   * @return {void}
   */
  private routes(): void {
    this.getAll();
    // this.create();
    // this.getOne();
    // this.update();
    // this.delete();
    // this.updatePassword();// ?
  }

  /**
   * @return {Router}
   */
  public static getRouter(): Router {
    const userRoutes = new UserRoutes();
    return userRoutes.router;
  }

  /**
   * Index route for {...}/users path
   * Get a list of users
   * @return {void}
   */
  private getAll(): void {
    this.router.get("/", usersController.getAll);
  }
}

export default UserRoutes;

import { Router } from "express";
import AuthController from "../../controllers/auth.controller";

const authController = new AuthController();

/**
 * Users CRUD endpoints
 */
class AuthRoutes {
  public static prefixPath: string = "/auth";

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
    this.register();
    this.login();
    this.logout();
  }

  /**
   * @return {Router}
   */
  public static getRouter(): Router {
    const instance = new AuthRoutes();
    return instance.router;
  }

  /**
   * Register an user
   * @return {void}
   */
  private register(): void {
    this.router.post("/register", authController.register);
  }

  /**
   * Log in an user
   * @return {void}
   */
  private login(): void {
    this.router.post("/login", authController.login);
  }

  /**
   * Log out an user
   * @return {void}
   */
  private logout(): void {
    this.router.get("/logout", authController.logout);
  }
}

export default AuthRoutes;

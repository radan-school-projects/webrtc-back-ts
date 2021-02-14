import { Router, Request, Response } from "express";
import TutorialsRoutes from "./tutorials.routes";
import UserRoutes from "./users.routes";
import AuthRoutes from "./auth.routes";

/**
 * All routes for /api
 */
class ApiRoutes {
  public static prefixPath: string = "/api";

  // eslint-disable-next-line new-cap
  private router: Router = Router();

  // eslint-disable-next-line require-jsdoc
  private constructor() {
    this.routes();
  }

  /**
   * @return {Router}
   */
  public static getRouter(): Router {
    const apiRoutes = new ApiRoutes();
    return apiRoutes.router;
  }

  /**
   * Routes definitions
   * @return {void}
   */
  routes(): void {
    this.get();
    this.router.use(UserRoutes.prefixPath, UserRoutes.getRouter());
    this.router.use(TutorialsRoutes.prefixPath, TutorialsRoutes.getRouter());
    this.router.use(AuthRoutes.prefixPath, AuthRoutes.getRouter());
  }

  /**
   * Index route for /api path
   * we will use it for serving a documentation of our API
   * @return {void}
   */
  get(): void {
    this.router.get("/", (req: Request, res: Response) => {
      res.status(200).send({
        // eslint-disable-next-line max-len
        message: "this is the APIs base path, refer to the docs to learn how to use it",
      });
    });
  }
}

export default ApiRoutes;

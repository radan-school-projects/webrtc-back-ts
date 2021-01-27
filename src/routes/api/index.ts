import { Router, Request, Response } from "express";
import UserRoutes from "./users.routes";

/**
 * All routes for /api/v1
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

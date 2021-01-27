import { Request, Response } from "express";

/**
 * UsersController
 */
class UsersController {
  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {void}
   */
  getAll(req: Request, res: Response): void {
    res.status(200).send({ message: "this is the lis of all users" });
  }
}

export default UsersController;

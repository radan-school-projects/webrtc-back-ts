import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config/config";
import { getValidationErrorMessages } from "../helpers/errorHandlers";
import Responder from "../helpers/responder";
import RolesModel, { IRoles } from "../models/roles.model";
import UsersModel, { IUsers } from "../models/users.model";
import AuthValidator from "../validators/auth.validator";
import AuthService from "../services/auth.service";

const Users = UsersModel.getModel();
const Roles = RolesModel.getModel();

const authValidator = new AuthValidator();
const authService = new AuthService();
const responder = new Responder();

const cookieName = config.jwt.cookieName;

/**
 * AuthController
 */
class AuthController {
  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<any>}
   */
  public async register(req: Request, res: Response): Promise<any> {
    try {
      const { userName, email, password, role } = req.body;
      const newUser = { userName, email, password, role };

      const { error: validationError, value } =
          authValidator.registerValidation(newUser);

      if (validationError) {
        responder.error(400, getValidationErrorMessages(validationError));
        return responder.send(res);
      }

      const userFound = await Users.findOne({ email: value.email });

      if (userFound) {
        responder.error(400, "email address already in use");
        return responder.send(res);
      }

      const roleFound: IRoles = await Roles.findOne({ name: value.role });

      if (!roleFound) {// * Something that should never happen but who knows?
        responder.error(400, `role ${value.role} does not exists`);
        return responder.send(res);
      }

      const data = await authService.register({ role: roleFound, value });

      responder.success(200, "user registered", data);
      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return { Promise<any>}
   */
  public async login(req: Request, res: Response):
      Promise<any> {
    try {
      const { error: validationError, value } =
          authValidator.loginValidation(req.body);

      if (validationError) {
        responder.error(400, getValidationErrorMessages(validationError));
        return responder.send(res);
      }

      const foundUser: IUsers = await Users.findOne({ email: value.email });

      if (!foundUser) {
        responder.error(400, "no user with matching email");
        return responder.send(res);
      }

      const isValidPass =
          await bcrypt.compare(value.password, foundUser.password);

      if (!isValidPass) {
        responder.error(400, "wrong password");
        return responder.send(res);
      }

      const token = AuthController.createToken(foundUser);
      AuthController.setTokenCookie(res, token);

      const toDisplay = {
        _id: foundUser._id,
        userName: foundUser.userName,
      };

      const data = { token, user: toDisplay };

      responder.success(200, "user logged in", data);
      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param {IUsers} user
   * @return {string}
   */
  private static createToken(user: IUsers): string {
    const payload = { _id: user._id };
    const signOptions: SignOptions = {
      algorithm: "HS256",
      expiresIn: config.jwt.tokenLife,
    };
    return jwt.sign(payload, config.jwt.secret, signOptions);
  }

  /**
   * @param  {Response} res
   * @param  {string} token
   * @return {void}
   */
  private static setTokenCookie(res: Response, token: string): void {
    const nowDate: Date = new Date();
    res.cookie(cookieName, token, {
      // expires one day from its activation
      expires: new Date(nowDate.getTime() + config.jwt.cookieMaxAge),
    });
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<any>}
   */
  public async logout(req: Request, res: Response):
      Promise<any> {
    try {
      delete req.user;
      res.clearCookie(cookieName);

      responder.success(200, "you are logged out");
      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @param  {NextFunction} next
   * @return {Promise<any>}
   */
  public async verifyToken(req: Request, res: Response, next: NextFunction):
  Promise<any> {
    try {
      const token = req.cookies[cookieName];

      if (!token) {// there is no token provided
        responder.error(401, "access denied, you need to login");
        return responder.send(res);
      }

      const verified = jwt.verify(token, config.jwt.secret);

      if (!verified) {
        responder.error(400, "Invalid token");
        return responder.send(res);
      }

      req.user = verified;

      next();
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @param  {NextFunction} next
   * @return {Promise<any>}
   */
  public async isModerator(req: Request, res: Response, next: NextFunction):
  Promise<any> {
    try {
      const role = await authService.getRoleOfRequestUser(req.user);

      if (role.name == "user") {
        responder.error(403, "content reserved to moderators and admins");
        return responder.send(res);
      }

      next();
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @param  {NextFunction} next
   * @return {Promise<any>}
   */
  public async isAdmin(req: Request, res: Response, next: NextFunction):
  Promise<any> {
    try {
      const role = await authService.getRoleOfRequestUser(req.user);

      if (role.name == "user" || role.name == "moderator" ) {
        responder.error(403, "content reserved to admins");
        return responder.send(res);
      }

      next();
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }
}

export default AuthController;

import bcrypt from "bcryptjs";
import RolesModel, { IRoles } from "../models/roles.model";
import UsersModel, { IUsers } from "../models/users.model";

const Users = UsersModel.getModel();
const Roles = RolesModel.getModel();

/**
 * Authentication related services
 */
class AuthService {
  /**
   * @param {any} value
   * @return {Promise<any>}
   */
  public async register({ role, value }: { role: IRoles, value: any }):
      Promise<any> {
    delete value.role;

    value.roleID = role._id;

    const salt = await bcrypt.genSalt(10);
    value.password = await bcrypt.hash(value.password, salt);

    const createdUser = await Users.create(value);

    const toDisplay = {
      _id: createdUser._id,
      userName: createdUser.userName,
    };

    return { createdUser: toDisplay };
  }

  /**
   * @param  {any} user
   * @return {Promise<IRoles>}
   */
  public async getRoleOfRequestUser(user: any): Promise<IRoles> {
    const foundUser: IUsers = await Users.findById(user._id);
    return await Roles.findById(foundUser.roleID);
  }
}

export default AuthService;

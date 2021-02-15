import mongoose, { Document, Model, Schema, SchemaOptions } from "mongoose";

export interface IUsers extends Document {
  userName: string,
  email: string,
  password: string,
  roleID: Schema.Types.ObjectId,
};

export interface IUsersModel {};// ? what is this?

/**
 * UsersModel
 */
class UsersModel {
  private model!: Model<IUsers>;

  private static instance: UsersModel;

  // eslint-disable-next-line require-jsdoc
  private constructor() {
    this.init();
  }

  // eslint-disable-next-line require-jsdoc
  private init(): void {
    const schemaDefinition = {
      userName: { type: String, required: true, minLength: 3, maxLength: 50 },
      email: { type: String, required: true, maxLength: 255 },
      password: { type: String, required: true, minLength: 7 },
      roleID: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
    };
    const schemaOptions: SchemaOptions = { timestamps: true };

    const schema: Schema = new Schema(schemaDefinition, schemaOptions);

    this.model = mongoose.model<IUsers>("Users", schema);
  }

  /**
   * @return {Model<IUsers>}
   */
  public static getModel(): Model<IUsers> {
    if (!this.instance) {
      this.instance = new UsersModel();
    }
    return this.instance.model;
  }
}

export default UsersModel;

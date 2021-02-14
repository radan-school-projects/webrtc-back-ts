import mongoose, { Document, Model, Schema, SchemaOptions } from "mongoose";

export interface ITutorials extends Document {
  title: string,
  description: string,
  published: boolean,
};

export interface ITutorialsModel {};// ? what is this?

/**
 * TutorialsModel
 */
class TutorialsModel {
  private model!: Model<ITutorials>;

  private static instance: TutorialsModel;

  // eslint-disable-next-line require-jsdoc
  public constructor() {
    this.init();
  }

  // eslint-disable-next-line require-jsdoc
  private init(): void {
    const schemaDefinition = {
      title: { type: String, required: true, minLength: 5, maxLength: 100 },
      // eslint-disable-next-line max-len
      description: { type: String, required: true, minLength: 5, maxLength: 255 },
      published: { type: Boolean, required: true, default: false },
    };
    const schemaOptions: SchemaOptions = { timestamps: true };

    const schema: Schema = new Schema(schemaDefinition, schemaOptions);

    this.model = mongoose.model<ITutorials>("Tutorials", schema);
  }

  /**
   * @return {Model<ITutorials>}
   */
  public static getModel(): Model<ITutorials> {
    if (!this.instance) {
      this.instance = new TutorialsModel();
    }
    return this.instance.model;
  }
}

export default TutorialsModel;

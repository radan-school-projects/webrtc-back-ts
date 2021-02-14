import Joi, { ValidationResult } from "joi";

/**
 * [TutorialsValidator]
 */
class TutorialsValidator {
  /**
   * @param  {object} data
   * @return {ValidationResult}
   */
  public createValidation(data: object): ValidationResult {
    const _schema = Joi.object({
      title: Joi.string().min(5).max(100).required(),
      description: Joi.string().min(5).max(255).required(),
      published: Joi.bool().default(false),
    });

    return _schema.validate(data, { abortEarly: false });
  }

  /**
   * @param  {object} data
   * @return {ValidationResult}
   */
  public updateValidation(data: object): ValidationResult {
    const _schema = Joi.object({
      title: Joi.string().min(5).max(100).optional(),
      description: Joi.string().min(5).max(255).optional(),
      published: Joi.bool().optional(),
    });

    return _schema.validate(data, { abortEarly: false });
  }
}

export default TutorialsValidator;

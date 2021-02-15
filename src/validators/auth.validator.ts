import Joi, { ValidationResult } from "joi";

/**
 * [AuthValidator]
 */
class AuthValidator {
  /**
   * @param  {object} data
   * @return {ValidationResult}
   */
  public registerValidation(data: object): ValidationResult {
    const _schema = Joi.object({
      userName: Joi.string().required().min(3).max(50),
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(7).required(),
      // eslint-disable-next-line max-len
      role: Joi.string().optional().valid("user", "moderator", "admin").default("user"),
    });

    return _schema.validate(data, { abortEarly: false });
  }

  /**
   * @param  {object} data
   * @return {ValidationResult}
   */
  public loginValidation(data: object): ValidationResult {
    const _schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    return _schema.validate(data, { abortEarly: false });
  }
}

export default AuthValidator;

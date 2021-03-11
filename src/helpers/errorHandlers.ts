import Joi from "joi";

/**
 * @param  {Joi.ValidationError} validationError
 * @return {Array<string>}
 */
export function
getValidationErrorMessages(validationError: Joi.ValidationError):
  Array<string> {
  const _err = [];
  for (const e of validationError.details) {
    _err.push(e.message);
  }

  return _err;
}

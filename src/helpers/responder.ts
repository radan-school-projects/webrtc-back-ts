import { Response } from "express";

interface Result {
  status: string;
  message: string | Array<string>;
  content?: any
};

/**
 * [Description Responder]
 */
class Responder {
  private type!: string;

  private code!: number;

  private message!: string | Array<string>;

  private content: any = null;

  /**
   * @param  {number} code
   * @param  {string} message
   * @param  {any} data?
   * @return {Promise<void>}
   */
  public async success(
      code: number,
      message: string | Array<string>,
      data?: any): Promise<void> {
    this.type = "success";
    this.code = code;
    this.message = message;
    this.content = data;
  };

  /**
   * @param  {number} code
   * @param  {string} message
   * @return {Promise<void>}
   */
  public async error(
      code: number,
      message: string | Array<string>): Promise<void> {
    this.type = "error";
    this.code = code;
    this.message = message;
  };

  /**
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async send(res: Response):
    Promise<Response<any, Record<string, any>>> {
    let result: Result;

    if (this.type === "success") {
      result = {
        status: this.type,
        message: this.message,
        content: this.content,
      };
    } else {
      result = {
        status: this.type,
        message: this.message,
      };
    }

    // res.status(this.code).json(result);
    return res.status(this.code).json(result);
  };
}

export default Responder;

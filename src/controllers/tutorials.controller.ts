import { Request, Response } from "express";
import { getValidationErrorMessages } from "../helpers/errorHandlers";
import Responder from "../helpers/responder";
import TutorialsModel, { ITutorials } from "../models/tutorials.model";
import TutorialsValidator from "../validators/tutorials.validator";

const Tutorials = TutorialsModel.getModel();

const tutorialsValidator = new TutorialsValidator();

const responder = new Responder();

/**
 * TutorialsController
 */
class TutorialsController {
  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tutsFound: Array<ITutorials> = await Tutorials.find();

      if (tutsFound.length > 0) {
        responder.success(200, "got all tutorials", tutsFound);
      } else {
        responder.error(404, "no tutorials found");
      }

      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async getByID(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const tutFound: ITutorials = await Tutorials.findById(id) as ITutorials;

      if (tutFound) {
        responder.success(200, "tutorial found", tutFound);
      } else {
        responder.error(404, "no tutorial with matching id");
      }

      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async getPublished(req: Request, res: Response): Promise<void> {
    try {
      const tutsFound: Array<ITutorials> =
        await Tutorials.find({ published: true });

      if (tutsFound.length > 0) {
        responder.success(200, "got published tutorials", tutsFound);
      } else {
        responder.error(404, "no published tutorials found");
      }

      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      // * validation
      const { error: validationError, value } =
        tutorialsValidator.createValidation(req.body);

      if (!validationError) {
        // * Two different ways of creating a tutorial
        // eslint-disable-next-line max-len
        // const createdTutorial: ITutorials = await Tutorials.create(value);// * #1
        // eslint-disable-next-line max-len
        const createdTutorial: ITutorials = await new Tutorials(value).save(); // * #2

        responder.success(200, "tutorial created", createdTutorial);
      } else {
        responder.error(422, getValidationErrorMessages(validationError));
      }

      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async updateByID(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const foundTut: ITutorials = await Tutorials.findById(id) as ITutorials;

      if (foundTut) {
        // * validation
        const { error: validationError, value } = tutorialsValidator
            .updateValidation(req.body);

        if (!validationError) {
          const log = await Tutorials.updateOne({ _id: id }, value);
          const updatedTut: ITutorials =
              await Tutorials.findById(id) as ITutorials;

          const data = {
            updatedTut: updatedTut,
            log: log,
          };

          responder.success(200, "tutorial updated", data);
        } else {
          responder.error(422, getValidationErrorMessages(validationError));
        }
      } else {
        responder.error(404, "no tutorial with matching id found");
      }

      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @return {Promise<void>}
   */
  public async deleteByID(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const tutFound: ITutorials =
          await Tutorials.findById(req.params.id) as ITutorials;

      if (tutFound) {
        const log = await Tutorials.deleteOne({ _id: id });

        const data = {
          deletedTut: tutFound,
          log,
        };

        responder.success(200, "tutorial deleted", data);
      } else {
        responder.error(404, "no tutorial with matching id found");
      }

      responder.send(res);
    } catch (err) {
      responder.error(400, err.message);
      responder.send(res);
    }
  }
}

export default TutorialsController;

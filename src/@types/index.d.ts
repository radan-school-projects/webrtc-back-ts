/* eslint-disable no-unused-vars */
import { IUsers } from "../models/users.model";

declare global {
    namespace Express {
        interface Request {
            user?: Record<IUsers>
        }
    }
}

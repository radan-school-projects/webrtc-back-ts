import { ExtendedError } from "socket.io/dist/namespace";
import { Socket } from "socket.io";
import { usersList } from "../app/users";
import Joi from "joi";
// import { ExtendedSocket } from "../types";

const validateUsername = (username: string) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
  });
  const { error } = schema.validate({ username });
  if (error) {
    return {
      isValid: false,
      message: error.details[0].message,
      value: username,
    };
  }
  return {
    isValid: true,
    message: "username is valid",
    value: username,
  };
};
const isAvailableUsername = (username: string) => {
  const foundUser = usersList.find((user) => user.name === username);
  return (!foundUser) ? true : false;
};

export const usernameValidation =
(socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  const { isValid, message, value } =
      validateUsername(socket.handshake.auth.username);
  if (isValid) {
    socket.data.username = value;
    next();
  } else {
    console.log(message);
    next(new Error(message));
  }
};

export const usernameAvailability =
(socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  // const username = socket.handshake.auth.username;
  const { username } = socket.data;
  if (isAvailableUsername(username)) {
    console.log(`${username} has connected`);
    socket.data.username = username;
    next();
  } else {
    console.log("username taken");
    next(new Error("username taken"));
  }
};

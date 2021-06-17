import { ExtendedError } from "socket.io/dist/namespace";
import { ExtendedSocket } from "../types";

export const ioUsername =
(socket: ExtendedSocket, next: (err?: ExtendedError | undefined) => void) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    // console.log("invalid username");
    next(new Error("invalid username"));
  }
  socket.username = username;
  next();
};

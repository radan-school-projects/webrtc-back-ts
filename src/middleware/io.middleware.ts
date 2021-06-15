// import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { ExtendedSocket } from "../types";
import * as responder from "../utils/responder";

export const ioUsername =
(socket: ExtendedSocket, next: (err?: ExtendedError | undefined) => void) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    console.log("invalid username");

    responder.send(socket, {
      success: false,
      type: "connect",
      content: { description: "invalid username" },
    });

    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
};

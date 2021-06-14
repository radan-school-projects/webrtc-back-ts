import { Socket } from "socket.io";
import { IResponse } from "../types";

export const send = (socket: Socket, response: IResponse) => {
  socket.send(response);
};

export const sendTo =
(emitter: Socket, receiverId: string, response: IResponse) => {
  emitter.to(receiverId).emit("response", response);
};

export const broadcast = (emitter: Socket, response: IResponse) => {
  emitter.broadcast.emit("response", response);
};

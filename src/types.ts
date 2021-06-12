import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
  username?: string;
}

export const enum ResponseType {
  CONNECT = "connect",
  LOGIN = "login",
  OFFER = "offer",
  ANSWER = "answer",
}

export interface IResponse {
  type: ResponseType;
  success: boolean;
  content: any;
};

export interface IUser {
  username: string;
  socketId: string;
}

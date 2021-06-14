import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
  username?: string;
}

const CommandType = {
  CONNECT: "connect",
  LOGIN: "login",
  LEAVE: "leave",
  OFFER: "offer",
  ANSWER: "answer",
} as const;
export type CommandType = typeof CommandType[keyof typeof CommandType];

const ResponseType = {
  ...CommandType,
  ERROR: "error",
  OTHER: "other",
} as const;
export type ResponseType = typeof ResponseType[keyof typeof ResponseType];

export interface ICommand {
  type: CommandType;
  content: any;
}
export interface IResponse {
  type: ResponseType;
  success: boolean;
  content: any | null;
};

export interface IUser {
  name: string;
  id: string;
}

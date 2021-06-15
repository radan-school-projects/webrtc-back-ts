import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
  username?: string;
}

const CommandTypeEnum = {
  CONNECT: "connect",
  LOGIN: "login",
  LEAVE: "leave",
  OFFER: "offer",
  ANSWER: "answer",
} as const;
export type CommandType = typeof CommandTypeEnum[keyof typeof CommandTypeEnum];

const ResponseTypeEnum = {
  ...CommandTypeEnum,
  ERROR: "error",
  OTHER: "other",
} as const;
export type ResponseType =
  typeof ResponseTypeEnum[keyof typeof ResponseTypeEnum];

export interface ICommand {
  type: CommandType;
  content: any;
}

export interface IResponse {
  type: ResponseType;
  success: boolean;
  content: any | null;
}

export interface IUser {
  name: string;
  id: string;
}

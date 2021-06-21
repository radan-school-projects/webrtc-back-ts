// import { Socket } from "socket.io";
import { ExtendedSocket } from "../types";
import * as responder from "../utils/responder";
import { usersList } from "./users";

interface SignalingProps {
  // socket: Socket | ExtendedSocket;
  socket: ExtendedSocket;
  content: any;
}

export const login = ({ socket, content }: SignalingProps) => {
  const { username } = content;

  // if no username
  if (!username) {
    responder.send(socket, {
      success: false,
      type: "login",
      content: { description: "username cannot be empty" },
    });

    return socket.disconnect();
  }

  // check if the username is already used
  const foundUser = usersList.find((user) => user.name === username);
  if (foundUser) {
    responder.send(socket, {
      success: false,
      type: "login",
      content: { description: "username already in use" },
    });
    return socket.disconnect();
  }

  // else register the new username
  usersList.push({
    id: socket.id,
    name: username,
  });

  // send a success response
  responder.send(socket, {
    success: true,
    type: "login",
    content: { description: "login successful" },
  });
};

export const offer = ({ socket, content }: SignalingProps) => {
  const { friendname, offer } = content;

  if (!friendname) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: { description: "friendname cannot be empty" },
    });
  }
  if (socket.username === friendname) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: { description: "a friend can't be yourself" },
    });
  }

  const foundUser = usersList.find((user) => user.name === friendname);
  if (!foundUser) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: { description: "no friends with matching name" },
    });
  }
  // if (foundUser.name === friendname) {
  //   return responder.send(socket, {
  //     success: false,
  //     type: "offer",
  //     content: { description: "a friend can't be yourself" },
  //   });
  // }

  if (!offer) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: {
        description: "offer cannot be empty",
      },
    });
  }

  // send the offer to our friend
  responder.sendTo(socket, foundUser.id, {
    success: true,
    type: "offer",
    content: {
      description: `${socket.username} sent you an offer`,
      emitter: socket.username,
      offer,
    },
  });
};

export const answer = ({ socket, content }: SignalingProps) => {
  const { answer, caller } = content;

  if (!caller) {
    return responder.send(socket, {
      success: false,
      type: "answer",
      content: { description: "caller have no id!" },
    });
  }

  if (!answer) {
    return responder.send(socket, {
      success: false,
      type: "answer",
      content: {
        description: "answer cannot be empty!",
      },
    });
  }

  const foundUser = usersList.find((user) => user.name === caller);
  if (!foundUser) {
    return responder.send(socket, {
      success: false,
      type: "answer",
      content: { description: "no caller with matching name" },
    });
  }

  responder.sendTo(socket, foundUser.id, {
    success: true,
    type: "answer",
    content: {
      description: `${socket.username} answered you`,
      emitter: socket.username,
      answer,
    },
  });
};

interface ErrorProps {
  type: string;
  // socket: Socket | ExtendedSocket;
  socket: ExtendedSocket;
}

export const error = ({ socket, type }: ErrorProps) => {
  responder.send(socket, {
    type: "error",
    success: false,
    content: { message: `command ${type} not found` },
  });
};

import { Socket } from "socket.io";
import { ExtendedSocket } from "../types";
import * as responder from "../utils/responder";
import { usersList } from "./users";

interface SignalingProps {
  socket: Socket | ExtendedSocket;
  content: any;
}

export const login = ({ socket, content }: SignalingProps) => {
  const { username } = content;

  // if no username
  if (!username) {
    return responder.send(socket, {
      success: false,
      type: "login",
      content: { description: "username cannot be empty" },
    });
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
  if ((socket as ExtendedSocket).username === friendname) {
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
      description: `${(socket as ExtendedSocket).username} sent you an offer`,
    },
  });
};

// export const answer = ({ socket, content }: SignalingProps) => {

// };

interface ErrorProps {
  type: string;
  socket: Socket | ExtendedSocket;
}

export const error = ({ socket, type }: ErrorProps) => {
  responder.send(socket, {
    type: "error",
    success: false,
    content: { message: `command ${type} not found` },
  });
};

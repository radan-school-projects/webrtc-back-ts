import { Socket } from "socket.io";
import { ICommand } from "../types";
import { usersList } from "../app/users";
import * as signaling from "./signaling";
import * as responder from "./responder";

export const connectionEventHandler = (socket: Socket) => {
  // register the new username
  usersList.push({
    id: socket.id,
    name: socket.data.username,
  });

  responder.send(socket, {
    type: "socket-connect",
    success: true,
    content: {
      description: "connected and registered",
      connected: socket.connected,
      username: socket.data.username,
    },
  });

  socket.on("disconnect", () => {
    const me = usersList.find((user) => user.id === socket.id);

    if (!me) return;
    const i = usersList.indexOf(me);
    usersList.splice(i, 1);

    console.log(`${socket.data.username} has disconnected`);

    // responder.broadcast(socket, {
    //   type: "leave",
    //   success: true,
    //   content: {
    //     message: `User "${me.name}" has leaved`,
    //     userDisconnected: me,
    //   },
    // });
  });

  socket.on("command", (command: ICommand) => {
    const { type, content } = command;

    switch (type) {
      case "call-offer":
        signaling.callOffer({ socket, content });
        break;

      case "call-answer":
        signaling.callAnswer({ socket, content });
        break;

      case "peer-offer":
        signaling.peerOffer({ socket, content });
        break;

      case "peer-answer":
        signaling.peerAnswer({ socket, content });
        break;

      case "ice-candidate":
        signaling.iceCandidate({ socket, content });
        break;

      default:
        signaling.error({ socket, type });
        break;
    }
  });
};

import { ExtendedSocket, ICommand } from "../types";
import { usersList } from "../app/users";
import * as signaling from "./signaling";
import * as responder from "../utils/responder";

export const onConnection = (socket: ExtendedSocket) => {
  responder.send(socket, {
    type: "connect",
    success: true,
    content: {
      message: "connected to the socket server",
      connected: socket.connected,
    },
  });

  socket.on("disconnect", () => {
    const me = usersList.find((user) => user.id === socket.id);

    if (!me) return;
    const i = usersList.indexOf(me);
    usersList.splice(i, 1);

    // responder.broadcast(socket, {
    //   type: "leave",
    //   success: true,
    //   content: {
    //     message: `User "${me.name}" has leaved`,
    //     userDisconnected: me,
    //   },
    // });
  });

  socket.on("command", (command) => {
    // const { type, content: { username, offer, contact, answer } } =
    //     command as ICommand;
    const { type, content } = command as ICommand;

    switch (type) {
      case "login":
        signaling.login({ socket, content });
        break;

      case "offer":
        signaling.offer({ socket, content });
        break;

      case "answer":
        signaling.answer({ socket, content });
        break;

      case "candidate":
        signaling.candidate({ socket, content });
        break;

      default:
        signaling.error({ socket, type });
        break;
    }
  });
};

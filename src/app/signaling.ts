import { Socket } from "socket.io";
import * as responder from "./responder";
import { usersList } from "./users";

interface SignalingProps {
  socket: Socket;
  content: any;
}

export const offer = ({ socket, content }: SignalingProps) => {
  const { target, offer } = content;

  if (!target) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: { description: "no target to send offer" },
    });
  }
  if (socket.data.username === target) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: { description: "a target can't be yourself" },
    });
  }

  const foundUser = usersList.find((user) => user.name === target);
  if (!foundUser) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: { description: "no target with matching name" },
    });
  }

  if (!offer) {
    return responder.send(socket, {
      success: false,
      type: "offer",
      content: {
        description: "no offer to send to target",
      },
    });
  }

  // send the offer to our friend
  responder.sendTo(socket, foundUser.id, {
    success: true,
    type: "offer",
    content: {
      description: `${socket.data.username} sent you an offer`,
      emitter: socket.data.username,
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
      content: { description: "caller param not provided" },
    });
  }

  if (!answer) {
    return responder.send(socket, {
      success: false,
      type: "answer",
      content: {
        description: "no answer to send to caller!!",
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
      description: `${socket.data.username} answered you`,
      emitter: socket.data.username,
      answer,
    },
  });
};

export const candidate = ({ socket, content }: SignalingProps) => {
  const { candidate, friendname } = content;

  if (!candidate) {
    return responder.send(socket, {
      success: false,
      type: "candidate",
      content: { description: "candidate empty or null" },
    });
  }

  const foundUser = usersList.find((user) => user.name === friendname);
  if (!foundUser) {
    return responder.send(socket, {
      success: false,
      type: "answer",
      content: { description: "no friend with matching name" },
    });
  }

  responder.sendTo(socket, foundUser.id, {
    success: true,
    type: "candidate",
    content: {
      description: `${socket.data.username} sent you a candidate`,
      candidate,
    },
  });
};
interface ErrorProps {
  type: string;
  // socket: Socket | ExtendedSocket;
  socket: Socket;
}

export const error = ({ socket, type }: ErrorProps) => {
  responder.send(socket, {
    type: "error",
    success: false,
    content: { message: `command ${type} not found` },
  });
};

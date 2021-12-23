import express from "express";
import http from "http";
import { Server } from "socket.io";

import { connectionEventHandler } from "./app/websocket";
import {
  usernameValidation,
  usernameAvailability,
} from "./middleware/io.middleware";
import { PORT, serverOptions } from "./config";

// don't forget to awake heroku

// initialization
const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, serverOptions);

// socket.io middlewares
io.use(usernameValidation);
io.use(usernameAvailability);

// socket events
io.on("connection", connectionEventHandler);

// server listen
httpServer.listen(
    PORT,
    () => console.log(`Runnning on port: ${PORT}`),
);

import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as ws from "./app/websocket";
import { ioUsername } from "./middleware/io.middleware";
import * as config from "./config";

// don't forget to awake heroku

// initialization
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, config.serverOptions);

// middlewares
io.use(ioUsername);

// socket events
io.on("connection", ws.onConnection);

// server listen
httpServer.listen(config.PORT,
    () => console.log(`Runnning on port: ${config.PORT}`));

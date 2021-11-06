import path from "path";
import express, { Request, Response } from "express";
import http from "http";
// import https from "https";
import { Server } from "socket.io";
// import cors from "cors";

import { connectionEventHandler } from "./app/websocket";
import {
  usernameValidation,
  usernameAvailability,
} from "./middleware/io.middleware";
import { PORT, serverOptions } from "./config";

// don't forget to awake heroku

// initialization
const app = express();
// app.use(cors());
app.use(express.static(path.join(process.cwd(), "static")));
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "welcome.html"));
});

// const httpServer = https.createServer(app);
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
    // "192.168.1.119",
    () => console.log(`Runnning on port: ${PORT}`),
);

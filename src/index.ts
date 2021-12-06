import fs from "fs";
import path from "path";
import express, { Request, Response } from "express";
// import http from "http";
import https from "https";
import { Server } from "socket.io";

import { connectionEventHandler } from "./app/websocket";
import {
  usernameValidation,
  usernameAvailability,
} from "./middleware/io.middleware";
import { PORT, serverOptions } from "./config";

const CWD = process.cwd();

const key = fs.readFileSync(path.join(CWD, "selfsigned.key"));
const cert = fs.readFileSync(path.join(CWD, "selfsigned.crt"));
const options = {
  key,
  cert,
};

// don't forget to awake heroku

// initialization
const app = express();
app.use(express.static(path.join(process.cwd(), "static")));

const httpServer = https.createServer(options, app);
// const httpServer = http.createServer(app);
const io = new Server(httpServer, serverOptions);

// socket.io middlewares
io.use(usernameValidation);
io.use(usernameAvailability);

// socket events
io.on("connection", connectionEventHandler);

// client
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "static", "index.html"));
});

// server listen
httpServer.listen(
    PORT,
    () => console.log(`Runnning on port: ${PORT}`),
);

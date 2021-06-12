export const PORT = process.env.PORT || 3300;

export const serverOptions = {
  cors: {
    origin: process.env.SOCKET_CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
};

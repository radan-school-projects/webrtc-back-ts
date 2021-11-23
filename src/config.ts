export const PORT = Number(process.env.PORT) || 3300;

export const serverOptions = {
  cors: {
    // origin: "*",
    origin: process.env.SOCKET_CLIENT_URL || "https://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
};

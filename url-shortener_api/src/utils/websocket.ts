import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initializeWebSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(",") || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {});

    // User joins a room for their URLs to receive real-time updates
    socket.on("join-user-room", (userId: string) => {
      socket.join(`user:${userId}`);
    });

    socket.on("leave-user-room", (userId: string) => {
      socket.leave(`user:${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("WebSocket not initialized");
  }
  return io;
};

export const emitClickUpdate = (
  userId: string,
  urlId: string,
  clicks: number
) => {
  try {
    const io = getIO();
    const room = `user:${userId}`;
    io.to(room).emit("url-clicked", {
      urlId,
      clicks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to emit click update:", error);
  }
};

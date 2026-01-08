import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export const initializeWebSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // User joins a room for their URLs to receive real-time updates
    socket.on('join-user-room', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('leave-user-room', (userId: string) => {
      socket.leave(`user:${userId}`);
      console.log(`User ${userId} left their room`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('WebSocket not initialized');
  }
  return io;
};


export const emitClickUpdate = (userId: string, urlId: string, clicks: number) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit('url-clicked', {
      urlId,
      clicks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to emit click update:', error);
  }
};

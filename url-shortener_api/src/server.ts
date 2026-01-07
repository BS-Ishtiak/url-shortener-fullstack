import http from 'http';
import app from './app';
import { initializeDatabase, closeDatabase } from './utils/database';
import { initializeWebSocket } from './utils/websocket';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    // Create HTTP server for Socket.io support
    const httpServer = http.createServer(app);
    
    // Initialize WebSocket
    initializeWebSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(
        `\n✅ Server is running on http://${HOST}:${PORT}`
      );
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      httpServer.close(async () => {
        await closeDatabase();
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT signal received: closing HTTP server');
      httpServer.close(async () => {
        await closeDatabase();
        console.log('HTTP server closed');
        process.exit(0);
      });
    });

    // Unhandled rejection handler
    process.on('unhandledRejection', async (reason: Error) => {
      console.error('Unhandled Rejection at:', reason);
      await closeDatabase();
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

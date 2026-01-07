import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  userId: string | null;
  enabled?: boolean;
}

export const useSocket = ({ userId, enabled = true }: UseSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!enabled || !userId) return;

    // Connect to the server
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      // Join the user's room for real-time updates
      socket.emit('join-user-room', userId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socket) {
        socket.emit('leave-user-room', userId);
        socket.disconnect();
      }
    };
  }, [userId, enabled]);

  // Method to listen for click updates
  const onUrlClicked = useCallback(
    (callback: (data: { urlId: string; clicks: number; timestamp: string }) => void) => {
      if (socketRef.current) {
        socketRef.current.on('url-clicked', callback);
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.off('url-clicked', callback);
        }
      };
    },
    []
  );

  return {
    socket: socketRef.current,
    onUrlClicked,
  };
};

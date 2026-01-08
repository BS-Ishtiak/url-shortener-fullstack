import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  userId: string | null;
  enabled?: boolean;
}

export const useSocket = ({ userId, enabled = true }: UseSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const listenersSetupRef = useRef<boolean>(false);

  // Initialize socket connection
  useEffect(() => {
    if (!enabled || !userId) {
      console.log('⏸️ Socket initialization skipped - enabled:', enabled, 'userId:', userId);
      return;
    }

    // Connect to the server
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
    
      socket.emit('join-user-room', userId);
      
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      listenersSetupRef.current = false;
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Socket connection error:', error);
    });

    return () => {
      
      if (socket) {
        socket.emit('leave-user-room', userId);
        socket.disconnect();
      }
      listenersSetupRef.current = false;
    };
  }, [userId, enabled]);

  // Method to listen for click updates - set up listener only once
  const onUrlClicked = useCallback(
    (callback: (data: { urlId: string; clicks: number; timestamp: string }) => void) => {
      if (socketRef.current && !listenersSetupRef.current) {
        console.log('👂 Setting up url-clicked listener');
        listenersSetupRef.current = true;
        
        socketRef.current.on('url-clicked', (data) => {
          callback(data);
        });
      }

      return () => {
        
        if (socketRef.current) {
          socketRef.current.off('url-clicked');
          listenersSetupRef.current = false;
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

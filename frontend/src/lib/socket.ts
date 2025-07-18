import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (userId: number, token?: string): Socket => {
  // if (!socket || !socket.connected) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      query: { userId },
      transports: ['websocket'],
      secure: true,
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket with ID:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });
  // }

  return socket;
};

export const getSocket = (): Socket | null => socket;

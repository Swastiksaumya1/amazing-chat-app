import { Socket as SocketIOSocket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    userId?: string;
  }
}

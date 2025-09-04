import * as React from 'react';
import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  useCallback, 
  ReactNode,
  useMemo
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { messagesAPI } from '../services/api';

export interface User {
  _id: string;
  username: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: Record<string, Message[]>;
  onlineUsers: string[];
  typingUsers: Record<string, boolean>;
  sendMessage: (receiverId: string, text: string) => Promise<Message>;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Connection event handlers
    const handleConnect = () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    };

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => prev.includes(userId) ? prev : [...prev, userId]);
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    };

    const handleReceiveMessage = ({ message }: { message: Message }) => {
      const chatKey = message.senderId;
      setMessages(prev => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), message].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      }));
    };

    const handleUserTyping = ({ senderId, isTyping }: { senderId: string, isTyping: boolean }) => {
      setTypingUsers(prev => ({
        ...prev,
        [senderId]: isTyping
      }));

      // Automatically stop typing indicator after 3 seconds if typing
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => ({
            ...prev,
            [senderId]: false
          }));
        }, 3000);
      }
    };

    // Set up event listeners
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('userOnline', handleUserOnline);
    newSocket.on('userOffline', handleUserOffline);
    newSocket.on('receiveMessage', handleReceiveMessage);
    newSocket.on('userTyping', handleUserTyping);

    // Cleanup on unmount
    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('userOnline', handleUserOnline);
      newSocket.off('userOffline', handleUserOffline);
      newSocket.off('receiveMessage', handleReceiveMessage);
      newSocket.off('userTyping', handleUserTyping);
      newSocket.disconnect();
    };
  }, [user]);



  // Send a new message
  const sendMessage = useCallback(async (receiverId: string, text: string): Promise<Message> => {
    if (!socket) throw new Error('Socket not connected');

    return new Promise((resolve, reject) => {
      socket.emit('sendMessage', { receiverId, text }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          const message = response.message;
          // Update local state
          setMessages(prev => ({
            ...prev,
            [receiverId]: [...(prev[receiverId] || []), message].sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          }));
          resolve(message);
        }
      });
    });
  }, [socket]);



  // Typing indicators
  const startTyping = useCallback((receiverId: string) => {
    if (!socket) return;
    socket.emit('typing', { receiverId, isTyping: true });
  }, [socket]);

  const stopTyping = useCallback((receiverId: string) => {
    if (!socket) return;
    socket.emit('typing', { receiverId, isTyping: false });
  }, [socket]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    socket,
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  }), [
    socket,
    isConnected,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    startTyping,
    stopTyping,
  ]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;

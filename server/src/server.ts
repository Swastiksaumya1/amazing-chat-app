import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import { socketAuthenticate } from './middleware/auth';
import User from './models/User';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Create Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Socket.IO connection handling
const onlineUsers = new Map<string, string>();

// Get online users endpoint
app.get('/api/users/online', (req: Request, res: Response) => {
  const onlineUserIds = Array.from(onlineUsers.keys());
  res.json({ onlineUsers: onlineUserIds });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

io.use(socketAuthenticate);

io.on('connection', async (socket: Socket) => {
  const userId = socket.userId;

  if (!userId) {
    console.error('Socket connected without userId');
    socket.disconnect();
    return;
  }

  // Add user to online users map
  onlineUsers.set(userId, socket.id);

  // Update user's online status in the database
  await User.findByIdAndUpdate(userId, { isOnline: true });

  // Notify other users that this user is online
  socket.broadcast.emit('userOnline', { userId });

  // Join user to their own room for private messages
  socket.join(userId);

  // Handle typing events
  socket.on('typing', ({ receiverId }) => {
    socket.to(receiverId).emit('userTyping', { userId });
  });

  // Handle stop typing events
  socket.on('stopTyping', ({ receiverId }) => {
    socket.to(receiverId).emit('userStoppedTyping', { userId });
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    onlineUsers.delete(userId);

    // Update user's online status in the database
    await User.findByIdAndUpdate(userId, { isOnline: false });

    // Notify other users that this user is offline
    socket.broadcast.emit('userOffline', { userId });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;

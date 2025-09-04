const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

// Store online users: { userId: socketId }
const onlineUsers = new Map();

const initializeSocket = (io) => {
  // Socket.IO middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Add user to online users
    onlineUsers.set(socket.userId, socket.id);
    io.emit('userOnline', { userId: socket.userId });

    // Handle private messages
    socket.on('sendMessage', async ({ receiverId, text }, callback) => {
      try {
        if (!text || !receiverId) {
          return callback({ error: 'Missing required fields' });
        }

        // Create and save message
        const message = new Message({
          senderId: socket.userId,
          receiverId,
          text
        });

        await message.save();

        // Populate sender info
        const populatedMessage = await Message.populate(message, {
          path: 'senderId',
          select: 'name email'
        });

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receiveMessage', {
            message: populatedMessage
          });
        }

        // Send acknowledgment to sender
        callback({ success: true, message: populatedMessage });
      } catch (error) {
        console.error('Error sending message:', error);
        callback({ error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', ({ receiverId, isTyping }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', {
          senderId: socket.userId,
          isTyping
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      io.emit('userOffline', { userId: socket.userId });
    });
  });

  return io;
};

// Helper function to check if a user is online
const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

module.exports = { initializeSocket, isUserOnline };

import api from './api';

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: string;
}

const chatAPI = {
  // Get all conversations for the current user
  getConversations: async (): Promise<{ data: User[] }> => {
    return api.get('/messages/conversations');
  },

  // Get messages between current user and another user
  getMessages: async (userId: string): Promise<{ data: Message[] }> => {
    return api.get(`/messages/${userId}`);
  },

  // Send a new message
  sendMessage: async (receiverId: string, content: string): Promise<{ data: Message }> => {
    return api.post('/messages', { receiverId, content });
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]): Promise<void> => {
    return api.post('/messages/read', { messageIds });
  },

  // Search for users
  searchUsers: async (query: string): Promise<{ data: User[] }> => {
    return api.get(`/users/search?q=${encodeURIComponent(query)}`);
  },

  // Get user by ID
  getUser: async (userId: string): Promise<{ data: User }> => {
    return api.get(`/users/${userId}`);
  },
};

export default chatAPI;

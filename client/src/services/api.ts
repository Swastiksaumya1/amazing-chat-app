import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error as Error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (userId: string) => api.get(`/users/${userId}`),
  searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
};

// Messages API
export const messagesAPI = {
  // Get all conversations for the current user
  getConversations: () => api.get('/messages/conversations'),

  // Get messages between current user and another user
  getMessages: (userId: string) => api.get(`/messages/${userId}`),

  // Send a new message
  sendMessage: (receiverId: string, content: string) =>
    api.post('/messages', { receiverId, content }),

  // Mark messages as read
  markAsRead: (messageIds: string[]) => api.patch('/messages/read', { messageIds }),
};

// WebSocket service URL
export const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = import.meta.env.VITE_WS_HOST || window.location.host;
  return `${protocol}//${host}`;
};

export default api;

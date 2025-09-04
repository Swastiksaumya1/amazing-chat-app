import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    messages,
    onlineUsers,
    sendMessage: sendSocketMessage,
    startTyping,
    stopTyping,
    typingUsers
  } = useSocket();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication and fetch users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);

      // Select the first user by default if available
      if (data.length > 0 && !selectedUser) {
        setSelectedUser(data[0]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      loadMessagesForUser(selectedUser._id);
    }
  }, [selectedUser]);

  // Load messages for a specific user
  const loadMessagesForUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      // Messages are handled by the socket context
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !selectedUser || !user) return;

    try {
      await sendSocketMessage(selectedUser._id, message);
      setMessage('');
      stopTyping(selectedUser._id);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!selectedUser || !isTyping) return;
    
    startTyping(selectedUser._id);
    
    // Reset typing indicator after 3 seconds of inactivity
    const timer = setTimeout(() => {
      stopTyping(selectedUser._id);
      setIsTyping(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get messages for the selected user
  const getMessagesForSelectedUser = () => {
    if (!selectedUser || !user) return [];

    // Messages are stored by the other user's ID in the socket context
    return messages[selectedUser._id] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-screen flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">ChatApp</h1>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm text-white/80">Welcome, {user?.name}</p>
            </div>
          </div>
          
          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
                </svg>
                Online Users ({users.length})
              </h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center p-4 rounded-xl cursor-pointer w-full text-left transition-all duration-200 ${
                      selectedUser?._id === user._id
                        ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 shadow-lg'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                          onlineUsers.includes(user._id) ? 'bg-green-400' : 'bg-gray-400'
                        }`}
                      ></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-white/60 text-sm">
                        {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                      </p>
                    </div>
                    {selectedUser?._id === user._id && (
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
            
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl">
          {selectedUser ? (
            <>
              {/* Chat header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                        onlineUsers.includes(selectedUser._id) ? 'bg-green-400' : 'bg-gray-400'
                      }`}
                    ></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedUser.name}</h2>
                    <p className="text-white/60 text-sm">
                      {onlineUsers.includes(selectedUser._id) ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {getMessagesForSelectedUser().map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.senderId === user?._id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      msg.senderId === user?._id ? 'order-2' : 'order-1'
                    }`}>
                      <div className={`text-xs mb-2 ${
                        msg.senderId === user?._id ? 'text-right text-white/60' : 'text-left text-white/60'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div
                        className={`rounded-2xl p-4 shadow-lg backdrop-blur-sm ${
                          msg.senderId === user?._id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ml-4'
                            : 'bg-white/10 text-white border border-white/20 mr-4'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {selectedUser && typingUsers[selectedUser._id] && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-white/60 text-sm">{selectedUser.name} is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
                  
              {/* Message input */}
              <div className="p-6 border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setIsTyping(true);
                      }}
                      onKeyDown={handleTyping}
                      onBlur={() => {
                        if (selectedUser) {
                          stopTyping(selectedUser._id);
                        }
                        setIsTyping(false);
                      }}
                      placeholder="Type your message..."
                      className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 pr-12"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Send</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                  <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start a Conversation</h3>
                <p className="text-white/60">Select a user from the sidebar to begin chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

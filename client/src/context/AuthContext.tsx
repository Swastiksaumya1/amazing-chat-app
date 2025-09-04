import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({ ...response.data, token });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser({ ...userData, token });
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setUser({ ...userData, token });
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const contextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
    loading,
    error,
  }), [user, login, register, logout, loading, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

declare global {
  interface Window {
    React: typeof React;
  }
}

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Don't show navbar on auth pages
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-2xl border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">ChatApp</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/chat"
                className={`${
                  location.pathname === '/chat'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Chat
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${
                    location.pathname === '/login'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`${
                    location.pathname === '/register'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ml-4 px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

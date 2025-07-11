
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Code, Home, Bookmark, LogOut, Sun, Moon, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CodeSnippets
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated && (
              <>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user?.username}</span>
                </div>
                
                <nav className="hidden md:flex items-center space-x-1">
                  <Link
                    to="/codes"
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      isActive('/codes') 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    <span>All Codes</span>
                  </Link>
                  
                  <Link
                    to="/saved"
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      isActive('/saved') 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Saved</span>
                  </Link>
                </nav>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <nav className="md:hidden border-t px-4 py-2 flex justify-center space-x-6">
            <Link
              to="/codes"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/codes') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="text-sm">All Codes</span>
            </Link>
            
            <Link
              to="/saved"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/saved') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span className="text-sm">Saved</span>
            </Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;

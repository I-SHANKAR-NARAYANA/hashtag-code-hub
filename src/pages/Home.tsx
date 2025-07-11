
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';

const Home: React.FC = () => {
  const { login, signup, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/codes" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let success = false;
      
      if (isSignupMode) {
        success = await signup(email, password, username);
        if (success) {
          setError('Account created! Please check your email to verify your account.');
          return;
        } else {
          setError('Failed to create account. Please try again.');
        }
      } else {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError(isSignupMode ? 'Signup failed. Please try again.' : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Code className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            CodeSnippets
          </h1>
          <p className="text-muted-foreground">
            Share and discover amazing code snippets
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-card border rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            {isSignupMode ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            <span>{isSignupMode ? 'Create Account' : 'Welcome Back'}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignupMode && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full p-3 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required={isSignupMode}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full p-3 bg-secondary border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className={`p-3 border rounded-lg text-sm ${
                error.includes('check your email') 
                  ? 'bg-green-500/10 border-green-500/20 text-green-500'
                  : 'bg-red-500/10 border-red-500/20 text-red-500'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {isSignupMode ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
                  <span>{isSignupMode ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignupMode(!isSignupMode);
                setError('');
                setEmail('');
                setPassword('');
                setUsername('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {isSignupMode 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

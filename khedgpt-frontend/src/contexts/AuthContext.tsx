import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if there's a saved user in localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('khetgpt_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('khetgpt_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function (replace with actual API call in production)
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      // In a real application, this would be an API call
      if (email === 'demo@khetgpt.com' && password === 'password') {
        const newUser: User = {
          id: '1',
          name: 'Demo User',
          email: email,
          role: 'farmer'
        };
        
        setUser(newUser);
        localStorage.setItem('khetgpt_user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  // Mock signup function (replace with actual API call in production)
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration logic
      // In a real application, this would be an API call
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9), // Generate a random ID
        name: name,
        email: email,
        role: 'farmer'
      };
      
      setUser(newUser);
      localStorage.setItem('khetgpt_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      setError('An error occurred during registration');
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('khetgpt_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

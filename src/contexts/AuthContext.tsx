import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  investment_style?: string[];
  privacy_settings: {
    profile: 'public' | 'private' | 'followers';
    trades: 'public' | 'private' | 'followers';
    journal: 'public' | 'private' | 'followers';
    analysis: 'public' | 'private' | 'followers';
  };
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    bio?: string;
    investment_style?: string[];
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的认证信息
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token: tokenData } = response.data;

      setUser(userData);
      setToken(tokenData);

      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // 注册
  const register = async (data: {
    email: string;
    username: string;
    password: string;
    bio?: string;
    investment_style?: string[];
  }) => {
    try {
      const response = await authAPI.register(data);
      const { user: userData, token: tokenData } = response.data;

      setUser(userData);
      setToken(tokenData);

      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // 登出
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
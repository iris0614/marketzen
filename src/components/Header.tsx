import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, BarChart3, Settings, Globe, BookOpen, LogOut, User, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'dashboard', icon: BarChart3 },
    { path: '/journal', label: 'journal', icon: BookOpen },
    { path: '/review', label: 'review', icon: BarChart3 },
    { path: '/settings', label: 'settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-gray-100 shadow-soft">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center">
              <Logo size="md" className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              {language === 'zh' ? '观市' : 'MarketZen'}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{t(item.label, language)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Globe size={16} />
              <span>{language === 'zh' ? 'EN' : '中'}</span>
            </button>

            {/* New Trade Button */}
            <Link
              to="/new"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>{t('newTrade', language)}</span>
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="hidden md:block">{user?.username}</span>
                <ChevronDown size={16} />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    <span>{language === 'zh' ? '退出登录' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
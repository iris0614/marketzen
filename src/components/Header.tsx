import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, BarChart3, Settings, Globe, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n';
import Logo from './Logo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'dashboard', icon: BarChart3 },
    { path: '/journal', label: 'journal', icon: BookOpen },
    { path: '/review', label: 'review', icon: BarChart3 },
    { path: '/settings', label: 'settings', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-gray-100 shadow-soft w-full overflow-x-hidden sticky top-0 z-30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center">
              <Logo size="md" className="text-blue-600 group-hover:text-blue-700 transition-colors duration-200" />
            </div>
            <span className="text-xl font-semibold text-gray-900">
              {language === 'zh' ? '观市' : 'MarketZen'}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 w-auto">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
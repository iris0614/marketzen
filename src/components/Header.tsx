import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, BarChart3, Settings, Globe, BookOpen, Menu, X } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n';
import Logo from './Logo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* PC导航 */}
          <nav className="hidden md:flex items-center space-x-1 w-auto">
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

          {/* PC端 Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => onLanguageChange(language === 'zh' ? 'en' : 'zh')}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Globe size={16} />
              <span>{language === 'zh' ? 'EN' : '中'}</span>
            </button>
            <Link
              to="/new"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>{t('newTrade', language)}</span>
            </Link>
          </div>
          {/* 移动端汉堡按钮 */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
      {/* 移动端下拉菜单/侧边栏 */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* 遮罩层 */}
          <div className="fixed inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          {/* 侧边栏 */}
          <div className="ml-auto w-2/3 max-w-xs bg-white h-full shadow-lg flex flex-col p-6 relative animate-slide-in">
            <button className="absolute top-4 right-4 p-2" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
            <div className="flex flex-col space-y-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{t(item.label, language)}</span>
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  onLanguageChange(language === 'zh' ? 'en' : 'zh');
                  setMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-base text-gray-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <Globe size={18} />
                <span>{language === 'zh' ? 'EN' : '中'}</span>
              </button>
              <Link
                to="/new"
                className="btn-primary flex items-center space-x-2 justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <Plus size={18} />
                <span>{t('newTrade', language)}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
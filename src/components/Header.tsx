import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus, BarChart3, Settings, BookOpen, Menu, X, Library, PenLine } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'dashboard', icon: BarChart3 },
    { path: '/notes', label: 'notes', icon: Library },
    { path: '/diary', label: 'diary', icon: PenLine },
    { path: '/journal', label: 'journal', icon: BookOpen },
    { path: '/review', label: 'review', icon: BarChart3 },
    { path: '/settings', label: 'settings', icon: Settings },
  ];

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-paper-50/90 backdrop-blur-md border-b border-paper-400 shadow-soft w-full overflow-x-hidden sticky top-0 z-30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <Logo size="md" className="text-clay-600 group-hover:text-clay-700 transition-colors duration-200" />
            <span className="font-serif text-xl text-ink tracking-tight">
              {language === 'zh' ? '观市' : 'MarketZen'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 min-w-0 flex-1 overflow-x-auto mx-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-[12px] text-[13px] font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-clay-50 text-clay-700'
                      : 'text-ink-muted hover:text-ink hover:bg-paper-200'
                  }`}
                >
                  <Icon size={15} />
                  <span>{t(item.label, language)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2 shrink-0">
            <LanguageToggle language={language} onChange={onLanguageChange} />
            <Link
              to="/new"
              className="btn-primary hidden sm:flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>{t('newTrade', language)}</span>
            </Link>
            <button
              className="md:hidden p-2 rounded-[12px] text-ink hover:bg-paper-200"
              onClick={() => setMenuOpen(true)}
              aria-label={t('openMenu', language)}
              type="button"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-ink/30" onClick={() => setMenuOpen(false)} />
          <div className="ml-auto w-72 max-w-[85%] bg-paper-50 h-full shadow-large flex flex-col p-6 relative animate-slide-in border-l border-paper-400">
            <button
              className="absolute top-4 right-4 p-2 rounded-[12px] hover:bg-paper-200"
              onClick={() => setMenuOpen(false)}
              aria-label={t('closeMenu', language)}
              type="button"
            >
              <X size={22} />
            </button>
            <div className="flex flex-col space-y-2 mt-10">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-[12px] text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-clay-50 text-clay-700'
                        : 'text-ink hover:text-clay-700 hover:bg-clay-50'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{t(item.label, language)}</span>
                  </Link>
                );
              })}
              <Link
                to="/new"
                className="btn-primary flex items-center space-x-2 justify-center mt-4 sm:hidden"
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

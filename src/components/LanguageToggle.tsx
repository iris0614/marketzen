import React from 'react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onChange: (language: Language) => void;
  className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({
  language,
  onChange,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center rounded-[12px] border border-paper-400 bg-paper-50 p-0.5 shadow-soft ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => onChange('zh')}
        aria-pressed={language === 'zh'}
        className={`px-2.5 py-1 text-[11px] tracking-[0.14em] font-medium rounded-[10px] transition-all duration-200 ${
          language === 'zh'
            ? 'bg-ink text-paper-50 shadow-soft'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        ZH
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        aria-pressed={language === 'en'}
        className={`px-2.5 py-1 text-[11px] tracking-[0.14em] font-medium rounded-[10px] transition-all duration-200 ${
          language === 'en'
            ? 'bg-ink text-paper-50 shadow-soft'
            : 'text-ink-muted hover:text-ink'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;

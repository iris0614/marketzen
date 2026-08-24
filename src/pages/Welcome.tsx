import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../types';
import Logo from '../components/Logo';
import LanguageToggle from '../components/LanguageToggle';

interface WelcomeProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  const quotes = {
    zh: {
      title: '我们都是这个时空的过客，',
      subtitle: '只是短暂停留。',
      purpose: '我们的使命，是去观察，去学习，去成长，去爱……',
      ending: '……然后，回到我们真正的归处。',
    },
    en: {
      title: 'We are all visitors to this time, this place.',
      subtitle: 'We are just passing through.',
      purpose: 'Our purpose here is to observe, to learn, to grow, to love...',
      ending: '...and then we return home.',
    },
  };

  const currentQuote = quotes[language];

  return (
    <div className="min-h-screen w-full bg-paper relative flex items-center justify-center px-5 py-16">
      <div className="absolute top-6 right-6 z-20">
        <LanguageToggle language={language} onChange={onLanguageChange} />
      </div>

      <div
        className={`relative z-10 text-center max-w-2xl w-full transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-14 flex items-center justify-center gap-4">
          <Logo size="lg" className="text-clay-600" />
          <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tight">
            {language === 'zh' ? '观市' : 'MarketZen'}
          </h1>
        </div>

        <div className="space-y-8 mb-14">
          {[currentQuote.title, currentQuote.subtitle, currentQuote.purpose, currentQuote.ending].map(
            (line, index) => (
              <p
                key={`${language}-${index}`}
                className="font-serif font-medium leading-relaxed text-base sm:text-lg md:text-xl text-ink animate-fade-in"
                style={{ animationDelay: `${0.15 + index * 0.28}s` }}
              >
                {line}
              </p>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="group inline-flex items-center px-8 py-3.5 text-lg text-clay-700 border border-clay-500 rounded-[12px] bg-paper-50 hover:bg-clay-500 hover:text-paper-50 transition-all duration-300 shadow-soft"
        >
          <span className="mr-3">
            {language === 'zh' ? '开始观市' : 'Begin Observing'}
          </span>
          <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome;

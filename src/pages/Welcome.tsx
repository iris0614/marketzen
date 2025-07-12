import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import Logo from '../components/Logo';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [language, setLanguage] = useState<'zh' | 'en'>('en');

  useEffect(() => {
    // 获取用户语言设置
    const settings = storage.getSettings();
    setLanguage(settings.language);
    
    // 页面加载时的淡入动画
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    navigate('/dashboard');
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
    storage.saveSettings({ ...storage.getSettings(), language: newLanguage });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex items-center justify-center px-4">
      {/* 微妙的背景纹理效果 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#FAF9F7]"></div>
      </div>
      
      <div className={`relative z-10 text-center max-w-2xl transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* 网站Logo和名称 */}
        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center justify-center mr-6">
              <Logo size="lg" className="text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-[#37352F] mb-2">
                {language === 'zh' ? '观市' : 'MarketZen'}
              </h1>
            </div>
          </div>
        </div>

        {/* 语言切换按钮 */}
        <div className="mb-12">
          <button
            onClick={handleLanguageChange}
            className="text-[#787774] hover:text-[#37352F] transition-colors duration-200 text-sm underline"
          >
            {language === 'zh' ? 'Switch to English' : '切换到中文'}
          </button>
        </div>

        {/* 入口按钮 */}
        <button
          onClick={handleEnter}
          className="group inline-flex items-center px-10 py-4 text-xl text-[#2F5FD5] border-2 border-[#2F5FD5] rounded-lg transition-all duration-300 hover:bg-[#2F5FD5] hover:text-white hover:shadow-lg"
        >
          <span className="mr-3">
            {language === 'zh' ? '开始观市' : 'Begin Observing'}
          </span>
          <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
        </button>
      </div>
    </div>
  );
};

export default Welcome; 
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

  const quotes = {
    zh: {
      title: "我们都是这个时空的过客，",
      subtitle: "只是短暂停留。",
      purpose: "我们的使命，是去观察，去学习，去成长，去爱……",
      ending: "……然后，回到我们真正的归处。"
    },
    en: {
      title: "We are all visitors to this time, this place.",
      subtitle: "We are just passing through.",
      purpose: "Our purpose here is to observe, to learn, to grow, to love...",
      ending: "...and then we return home."
    }
  };

  const currentQuote = quotes[language];

  // 整句淡入动画，而不是逐字动画
  const fadeInStyle = (delay: number) => ({
    opacity: 0,
    animation: `fadeIn 0.8s forwards`,
    animationDelay: `${delay}s`,
  });

  // 渲染整句动画文本
  const renderAnimatedText = (text: string, isEnglish: boolean = false, delay: number = 0) => (
    <div style={fadeInStyle(delay)}>
      <span style={{ 
        fontSize: '1.5rem', // 中英文字体大小保持一致
        fontFamily: 'Noto Serif SC, serif', 
        fontWeight: 500,
        lineHeight: '1.6',
        whiteSpace: 'nowrap', // 确保英文不换行
        display: 'block' // 每句话独占一行
      }}>
        {text}
      </span>
    </div>
  );

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

        {/* 引言文字 */}
        <div className="mt-12 mb-8 text-center">
          {renderAnimatedText(currentQuote.title, language === 'en', 0.2)}
        </div>
        <div className="mt-12 mb-8 text-center">
          {renderAnimatedText(currentQuote.subtitle, language === 'en', 0.6)}
        </div>
        <div className="mt-12 mb-8 text-center">
          {renderAnimatedText(currentQuote.purpose, language === 'en', 1.0)}
        </div>
        <div className="mt-12 mb-8 text-center">
          {renderAnimatedText(currentQuote.ending, language === 'en', 1.4)}
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

// 3. 在文件底部添加全局动画样式
<style>{`
@keyframes fadeIn {
  to { opacity: 1; }
}
`}</style> 
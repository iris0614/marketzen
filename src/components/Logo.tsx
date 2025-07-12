import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* 外圆 - 代表宇宙/市场 */}
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-gray-700"
        />
        
        {/* 内圆 - 代表内心/智慧 */}
        <circle
          cx="16"
          cy="16"
          r="8"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-gray-500"
        />
        
        {/* 中心点 - 代表观察者/投资者 */}
        <circle
          cx="16"
          cy="16"
          r="2"
          fill="currentColor"
          className="text-blue-600"
        />
        
        {/* 四个小点 - 代表四季/周期，使用更优雅的布局 */}
        <circle
          cx="16"
          cy="6"
          r="1"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="26"
          cy="16"
          r="1"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="16"
          cy="26"
          r="1"
          fill="currentColor"
          className="text-gray-400"
        />
        <circle
          cx="6"
          cy="16"
          r="1"
          fill="currentColor"
          className="text-gray-400"
        />
        
        {/* 添加微妙的连接线，代表观察的视角 */}
        <line
          x1="16"
          y1="6"
          x2="16"
          y2="26"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-300"
        />
        <line
          x1="6"
          y1="16"
          x2="26"
          y2="16"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-gray-300"
        />
      </svg>
    </div>
  );
};

export default Logo; 
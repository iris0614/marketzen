import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm font-medium ${
            isPositive ? 'text-success-600' : 'text-danger-600'
          }`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${
          isPositive ? 'bg-success-50' : 'bg-danger-50'
        }`}>
          <Icon 
            size={24} 
            className={isPositive ? 'text-success-600' : 'text-danger-600'} 
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 
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
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-muted mb-1">{title}</p>
          <p className="text-2xl font-serif text-ink truncate">{value}</p>
          <p className={`text-sm font-medium mt-1 ${
            isPositive ? 'text-sage-600' : 'text-rose-600'
          }`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-[12px] shrink-0 ${
          isPositive ? 'bg-sage-50' : 'bg-rose-50'
        }`}>
          <Icon
            size={22}
            className={isPositive ? 'text-sage-600' : 'text-rose-600'}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

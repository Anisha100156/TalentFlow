// MetricCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, change, trend }) => {
  const isPositive = trend === 'up';
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="flex items-center gap-1">
        {isPositive ? <TrendingUp className="w-4 h-4 text-teal-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
        <span className={`text-sm font-medium ${isPositive ? 'text-teal-500' : 'text-red-500'}`}>{change}%</span>
      </div>
    </div>
  );
};

export default MetricCard;

import React from 'react';

export default function PortfolioChart() {
  // Mock chart data - in a real app, this would come from an API
  const chartData = [
    { date: '2024-01-01', value: 10000 },
    { date: '2024-01-02', value: 10200 },
    { date: '2024-01-03', value: 9800 },
    { date: '2024-01-04', value: 10500 },
    { date: '2024-01-05', value: 11200 },
    { date: '2024-01-06', value: 10900 },
    { date: '2024-01-07', value: 11800 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  return (
    <div className="relative h-64">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Chart line */}
        <path
          d={chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 360 + 20;
            const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          className="drop-shadow-sm"
        />
        
        {/* Chart area fill */}
        <path
          d={chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * 360 + 20;
            const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ') + ' L 380 180 L 20 180 Z'}
          fill="url(#gradient)"
          opacity="0.1"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </linearGradient>
        </defs>
        
        {/* Data points */}
        {chartData.map((point, index) => {
          const x = (index / (chartData.length - 1)) * 360 + 20;
          const y = 180 - ((point.value - minValue) / (maxValue - minValue)) * 160;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all duration-200 cursor-pointer"
            />
          );
        })}
      </svg>
      
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
        <span>${(maxValue / 1000).toFixed(0)}k</span>
        <span>${(minValue / 1000).toFixed(0)}k</span>
      </div>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-5 right-5 flex justify-between text-xs text-gray-500">
        <span>7d ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
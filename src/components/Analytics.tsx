import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, BarChart3, Calendar, DollarSign } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCurrency } from '../contexts/CurrencyContext';
import PortfolioChart from './PortfolioChart';

export default function Analytics() {
  const { holdings, totalValue, totalGainLoss, totalGainLossPercent } = usePortfolio();
  const { formatCurrency } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Calculate portfolio allocation
  const portfolioAllocation = holdings.map(holding => ({
    symbol: holding.symbol,
    percentage: (holding.totalValue / totalValue) * 100,
    value: holding.totalValue,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  // Mock performance metrics
  const performanceMetrics = [
    { label: 'Sharpe Ratio', value: '1.45', description: 'Risk-adjusted return' },
    { label: 'Beta', value: '1.12', description: 'Market sensitivity' },
    { label: 'Alpha', value: '2.3%', description: 'Excess return' },
    { label: 'Volatility', value: '18.5%', description: 'Standard deviation' },
  ];

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Detailed portfolio analysis and performance metrics</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="90d">90 days</option>
            <option value="1y">1 year</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Return</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalGainLoss)}</p>
          <p className={`text-sm ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(totalGainLossPercent)}
          </p>
        </div>

        {performanceMetrics.map((metric) => (
          <div key={metric.label} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.label}</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Performance</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">+12.5%</span>
            </div>
          </div>
          <PortfolioChart />
        </div>

        {/* Asset Allocation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Asset Allocation</h3>
            <PieChart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {portfolioAllocation.map((allocation) => (
              <div key={allocation.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: allocation.color }}
                  />
                  <span className="font-medium text-gray-900">{allocation.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">{allocation.percentage.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(allocation.value)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Performance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Top Performers</h4>
            <div className="space-y-3">
              {holdings
                .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
                .slice(0, 3)
                .map((holding) => (
                  <div key={holding.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{holding.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-medium">{formatPercent(holding.gainLossPercent)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(holding.gainLoss)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Underperformers</h4>
            <div className="space-y-3">
              {holdings
                .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
                .slice(0, 3)
                .map((holding) => (
                  <div key={holding.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{holding.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-600 font-medium">{formatPercent(holding.gainLossPercent)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(holding.gainLoss)}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Risk Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Moderate Risk</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Your portfolio shows moderate risk with balanced diversification
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Growth Focused</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Portfolio is oriented towards growth with good return potential
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <PieChart className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Well Diversified</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Good diversification across different sectors and asset classes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
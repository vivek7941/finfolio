import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, Plus } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCurrency } from '../contexts/CurrencyContext';
import PortfolioChart from './PortfolioChart';
import StockSearch from './StockSearch';
import IndianStockSearch from './IndianStockSearch';
import IndianMarketOverview from './IndianMarketOverview';

export default function Dashboard() {
  const { totalValue, totalGainLoss, totalGainLossPercent, holdings, watchlist } = usePortfolio();
  const { formatCurrency } = useCurrency();


  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: formatCurrency(totalValue),
      change: formatCurrency(totalGainLoss),
      changePercent: formatPercent(totalGainLossPercent),
      isPositive: totalGainLoss >= 0,
      icon: DollarSign,
    },
    {
      title: 'Holdings',
      value: holdings.length.toString(),
      change: '+2 this week',
      changePercent: '',
      isPositive: true,
      icon: Target,
    },
    {
      title: 'Watchlist',
      value: watchlist.length.toString(),
      change: '+1 this week',
      changePercent: '',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'Alerts',
      value: '3',
      change: '2 active',
      changePercent: '',
      isPositive: false,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Track your investments and market performance</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex space-x-3">
            <StockSearch />
            <IndianStockSearch />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    {stat.changePercent && (
                      <span className={`text-sm ml-2 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.changePercent}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.isPositive ? 'bg-green-50' : 'bg-red-50'}`}>
                  <Icon className={`w-6 h-6 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Performance</h3>
            <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
              <option>1 year</option>
            </select>
          </div>
          <PortfolioChart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {[
              { action: 'Buy', symbol: 'AAPL', shares: 10, price: 175.43, time: '2 hours ago' },
              { action: 'Sell', symbol: 'GOOGLE', shares: 5, price: 138.21, time: '1 day ago' },
              { action: 'Buy', symbol: 'MSFT', shares: 8, price: 378.85, time: '3 days ago' },
              { action: 'Alert', symbol: 'TSLA', shares: 0, price: 248.50, time: '1 week ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action === 'Buy' ? 'bg-green-500' : 
                    activity.action === 'Sell' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action} {activity.symbol}
                      {activity.shares > 0 && ` (${activity.shares} shares)`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(activity.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indian Market Overview */}
      <IndianMarketOverview />

      {/* Top Holdings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Holdings</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View portfolio
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3">Symbol</th>
                <th className="pb-3">Shares</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Value</th>
                <th className="pb-3">Return</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {holdings.slice(0, 5).map((holding) => (
                <tr key={holding.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <td className="py-3">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-xs">{holding.name}</div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{holding.quantity}</td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">{formatCurrency(holding.currentPrice)}</td>
                  <td className="py-3 text-gray-900 dark:text-white font-medium">{formatCurrency(holding.totalValue)}</td>
                  <td className="py-3">
                    <div className={`flex items-center ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.gainLoss >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">{formatPercent(holding.gainLossPercent)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
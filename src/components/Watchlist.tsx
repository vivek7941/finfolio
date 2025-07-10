import React, { useState } from 'react';
import { TruckIcon, TrendingDown, Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist } = usePortfolio();
  const { formatCurrency } = useCurrency();
  const [sortBy, setSortBy] = useState('symbol');

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    switch (sortBy) {
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      case 'price':
        return b.price - a.price;
      case 'change':
        return b.changePercent - a.changePercent;
      default:
        return 0;
    }
  });

  const toggleAlert = (symbol: string) => {
    // Mock alert toggle functionality
    console.log(`Toggle alert for ${symbol}`);
  };

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Watchlist</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor your favorite stocks and set price alerts</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Watchlist Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Watched</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{watchlist.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Stocks in watchlist</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Alerts</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active alerts</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Avg Performance</h3>
          <div className="flex items-center text-green-600">
            <TruckIcon className="w-5 h-5 mr-2" />
            <p className="text-3xl font-bold">+2.4%</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Today's average</p>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Watched Stocks</h3>
            <div className="mt-4 sm:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="symbol">Sort by Symbol</option>
                <option value="price">Sort by Price</option>
                <option value="change">Sort by Change</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <th className="px-6 py-3">Symbol</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Change</th>
                <th className="px-6 py-3">Change %</th>
                <th className="px-6 py-3">Alert Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedWatchlist.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(stock.price)}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? (
                        <TruckIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">{formatCurrency(stock.change)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      stock.changePercent >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formatPercent(stock.changePercent)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">
                    {stock.alertPrice ? formatCurrency(stock.alertPrice) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      stock.alertPrice ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stock.alertPrice ? 'Alert Set' : 'No Alert'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => toggleAlert(stock.symbol)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                      >
                        {stock.alertPrice ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </button>
                      <button className="text-green-600 hover:text-green-800 p-1 rounded">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeFromWatchlist(stock.symbol)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {watchlist.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <TruckIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No stocks in watchlist</p>
              <p className="text-sm">Add stocks to monitor their performance</p>
            </div>
            <button className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add Stock</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Trash2, Plus, Edit2 } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Portfolio() {
  const { holdings, totalValue, totalGainLoss, totalGainLossPercent, removeHolding } = usePortfolio();
  const { formatCurrency } = useCurrency();
  const [sortBy, setSortBy] = useState('value');


  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.totalValue - a.totalValue;
      case 'gainLoss':
        return b.gainLoss - a.gainLoss;
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your stock holdings and track performance</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Value</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Gain/Loss</h3>
          <div className={`flex items-center ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-2" />
            )}
            <p className="text-3xl font-bold">{formatCurrency(totalGainLoss)}</p>
          </div>
          <p className={`text-sm mt-2 ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(totalGainLossPercent)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Holdings</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{holdings.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Active positions</p>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Holdings</h3>
            <div className="mt-4 sm:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="value">Sort by Value</option>
                <option value="gainLoss">Sort by Gain/Loss</option>
                <option value="symbol">Sort by Symbol</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                <th className="px-6 py-3">Symbol</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Avg Price</th>
                <th className="px-6 py-3">Current Price</th>
                <th className="px-6 py-3">Total Value</th>
                <th className="px-6 py-3">Gain/Loss</th>
                <th className="px-6 py-3">Return %</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedHoldings.map((holding) => (
                <tr key={holding.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{holding.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{holding.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{holding.quantity}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{formatCurrency(holding.averagePrice)}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white">{formatCurrency(holding.currentPrice)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(holding.totalValue)}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.gainLoss >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">{formatCurrency(holding.gainLoss)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      holding.gainLossPercent >= 0 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {formatPercent(holding.gainLossPercent)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeHolding(holding.id)}
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

        {holdings.length === 0 && (
          <div className="text-center py-12">
           <div className="text-gray-500 dark:text-gray-400 mb-4">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No holdings yet</p>
              <p className="text-sm">Add your first stock position to get started</p>
            </div>
            <button className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add Position</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function StockSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToWatchlist, addHolding, searchStocks } = usePortfolio();
  const { formatCurrency } = useCurrency();

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setStocks([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchStocks(searchQuery);
      setStocks(results);
    } catch (error) {
      console.error('Error searching stocks:', error);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const handleAddToPortfolio = (stock: any) => {
    // For demo purposes, add a random quantity
    const quantity = Math.floor(Math.random() * 10) + 1;
    addHolding(stock.symbol, quantity, stock.price);
    setIsOpen(false);
    setQuery('');
    setStocks([]);
  };

  const handleAddToWatchlist = (stock: any) => {
    addToWatchlist(stock.symbol, stock.name);
    setIsOpen(false);
    setQuery('');
    setStocks([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <Search className="w-4 h-4" />
        <span>Search Stocks</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Searching...</p>
              </div>
            ) : stocks.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {query ? 'No stocks found' : 'Start typing to search stocks'}
              </div>
            ) : (
              stocks.map((stock) => (
                <div key={stock.symbol} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(stock.price)}</div>
                      <div className={`text-sm flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {formatPercent(stock.changePercent)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => handleAddToPortfolio(stock)}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add to Portfolio</span>
                    </button>
                    <button
                      onClick={() => handleAddToWatchlist(stock)}
                      className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Watch</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setQuery('');
            setStocks([]);
          }}
        />
      )}
    </div>
  );
}
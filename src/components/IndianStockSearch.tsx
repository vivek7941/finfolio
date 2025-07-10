import React, { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, MapPin, Building } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { indianStockApi, type IndianStock } from '../services/indianStockApi';

export default function IndianStockSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [stocks, setStocks] = useState<IndianStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<'ALL' | 'NSE' | 'BSE'>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const { addToWatchlist, addHolding } = usePortfolio();
  const { formatCurrency } = useCurrency();

  const sectors = [
    'ALL', 'Information Technology', 'Banking', 'FMCG', 'Automobile', 
    'Pharmaceuticals', 'Oil & Gas', 'Metals', 'Telecommunications', 'Infrastructure'
  ];

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // Show popular stocks when no query
      setLoading(true);
      try {
        let results = await indianStockApi.getPopularIndianStocks();
        
        // Filter by exchange
        if (selectedExchange !== 'ALL') {
          results = results.filter(stock => stock.exchange === selectedExchange);
        }
        
        // Filter by sector
        if (selectedSector !== 'ALL') {
          results = results.filter(stock => stock.sector === selectedSector);
        }
        
        setStocks(results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching popular stocks:', error);
        setStocks([]);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const searchResults = await indianStockApi.searchIndianStocks(searchQuery);
      const stocksWithPrices = await Promise.all(
        searchResults.slice(0, 10).map(async (result) => {
          const quote = await indianStockApi.getIndianStockQuote(result.symbol);
          return quote;
        })
      );
      
      let filteredStocks = stocksWithPrices.filter((stock): stock is IndianStock => stock !== null);
      
      // Apply filters
      if (selectedExchange !== 'ALL') {
        filteredStocks = filteredStocks.filter(stock => stock.exchange === selectedExchange);
      }
      
      if (selectedSector !== 'ALL') {
        filteredStocks = filteredStocks.filter(stock => stock.sector === selectedSector);
      }
      
      setStocks(filteredStocks);
    } catch (error) {
      console.error('Error searching Indian stocks:', error);
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
  }, [query, selectedExchange, selectedSector]);

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const handleAddToPortfolio = (stock: IndianStock) => {
    const quantity = Math.floor(Math.random() * 10) + 1;
    addHolding(stock.symbol, quantity, stock.price);
    setIsOpen(false);
    setQuery('');
    setStocks([]);
  };

  const handleAddToWatchlist = (stock: IndianStock) => {
    addToWatchlist(stock.symbol, stock.name);
    setIsOpen(false);
    setQuery('');
    setStocks([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200"
      >
        <MapPin className="w-4 h-4" />
        <span>Indian Stocks</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[480px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Indian stocks..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  autoFocus
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={selectedExchange}
                  onChange={(e) => setSelectedExchange(e.target.value as 'ALL' | 'NSE' | 'BSE')}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="ALL">All Exchanges</option>
                  <option value="NSE">NSE</option>
                  <option value="BSE">BSE</option>
                </select>
                
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>
                      {sector === 'ALL' ? 'All Sectors' : sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-2">Searching Indian stocks...</p>
              </div>
            ) : stocks.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {query ? 'No Indian stocks found' : 'Start typing to search Indian stocks'}
              </div>
            ) : (
              stocks.map((stock) => (
                <div key={stock.symbol} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              stock.exchange === 'NSE' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                              {stock.exchange}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">{stock.sector}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(stock.price)}</div>
                      <div className={`text-sm flex items-center justify-end ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                      className="flex items-center space-x-1 bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors duration-200"
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
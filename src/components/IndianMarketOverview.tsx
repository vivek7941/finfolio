import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';
import { indianStockApi } from '../services/indianStockApi';
import { useCurrency } from '../contexts/CurrencyContext';

export default function IndianMarketOverview() {
  const [indices, setIndices] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      const [indicesData, sectorsData] = await Promise.all([
        indianStockApi.getIndianMarketIndices(),
        indianStockApi.getSectorPerformance(),
      ]);
      
      setIndices(indicesData);
      setSectors(sectorsData);
    } catch (error) {
      console.error('Error loading market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Activity className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Indian Market Indices</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indices.map((index) => (
            <div key={index.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{index.name}</h4>
                {index.change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-sm ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(index.change)} ({formatPercent(index.changePercent)})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sector Performance</h3>
        </div>
        
        <div className="space-y-3">
          {sectors.map((sector) => (
            <div key={sector.sector} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  sector.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{sector.sector}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{sector.stocks} stocks</div>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                sector.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {sector.change >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">{formatPercent(sector.change)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
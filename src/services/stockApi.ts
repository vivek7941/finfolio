import axios from 'axios';
import { indianStockApi, type IndianStock } from './indianStockApi';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

const isApiConfigured = !!ALPHA_VANTAGE_API_KEY;

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

class StockApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    const cacheKey = `quote_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    // If API is not configured, return mock data
    if (!isApiConfigured) {
      const mockQuote = this.getMockQuote(symbol);
      this.cache.set(cacheKey, { data: mockQuote, timestamp: Date.now() });
      return mockQuote;
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const quote = response.data['Global Quote'];
      
      if (!quote || Object.keys(quote).length === 0) {
        return null;
      }

      const stockQuote: StockQuote = {
        symbol: quote['01. symbol'],
        name: quote['01. symbol'], // Alpha Vantage doesn't provide company name in quote
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
      };

      this.cache.set(cacheKey, { data: stockQuote, timestamp: Date.now() });
      return stockQuote;
    } catch (error) {
      console.error('Error fetching stock quote:', error);
      // Fallback to mock data on error
      const mockQuote = this.getMockQuote(symbol);
      this.cache.set(cacheKey, { data: mockQuote, timestamp: Date.now() });
      return mockQuote;
    }
  }

  async searchSymbols(query: string): Promise<StockSearchResult[]> {
    const cacheKey = `search_${query}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    // If API is not configured, return mock search results
    if (!isApiConfigured) {
      const mockResults = this.getMockSearchResults(query);
      this.cache.set(cacheKey, { data: mockResults, timestamp: Date.now() });
      return mockResults;
    }

    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });

      const matches = response.data.bestMatches || [];
      const results: StockSearchResult[] = matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: match['9. matchScore'],
      }));

      this.cache.set(cacheKey, { data: results, timestamp: Date.now() });
      return results;
    } catch (error) {
      console.error('Error searching symbols:', error);
      // Fallback to mock data on error
      const mockResults = this.getMockSearchResults(query);
      this.cache.set(cacheKey, { data: mockResults, timestamp: Date.now() });
      return mockResults;
    }
  }

  async searchAllStocks(query: string): Promise<(StockSearchResult | IndianStock)[]> {
    // Search both international and Indian stocks
    const [intlResults, indianResults] = await Promise.all([
      this.searchSymbols(query),
      indianStockApi.searchIndianStocks(query)
    ]);

    // Convert Indian stocks to search result format and combine
    const indianAsSearchResults = await Promise.all(
      indianResults.map(async (stock) => {
        const quote = await indianStockApi.getIndianStockQuote(stock.symbol);
        return quote;
      })
    );

    return [...intlResults, ...indianAsSearchResults.filter(Boolean)];
  }
  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    const results = await Promise.all(promises);
    return results.filter((quote): quote is StockQuote => quote !== null);
  }

  // Fallback mock data for development/demo
  getMockQuote(symbol: string): StockQuote {
    const mockData: Record<string, StockQuote> = {
      AAPL: {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 175.43,
        change: 2.34,
        changePercent: 1.35,
        volume: 45234567,
        marketCap: 2800000000000,
      },
      GOOGLE: {
        symbol: 'GOOGLE',
        name: 'Google Inc.',
        price: 138.21,
        change: -1.45,
        changePercent: -1.04,
        volume: 23456789,
        marketCap: 1750000000000,
      },
      MSFT: {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 378.85,
        change: 5.67,
        changePercent: 1.52,
        volume: 34567890,
        marketCap: 2820000000000,
      },
      AMZN: {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 151.94,
        change: -2.11,
        changePercent: -1.37,
        volume: 56789012,
        marketCap: 1580000000000,
      },
      TSLA: {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.50,
        change: 12.30,
        changePercent: 5.21,
        volume: 78901234,
        marketCap: 790000000000,
      },
      META: {
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        price: 331.16,
        change: 8.92,
        changePercent: 2.77,
        volume: 12345678,
        marketCap: 840000000000,
      },
      NVDA: {
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        price: 451.22,
        change: 15.67,
        changePercent: 3.59,
        volume: 67890123,
        marketCap: 1110000000000,
      },
      NFLX: {
        symbol: 'NFLX',
        name: 'Netflix Inc.',
        price: 445.73,
        change: -7.89,
        changePercent: -1.74,
        volume: 9876543,
        marketCap: 197000000000,
      },
      // Add some Indian stocks to mock data
      RELIANCE: {
        symbol: 'RELIANCE',
        name: 'Reliance Industries Limited',
        price: 2456.75,
        change: 23.45,
        changePercent: 0.96,
        volume: 2345678,
        marketCap: 16600000000000,
      },
      TCS: {
        symbol: 'TCS',
        name: 'Tata Consultancy Services Limited',
        price: 3678.90,
        change: -45.20,
        changePercent: -1.21,
        volume: 1234567,
        marketCap: 13400000000000,
      },
    };

    return mockData[symbol] || {
      symbol,
      name: `${symbol} Inc.`,
      price: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 10000000),
    };
  }

  getMockSearchResults(query: string): StockSearchResult[] {
    const allStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGLE', name: 'Google Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'RELIANCE', name: 'Reliance Industries Limited' },
      { symbol: 'TCS', name: 'Tata Consultancy Services Limited' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Limited' },
      { symbol: 'INFY', name: 'Infosys Limited' },
    ];

    const filtered = allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      type: 'Equity',
      region: 'United States',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'UTC-04',
      currency: 'USD',
      matchScore: '1.0000',
    }));
  }
}

export const stockApi = new StockApiService();
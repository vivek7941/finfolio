import axios from 'axios';

// Indian stock exchanges and popular stocks
export interface IndianStock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface IndianStockSearchResult {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  isin?: string;
}

class IndianStockApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 300000; // 5 minutes cache for Indian stocks

  // Popular Indian stocks data
  private readonly popularIndianStocks: IndianStock[] = [
    {
      symbol: 'RELIANCE',
      name: 'Reliance Industries Limited',
      exchange: 'NSE',
      sector: 'Oil & Gas',
      price: 2456.75,
      change: 23.45,
      changePercent: 0.96,
      volume: 2345678,
      marketCap: 16600000000000,
    },
    {
      symbol: 'TCS',
      name: 'Tata Consultancy Services Limited',
      exchange: 'NSE',
      sector: 'Information Technology',
      price: 3678.90,
      change: -45.20,
      changePercent: -1.21,
      volume: 1234567,
      marketCap: 13400000000000,
    },
    {
      symbol: 'HDFCBANK',
      name: 'HDFC Bank Limited',
      exchange: 'NSE',
      sector: 'Banking',
      price: 1567.30,
      change: 12.80,
      changePercent: 0.82,
      volume: 3456789,
      marketCap: 11900000000000,
    },
    {
      symbol: 'INFY',
      name: 'Infosys Limited',
      exchange: 'NSE',
      sector: 'Information Technology',
      price: 1789.45,
      change: 34.60,
      changePercent: 1.97,
      volume: 2987654,
      marketCap: 7400000000000,
    },
    {
      symbol: 'HINDUNILVR',
      name: 'Hindustan Unilever Limited',
      exchange: 'NSE',
      sector: 'FMCG',
      price: 2345.60,
      change: -18.90,
      changePercent: -0.80,
      volume: 876543,
      marketCap: 5500000000000,
    },
    {
      symbol: 'ICICIBANK',
      name: 'ICICI Bank Limited',
      exchange: 'NSE',
      sector: 'Banking',
      price: 1123.75,
      change: 15.25,
      changePercent: 1.38,
      volume: 4567890,
      marketCap: 7800000000000,
    },
    {
      symbol: 'BHARTIARTL',
      name: 'Bharti Airtel Limited',
      exchange: 'NSE',
      sector: 'Telecommunications',
      price: 1456.20,
      change: 28.40,
      changePercent: 1.99,
      volume: 1876543,
      marketCap: 8200000000000,
    },
    {
      symbol: 'SBIN',
      name: 'State Bank of India',
      exchange: 'NSE',
      sector: 'Banking',
      price: 567.80,
      change: -8.45,
      changePercent: -1.47,
      volume: 5432109,
      marketCap: 5100000000000,
    },
    {
      symbol: 'WIPRO',
      name: 'Wipro Limited',
      exchange: 'NSE',
      sector: 'Information Technology',
      price: 456.90,
      change: 12.30,
      changePercent: 2.77,
      volume: 3210987,
      marketCap: 2500000000000,
    },
    {
      symbol: 'MARUTI',
      name: 'Maruti Suzuki India Limited',
      exchange: 'NSE',
      sector: 'Automobile',
      price: 10234.50,
      change: 156.75,
      changePercent: 1.56,
      volume: 654321,
      marketCap: 3100000000000,
    },
    {
      symbol: 'ADANIPORTS',
      name: 'Adani Ports and Special Economic Zone Limited',
      exchange: 'NSE',
      sector: 'Infrastructure',
      price: 789.60,
      change: 23.45,
      changePercent: 3.06,
      volume: 2109876,
      marketCap: 1700000000000,
    },
    {
      symbol: 'ASIANPAINT',
      name: 'Asian Paints Limited',
      exchange: 'NSE',
      sector: 'Paints',
      price: 3456.80,
      change: -67.20,
      changePercent: -1.91,
      volume: 432109,
      marketCap: 3300000000000,
    },
    {
      symbol: 'BAJFINANCE',
      name: 'Bajaj Finance Limited',
      exchange: 'NSE',
      sector: 'Financial Services',
      price: 6789.45,
      change: 123.60,
      changePercent: 1.85,
      volume: 765432,
      marketCap: 4200000000000,
    },
    {
      symbol: 'HCLTECH',
      name: 'HCL Technologies Limited',
      exchange: 'NSE',
      sector: 'Information Technology',
      price: 1234.70,
      change: 45.80,
      changePercent: 3.85,
      volume: 1543210,
      marketCap: 3400000000000,
    },
    {
      symbol: 'KOTAKBANK',
      name: 'Kotak Mahindra Bank Limited',
      exchange: 'NSE',
      sector: 'Banking',
      price: 1876.90,
      change: -34.50,
      changePercent: -1.81,
      volume: 987654,
      marketCap: 3700000000000,
    },
  ];

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getIndianStockQuote(symbol: string): Promise<IndianStock | null> {
    const cacheKey = `indian_quote_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    // For demo purposes, return mock data
    // In production, you would integrate with NSE/BSE APIs or services like Alpha Vantage, Yahoo Finance
    const stock = this.getMockIndianStock(symbol);
    this.cache.set(cacheKey, { data: stock, timestamp: Date.now() });
    return stock;
  }

  async searchIndianStocks(query: string): Promise<IndianStockSearchResult[]> {
    const cacheKey = `indian_search_${query}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    const results = this.getMockIndianSearchResults(query);
    this.cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  }

  async getPopularIndianStocks(): Promise<IndianStock[]> {
    // Add some random price movements to make it look live
    return this.popularIndianStocks.map(stock => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 20,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 5,
    }));
  }

  async getIndianStocksByExchange(exchange: 'NSE' | 'BSE'): Promise<IndianStock[]> {
    const allStocks = await this.getPopularIndianStocks();
    return allStocks.filter(stock => stock.exchange === exchange);
  }

  async getIndianStocksBySector(sector: string): Promise<IndianStock[]> {
    const allStocks = await this.getPopularIndianStocks();
    return allStocks.filter(stock => 
      stock.sector.toLowerCase().includes(sector.toLowerCase())
    );
  }

  private getMockIndianStock(symbol: string): IndianStock {
    const existing = this.popularIndianStocks.find(stock => 
      stock.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (existing) {
      return {
        ...existing,
        price: existing.price + (Math.random() - 0.5) * 20,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 5,
      };
    }

    // Generate mock data for unknown symbols
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol} Limited`,
      exchange: Math.random() > 0.5 ? 'NSE' : 'BSE',
      sector: 'Others',
      price: Math.random() * 5000 + 100,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 10000000),
    };
  }

  private getMockIndianSearchResults(query: string): IndianStockSearchResult[] {
    const filtered = this.popularIndianStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase()) ||
      stock.sector.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      sector: stock.sector,
      isin: `INE${Math.random().toString(36).substr(2, 6).toUpperCase()}01`,
    }));
  }

  // Get market indices
  async getIndianMarketIndices() {
    return [
      {
        name: 'NIFTY 50',
        value: 19674.25,
        change: 123.45,
        changePercent: 0.63,
      },
      {
        name: 'SENSEX',
        value: 65953.48,
        change: 287.90,
        changePercent: 0.44,
      },
      {
        name: 'NIFTY BANK',
        value: 45234.60,
        change: -234.50,
        changePercent: -0.52,
      },
      {
        name: 'NIFTY IT',
        value: 31456.78,
        change: 456.30,
        changePercent: 1.47,
      },
    ];
  }

  // Get sector performance
  async getSectorPerformance() {
    return [
      { sector: 'Information Technology', change: 2.34, stocks: 45 },
      { sector: 'Banking', change: -0.87, stocks: 32 },
      { sector: 'FMCG', change: 1.23, stocks: 28 },
      { sector: 'Automobile', change: 0.56, stocks: 24 },
      { sector: 'Pharmaceuticals', change: -1.45, stocks: 38 },
      { sector: 'Oil & Gas', change: 1.78, stocks: 18 },
      { sector: 'Metals', change: 3.21, stocks: 22 },
      { sector: 'Telecommunications', change: 0.92, stocks: 12 },
    ];
  }
}

export const indianStockApi = new IndianStockApiService();
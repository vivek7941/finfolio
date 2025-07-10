import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { stockApi } from '../services/stockApi';
import { useAuth } from './AuthContext';
import type { Portfolio, Holding, Transaction, WatchlistItem, PriceAlert } from '../lib/supabase';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface HoldingWithData extends Holding {
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface WatchlistItemWithData extends WatchlistItem {
  price: number;
  change: number;
  changePercent: number;
  alertPrice?: number;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  holdings: HoldingWithData[];
  watchlist: WatchlistItemWithData[];
  transactions: Transaction[];
  priceAlerts: PriceAlert[];
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  loading: boolean;
  setCurrentPortfolio: (portfolio: Portfolio) => void;
  addHolding: (symbol: string, quantity: number, price: number) => void;
  removeHolding: (id: string) => void;
  addToWatchlist: (symbol: string, companyName: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addTransaction: (symbol: string, companyName: string, type: 'buy' | 'sell', quantity: number, price: number) => void;
  searchStocks: (query: string) => Promise<StockData[]>;
  refreshData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [holdings, setHoldings] = useState<HoldingWithData[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItemWithData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(false);

  // Demo data for when Supabase is not configured
  const demoHoldings: HoldingWithData[] = [
    {
      id: '1',
      portfolio_id: 'demo-portfolio',
      symbol: 'AAPL',
      company_name: 'Apple Inc.',
      quantity: 10,
      average_price: 150.00,
      currentPrice: 175.43,
      totalValue: 1754.30,
      totalCost: 1500.00,
      gainLoss: 254.30,
      gainLossPercent: 16.95,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      portfolio_id: 'demo-portfolio',
      symbol: 'GOOGLE',
      company_name: 'Google Inc.',
      quantity: 5,
      average_price: 140.00,
      currentPrice: 138.21,
      totalValue: 691.05,
      totalCost: 700.00,
      gainLoss: -8.95,
      gainLossPercent: -1.28,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      portfolio_id: 'demo-portfolio',
      symbol: 'MSFT',
      company_name: 'Microsoft Corporation',
      quantity: 8,
      average_price: 350.00,
      currentPrice: 378.85,
      totalValue: 3030.80,
      totalCost: 2800.00,
      gainLoss: 230.80,
      gainLossPercent: 8.24,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  const demoWatchlist: WatchlistItemWithData[] = [
    {
      id: '1',
      user_id: 'demo-user',
      symbol: 'TSLA',
      company_name: 'Tesla Inc.',
      price: 248.50,
      change: 12.30,
      changePercent: 5.21,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: 'demo-user',
      symbol: 'META',
      company_name: 'Meta Platforms Inc.',
      price: 331.16,
      change: 8.92,
      changePercent: 2.77,
      created_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Load demo data
      setHoldings(demoHoldings);
      setWatchlist(demoWatchlist);
      setCurrentPortfolio({
        id: 'demo-portfolio',
        user_id: 'demo-user',
        name: 'Demo Portfolio',
        description: 'This is a demo portfolio',
        is_default: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return;
    }

    if (isAuthenticated && user && isSupabaseConfigured) {
      loadUserData();
    }
  }, [isAuthenticated, user, isSupabaseConfigured]);

  useEffect(() => {
    if (portfolios.length > 0 && !currentPortfolio) {
      const defaultPortfolio = portfolios.find(p => p.is_default) || portfolios[0];
      setCurrentPortfolio(defaultPortfolio);
    }
  }, [portfolios, currentPortfolio]);

  const loadUserData = async () => {
    if (!user) return;
    
    if (!isSupabaseConfigured) return;

    setLoading(true);
    try {
      await Promise.all([
        loadPortfolios(),
        loadWatchlist(),
        loadPriceAlerts(),
      ]);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolios = async () => {
    if (!user) return;

    if (!isSupabaseConfigured) return;

    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    setPortfolios(data || []);
  };

  const loadHoldings = async (portfolioId: string) => {
    if (!isSupabaseConfigured) return;

    const { data, error } = await supabase
      .from('holdings')
      .select('*')
      .eq('portfolio_id', portfolioId);

    if (error) throw error;

    // Get current prices for all holdings
    const symbols = data?.map(h => h.symbol) || [];
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await stockApi.getQuote(symbol);
        return quote || stockApi.getMockQuote(symbol);
      })
    );

    const holdingsWithData: HoldingWithData[] = (data || []).map((holding, index) => {
      const quote = quotes[index];
      const currentPrice = quote.price;
      const totalValue = holding.quantity * currentPrice;
      const totalCost = holding.quantity * holding.average_price;
      const gainLoss = totalValue - totalCost;
      const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

      return {
        ...holding,
        currentPrice,
        totalValue,
        totalCost,
        gainLoss,
        gainLossPercent,
      };
    });

    setHoldings(holdingsWithData);
  };

  const loadTransactions = async (portfolioId: string) => {
    if (!isSupabaseConfigured) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    setTransactions(data || []);
  };

  const loadWatchlist = async () => {
    if (!user) return;

    if (!isSupabaseConfigured) return;

    const { data, error } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    // Get current prices for watchlist items
    const symbols = data?.map(w => w.symbol) || [];
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await stockApi.getQuote(symbol);
        return quote || stockApi.getMockQuote(symbol);
      })
    );

    const watchlistWithData: WatchlistItemWithData[] = (data || []).map((item, index) => {
      const quote = quotes[index];
      return {
        ...item,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
      };
    });

    setWatchlist(watchlistWithData);
  };

  const loadPriceAlerts = async () => {
    if (!user) return;

    if (!isSupabaseConfigured) return;

    const { data, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) throw error;
    setPriceAlerts(data || []);
  };

  // Load holdings and transactions when current portfolio changes
  useEffect(() => {
    if (currentPortfolio && isSupabaseConfigured) {
      loadHoldings(currentPortfolio.id);
      loadTransactions(currentPortfolio.id);
    }
  }, [currentPortfolio]);

  const totalValue = holdings.reduce((sum, holding) => sum + holding.totalValue, 0);
  const totalCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  const addHolding = async (symbol: string, quantity: number, price: number) => {
    if (!currentPortfolio) return;

    if (!isSupabaseConfigured) {
      // Demo mode - just add to local state
      const quote = stockApi.getMockQuote(symbol);
      const newHolding: HoldingWithData = {
        id: Date.now().toString(),
        portfolio_id: currentPortfolio.id,
        symbol,
        company_name: quote.name,
        quantity,
        average_price: price,
        currentPrice: quote.price,
        totalValue: quote.price * quantity,
        totalCost: price * quantity,
        gainLoss: (quote.price - price) * quantity,
        gainLossPercent: ((quote.price - price) / price) * 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setHoldings(prev => [...prev, newHolding]);
      return;
    }

    try {
      // Get company name from stock API
      const quote = await stockApi.getQuote(symbol);
      const companyName = quote?.name || `${symbol} Inc.`;

      // Check if holding already exists
      const { data: existingHolding } = await supabase
        .from('holdings')
        .select('*')
        .eq('portfolio_id', currentPortfolio.id)
        .eq('symbol', symbol)
        .single();

      if (existingHolding) {
        // Update existing holding with new average price
        const newQuantity = existingHolding.quantity + quantity;
        const newAveragePrice = ((existingHolding.quantity * existingHolding.average_price) + (quantity * price)) / newQuantity;

        const { error } = await supabase
          .from('holdings')
          .update({
            quantity: newQuantity,
            average_price: newAveragePrice,
          })
          .eq('id', existingHolding.id);

        if (error) throw error;
      } else {
        // Create new holding
        const { error } = await supabase
          .from('holdings')
          .insert({
            portfolio_id: currentPortfolio.id,
            symbol,
            company_name: companyName,
            quantity,
            average_price: price,
          });

        if (error) throw error;
      }

      // Add transaction record
      await addTransaction(symbol, companyName, 'buy', quantity, price);
      
      // Reload holdings
      await loadHoldings(currentPortfolio.id);
    } catch (error) {
      console.error('Error adding holding:', error);
    }
  };

  const removeHolding = async (id: string) => {
    if (!isSupabaseConfigured) {
      setHoldings(prev => prev.filter(holding => holding.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from('holdings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (currentPortfolio) {
        await loadHoldings(currentPortfolio.id);
      }
    } catch (error) {
      console.error('Error removing holding:', error);
    }
  };

  const addToWatchlist = async (symbol: string, companyName: string) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      const quote = stockApi.getMockQuote(symbol);
      const newItem: WatchlistItemWithData = {
        id: Date.now().toString(),
        user_id: user.id,
        symbol,
        company_name: companyName,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        created_at: new Date().toISOString(),
      };
      setWatchlist(prev => [...prev.filter(item => item.symbol !== symbol), newItem]);
      return;
    }

    try {
      const { error } = await supabase
        .from('watchlists')
        .insert({
          user_id: user.id,
          symbol,
          company_name: companyName,
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw error;
      }
      
      await loadWatchlist();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    if (!user) return;

    if (!isSupabaseConfigured) {
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      return;
    }

    try {
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol);

      if (error) throw error;
      
      await loadWatchlist();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const addTransaction = async (symbol: string, companyName: string, type: 'buy' | 'sell', quantity: number, price: number) => {
    if (!currentPortfolio) return;

    if (!isSupabaseConfigured) {
      // Demo mode - just add to local state
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        portfolio_id: currentPortfolio.id,
        symbol,
        company_name: companyName,
        transaction_type: type,
        quantity,
        price,
        total_amount: quantity * price,
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
      return;
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          portfolio_id: currentPortfolio.id,
          symbol,
          company_name: companyName,
          transaction_type: type,
          quantity,
          price,
          total_amount: quantity * price,
        });

      if (error) throw error;
      
      await loadTransactions(currentPortfolio.id);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const searchStocks = async (query: string): Promise<StockData[]> => {
    if (!query.trim()) {
      // Return some popular stocks as default
      const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
      const quotes = await Promise.all(
        popularSymbols.map(async (symbol) => {
          const quote = await stockApi.getQuote(symbol);
          return quote || stockApi.getMockQuote(symbol);
        })
      );
      return quotes.map(quote => ({
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: quote.marketCap || 0,
      }));
    }

    try {
      const searchResults = await stockApi.searchSymbols(query);
      const quotes = await Promise.all(
        searchResults.slice(0, 10).map(async (result) => {
          const quote = await stockApi.getQuote(result.symbol);
          return quote || stockApi.getMockQuote(result.symbol);
        })
      );

      return quotes.map(quote => ({
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: quote.marketCap || 0,
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  };

  const refreshData = () => {
    if (!isSupabaseConfigured) {
      // In demo mode, just refresh with mock data
      setHoldings([...demoHoldings]);
      setWatchlist([...demoWatchlist]);
      return;
    }

    if (currentPortfolio && isSupabaseConfigured) {
      loadHoldings(currentPortfolio.id);
      loadTransactions(currentPortfolio.id);
    }
    loadWatchlist();
    loadPriceAlerts();
  };

  return (
    <PortfolioContext.Provider value={{
      portfolios,
      currentPortfolio,
      holdings,
      watchlist,
      transactions,
      priceAlerts,
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
      loading,
      setCurrentPortfolio,
      addHolding,
      removeHolding,
      addToWatchlist,
      removeFromWatchlist,
      addTransaction,
      searchStocks,
      refreshData,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
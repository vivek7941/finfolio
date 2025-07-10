import React, { createContext, useContext, useState, useEffect } from 'react';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    const savedCurrency = localStorage.getItem('finfolio_currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    localStorage.setItem('finfolio_currency', newCurrency);
  };

  const formatCurrency = (amount: number) => {
    const currencyMap = {
      INR: { symbol: '₹', locale: 'en-IN' },
      USD: { symbol: '$', locale: 'en-US' },
      EUR: { symbol: '€', locale: 'en-EU' },
      GBP: { symbol: '£', locale: 'en-GB' },
      JPY: { symbol: '¥', locale: 'ja-JP' },
    };

    const config = currencyMap[currency as keyof typeof currencyMap] || currencyMap.INR;
    
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
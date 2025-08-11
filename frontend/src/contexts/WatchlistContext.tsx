import React, { createContext, useContext, useState } from 'react';

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  averagePrice: number;
  purchaseDate: string;
  notes?: string;
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  symbols: string[];
  createdAt: string;
  updatedAt: string;
  type?: 'watchlist' | 'portfolio';
  portfolioPositions?: PortfolioPosition[];
}

interface WatchlistContextType {
  watchlists: Watchlist[];
  addWatchlist: (watchlist: Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addPortfolio: (name: string, positions: PortfolioPosition[]) => void;
  updateWatchlist: (id: string, updates: Partial<Watchlist>) => void;
  deleteWatchlist: (id: string) => void;
  getWatchlist: (id: string) => Watchlist | undefined;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: React.ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    // Sample watchlists
    {
      id: 'watchlist_1',
      name: 'Tech Giants',
      description: 'Major technology companies',
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META'],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'watchlist_2',
      name: 'S&P 500 Top 20',
      description: 'Top 20 largest companies in S&P 500',
      symbols: ['AAPL', 'MSFT', 'AMZN', 'NVDA', 'GOOGL', 'TSLA', 'META', 'BRK.B', 'UNH', 'XOM', 'JNJ', 'JPM', 'V', 'PG', 'MA', 'LLY', 'HD', 'CVX', 'ABBV', 'PEP'],
      createdAt: '2025-01-10T14:30:00Z',
      updatedAt: '2025-01-20T09:15:00Z'
    },
    {
      id: 'watchlist_3',
      name: 'Crypto Stocks',
      description: 'Companies exposed to cryptocurrency',
      symbols: ['COIN', 'MSTR', 'SQ', 'PYPL', 'RIOT', 'MARA', 'HUT'],
      createdAt: '2025-01-12T16:45:00Z',
      updatedAt: '2025-01-18T11:20:00Z'
    },
    {
      id: 'watchlist_4',
      name: 'Banking Sector',
      description: 'Major US banks and financial institutions',
      symbols: ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'USB', 'PNC', 'BLK', 'AXP'],
      createdAt: '2025-01-08T08:30:00Z',
      updatedAt: '2025-01-08T08:30:00Z'
    },
    {
      id: 'watchlist_5',
      name: 'Growth Stocks',
      description: 'High-growth potential stocks',
      symbols: ['TSLA', 'NVDA', 'AMD', 'CRM', 'SNOW', 'PLTR', 'ROKU', 'SQ', 'SHOP', 'ZM'],
      createdAt: '2025-01-05T13:15:00Z',
      updatedAt: '2025-01-19T15:45:00Z'
    }
  ]);

  const addWatchlist = (watchlist: Omit<Watchlist, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWatchlist: Watchlist = {
      ...watchlist,
      id: `watchlist_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWatchlists(prev => [...prev, newWatchlist]);
  };

  const addPortfolio = (name: string, positions: PortfolioPosition[]) => {
    const symbols = positions.map(pos => pos.symbol);
    const description = `Portfolio with ${positions.length} positions: ${symbols.join(', ')}`;
    
    const newPortfolio: Watchlist = {
      id: `portfolio_${Date.now()}`,
      name,
      description,
      symbols,
      type: 'portfolio',
      portfolioPositions: positions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setWatchlists(prev => [...prev, newPortfolio]);
  };

  const updateWatchlist = (id: string, updates: Partial<Watchlist>) => {
    setWatchlists(prev =>
      prev.map(watchlist =>
        watchlist.id === id
          ? { ...watchlist, ...updates, updatedAt: new Date().toISOString() }
          : watchlist
      )
    );
  };

  const deleteWatchlist = (id: string) => {
    setWatchlists(prev => prev.filter(watchlist => watchlist.id !== id));
  };

  const getWatchlist = (id: string) => {
    return watchlists.find(watchlist => watchlist.id === id);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        addWatchlist,
        addPortfolio,
        updateWatchlist,
        deleteWatchlist,
        getWatchlist
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
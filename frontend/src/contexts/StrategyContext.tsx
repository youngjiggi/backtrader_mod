import React, { createContext, useContext, useState } from 'react';

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  symbol: string;
  timeframe: string;
  atrPeriod: number;
  atrMultiplier: number;
  cvdThreshold: number;
  profileBins: number[];
  relativeVolume: boolean;
  atrTrim: boolean;
  phaseId: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // Performance metrics
  performance?: {
    totalReturn: number;
    winRate: number;
    sharpe: number;
    maxDrawdown: number;
    totalTrades: number;
    avgHoldTime: string;
    profitFactor: number;
    trend: 'up' | 'down' | 'stable';
    healthScore: number; // 0-100 scale
    lastBacktestDate?: string;
  };
  status?: 'active' | 'draft' | 'archived' | 'paused';
  isFavorite?: boolean;
}

interface StrategyContextType {
  strategies: StrategyTemplate[];
  addStrategy: (strategy: Omit<StrategyTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateStrategy: (id: string, updates: Partial<StrategyTemplate>) => void;
  deleteStrategy: (id: string) => void;
  getStrategy: (id: string) => StrategyTemplate | undefined;
}

const StrategyContext = createContext<StrategyContextType | undefined>(undefined);

export const useStrategy = () => {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error('useStrategy must be used within a StrategyProvider');
  }
  return context;
};

interface StrategyProviderProps {
  children: React.ReactNode;
}

export const StrategyProvider: React.FC<StrategyProviderProps> = ({ children }) => {
  const [strategies, setStrategies] = useState<StrategyTemplate[]>([
    // Sample strategies
    {
      id: 'strategy_1',
      name: 'ATR Breakout Classic',
      description: 'Standard ATR breakout strategy with 2x multiplier',
      symbol: '',
      timeframe: '1d',
      atrPeriod: 14,
      atrMultiplier: 2,
      cvdThreshold: 1000,
      profileBins: [50],
      relativeVolume: false,
      atrTrim: false,
      phaseId: false,
      tags: ['breakout', 'atr', 'classic', 'momentum'],
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z',
      performance: {
        totalReturn: 24.7,
        winRate: 68.4,
        sharpe: 1.84,
        maxDrawdown: -8.2,
        totalTrades: 127,
        avgHoldTime: '3.2d',
        profitFactor: 1.45,
        trend: 'up',
        healthScore: 85,
        lastBacktestDate: '2025-01-20T10:00:00Z'
      },
      status: 'active',
      isFavorite: true
    },
    {
      id: 'strategy_2',
      name: 'Conservative CVD',
      description: 'Low-risk strategy with volume confirmation',
      symbol: '',
      timeframe: '4h',
      atrPeriod: 20,
      atrMultiplier: 1.5,
      cvdThreshold: 500,
      profileBins: [50, 150],
      relativeVolume: true,
      atrTrim: true,
      phaseId: false,
      tags: ['conservative', 'volume', 'cvd', 'low-risk'],
      createdAt: '2025-01-18T14:30:00Z',
      updatedAt: '2025-01-18T14:30:00Z',
      performance: {
        totalReturn: 16.2,
        winRate: 74.8,
        sharpe: 2.12,
        maxDrawdown: -5.1,
        totalTrades: 89,
        avgHoldTime: '2.8d',
        profitFactor: 1.68,
        trend: 'stable',
        healthScore: 92,
        lastBacktestDate: '2025-01-18T14:30:00Z'
      },
      status: 'active',
      isFavorite: false
    },
    {
      id: 'strategy_3',
      name: 'Phase Reversal Pro',
      description: 'Advanced strategy with phase identification',
      symbol: '',
      timeframe: '1h',
      atrPeriod: 10,
      atrMultiplier: 2.5,
      cvdThreshold: 1500,
      profileBins: [100, 200],
      relativeVolume: true,
      atrTrim: true,
      phaseId: true,
      tags: ['advanced', 'reversal', 'phase-id', 'scalping'],
      createdAt: '2025-01-15T09:15:00Z',
      updatedAt: '2025-01-22T16:45:00Z',
      performance: {
        totalReturn: 8.4,
        winRate: 52.6,
        sharpe: 0.96,
        maxDrawdown: -12.3,
        totalTrades: 234,
        avgHoldTime: '1.2d',
        profitFactor: 1.18,
        trend: 'down',
        healthScore: 43,
        lastBacktestDate: '2025-01-22T16:45:00Z'
      },
      status: 'paused',
      isFavorite: false
    }
  ]);

  const addStrategy = (strategy: Omit<StrategyTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStrategy: StrategyTemplate = {
      ...strategy,
      id: `strategy_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setStrategies(prev => [...prev, newStrategy]);
  };

  const updateStrategy = (id: string, updates: Partial<StrategyTemplate>) => {
    setStrategies(prev =>
      prev.map(strategy =>
        strategy.id === id
          ? { ...strategy, ...updates, updatedAt: new Date().toISOString() }
          : strategy
      )
    );
  };

  const deleteStrategy = (id: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== id));
  };

  const getStrategy = (id: string) => {
    return strategies.find(strategy => strategy.id === id);
  };

  return (
    <StrategyContext.Provider
      value={{
        strategies,
        addStrategy,
        updateStrategy,
        deleteStrategy,
        getStrategy
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};
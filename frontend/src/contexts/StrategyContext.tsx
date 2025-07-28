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
  createdAt: string;
  updatedAt: string;
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
      createdAt: '2025-01-20T10:00:00Z',
      updatedAt: '2025-01-20T10:00:00Z'
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
      createdAt: '2025-01-18T14:30:00Z',
      updatedAt: '2025-01-18T14:30:00Z'
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
      createdAt: '2025-01-15T09:15:00Z',
      updatedAt: '2025-01-22T16:45:00Z'
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
import React, { useState, useCallback } from 'react';
import { ArrowLeft, X, List, MoreHorizontal, Layout } from 'lucide-react';
import Library from './Library';
import StrategyViewScreen from './StrategyViewScreen';
import MultiStrategyViewScreen from './MultiStrategyViewScreen';
import ComparisonViewContainer from './ComparisonViewContainer';
import SingleNavigationBar from './SingleNavigationBar';
import { PanelManagerProvider } from './PanelManager';
import { RecentRun } from './RecentRunsCarousel';
import { generateMockStageData } from '../utils/mockStageData';

interface BacktestReportData {
  id: string;
  name: string;
  version: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  totalReturn: number;
  winRate: number;
  sharpe: number;
  maxDrawdown: number;
  totalTrades: number;
  avgHoldTime: string;
  profitFactor: number;
  calmarRatio: number;
  conflictLog: string[];
  trimEvents?: {
    count: number;
    avgReduction: number;
  };
  phaseDetection?: {
    reversals: number;
    consolidations: number;
    exhaustions: number;
  };
  keynote: string;
  chartData: {
    equity: { date: string; value: number }[];
    drawdown: { date: string; value: number }[];
    trades: { date: string; type: 'entry' | 'exit'; price: number; size: number }[];
    priceData: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
    movingAverage30W: { date: string; value: number }[];
    stageAnalysis: {
      stages: { date: string; stage: 1 | 2 | 3 | 4; sataScore: number }[];
      relativeStrength: { date: string; value: number }[];
      momentum: { date: string; value: number }[];
      stageTransitions: { date: string; fromStage: 1 | 2 | 3 | 4; toStage: 1 | 2 | 3 | 4; trigger: string }[];
    };
  };
}

interface Tab {
  id: string;
  type: 'library' | 'strategy';
  title: string;
  data?: RecentRun;
}

interface TabbedLibraryProps {
  onBack: () => void;
  onCompareSelected?: (selectedIds: string[]) => void;
  initialSearchTerm?: string;
}

const TabbedLibrary: React.FC<TabbedLibraryProps> = ({ onBack, onCompareSelected, initialSearchTerm }) => {
  const [useComparisonView, setUseComparisonView] = useState(false);
  const [comparisonStrategies, setComparisonStrategies] = useState<RecentRun[]>([]);
  const [useMultiStrategyView, setUseMultiStrategyView] = useState(false);
  const [multiStrategyViewStrategies, setMultiStrategyViewStrategies] = useState<RecentRun[]>([]);
  const [useSplitView, setUseSplitView] = useState(false);
  const [splitViewStrategy, setSplitViewStrategy] = useState<RecentRun | null>(null);
  const [activeTabId, setActiveTabId] = useState('library');
  const [tabOverflowMenuOpen, setTabOverflowMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'warning' | 'error' } | null>(null);

  const MAX_VISIBLE_TABS = 5;

  // Convert Library's BacktestData to RecentRun
  interface LibraryBacktestData {
    id: string;
    name: string;
    version: string;
    date: string;
    symbol: string;
    timeframe: string;
    winRate: number;
    sharpe: number;
    totalReturn: number;
    maxDrawdown: number;
    isUnread: boolean;
    keynote: string;
  }

  const convertToStrategyData = (libraryData: LibraryBacktestData): RecentRun => {
    const startingBalance = 100000;
    const endingBalance = startingBalance * (1 + libraryData.totalReturn / 100);
    const totalTrades = Math.floor(Math.random() * 500 + 50);
    const winningTrades = Math.floor(totalTrades * (libraryData.winRate / 100));
    const losingTrades = totalTrades - winningTrades;
    
    return {
      id: libraryData.id,
      name: libraryData.name,
      version: libraryData.version,
      symbol: libraryData.symbol,
      timeframe: libraryData.timeframe,
      startDate: '2024-01-01',
      endDate: libraryData.date,
      totalReturn: libraryData.totalReturn,
      winRate: libraryData.winRate,
      sharpe: libraryData.sharpe,
      maxDrawdown: libraryData.maxDrawdown,
      totalTrades: totalTrades,
      avgHoldTime: '3.2d',
      profitFactor: 1.65,
      calmarRatio: 2.1,
      completedAt: libraryData.date,
      keynote: libraryData.keynote,
      strategySettings: {
        atrPeriod: 14,
        atrMultiplier: 2.0,
        cvdThreshold: 0.5,
        rsiPeriod: 14,
        rsiOversold: 30,
        rsiOverbought: 70,
        stopLoss: 2.0,
        takeProfit: 4.0,
        positionSize: 100,
        maxPositions: 5
      },
      periodData: {
        '1M': {
          totalReturn: libraryData.totalReturn * 0.2,
          winRate: libraryData.winRate * 0.9,
          sharpe: libraryData.sharpe * 0.8,
          maxDrawdown: libraryData.maxDrawdown * 0.6,
          totalTrades: Math.floor(totalTrades * 0.15),
          avgHoldTime: '2.8d',
          profitFactor: 1.45,
          calmarRatio: 1.8
        }
      },
      // Comprehensive backtesting data
      accountData: {
        startingBalance,
        endingBalance,
        peakBalance: endingBalance * 1.15,
        balanceProgression: Array.from({ length: 50 }, (_, i) => {
          const date = new Date(2024, 0, 1 + i * 7).toISOString().split('T')[0];
          const progress = i / 49;
          const balance = startingBalance + (endingBalance - startingBalance) * progress + (Math.random() - 0.5) * 5000;
          return {
            date,
            balance,
            equity: balance * (1 + (Math.random() - 0.5) * 0.02),
            drawdown: Math.random() * libraryData.maxDrawdown * 0.01
          };
        }),
        totalCommissions: endingBalance * 0.002,
        totalSlippage: endingBalance * 0.001
      },
      tradeJournal: {
        entries: Array.from({ length: totalTrades }, (_, i) => ({
          id: `entry-${i}`,
          date: new Date(2024, 0, 1 + Math.random() * 365).toISOString(),
          type: Math.random() > 0.5 ? 'long' : 'short',
          price: 100 + Math.random() * 50,
          size: Math.floor(Math.random() * 500 + 100),
          reason: ['ATR Breakout', 'RSI Oversold', 'VWAP Support', 'Stage 2 Entry'][Math.floor(Math.random() * 4)],
          signal: ['Strong Buy', 'Buy', 'Accumulate'][Math.floor(Math.random() * 3)],
          confidence: Math.random() * 0.4 + 0.6
        })),
        exits: Array.from({ length: totalTrades - 10 }, (_, i) => ({
          id: `exit-${i}`,
          entryId: `entry-${i}`,
          date: new Date(2024, 0, 1 + Math.random() * 365).toISOString(),
          price: 100 + Math.random() * 50,
          size: Math.floor(Math.random() * 500 + 100),
          reason: ['Take Profit', 'Stop Loss', 'Time Exit', 'Signal Reversal'][Math.floor(Math.random() * 4)],
          signal: ['Exit', 'Stop', 'Trim'][Math.floor(Math.random() * 3)],
          pnl: (Math.random() - 0.3) * 2000,
          pnlPercent: (Math.random() - 0.3) * 15,
          holdTime: `${Math.floor(Math.random() * 10 + 1)}.${Math.floor(Math.random() * 10)}d`
        })),
        openPositions: Array.from({ length: 10 }, (_, i) => ({
          id: `open-${i}`,
          entryDate: new Date(2024, 11, 1 + Math.random() * 30).toISOString(),
          type: Math.random() > 0.5 ? 'long' : 'short',
          entryPrice: 100 + Math.random() * 50,
          currentPrice: 100 + Math.random() * 50,
          size: Math.floor(Math.random() * 500 + 100),
          unrealizedPnl: (Math.random() - 0.5) * 1000,
          holdTime: `${Math.floor(Math.random() * 30 + 1)}d`
        }))
      },
      strategyDefinition: {
        logic: "Multi-timeframe momentum strategy combining ATR-based position sizing with RSI mean reversion signals. Enters positions when price breaks above/below ATR bands with confirming volume and RSI divergence patterns.",
        entryConditions: [
          "Price closes above ATR upper band",
          "RSI(14) < 70 (not overbought)",
          "Volume > 1.5x 20-day average",
          "CVD threshold exceeded",
          "No conflicting higher timeframe signals"
        ],
        exitConditions: [
          "Stop loss: 2x ATR below entry",
          "Take profit: 4x ATR above entry",
          "RSI(14) > 80 (overbought exit)",
          "Volume drops below 0.8x average",
          "Maximum hold time: 10 days"
        ],
        riskManagement: {
          stopLossType: 'atr',
          takeProfitType: 'risk_reward',
          maxRiskPerTrade: 2.0,
          positionSizing: 'volatility_adjusted'
        },
        filters: [
          "Market cap > $1B",
          "Average volume > 1M shares",
          "No earnings announcements within 2 days",
          "Beta between 0.5 and 2.0"
        ],
        timeRestrictions: {
          tradingHours: "09:30 - 16:00 EST",
          excludedDays: [],
          excludedDates: []
        }
      },
      enhancedMetrics: {
        // Risk metrics
        valueAtRisk: libraryData.totalReturn * -0.15,
        conditionalValueAtRisk: libraryData.totalReturn * -0.22,
        maximumDrawdownDays: Math.floor(Math.random() * 45 + 15),
        recoveryFactor: libraryData.totalReturn / libraryData.maxDrawdown,
        ulcerIndex: Math.abs(libraryData.maxDrawdown * 0.7),
        
        // Return metrics
        annualizedReturn: libraryData.totalReturn * 1.2,
        monthlyReturns: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
          return: (Math.random() - 0.5) * 20
        })),
        bestMonth: { month: 'Mar', return: 15.8 },
        worstMonth: { month: 'Aug', return: -8.4 },
        positiveMonths: 8,
        
        // Consistency metrics
        winStreakMax: Math.floor(Math.random() * 8 + 3),
        loseStreakMax: Math.floor(Math.random() * 4 + 1),
        consistency: Math.min(0.95, libraryData.sharpe / 2 + 0.5),
        stabilityRatio: Math.max(0.1, Math.min(0.9, libraryData.sharpe / 3 + 0.3)),
        
        // Benchmark comparison
        benchmarkCorrelation: Math.random() * 0.6 + 0.2,
        beta: Math.random() * 1.5 + 0.5,
        alpha: libraryData.totalReturn - (Math.random() * 10 + 5),
        trackingError: Math.random() * 5 + 2,
        informationRatio: libraryData.sharpe * 0.8
      },
      executionDetails: {
        totalSignals: totalTrades + Math.floor(Math.random() * 50),
        signalsActioned: totalTrades,
        missedOpportunities: Math.floor(Math.random() * 20),
        slippageStats: {
          avgSlippage: Math.random() * 0.05,
          maxSlippage: Math.random() * 0.15,
          totalSlippageCost: endingBalance * 0.001
        },
        commissionStats: {
          avgCommission: 5 + Math.random() * 10,
          totalCommissions: endingBalance * 0.002
        },
        latencyStats: {
          avgOrderLatency: Math.random() * 100 + 50,
          maxOrderLatency: Math.random() * 500 + 200
        }
      }
    };
  };

  // State for tabs - initialized after function definitions
  const [tabs, setTabs] = useState<Tab[]>([]);

  // Initialize tabs after component mount
  React.useEffect(() => {
    if (tabs.length === 0) {
      setTabs([
        { 
          id: 'library', 
          type: 'library', 
          title: 'Library'
        }
      ]);
    }
  }, [tabs.length]);

  const handleOpenReport = useCallback((libraryBacktest: LibraryBacktestData) => {
    const strategy = convertToStrategyData(libraryBacktest);
    const existingTab = tabs.find(tab => tab.type === 'strategy' && tab.data?.id === strategy.id);
    
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: Tab = {
        id: `strategy-${strategy.id}`,
        type: 'strategy',
        title: `${strategy.name} ${strategy.version}`,
        data: strategy
      };

      setTabs(prev => {
        let updatedTabs = [...prev];
        const strategyTabs = prev.filter(tab => tab.type === 'strategy');
        
        if (strategyTabs.length >= MAX_VISIBLE_TABS - 1) {
          const oldestStrategyTab = strategyTabs[0];
          updatedTabs = updatedTabs.filter(tab => tab.id !== oldestStrategyTab.id);
        }

        updatedTabs.push(newTab);
        return updatedTabs;
      });
      setActiveTabId(newTab.id);
    }
  }, [tabs]);

  const handleOpenSelected = useCallback((backtests: LibraryBacktestData[]) => {
    const newTabs: Tab[] = [];
    
    backtests.forEach(libraryBacktest => {
      const strategy = convertToStrategyData(libraryBacktest);
      const existingTab = tabs.find(tab => tab.type === 'strategy' && tab.data?.id === strategy.id);
      
      if (!existingTab) {
        const newTab: Tab = {
          id: `strategy-${strategy.id}`,
          type: 'strategy',
          title: `${strategy.name} ${strategy.version}`,
          data: strategy
        };
        newTabs.push(newTab);
      }
    });
    
    if (newTabs.length > 0) {
      setTabs(prev => {
        let updatedTabs = [...prev];
        const strategyTabs = prev.filter(tab => tab.type === 'strategy');
        const totalNewTabs = strategyTabs.length + newTabs.length;
        
        if (totalNewTabs > MAX_VISIBLE_TABS - 1) {
          const tabsToRemove = totalNewTabs - (MAX_VISIBLE_TABS - 1);
          for (let i = 0; i < tabsToRemove; i++) {
            if (strategyTabs[i]) {
              updatedTabs = updatedTabs.filter(tab => tab.id !== strategyTabs[i].id);
            }
          }
        }
        
        updatedTabs.push(...newTabs);
        return updatedTabs;
      });
      
      if (newTabs.length > 0) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
    }
  }, [tabs]);

  const handleOpenInComparisonView = useCallback((backtests: LibraryBacktestData[], layoutMode?: string) => {
    // Convert to strategies and set for comparison view
    const strategies = backtests.map(convertToStrategyData);
    setComparisonStrategies(strategies);
    setUseComparisonView(true);
    console.log('Comparison view requested for:', strategies, 'Layout:', layoutMode);
  }, []);

  const handleOpenInSplitView = useCallback((backtests: LibraryBacktestData[]) => {
    if (backtests.length > 0) {
      // Convert to strategies and open in multi-strategy view (StrategyViewScreen layout with chart grid)
      const strategies = backtests.map(convertToStrategyData);
      setMultiStrategyViewStrategies(strategies);
      setUseMultiStrategyView(true);
      console.log('Split view requested for strategies:', strategies);
    } else {
      // No strategies selected
      alert('Please select strategies first to open Split View.');
      console.log('Split view error: No strategies selected');
    }
  }, []);

  const handleTabMove = useCallback((tabId: string, fromPaneId: string, toPaneId: string) => {
    console.log(`Moving tab ${tabId} from ${fromPaneId} to ${toPaneId}`);
    // Tab movement logic would be handled by SplitScreenManager
  }, []);

  const handleToggleComparisonView = useCallback(() => {
    if (!useComparisonView) {
      // Enable comparison view and populate with current strategy tabs
      const strategyTabs = tabs.filter(tab => tab.type === 'strategy' && tab.data);
      if (strategyTabs.length >= 2) {
        const strategies = strategyTabs.map(tab => tab.data!).slice(0, 4); // Limit to 4 strategies
        setComparisonStrategies(strategies);
        setUseComparisonView(true);
      } else {
        // Show user-friendly notification
        setNotification({
          message: `Need at least 2 open strategy tabs for comparison. Currently have ${strategyTabs.length}.`,
          type: 'warning'
        });
        // Auto-hide notification after 4 seconds
        setTimeout(() => setNotification(null), 4000);
      }
    } else {
      // Disable comparison view
      setUseComparisonView(false);
      setComparisonStrategies([]);
    }
  }, [useComparisonView, tabs]);

  const handleCloseTab = useCallback((tabId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (tabId === 'library') return; // Can't close library tab

    setTabs(prev => prev.filter(tab => tab.id !== tabId));

    // If we closed the active tab, switch to library or previous tab
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : 'library');
    }

    setTabOverflowMenuOpen(false);
  }, [activeTabId, tabs]);

  const handleCloseAllStrategyTabs = useCallback(() => {
    setTabs(prev => prev.filter(tab => tab.type === 'library'));
    setActiveTabId('library');
    setTabOverflowMenuOpen(false);
    setUseComparisonView(false);
    setComparisonStrategies([]);
    setUseMultiStrategyView(false);
    setMultiStrategyViewStrategies([]);
    setUseSplitView(false);
    setSplitViewStrategy(null);
  }, []);

  const handleCloneStrategy = useCallback(() => {
    // Find the currently active strategy tab
    const activeTab = tabs.find(tab => tab.id === activeTabId && tab.type === 'strategy');
    
    if (activeTab && activeTab.data) {
      // Generate a unique ID for the cloned strategy
      const clonedId = `${activeTab.id}_clone_${Date.now()}`;
      
      // Create cloned strategy data with modified name
      const clonedData: RecentRun = {
        ...activeTab.data,
        id: clonedId,
        name: `${activeTab.data.name} (Copy)`,
      };
      
      // Create new tab for the cloned strategy
      const clonedTab: Tab = {
        id: clonedId,
        type: 'strategy',
        title: clonedData.name,
        data: clonedData
      };
      
      // Add the cloned tab and make it active
      setTabs(prev => [...prev, clonedTab]);
      setActiveTabId(clonedId);
    } else {
      // Show user-friendly notification
      setNotification({
        message: 'No strategy tab is currently open to clone. Please open a strategy first.',
        type: 'warning'
      });
      // Auto-hide notification after 4 seconds
      setTimeout(() => setNotification(null), 4000);
    }
  }, [activeTabId, tabs]);

  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const visibleTabs = tabs.slice(0, MAX_VISIBLE_TABS);
  const overflowTabs = tabs.slice(MAX_VISIBLE_TABS);
  const activeTab = tabs.find(tab => tab.id === activeTabId);

  // Create Library component with proper props
  const libraryComponent = (
    <Library 
      onBack={onBack} 
      onCompareSelected={onCompareSelected}
      onReportOpen={handleOpenReport}
      onOpenSelected={handleOpenSelected}
      onOpenInComparisonView={handleOpenInComparisonView}
      onOpenInSplitView={handleOpenInSplitView}
      initialSearchTerm={initialSearchTerm}
    />
  );

  return (
    <PanelManagerProvider>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Single Minimal Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >

        {/* Single Minimal Header for all views */}
        <SingleNavigationBar
          strategies={tabs.filter(tab => tab.type === 'strategy').map(tab => ({
            id: tab.id,
            name: tab.title,
            isActive: tab.id === activeTabId
          }))}
          activeStrategyId={activeTabId}
          onStrategySelect={(strategyId) => setActiveTabId(strategyId)}
          onStrategyClose={(strategyId) => handleCloseTab(strategyId)}
          onLibraryClick={() => {
            setActiveTabId('library');
            setUseComparisonView(false);
            setComparisonStrategies([]);
            setUseMultiStrategyView(false);
            setMultiStrategyViewStrategies([]);
          }}
          onCompareClick={handleToggleComparisonView}
          onCloneStrategy={handleCloneStrategy}
          onCloseAllStrategies={handleCloseAllStrategyTabs}
          onBack={onBack}
        />
      </div>

      {/* Notification Toast */}
      {notification && (
        <div 
          className="fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border max-w-md animate-slide-in"
          style={{
            backgroundColor: notification.type === 'warning' ? '#fef3cd' : 
                           notification.type === 'error' ? '#f8d7da' : '#d1ecf1',
            borderColor: notification.type === 'warning' ? '#fdbf47' : 
                        notification.type === 'error' ? '#f5c6cb' : '#bee5eb',
            color: notification.type === 'warning' ? '#664d03' : 
                  notification.type === 'error' ? '#721c24' : '#0c5460',
          }}
        >
          <div className="flex items-center justify-between space-x-3">
            <div className="text-sm font-medium flex-1">{notification.message}</div>
            <button
              onClick={() => setNotification(null)}
              className="text-lg leading-none hover:opacity-70 flex-shrink-0 ml-2"
              style={{ color: 'inherit' }}
              title="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1">
        {useMultiStrategyView && multiStrategyViewStrategies.length > 0 ? (
          <MultiStrategyViewScreen
            strategies={multiStrategyViewStrategies}
            onBack={() => {
              setUseMultiStrategyView(false);
              setMultiStrategyViewStrategies([]);
              setActiveTabId('library');
            }}
          />
        ) : useComparisonView && comparisonStrategies.length > 0 ? (
          <ComparisonViewContainer
            strategies={comparisonStrategies}
            onStrategySelect={(strategy) => {
              console.log('Strategy selected:', strategy);
            }}
            onBack={() => {
              setUseComparisonView(false);
              setComparisonStrategies([]);
              setActiveTabId('library');
            }}
            className="h-full"
          />
        ) : (
          // Traditional tabbed view
          <div className="h-full">
            {activeTab?.type === 'library' ? (
              <div className="max-w-7xl mx-auto h-full">
                {libraryComponent}
              </div>
            ) : activeTab?.type === 'strategy' && activeTab.data ? (
              <StrategyViewScreen 
                strategy={activeTab.data}
                onBack={() => setActiveTabId('library')}
                hideHeader={true}
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Tab not found
                  </h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    The requested tab could not be displayed.
                  </p>
                  <button
                    onClick={() => setActiveTabId('library')}
                    className="mt-4 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    Return to Library
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </PanelManagerProvider>
  );
};

export default TabbedLibrary;
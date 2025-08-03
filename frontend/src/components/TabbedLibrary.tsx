import React, { useState, useCallback } from 'react';
import { ArrowLeft, X, List, MoreHorizontal, Layout } from 'lucide-react';
import Library from './Library';
import StrategyViewScreen from './StrategyViewScreen';
import MultiStrategyViewScreen from './MultiStrategyViewScreen';
import ComparisonViewContainer from './ComparisonViewContainer';
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
  component?: React.ReactNode;
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

  const convertToStrategyData = (libraryData: LibraryBacktestData): RecentRun => ({
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
    totalTrades: 1247,
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
    }
  });

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
        data: strategy,
        component: <StrategyViewScreen 
          strategy={strategy}
          onBack={() => setActiveTabId('library')}
        />
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
          data: strategy,
          component: <StrategyViewScreen 
            strategy={strategy}
            onBack={() => setActiveTabId('library')}
          />
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
    setUseComparisonView(!useComparisonView);
  }, [useComparisonView]);

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header with Tabs */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Main</span>
            </button>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {activeTab?.type === 'library' ? 'Backtest Library' : 'Strategy Analysis'}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Comparison View Toggle */}
            {tabs.some(tab => tab.type === 'strategy') && (
              <button
                onClick={handleToggleComparisonView}
                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                  useComparisonView ? 'ring-2' : 'hover:bg-opacity-50'
                }`}
                style={{
                  borderColor: useComparisonView ? 'var(--accent)' : 'var(--border)',
                  color: useComparisonView ? 'var(--accent)' : 'var(--text-primary)',
                  backgroundColor: useComparisonView ? 'rgba(59, 130, 246, 0.1)' : 'var(--surface)',
                  ringColor: 'var(--accent)'
                }}
                title={useComparisonView ? 'Exit comparison view' : 'Switch to comparison view'}
              >
                <Layout size={16} style={{ marginRight: '4px' }} />
                {useComparisonView ? 'Exit Compare' : 'Compare View'}
              </button>
            )}
            
            {/* Close All Tabs Button (when strategy tabs exist) */}
            {tabs.some(tab => tab.type === 'strategy') && (
              <button
                onClick={handleCloseAllStrategyTabs}
                className="px-3 py-1.5 text-sm border rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                style={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  backgroundColor: 'var(--surface)'
                }}
              >
                Close All Strategies
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar - Only show in normal tabbed view */}
        {!useComparisonView && !useMultiStrategyView && tabs.length > 1 && (
          <div className="px-6">
            <div className="flex items-center space-x-1 overflow-hidden">
              {/* Visible Tabs */}
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-all hover:bg-opacity-50 ${
                    activeTabId === tab.id ? 'border-b-2' : 'border-transparent hover:border-gray-300'
                  }`}
                  style={{
                    borderBottomColor: activeTabId === tab.id ? 'var(--accent)' : 'transparent',
                    color: activeTabId === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                    backgroundColor: activeTabId === tab.id ? 'var(--bg-primary)' : 'transparent'
                  }}
                >
                  {tab.type === 'library' ? (
                    <List size={16} />
                  ) : (
                    <div className="flex items-center space-x-2 max-w-32">
                      <span className="truncate text-sm font-medium">
                        {truncateTitle(tab.title)}
                      </span>
                      <button
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                  {tab.type === 'library' && <span className="text-sm font-medium">Library</span>}
                </button>
              ))}

              {/* Overflow Menu */}
              {overflowTabs.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setTabOverflowMenuOpen(!tabOverflowMenuOpen)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm border-b-2 border-transparent hover:border-gray-300 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <MoreHorizontal size={16} />
                    <span>+{overflowTabs.length}</span>
                  </button>

                  {tabOverflowMenuOpen && (
                    <div
                      className="absolute top-full right-0 mt-1 border rounded-lg shadow-lg z-10 min-w-48"
                      style={{
                        backgroundColor: 'var(--surface)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      {overflowTabs.map((tab) => (
                        <div
                          key={tab.id}
                          className="flex items-center justify-between px-3 py-2 hover:bg-opacity-50 transition-colors"
                        >
                          <button
                            onClick={() => {
                              setActiveTabId(tab.id);
                              setTabOverflowMenuOpen(false);
                            }}
                            className="flex-1 text-left text-sm truncate"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {tab.title}
                          </button>
                          <button
                            onClick={(e) => handleCloseTab(tab.id, e)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors ml-2"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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
            ) : activeTab?.component ? (
              activeTab.component
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
  );
};

export default TabbedLibrary;
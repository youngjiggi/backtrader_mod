import React, { useState } from 'react';
import Header from './Header';
import CollapsibleSection from './CollapsibleSection';
import NewBacktestModal from './NewBacktestModal';
import InlineEditableTitle from './InlineEditableTitle';
import TagEditor from './TagEditor';
import RecentRunsCarousel, { RecentRun } from './RecentRunsCarousel';
import DynamicPerformanceCards from './DynamicPerformanceCards';
import BenchmarkComparison from './BenchmarkComparison';
import StrategyComparisonChart from './StrategyComparisonChart';
import PerformanceDetailsAccordion from './PerformanceDetailsAccordion';
import { BarChart3, Library, Plus, X, Clock, Play, Search, List } from 'lucide-react';
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

interface DashboardProps {
  onNavigateToLibrary: (searchTerm?: string) => void;
  onNavigateToWatchlistManagement?: () => void;
  onNavigateToStrategies?: () => void;
  onNavigateToReport?: (backtest: BacktestReportData) => void;
  onNavigateToStrategyView?: (strategy: RecentRun) => void;
  onNavigateToSignIn?: () => void;
  onNavigateToSettings?: () => void;
}

interface RunningBacktest {
  id: string;
  name: string;
  symbol: string;
  timeframe: string;
  startTime: string;
  progress: number;
  status: 'running' | 'completed' | 'failed';
  tags: string[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToLibrary, onNavigateToWatchlistManagement, onNavigateToStrategies, onNavigateToReport, onNavigateToStrategyView, onNavigateToSignIn, onNavigateToSettings }) => {
  const [isNewBacktestModalOpen, setIsNewBacktestModalOpen] = useState(false);
  const [runningBacktests, setRunningBacktests] = useState<RunningBacktest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecentRun, setSelectedRecentRun] = useState<RecentRun | null>(null);
  const [timeInterval, setTimeInterval] = useState('1Y');
  const [baseStrategyId, setBaseStrategyId] = useState<string>('recent_1');
  const [comparisonStrategies, setComparisonStrategies] = useState<string[]>([]);

  // Sample report data for navigation
  const sampleReportData: BacktestReportData[] = [
    {
      id: 'report_1',
      name: 'ATR Strategy',
      version: 'v1',
      symbol: 'AAPL',
      timeframe: '1D',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 24.7,
      winRate: 68.4,
      sharpe: 1.84,
      maxDrawdown: -8.2,
      totalTrades: 1247,
      avgHoldTime: '3.2d',
      profitFactor: 1.65,
      calmarRatio: 2.1,
      conflictLog: [
        'CVD negative but ATR held: +5% net',
        'Phase reversal detected during position: Adjusted size',
        'Volume spike exceeded threshold: Entry delayed'
      ],
      trimEvents: {
        count: 12,
        avgReduction: 15
      },
      phaseDetection: {
        reversals: 8,
        consolidations: 15,
        exhaustions: 4
      },
      keynote: 'Strong performance in trending markets with improved exit signals. The ATR-based position sizing helped reduce drawdowns significantly.',
      chartData: {
        equity: [],
        drawdown: [],
        trades: [],
        ...generateMockStageData('AAPL', '2024-01-01', '2024-12-31', 180)
      }
    },
    {
      id: 'report_2',
      name: 'ATR Strategy',
      version: 'v2',
      symbol: 'AAPL',
      timeframe: '1D',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 31.2,
      winRate: 72.1,
      sharpe: 2.12,
      maxDrawdown: -6.5,
      totalTrades: 892,
      avgHoldTime: '2.8d',
      profitFactor: 1.89,
      calmarRatio: 2.8,
      conflictLog: [
        'Enhanced CVD filtering reduced false signals',
        'Phase detection improved entry timing by 12%'
      ],
      phaseDetection: {
        reversals: 12,
        consolidations: 18,
        exhaustions: 6
      },
      keynote: 'Excellent reversal detection with volume confirmation. Version 2 improvements show significant performance gains.',
      chartData: {
        equity: [],
        drawdown: [],
        trades: [],
        ...generateMockStageData('AAPL', '2024-01-01', '2024-12-31', 185)
      }
    },
    {
      id: 'report_3',
      name: 'ATR Strategy',
      version: 'v3',
      symbol: 'AAPL',
      timeframe: '1D',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 18.9,
      winRate: 65.3,
      sharpe: 1.45,
      maxDrawdown: -4.2,
      totalTrades: 1056,
      avgHoldTime: '4.1d',
      profitFactor: 1.52,
      calmarRatio: 1.9,
      conflictLog: [
        'Conservative approach reduced volatility',
        'Lower returns but improved consistency'
      ],
      keynote: 'More conservative version focusing on risk management. Lower returns but much better risk-adjusted performance.',
      chartData: {
        equity: [],
        drawdown: [],
        trades: [],
        ...generateMockStageData('AAPL', '2024-01-01', '2024-12-31', 175)
      }
    }
  ];

  // Recent completed runs data
  const recentRuns: RecentRun[] = [
    {
      id: 'recent_1',
      name: 'ATR Strategy',
      version: 'v2.1',
      symbol: 'AAPL',
      timeframe: '1D',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 24.7,
      winRate: 68.4,
      sharpe: 1.84,
      maxDrawdown: -8.2,
      totalTrades: 1247,
      avgHoldTime: '3.2d',
      profitFactor: 1.95,
      calmarRatio: 2.1,
      completedAt: '2025-01-30T14:30:00Z',
      keynote: 'Strong performance in trending markets with improved exit signals. The ATR-based position sizing helped reduce drawdowns significantly.',
      strategySettings: {
        atrPeriod: 14,
        atrMultiplier: 2.0,
        cvdThreshold: 0.05,
        rsiPeriod: 14,
        rsiOversold: 30,
        rsiOverbought: 70,
        stopLoss: 0.02,
        takeProfit: 0.06,
        positionSize: 0.1,
        maxPositions: 3
      },
      periodData: {
        '1M': { totalReturn: 2.1, winRate: 65.2, sharpe: 1.45, maxDrawdown: -3.1, totalTrades: 87, avgHoldTime: '2.8d', profitFactor: 1.72, calmarRatio: 1.8 },
        '3M': { totalReturn: 8.3, winRate: 67.1, sharpe: 1.62, maxDrawdown: -5.4, totalTrades: 264, avgHoldTime: '3.1d', profitFactor: 1.83, calmarRatio: 1.95 },
        '6M': { totalReturn: 14.8, winRate: 68.9, sharpe: 1.78, maxDrawdown: -6.7, totalTrades: 523, avgHoldTime: '3.0d', profitFactor: 1.91, calmarRatio: 2.05 },
        '1Y': { totalReturn: 24.7, winRate: 68.4, sharpe: 1.84, maxDrawdown: -8.2, totalTrades: 1247, avgHoldTime: '3.2d', profitFactor: 1.95, calmarRatio: 2.1 },
        'YTD': { totalReturn: 1.8, winRate: 62.5, sharpe: 1.32, maxDrawdown: -2.9, totalTrades: 62, avgHoldTime: '2.9d', profitFactor: 1.65, calmarRatio: 1.7 },
        'All': { totalReturn: 24.7, winRate: 68.4, sharpe: 1.84, maxDrawdown: -8.2, totalTrades: 1247, avgHoldTime: '3.2d', profitFactor: 1.95, calmarRatio: 2.1 }
      }
    },
    {
      id: 'recent_2',
      name: 'RSI Divergence',
      version: 'v1.3',
      symbol: 'TSLA',
      timeframe: '4h',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 31.2,
      winRate: 72.1,
      sharpe: 2.12,
      maxDrawdown: -6.5,
      totalTrades: 892,
      avgHoldTime: '2.8d',
      profitFactor: 1.89,
      calmarRatio: 2.8,
      completedAt: '2025-01-29T16:45:00Z',
      keynote: 'Excellent reversal detection with volume confirmation. Version 1.3 improvements show significant performance gains.',
      strategySettings: {
        atrPeriod: 21,
        atrMultiplier: 1.5,
        cvdThreshold: 0.08,
        rsiPeriod: 9,
        rsiOversold: 25,
        rsiOverbought: 75,
        stopLoss: 0.025,
        takeProfit: 0.05,
        positionSize: 0.15,
        maxPositions: 5
      },
      periodData: {
        '1M': { totalReturn: 4.2, winRate: 69.8, sharpe: 1.82, maxDrawdown: -2.8, totalTrades: 78, avgHoldTime: '2.5d', profitFactor: 1.74, calmarRatio: 2.1 },
        '3M': { totalReturn: 12.8, winRate: 71.3, sharpe: 1.95, maxDrawdown: -4.2, totalTrades: 235, avgHoldTime: '2.7d', profitFactor: 1.81, calmarRatio: 2.4 },
        '6M': { totalReturn: 21.5, winRate: 72.8, sharpe: 2.05, maxDrawdown: -5.8, totalTrades: 467, avgHoldTime: '2.6d', profitFactor: 1.86, calmarRatio: 2.7 },
        '1Y': { totalReturn: 31.2, winRate: 72.1, sharpe: 2.12, maxDrawdown: -6.5, totalTrades: 892, avgHoldTime: '2.8d', profitFactor: 1.89, calmarRatio: 2.8 },
        'YTD': { totalReturn: 3.1, winRate: 68.2, sharpe: 1.65, maxDrawdown: -2.3, totalTrades: 51, avgHoldTime: '2.4d', profitFactor: 1.68, calmarRatio: 1.9 },
        'All': { totalReturn: 31.2, winRate: 72.1, sharpe: 2.12, maxDrawdown: -6.5, totalTrades: 892, avgHoldTime: '2.8d', profitFactor: 1.89, calmarRatio: 2.8 }
      }
    },
    {
      id: 'recent_3',
      name: 'Moving Average Cross',
      version: 'v3.0',
      symbol: 'SPY',
      timeframe: '1d',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 18.9,
      winRate: 65.3,
      sharpe: 1.45,
      maxDrawdown: -4.2,
      totalTrades: 1056,
      avgHoldTime: '4.1d',
      profitFactor: 1.52,
      calmarRatio: 1.9,
      completedAt: '2025-01-28T11:20:00Z',
      keynote: 'Stable returns with low drawdown, good for risk-averse strategies. Conservative approach with consistent results.',
      strategySettings: {
        atrPeriod: 20,
        atrMultiplier: 2.5,
        cvdThreshold: 0.03,
        rsiPeriod: 21,
        rsiOversold: 35,
        rsiOverbought: 65,
        stopLoss: 0.015,
        takeProfit: 0.04,
        positionSize: 0.08,
        maxPositions: 2
      },
      periodData: {
        '1M': { totalReturn: 1.5, winRate: 63.1, sharpe: 1.22, maxDrawdown: -1.8, totalTrades: 92, avgHoldTime: '3.8d', profitFactor: 1.41, calmarRatio: 1.6 },
        '3M': { totalReturn: 5.8, winRate: 64.7, sharpe: 1.35, maxDrawdown: -2.9, totalTrades: 278, avgHoldTime: '4.0d', profitFactor: 1.47, calmarRatio: 1.75 },
        '6M': { totalReturn: 11.2, winRate: 65.1, sharpe: 1.41, maxDrawdown: -3.5, totalTrades: 532, avgHoldTime: '4.0d', profitFactor: 1.50, calmarRatio: 1.85 },
        '1Y': { totalReturn: 18.9, winRate: 65.3, sharpe: 1.45, maxDrawdown: -4.2, totalTrades: 1056, avgHoldTime: '4.1d', profitFactor: 1.52, calmarRatio: 1.9 },
        'YTD': { totalReturn: 1.2, winRate: 61.8, sharpe: 1.15, maxDrawdown: -1.5, totalTrades: 71, avgHoldTime: '3.9d', profitFactor: 1.38, calmarRatio: 1.5 },
        'All': { totalReturn: 18.9, winRate: 65.3, sharpe: 1.45, maxDrawdown: -4.2, totalTrades: 1056, avgHoldTime: '4.1d', profitFactor: 1.52, calmarRatio: 1.9 }
      }
    },
    {
      id: 'recent_4',
      name: 'Phase Reversal Detection',
      version: 'v1.0',
      symbol: 'QQQ',
      timeframe: '1h',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: 22.1,
      winRate: 64.7,
      sharpe: 1.67,
      maxDrawdown: -9.5,
      totalTrades: 1543,
      avgHoldTime: '1.8d',
      profitFactor: 1.74,
      calmarRatio: 1.8,
      completedAt: '2025-01-27T09:15:00Z',
      keynote: 'Promising early results with phase identification. Requires more testing on different market conditions.'
    },
    {
      id: 'recent_5',
      name: 'CVD Momentum Strategy',
      version: 'v2.5',
      symbol: 'BTC',
      timeframe: '15m',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      totalReturn: -3.8,
      winRate: 61.3,
      sharpe: 0.92,
      maxDrawdown: -15.2,
      totalTrades: 2847,
      avgHoldTime: '45m',
      profitFactor: 0.96,
      calmarRatio: 0.4,
      completedAt: '2025-01-26T18:50:00Z',
      keynote: 'High volatility strategy with mixed results. Needs adjustment for crypto market conditions.'
    }
  ];

  const handleRecentRunSelect = (run: RecentRun) => {
    setSelectedRecentRun(run);
  };

  const handleSetBaseStrategy = (strategyId: string) => {
    setBaseStrategyId(strategyId);
    // Remove from comparison list if it was there
    setComparisonStrategies(prev => prev.filter(id => id !== strategyId));
  };

  const handleAddToComparison = (strategyId: string) => {
    if (!comparisonStrategies.includes(strategyId) && strategyId !== baseStrategyId) {
      setComparisonStrategies(prev => [...prev, strategyId]);
    }
  };

  const handleRemoveFromComparison = (strategyId: string) => {
    setComparisonStrategies(prev => prev.filter(id => id !== strategyId));
  };

  const handleEditStrategy = (strategyId: string) => {
    // TODO: Navigate to strategy editor or open edit modal
    console.log('Edit strategy:', strategyId);
  };

  const handleNavigateToStrategyView = (run: RecentRun) => {
    if (onNavigateToStrategyView) {
      onNavigateToStrategyView(run);
    }
  };

  const handleBacktestStarted = (backtestId: string) => {
    const newBacktest: RunningBacktest = {
      id: backtestId,
      name: 'ATR Strategy',
      symbol: 'AAPL', // TODO: Get from form data
      timeframe: '1d',
      startTime: new Date().toISOString(),
      progress: 0,
      status: 'running',
      tags: ['new', 'test']
    };

    setRunningBacktests(prev => [...prev, newBacktest]);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setRunningBacktests(prev => 
        prev.map(bt => {
          if (bt.id === backtestId && bt.status === 'running') {
            const newProgress = Math.min(bt.progress + Math.random() * 20, 100);
            return {
              ...bt,
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'running'
            };
          }
          return bt;
        })
      );
    }, 1000);

    // Clear interval when completed
    setTimeout(() => {
      clearInterval(progressInterval);
      setRunningBacktests(prev => 
        prev.map(bt => 
          bt.id === backtestId ? { ...bt, progress: 100, status: 'completed' } : bt
        )
      );
    }, 8000);
  };

  const handleCancelBacktest = (id: string) => {
    setRunningBacktests(prev => prev.filter(bt => bt.id !== id));
  };

  const handleUpdateBacktestName = (backtestId: string, newName: string) => {
    setRunningBacktests(prev => 
      prev.map(bt => 
        bt.id === backtestId 
          ? { ...bt, name: newName }
          : bt
      )
    );
  };

  const handleUpdateBacktestTags = (backtestId: string, newTags: string[]) => {
    setRunningBacktests(prev => 
      prev.map(bt => 
        bt.id === backtestId 
          ? { ...bt, tags: newTags }
          : bt
      )
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Navigating to library with search:', searchQuery);
      onNavigateToLibrary(searchQuery.trim());
    } else {
      onNavigateToLibrary();
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header onSignInClick={onNavigateToSignIn} onSettingsClick={onNavigateToSettings} />
      
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/grid.png)',
          }}
        >
          {/* Overlay for better text readability and theme consistency */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%)'
            }}
          ></div>
        </div>

        {/* Floating Search Bar and Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl px-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10" 
                  size={20} 
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search strategies, symbols, or backtests..."
                  className="w-full pl-12 pr-20 py-4 text-lg rounded-xl border shadow-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* New Backtest - Primary Action */}
              <button
                onClick={() => setIsNewBacktestModalOpen(true)}
                className="group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.085)',
                  borderColor: 'rgba(255, 255, 255, 0.255)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.17)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1275) 0%, rgba(255, 255, 255, 0.0425) 100%)'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-full bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all backdrop-blur-sm">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-shadow">New Backtest</h3>
                  <p className="text-sm opacity-90 text-shadow">
                    Create and run a new strategy backtest
                  </p>
                </div>
              </button>

              {/* View Library - Secondary Action */}
              <button
                onClick={() => onNavigateToLibrary()}
                className="group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.068)',
                  borderColor: 'rgba(255, 255, 255, 0.17)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1275)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.102) 0%, rgba(255, 255, 255, 0.034) 100%)'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-full bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all backdrop-blur-sm">
                    <Library size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-shadow">View Library</h3>
                  <p className="text-sm opacity-90 text-shadow">
                    Browse your strategy library and results
                  </p>
                </div>
              </button>

              {/* Manage Watchlists - Secondary Action */}
              <button
                onClick={onNavigateToWatchlistManagement}
                className="group p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl backdrop-blur-lg"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.068)',
                  borderColor: 'rgba(255, 255, 255, 0.17)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1275)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.102) 0%, rgba(255, 255, 255, 0.034) 100%)'
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 rounded-full bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all backdrop-blur-sm">
                    <List size={24} />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-shadow">Manage Watchlists</h3>
                  <p className="text-sm opacity-90 text-shadow">
                    Organize and manage your symbol watchlists
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Top Performant Strategies Carousel */}
        <RecentRunsCarousel
          runs={recentRuns}
          selectedRunId={selectedRecentRun?.id || null}
          onRunSelect={handleRecentRunSelect}
          timeInterval={timeInterval}
          onTimeIntervalChange={setTimeInterval}
          baseStrategyId={baseStrategyId}
          comparisonStrategies={comparisonStrategies}
          onSetBaseStrategy={handleSetBaseStrategy}
          onAddToComparison={handleAddToComparison}
          onRemoveFromComparison={handleRemoveFromComparison}
          onEditStrategy={handleEditStrategy}
          onDoubleClickStrategy={handleNavigateToStrategyView}
        />

        {/* Performance Overview - Current Portfolio Tracking */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Performance Overview
            </h2>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Current Portfolio Strategy Tracking
            </div>
          </div>
          <DynamicPerformanceCards selectedRun={selectedRecentRun} timeInterval={timeInterval} />
        </div>

        {/* Strategy Comparison Chart */}
        {(baseStrategyId || comparisonStrategies.length > 0) && (
          <StrategyComparisonChart
            baseStrategy={recentRuns.find(run => run.id === baseStrategyId) || null}
            comparisonStrategies={recentRuns.filter(run => comparisonStrategies.includes(run.id))}
            timeInterval={timeInterval}
          />
        )}

        {/* Performance Details Accordion */}
        {(baseStrategyId && comparisonStrategies.length > 0) && (
          <PerformanceDetailsAccordion
            baseStrategy={recentRuns.find(run => run.id === baseStrategyId) || null}
            comparisonStrategies={recentRuns.filter(run => comparisonStrategies.includes(run.id))}
          />
        )}

        {/* Benchmark Comparison */}
        <BenchmarkComparison selectedRun={selectedRecentRun} timeInterval={timeInterval} />

        {/* Runs in Progress */}
        {runningBacktests.length > 0 && (
          <CollapsibleSection
            title={`Runs in Progress (${runningBacktests.filter(bt => bt.status === 'running').length})`}
            icon={<Clock size={20} />}
            defaultExpanded={true}
          >
            <div className="space-y-4">
              {runningBacktests.map((backtest) => (
                <div
                  key={backtest.id}
                  className="border rounded-lg p-4"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {backtest.status === 'running' ? (
                        <Play className="animate-pulse" size={16} style={{ color: 'var(--accent)' }} />
                      ) : backtest.status === 'completed' ? (
                        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="mb-1">
                          <InlineEditableTitle
                            value={backtest.name}
                            onSave={(newName) => handleUpdateBacktestName(backtest.id, newName)}
                            className="font-medium"
                            titleStyle={{ color: 'var(--text-primary)' }}
                            placeholder="Backtest name..."
                          />
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {backtest.symbol} • {backtest.timeframe} • Started {new Date(backtest.startTime).toLocaleTimeString()}
                        </p>
                        <TagEditor
                          tags={backtest.tags}
                          onTagsChange={(newTags) => handleUpdateBacktestTags(backtest.id, newTags)}
                          className="mb-1"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>
                        {Math.round(backtest.progress)}%
                      </span>
                      {backtest.status === 'running' && (
                        <button
                          onClick={() => handleCancelBacktest(backtest.id)}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Cancel backtest"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${backtest.progress}%`,
                        backgroundColor: backtest.status === 'completed' ? '#10b981' : 'var(--accent)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Collapsible Sections */}
        <div className="space-y-6">
          {/* Recent Runs */}
          <CollapsibleSection
            title="Recent Runs"
            icon={<BarChart3 size={20} />}
            defaultExpanded={true}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleReportData.map((backtest) => (
                <div
                  key={backtest.id}
                  onClick={() => onNavigateToReport && onNavigateToReport(backtest)}
                  className="p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-opacity-70"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {backtest.name} {backtest.version}
                    </h3>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                      title="Unread"
                    />
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {backtest.symbol} • {backtest.timeframe} • {new Date(backtest.endDate).toLocaleDateString()}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Win Rate:</span>
                      <span style={{ color: 'var(--highlight)' }}>{backtest.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Sharpe:</span>
                      <span style={{ color: 'var(--highlight)' }}>{backtest.sharpe.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Return:</span>
                      <span style={{ color: backtest.totalReturn > 0 ? '#10b981' : '#ef4444' }}>
                        {backtest.totalReturn > 0 ? '+' : ''}{backtest.totalReturn.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Performance Comparison */}
          <CollapsibleSection
            title="Performance Overview"
            icon={<BarChart3 size={20} />}
          >
            <div 
              className="h-64 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <p style={{ color: 'var(--text-secondary)' }}>
                Performance charts will be displayed here
              </p>
            </div>
          </CollapsibleSection>

          {/* Strategy Library Preview */}
          <CollapsibleSection
            title="Strategy Library"
            icon={<Library size={20} />}
          >
            <div className="space-y-4">
              {['Moving Average Cross', 'RSI Divergence', 'Breakout Strategy'].map((strategy, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded border"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div>
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {strategy}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {i + 3} backtests • Updated {i + 1} day ago
                    </p>
                  </div>
                  <button
                    onClick={onNavigateToStrategies}
                    className="px-3 py-1 rounded text-sm"
                    style={{
                      backgroundColor: 'var(--highlight)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      </main>

      {/* Modals */}
      <NewBacktestModal
        isOpen={isNewBacktestModalOpen}
        onClose={() => setIsNewBacktestModalOpen(false)}
        onBacktestStarted={handleBacktestStarted}
        onManageWatchlists={onNavigateToWatchlistManagement}
      />
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import Header from './Header';
import CollapsibleSection from './CollapsibleSection';
import MetricsCards from './MetricsCards';
import NewBacktestModal from './NewBacktestModal';
import InlineEditableTitle from './InlineEditableTitle';
import TagEditor from './TagEditor';
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

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToLibrary, onNavigateToWatchlistManagement, onNavigateToStrategies, onNavigateToReport, onNavigateToSignIn, onNavigateToSettings }) => {
  const [isNewBacktestModalOpen, setIsNewBacktestModalOpen] = useState(false);
  const [runningBacktests, setRunningBacktests] = useState<RunningBacktest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample recent runs data
  const recentRuns: BacktestReportData[] = [
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

        {/* Floating Search Bar */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-2xl px-6">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
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
          </div>
        </div>
      </section>
      
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Metrics */}
        <MetricsCards />

        {/* Quick Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => setIsNewBacktestModalOpen(true)}
            className="px-6 py-3 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: 'var(--accent)', 
              color: 'var(--bg-primary)' 
            }}
          >
            <Plus className="inline mr-2" size={20} />
            New Backtest
          </button>
          <button
            onClick={() => onNavigateToLibrary()}
            className="px-6 py-3 rounded-lg border font-medium transition-colors duration-200 hover:bg-opacity-80"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            <Library className="inline mr-2" size={20} />
            View Library
          </button>
          <button
            onClick={onNavigateToWatchlistManagement}
            className="px-6 py-3 rounded-lg border font-medium transition-colors duration-200 hover:bg-opacity-80"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            <List className="inline mr-2" size={20} />
            Manage Watchlists
          </button>
        </div>

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
              {recentRuns.map((backtest) => (
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
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { StrategyProvider } from './contexts/StrategyContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { RecentRun } from './components/RecentRunsCarousel';
import Dashboard from './components/Dashboard';
import TabbedLibrary from './components/TabbedLibrary';
import ComparisonScreen from './components/ComparisonScreen';
import StrategyLibrary from './components/StrategyLibrary';
import ReportScreen from './components/ReportScreen';
import StrategyViewScreen from './components/StrategyViewScreen';
import SignInScreen from './components/SignInScreen';
import WatchlistManagement from './components/WatchlistManagement';
import SettingsScreen from './components/SettingsScreen';

type CurrentView = 'dashboard' | 'library' | 'comparison' | 'strategies' | 'report' | 'strategy-view' | 'signin' | 'watchlists' | 'settings';

interface BacktestData {
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
  totalTrades: number;
  avgHoldTime: string;
  isUnread: boolean;
  keynote: string;
}

// Add BacktestReportData interface (copy from Dashboard.tsx)
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

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const [selectedBacktestsForComparison, setSelectedBacktestsForComparison] = useState<BacktestData[]>([]);
  const [selectedBacktestForReport, setSelectedBacktestForReport] = useState<BacktestReportData | null>(null);
  const [selectedStrategyForView, setSelectedStrategyForView] = useState<RecentRun | null>(null);
  const [librarySearchTerm, setLibrarySearchTerm] = useState<string>('');

  // Sample data for comparison
  const sampleBacktests: BacktestData[] = [
    {
      id: '1',
      name: 'ATR Breakout Strategy',
      version: 'v2.1',
      date: '2025-01-25',
      symbol: 'AAPL',
      timeframe: '1d',
      winRate: 68.4,
      sharpe: 1.84,
      totalReturn: 24.7,
      maxDrawdown: -8.2,
      totalTrades: 1247,
      avgHoldTime: '3.2d',
      isUnread: true,
      keynote: 'Strong performance in trending markets with improved exit signals'
    },
    {
      id: '2',
      name: 'RSI Divergence',
      version: 'v1.3',
      date: '2025-01-24',
      symbol: 'TSLA',
      timeframe: '4h',
      winRate: 72.1,
      sharpe: 2.12,
      totalReturn: 31.2,
      maxDrawdown: -12.4,
      totalTrades: 892,
      avgHoldTime: '2.8d',
      isUnread: false,
      keynote: 'Excellent reversal detection, needs volume confirmation'
    }
  ];

  const handleCompareSelected = (selectedIds: string[]) => {
    const selectedBacktests = sampleBacktests.filter(bt => selectedIds.includes(bt.id));
    setSelectedBacktestsForComparison(selectedBacktests);
    setCurrentView('comparison');
  };

  const handleNavigateToReport = (backtest: BacktestReportData) => {
    setSelectedBacktestForReport(backtest);
    setCurrentView('report');
  };

  const handleNavigateToSignIn = () => {
    setCurrentView('signin');
  };

  const handleNavigateToSettings = () => {
    setCurrentView('settings');
  };

  const handleNavigateToStrategyView = (strategy: RecentRun) => {
    setSelectedStrategyForView(strategy);
    setCurrentView('strategy-view');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'settings':
        return (
          <SettingsScreen 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'signin':
        return (
          <SignInScreen 
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'report':
        return selectedBacktestForReport ? (
          <ReportScreen 
            backtest={selectedBacktestForReport}
            onBack={() => setCurrentView('dashboard')} 
          />
        ) : null;
      case 'strategy-view':
        return selectedStrategyForView ? (
          <StrategyViewScreen 
            strategy={selectedStrategyForView}
            onBack={() => setCurrentView('dashboard')} 
          />
        ) : null;
      case 'strategies':
        return (
          <StrategyLibrary 
            onBack={() => setCurrentView('dashboard')}
            onRunStrategy={(strategy, symbol) => {
              console.log('Running strategy:', strategy.name, 'for', symbol);
              setCurrentView('dashboard');
            }}
          />
        );
      case 'comparison':
        return (
          <ComparisonScreen 
            selectedBacktests={selectedBacktestsForComparison}
            onBack={() => setCurrentView('library')} 
          />
        );
      case 'watchlists':
        return (
          <WatchlistManagement
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'library':
        return (
          <TabbedLibrary 
            onBack={() => setCurrentView('dashboard')}
            onCompareSelected={handleCompareSelected}
            initialSearchTerm={librarySearchTerm}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            onNavigateToLibrary={(searchTerm?: string) => {
              setLibrarySearchTerm(searchTerm || '');
              setCurrentView('library');
            }}
            onNavigateToWatchlistManagement={() => setCurrentView('watchlists')}
            onNavigateToStrategies={() => setCurrentView('strategies')}
            onNavigateToReport={handleNavigateToReport}
            onNavigateToStrategyView={handleNavigateToStrategyView}
            onNavigateToSignIn={handleNavigateToSignIn}
            onNavigateToSettings={handleNavigateToSettings}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <FontSizeProvider>
        <StrategyProvider>
          <WatchlistProvider>
            <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
              {renderCurrentView()}
            </div>
          </WatchlistProvider>
        </StrategyProvider>
      </FontSizeProvider>
    </ThemeProvider>
  );
}

export default App;
import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { StrategyProvider } from './contexts/StrategyContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import Dashboard from './components/Dashboard';
import Library from './components/Library';
import ComparisonScreen from './components/ComparisonScreen';
import StrategyLibrary from './components/StrategyLibrary';
import ReportScreen from './components/ReportScreen';
import SignInScreen from './components/SignInScreen';

type CurrentView = 'dashboard' | 'library' | 'comparison' | 'strategies' | 'report' | 'signin';

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
  };
}

function App() {
  const [currentView, setCurrentView] = useState<CurrentView>('dashboard');
  const [selectedBacktestsForComparison, setSelectedBacktestsForComparison] = useState<BacktestData[]>([]);
  const [selectedBacktestForReport, setSelectedBacktestForReport] = useState<BacktestReportData | null>(null);

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

  const renderCurrentView = () => {
    switch (currentView) {
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
      case 'library':
        return (
          <Library 
            onBack={() => setCurrentView('dashboard')}
            onCompareSelected={handleCompareSelected}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            onNavigateToLibrary={() => setCurrentView('library')}
            onNavigateToStrategies={() => setCurrentView('strategies')}
            onNavigateToReport={handleNavigateToReport}
            onNavigateToSignIn={handleNavigateToSignIn}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <StrategyProvider>
        <WatchlistProvider>
          <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {renderCurrentView()}
          </div>
        </WatchlistProvider>
      </StrategyProvider>
    </ThemeProvider>
  );
}

export default App;
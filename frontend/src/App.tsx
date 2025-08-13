import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { StrategyProvider } from './contexts/StrategyContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { UserProvider } from './contexts/UserContext';
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
import UserProfileScreen from './components/UserProfileScreen';
import AccountSettingsScreen from './components/AccountSettingsScreen';
import TradingPreferencesScreen from './components/TradingPreferencesScreen';
import NotificationSettingsScreen from './components/NotificationSettingsScreen';
import DataSettingsScreen from './components/DataSettingsScreen';
import DisplaySettingsScreen from './components/DisplaySettingsScreen';

type CurrentView = 'dashboard' | 'library' | 'comparison' | 'strategies' | 'report' | 'strategy-view' | 'signin' | 'watchlists' | 'settings' | 'profile' | 'account-settings' | 'trading-preferences' | 'notification-settings' | 'data-settings' | 'display-settings';

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

  const handleNavigateToProfile = () => {
    setCurrentView('profile');
  };

  const handleNavigateToAccountSettings = () => {
    setCurrentView('account-settings');
  };

  const handleNavigateToTradingPreferences = () => {
    setCurrentView('trading-preferences');
  };

  const handleNavigateToNotificationSettings = () => {
    setCurrentView('notification-settings');
  };

  const handleNavigateToDataSettings = () => {
    setCurrentView('data-settings');
  };

  const handleNavigateToDisplaySettings = () => {
    setCurrentView('display-settings');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'settings':
        return (
          <SettingsScreen 
            onBack={() => setCurrentView('dashboard')}
            onAccountSettingsClick={handleNavigateToAccountSettings}
            onTradingPreferencesClick={handleNavigateToTradingPreferences}
            onProfileClick={handleNavigateToProfile}
            onNotificationSettingsClick={handleNavigateToNotificationSettings}
            onDataSettingsClick={handleNavigateToDataSettings}
            onDisplaySettingsClick={handleNavigateToDisplaySettings}
          />
        );
      case 'profile':
        return (
          <UserProfileScreen 
            onBack={() => setCurrentView('dashboard')}
            onAccountSettingsClick={handleNavigateToAccountSettings}
            onTradingPreferencesClick={handleNavigateToTradingPreferences}
            onSettingsClick={handleNavigateToSettings}
          />
        );
      case 'account-settings':
        return (
          <AccountSettingsScreen 
            onBack={() => setCurrentView('profile')}
          />
        );
      case 'trading-preferences':
        return (
          <TradingPreferencesScreen 
            onBack={() => setCurrentView('profile')}
          />
        );
      case 'notification-settings':
        return (
          <NotificationSettingsScreen 
            onBack={() => setCurrentView('settings')}
          />
        );
      case 'data-settings':
        return (
          <DataSettingsScreen 
            onBack={() => setCurrentView('settings')}
          />
        );
      case 'display-settings':
        return (
          <DisplaySettingsScreen 
            onBack={() => setCurrentView('settings')}
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
              // Convert StrategyTemplate to RecentRun for navigation
              const recentRun: RecentRun = {
                id: `run-${Date.now()}`,
                name: strategy.name,
                version: 'v1.0',
                symbol: symbol,
                timeframe: strategy.timeframe,
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                totalReturn: 15.2,
                winRate: 68.4,
                sharpe: 1.84,
                maxDrawdown: -8.2,
                totalTrades: 127,
                avgHoldTime: '3.2d',
                profitFactor: 1.45,
                calmarRatio: 0.92,
                completedAt: new Date().toISOString(),
                keynote: `Running ${strategy.name} on ${symbol}`,
                strategySettings: {
                  atrPeriod: strategy.atrPeriod,
                  atrMultiplier: strategy.atrMultiplier,
                  cvdThreshold: strategy.cvdThreshold,
                  rsiPeriod: 14,
                  rsiOversold: 30,
                  rsiOverbought: 70,
                  stopLoss: 2.0,
                  takeProfit: 6.0,
                  positionSize: 1000,
                  maxPositions: 5
                },
                periodData: {
                  '1D': { totalReturn: 15.2, winRate: 68.4, sharpe: 1.84, maxDrawdown: -8.2, totalTrades: 127, avgHoldTime: '3.2d', profitFactor: 1.45, calmarRatio: 0.92 },
                  '1W': { totalReturn: 18.7, winRate: 72.1, sharpe: 2.02, maxDrawdown: -6.8, totalTrades: 89, avgHoldTime: '2.8d', profitFactor: 1.62, calmarRatio: 1.08 },
                  '1M': { totalReturn: 24.3, winRate: 69.8, sharpe: 1.96, maxDrawdown: -9.1, totalTrades: 156, avgHoldTime: '4.1d', profitFactor: 1.58, calmarRatio: 0.95 }
                }
              };
              handleNavigateToStrategyView(recentRun);
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
            onNavigateToProfile={handleNavigateToProfile}
          />
        );
    }
  };

  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { ArrowLeft, X, List, MoreHorizontal } from 'lucide-react';
import Library from './Library';
import ReportScreen from './ReportScreen';
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
  type: 'library' | 'report';
  title: string;
  data?: BacktestReportData;
}

interface TabbedLibraryProps {
  onBack: () => void;
  onCompareSelected?: (selectedIds: string[]) => void;
  initialSearchTerm?: string;
}

const TabbedLibrary: React.FC<TabbedLibraryProps> = ({ onBack, onCompareSelected, initialSearchTerm }) => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'library', type: 'library', title: 'Library' }
  ]);
  const [activeTabId, setActiveTabId] = useState('library');
  const [tabOverflowMenuOpen, setTabOverflowMenuOpen] = useState(false);

  const MAX_VISIBLE_TABS = 5;

  // Convert Library's BacktestData to BacktestReportData
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

  const convertToReportData = (libraryData: LibraryBacktestData): BacktestReportData => ({
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
    totalTrades: 1247, // Default values - could be enhanced
    avgHoldTime: '3.2d',
    profitFactor: 1.65,
    calmarRatio: 2.1,
    conflictLog: [
      'CVD negative but ATR held: +5% net',
      'Phase reversal detected during position: Adjusted size'
    ],
    keynote: libraryData.keynote,
    chartData: {
      equity: [],
      drawdown: [],
      trades: [],
      ...generateMockStageData(libraryData.symbol, '2024-01-01', libraryData.date, 150)
    }
  });


  const handleOpenReport = (libraryBacktest: LibraryBacktestData) => {
    const backtest = convertToReportData(libraryBacktest);
    const existingTab = tabs.find(tab => tab.type === 'report' && tab.data?.id === backtest.id);
    
    if (existingTab) {
      // Switch to existing tab
      setActiveTabId(existingTab.id);
    } else {
      // Create new tab
      const newTab: Tab = {
        id: `report-${backtest.id}`,
        type: 'report',
        title: `${backtest.name} ${backtest.version}`,
        data: backtest
      };

      // If we're at max tabs, remove the oldest report tab (but keep library)
      let updatedTabs = [...tabs];
      const reportTabs = tabs.filter(tab => tab.type === 'report');
      
      if (reportTabs.length >= MAX_VISIBLE_TABS - 1) {
        const oldestReportTab = reportTabs[0];
        updatedTabs = updatedTabs.filter(tab => tab.id !== oldestReportTab.id);
      }

      updatedTabs.push(newTab);
      setTabs(updatedTabs);
      setActiveTabId(newTab.id);
    }
  };

  const handleCloseTab = (tabId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (tabId === 'library') return; // Can't close library tab

    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);

    // If we closed the active tab, switch to library or previous tab
    if (activeTabId === tabId) {
      const remainingTabs = updatedTabs.filter(tab => tab.id !== tabId);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : 'library');
    }

    setTabOverflowMenuOpen(false);
  };

  const handleCloseAllReportTabs = () => {
    setTabs(tabs.filter(tab => tab.type === 'library'));
    setActiveTabId('library');
    setTabOverflowMenuOpen(false);
  };

  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  const visibleTabs = tabs.slice(0, MAX_VISIBLE_TABS);
  const overflowTabs = tabs.slice(MAX_VISIBLE_TABS);
  const activeTab = tabs.find(tab => tab.id === activeTabId);

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
              {activeTab?.type === 'library' ? 'Backtest Library' : 'Report View'}
            </h1>
          </div>

          {/* Close All Tabs Button (when report tabs exist) */}
          {tabs.some(tab => tab.type === 'report') && (
            <button
              onClick={handleCloseAllReportTabs}
              className="px-3 py-1.5 text-sm border rounded transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              style={{
                borderColor: '#ef4444',
                color: '#ef4444',
                backgroundColor: 'var(--surface)'
              }}
            >
              Close All Reports
            </button>
          )}
        </div>

        {/* Tab Bar */}
        {tabs.length > 1 && (
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
        {activeTab?.type === 'library' ? (
          <div className="max-w-7xl mx-auto">
            <Library 
              onBack={onBack} 
              onCompareSelected={onCompareSelected}
              onReportOpen={handleOpenReport}
              initialSearchTerm={initialSearchTerm}
            />
          </div>
        ) : activeTab?.type === 'report' && activeTab.data ? (
          <ReportScreen 
            backtest={activeTab.data}
            onBack={() => setActiveTabId('library')}
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
    </div>
  );
};

export default TabbedLibrary;
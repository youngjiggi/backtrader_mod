import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Target, BarChart3, ExternalLink, LayoutGrid } from 'lucide-react';
import ViewToggle from './ViewToggle';
import FilterModal, { FilterOptions } from './FilterModal';
import SortableHeader from './SortableHeader';
import InlineEditableTitle from './InlineEditableTitle';
import TagEditor from './TagEditor';

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
  isUnread: boolean;
  keynote: string;
  tags: string[];
}

interface LibraryProps {
  onBack: () => void;
  onCompareSelected?: (selectedIds: string[]) => void;
  onReportOpen?: (backtest: BacktestData) => void;
  onOpenSelected?: (backtests: BacktestData[]) => void;
  onOpenInComparisonView?: (backtests: BacktestData[], layoutMode?: string) => void;
  onOpenInSplitView?: (backtests: BacktestData[]) => void;
  initialSearchTerm?: string;
}

const Library: React.FC<LibraryProps> = ({ onCompareSelected, onReportOpen, onOpenSelected, onOpenInComparisonView, onOpenInSplitView, initialSearchTerm }) => {
  const [view, setView] = useState<'list' | 'thumbnail'>('list');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [filterTimeframe, setFilterTimeframe] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });
  
  const [advancedFilters, setAdvancedFilters] = useState<FilterOptions>({
    dateRange: { start: '', end: '' },
    winRateMin: 0,
    sharpeMin: 0,
    returnMin: -100,
    symbols: [],
    timeframes: []
  });

  // Sample data
  const [backtests, setBacktests] = useState<BacktestData[]>([
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
      isUnread: true,
      keynote: 'Strong performance in trending markets with improved exit signals',
      tags: ['breakout', 'atr', 'trending', 'momentum']
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
      isUnread: false,
      keynote: 'Excellent reversal detection, needs volume confirmation',
      tags: ['rsi', 'divergence', 'reversal', 'oversold']
    },
    {
      id: '3',
      name: 'Moving Average Cross',
      version: 'v3.0',
      date: '2025-01-23',
      symbol: 'SPY',
      timeframe: '1d',
      winRate: 58.9,
      sharpe: 1.45,
      totalReturn: 18.3,
      maxDrawdown: -6.8,
      isUnread: true,
      keynote: 'Stable returns with low drawdown, good for risk-averse strategies',
      tags: ['moving-average', 'cross', 'trend-following', 'conservative']
    },
    {
      id: '4',
      name: 'Phase Reversal Detection',
      version: 'v1.0',
      date: '2025-01-22',
      symbol: 'QQQ',
      timeframe: '1h',
      winRate: 64.7,
      sharpe: 1.67,
      totalReturn: 22.1,
      maxDrawdown: -9.5,
      isUnread: false,
      keynote: 'Promising early results, requires more testing on different market conditions',
      tags: ['phase', 'reversal', 'experimental', 'scalping']
    },
    {
      id: '5',
      name: 'CVD Momentum Strategy',
      version: 'v2.5',
      date: '2025-01-21',
      symbol: 'BTC',
      timeframe: '15m',
      winRate: 61.3,
      sharpe: 1.92,
      totalReturn: 28.4,
      maxDrawdown: -15.2,
      isUnread: false,
      keynote: 'High volatility strategy, works well in crypto markets',
      tags: ['cvd', 'momentum', 'crypto', 'high-frequency']
    }
  ]);

  // Helper functions
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  const handleSelectItem = (id: string, index?: number, event?: React.MouseEvent) => {
    if (event?.shiftKey && lastSelectedIndex !== -1 && index !== undefined) {
      // Range selection with Shift+click
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = sortedBacktests.slice(start, end + 1).map(item => item.id);
      
      setSelectedItems(prev => {
        const newSelection = [...prev];
        rangeIds.forEach(rangeId => {
          if (!newSelection.includes(rangeId)) {
            newSelection.push(rangeId);
          }
        });
        return newSelection;
      });
    } else if (event?.ctrlKey || event?.metaKey) {
      // Individual toggle with Ctrl/Cmd+click
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      // Single selection
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    }
    
    if (index !== undefined) {
      setLastSelectedIndex(index);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredBacktests.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredBacktests.map(item => item.id));
    }
  };

  const handleUpdateBacktestName = (backtestId: string, newName: string) => {
    setBacktests(prev => 
      prev.map(bt => 
        bt.id === backtestId 
          ? { ...bt, name: newName }
          : bt
      )
    );
  };

  const handleUpdateBacktestTags = (backtestId: string, newTags: string[]) => {
    setBacktests(prev => 
      prev.map(bt => 
        bt.id === backtestId 
          ? { ...bt, tags: newTags }
          : bt
      )
    );
  };

  const applyAdvancedFilters = (backtest: BacktestData) => {
    // Debug advanced filters
    console.log('Advanced filters:', advancedFilters);
    
    // Date range filter
    if (advancedFilters.dateRange.start && new Date(backtest.date) < new Date(advancedFilters.dateRange.start)) {
      console.log(`${backtest.name} filtered out by start date`);
      return false;
    }
    if (advancedFilters.dateRange.end && new Date(backtest.date) > new Date(advancedFilters.dateRange.end)) {
      console.log(`${backtest.name} filtered out by end date`);
      return false;
    }
    
    // Performance filters
    if (backtest.winRate < advancedFilters.winRateMin) {
      console.log(`${backtest.name} filtered out by winRate: ${backtest.winRate} < ${advancedFilters.winRateMin}`);
      return false;
    }
    if (backtest.sharpe < advancedFilters.sharpeMin) {
      console.log(`${backtest.name} filtered out by sharpe: ${backtest.sharpe} < ${advancedFilters.sharpeMin}`);
      return false;
    }
    if (backtest.totalReturn < advancedFilters.returnMin) {
      console.log(`${backtest.name} filtered out by return: ${backtest.totalReturn} < ${advancedFilters.returnMin}`);
      return false;
    }
    
    // Timeframe filter
    if (advancedFilters.timeframes.length > 0 && !advancedFilters.timeframes.includes(backtest.timeframe)) {
      console.log(`${backtest.name} filtered out by timeframes`);
      return false;
    }
    
    return true;
  };

  const filteredBacktests = backtests.filter(backtest => {
    const matchesSearch = backtest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backtest.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backtest.keynote.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backtest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTimeframe = filterTimeframe === 'all' || backtest.timeframe === filterTimeframe;
    const matchesAdvancedFilters = applyAdvancedFilters(backtest);
    
    // Debug logging
    if (searchTerm) {
      console.log(`Search term: "${searchTerm}"`);
      console.log(`Backtest: ${backtest.name} - matches search: ${matchesSearch}, matches timeframe: ${matchesTimeframe}, matches advanced: ${matchesAdvancedFilters}`);
    }
    
    return matchesSearch && matchesTimeframe && matchesAdvancedFilters;
  });

  // Apply sorting
  const sortedBacktests = [...filteredBacktests].sort((a, b) => {
    if (!sortConfig.direction) return 0;
    
    let aValue: any = a[sortConfig.key as keyof BacktestData];
    let bValue: any = b[sortConfig.key as keyof BacktestData];
    
    // Handle different data types
    if (sortConfig.key === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            <th className="w-16 py-3 px-4">
              <div className="flex items-center justify-center">
                <label className="flex items-center justify-center w-8 h-8 rounded-lg border-2 cursor-pointer hover:bg-opacity-50 transition-all"
                  style={{ 
                    borderColor: selectedItems.length === sortedBacktests.length && sortedBacktests.length > 0 ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: selectedItems.length === sortedBacktests.length && sortedBacktests.length > 0 ? 'var(--accent)' : 'transparent'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.length === sortedBacktests.length && sortedBacktests.length > 0}
                    onChange={handleSelectAll}
                    className="sr-only"
                  />
                  {selectedItems.length === sortedBacktests.length && sortedBacktests.length > 0 && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedItems.length > 0 && selectedItems.length < sortedBacktests.length && (
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: 'var(--accent)' }}></div>
                  )}
                </label>
              </div>
            </th>
            <SortableHeader
              sortKey="name"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Strategy Name
            </SortableHeader>
            <SortableHeader
              sortKey="symbol"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Symbol
            </SortableHeader>
            <SortableHeader
              sortKey="date"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Date
            </SortableHeader>
            <SortableHeader
              sortKey="winRate"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Win Rate
            </SortableHeader>
            <SortableHeader
              sortKey="sharpe"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Sharpe
            </SortableHeader>
            <SortableHeader
              sortKey="totalReturn"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Return
            </SortableHeader>
            <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Keynote
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedBacktests.map((backtest, index) => {
            const isSelected = selectedItems.includes(backtest.id);
            return (
              <tr
                key={backtest.id}
                className={`border-b hover:bg-opacity-75 transition-all duration-200 group ${
                  isSelected 
                    ? 'ring-2 ring-opacity-50' 
                    : 'hover:bg-opacity-30'
                }`}
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  ringColor: isSelected ? 'var(--accent)' : 'transparent'
                }}
                onClick={(e) => {
                  // Don't trigger selection if clicking on action buttons or links
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('a')) {
                    handleSelectItem(backtest.id, index, e);
                  }
                }}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center">
                    <label className="flex items-center justify-center w-6 h-6 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ 
                        borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                        backgroundColor: isSelected ? 'var(--accent)' : 'transparent'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectItem(backtest.id, index, e);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by label click
                        className="sr-only"
                      />
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  </div>
                </td>
              <td className="py-4 px-4 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  onReportOpen && onReportOpen(backtest);
                }}
              >
                <div className="flex items-center space-x-3">
                  {backtest.isUnread && (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                      title="Unread"
                    />
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
                    <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {backtest.version}
                    </div>
                    <TagEditor
                      tags={backtest.tags}
                      onTagsChange={(newTags) => handleUpdateBacktestTags(backtest.id, newTags)}
                      className="mb-1"
                    />
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                  {backtest.symbol}
                </span>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {backtest.timeframe}
                </div>
              </td>
              <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {new Date(backtest.date).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <span style={{ color: 'var(--highlight)' }}>
                  {backtest.winRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-4 px-4">
                <span style={{ color: 'var(--highlight)' }}>
                  {backtest.sharpe.toFixed(2)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={backtest.totalReturn > 0 ? 'text-green-500' : 'text-red-500'}>
                  {backtest.totalReturn > 0 ? '+' : ''}{backtest.totalReturn.toFixed(1)}%
                </span>
              </td>
              <td className="py-4 px-4 max-w-xs">
                <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }} title={backtest.keynote}>
                  {backtest.keynote}
                </p>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );

  const ThumbnailView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedBacktests.map((backtest, index) => {
        const isSelected = selectedItems.includes(backtest.id);
        return (
          <div
            key={backtest.id}
            className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer ${
              isSelected ? 'ring-2 ring-opacity-50' : ''
            }`}
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
              ringColor: isSelected ? 'var(--accent)' : 'transparent'
            }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (!target.closest('button') && !target.closest('input')) {
                handleSelectItem(backtest.id, index, e);
              }
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <label className="flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer hover:scale-110 transition-transform"
                    style={{ 
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      backgroundColor: isSelected ? 'var(--accent)' : 'transparent'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectItem(backtest.id, index, e);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by label click
                      className="sr-only"
                    />
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                {backtest.isUnread && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                    title="Unread"
                  />
                )}
                <div className="flex-1">
                  <InlineEditableTitle
                    value={backtest.name}
                    onSave={(newName) => handleUpdateBacktestName(backtest.id, newName)}
                    className="font-semibold"
                    titleStyle={{ color: 'var(--text-primary)' }}
                    placeholder="Backtest name..."
                  />
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                {backtest.version} • {backtest.symbol} • {backtest.timeframe}
              </p>
              <TagEditor
                tags={backtest.tags}
                onTagsChange={(newTags) => handleUpdateBacktestTags(backtest.id, newTags)}
                className="mb-2"
              />
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {new Date(backtest.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Mini Chart Placeholder */}
          <div
            className="h-20 rounded border mb-4 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border)'
            }}
          >
            <BarChart3 size={24} style={{ color: 'var(--highlight)' }} />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Target size={14} style={{ color: 'var(--highlight)' }} />
              <div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
                <div className="font-medium" style={{ color: 'var(--highlight)' }}>
                  {backtest.winRate.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
              <div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Return</div>
                <div className={`font-medium ${backtest.totalReturn > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {backtest.totalReturn > 0 ? '+' : ''}{backtest.totalReturn.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 size={14} style={{ color: 'var(--highlight)' }} />
              <div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
                <div className="font-medium" style={{ color: 'var(--highlight)' }}>
                  {backtest.sharpe.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Max DD</div>
                <div className="font-medium text-red-500">
                  {backtest.maxDrawdown.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Keynote */}
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {backtest.keynote}
          </p>
        </div>
      );
      })}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Controls */}
      <div className="px-6 pt-6">
        <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Backtest Library
        </h2>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Filters and Timeframe - Tesla optimized left positioning */}
          <div className="flex items-center space-x-4">
            <select
              value={filterTimeframe}
              onChange={(e) => setFilterTimeframe(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 min-h-[48px]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            >
              <option value="all">All Timeframes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">1 Day</option>
            </select>

            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-3 border rounded-lg transition-colors hover:bg-opacity-80 min-h-[48px]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search strategies, symbols, keynotes..."
              value={searchTerm}
              onChange={(e) => {
                console.log('Search input changed to:', e.target.value);
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors min-h-[48px]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            />
          </div>
        </div>

        {/* Tesla-Optimized: Action Buttons on Left + Results Count */}
        <div className="flex items-center space-x-4 mb-4">
          {/* Action Buttons - Tesla Left-Side Positioning */}
          <div className="flex items-center space-x-3">
            {/* View Toggle - Always visible, most frequently used */}
            <ViewToggle view={view} onViewChange={setView} />
            
            {/* Selection Action Buttons - Only when items selected */}
            {selectedItems.length > 0 && (
              <>
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-opacity-80 flex items-center whitespace-nowrap"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface)'
                }}
                onClick={() => {
                  const selectedBacktests = sortedBacktests.filter(bt => selectedItems.includes(bt.id));
                  if (onOpenSelected) {
                    onOpenSelected(selectedBacktests);
                  } else {
                    console.log('Open selected items:', selectedBacktests);
                  }
                }}
                title="Open all selected strategies in individual tabs"
              >
                <ExternalLink size={16} className="mr-1" />
                Open Selected
              </button>
              
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-opacity-80 flex items-center whitespace-nowrap"
                style={{
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                  backgroundColor: 'transparent'
                }}
                onClick={() => {
                  const selectedBacktests = sortedBacktests.filter(bt => selectedItems.includes(bt.id));
                  if (onOpenInSplitView) {
                    onOpenInSplitView(selectedBacktests);
                  } else {
                    console.log('Open in split view:', selectedBacktests);
                  }
                }}
                title="Open selected strategies in split view (grid layout with shared panels)"
              >
                <LayoutGrid size={16} className="mr-1" />
                Split View
              </button>
              
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
                onClick={() => {
                  const selectedBacktests = sortedBacktests.filter(bt => selectedItems.includes(bt.id));
                  if (onOpenInComparisonView) {
                    onOpenInComparisonView(selectedBacktests);
                  } else if (onCompareSelected) {
                    onCompareSelected(selectedItems);
                  } else {
                    console.log('Compare selected items:', selectedItems);
                  }
                }}
                title="Compare selected strategies side by side"
              >
                <BarChart3 size={16} className="mr-1" />
                Compare ({selectedItems.length})
              </button>
              </>
            )}
          </div>

          {/* Results Count - Moved to right side */}
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing {sortedBacktests.length} of {backtests.length} strategies
            {searchTerm && (
              <span style={{ color: 'var(--accent)' }}>
                {' '}(searching for: "{searchTerm}")
              </span>
            )}
            {selectedItems.length > 0 && (
              <span className="text-sm font-medium ml-2" style={{ color: 'var(--text-primary)' }}>
                • {selectedItems.length} selected
              </span>
            )}
          </p>
        </div>

        {/* Content */}
        <div
          className="rounded-lg border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="p-6">
            {view === 'list' ? <ListView /> : <ThumbnailView />}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={setAdvancedFilters}
        currentFilters={advancedFilters}
      />
    </div>
  );
};

export default Library;
import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Settings, TrendingUp, BarChart3, Activity, Target, DollarSign, Calendar, ChevronDown, ChevronUp, Play, Cog, Users, TrendingDown, AlertTriangle, Zap, LineChart, PieChart, Brain, CheckCircle, XCircle, Clock, GripVertical, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen, FileText, Shield, Pin, Star, Archive, Download, Copy } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import StageAnalysisChart from './StageAnalysisChart';
import TradeJournal from './TradeJournal';
import AccountBalanceChart from './AccountBalanceChart';
import StrategyDefinition from './StrategyDefinition';
import EnhancedPerformanceMetrics from './EnhancedPerformanceMetrics';

interface StrategyViewScreenProps {
  strategy: RecentRun;
  onBack: () => void;
  chartOnly?: boolean;
  onChartClick?: () => void;
  isActive?: boolean;
}

const StrategyViewScreen: React.FC<StrategyViewScreenProps> = ({ 
  strategy, 
  onBack, 
  chartOnly = false, 
  onChartClick, 
  isActive = false 
}) => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['performance', 'account', 'definition']));
  const [viewMode, setViewMode] = useState<'single' | 'portfolio'>('single');
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');
  
  // Panel state management
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(300);
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(true);
  
  // Resize refs
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);
  const bottomResizeRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<string | null>(null);

  const toggleAccordion = (accordionId: string) => {
    setExpandedAccordions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(accordionId)) {
        newSet.delete(accordionId);
      } else {
        newSet.add(accordionId);
      }
      return newSet;
    });
  };

  // Resize handlers
  const handleMouseDown = useCallback((panel: string, e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = panel;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = panel === 'bottom' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;

    if (isResizing.current === 'left') {
      const newWidth = Math.max(200, Math.min(600, e.clientX));
      setLeftPanelWidth(newWidth);
    } else if (isResizing.current === 'right') {
      const newWidth = Math.max(200, Math.min(600, window.innerWidth - e.clientX));
      setRightPanelWidth(newWidth);
    } else if (isResizing.current === 'bottom') {
      const newHeight = Math.max(200, Math.min(500, window.innerHeight - e.clientY));
      setBottomPanelHeight(newHeight);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizing.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  // Mock chart data generation for the strategy
  const generateMockChartData = () => {
    const priceData = Array.from({ length: 100 }, (_, i) => ({
      date: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      open: 100 + Math.random() * 50,
      high: 110 + Math.random() * 60,
      low: 90 + Math.random() * 40,
      close: 105 + Math.random() * 45,
      volume: Math.floor(1000000 + Math.random() * 5000000)
    }));

    return {
      priceData,
      movingAverage30W: priceData.map(p => ({ date: p.date, value: p.close * 0.95 })),
      stageAnalysis: {
        stages: priceData.map((p, i) => ({
          date: p.date,
          stage: (Math.floor(i / 25) + 1) as 1 | 2 | 3 | 4,
          sataScore: 5 + Math.random() * 5
        })),
        relativeStrength: priceData.map(p => ({ date: p.date, value: Math.random() * 100 })),
        momentum: priceData.map(p => ({ date: p.date, value: Math.random() * 2 - 1 })),
        stageTransitions: []
      },
      trades: []
    };
  };

  const sidebarTabs = [
    { id: 'portfolio', label: 'Portfolio', icon: Users },
    { id: 'stage', label: 'Stage & SATA', icon: PieChart },
    { id: 'indicators', label: 'Indicators', icon: LineChart },
    { id: 'signalhierarchy', label: 'Signal Hierarchy', icon: Zap },
    { id: 'rules', label: 'Rules', icon: Target },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'history', label: 'History', icon: Calendar }
  ];

  const performanceMetrics = [
    { label: 'Total Return', value: `${strategy.totalReturn >= 0 ? '+' : ''}${strategy.totalReturn.toFixed(2)}%`, color: strategy.totalReturn >= 0 ? 'var(--highlight)' : '#ef4444' },
    { label: 'Win Rate', value: `${strategy.winRate.toFixed(1)}%`, color: 'var(--text-primary)' },
    { label: 'Sharpe Ratio', value: strategy.sharpe.toFixed(2), color: 'var(--text-primary)' },
    { label: 'Max Drawdown', value: `${strategy.maxDrawdown.toFixed(1)}%`, color: '#ef4444' },
    { label: 'Total Trades', value: strategy.totalTrades.toString(), color: 'var(--text-primary)' },
    { label: 'Avg Hold Time', value: strategy.avgHoldTime, color: 'var(--text-primary)' },
    { label: 'Profit Factor', value: strategy.profitFactor.toFixed(2), color: 'var(--text-primary)' },
    { label: 'Calmar Ratio', value: strategy.calmarRatio.toFixed(2), color: 'var(--text-primary)' }
  ];

  // Chart-only mode for split view - minimal display without interactive elements
  if (chartOnly) {
    return (
      <div 
        className={`h-full flex flex-col border rounded-lg cursor-pointer transition-all duration-200 ${
          isActive ? 'ring-2 ring-opacity-75' : 'hover:shadow-md'
        }`}
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: isActive ? 'var(--accent)' : 'var(--border)',
          ringColor: isActive ? 'var(--accent)' : 'transparent'
        }}
        onClick={onChartClick}
      >
        {/* Minimal Chart Header - No interactive elements */}
        <div 
          className={`px-4 py-2 border-b transition-colors ${
            isActive ? 'bg-opacity-10' : ''
          }`}
          style={{ 
            borderColor: 'var(--border)',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <BarChart3 
                  size={16} 
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-secondary)' }} 
                />
                <span 
                  className="font-semibold text-sm"
                  style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}
                >
                  {strategy.name} {strategy.version}
                </span>
              </div>
              <span 
                className="text-xs px-2 py-1 rounded"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-secondary)'
                }}
              >
                {strategy.symbol}
              </span>
            </div>
            
            {/* Key Metrics - Static display only */}
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <TrendingUp size={12} style={{ color: 'var(--text-secondary)' }} />
                <span 
                  className="font-medium"
                  style={{ color: strategy.totalReturn >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {strategy.totalReturn >= 0 ? '+' : ''}{strategy.totalReturn.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Target size={12} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {strategy.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="flex-1 p-4">
          <div 
            className="h-full rounded border flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border)'
            }}
          >
            {/* Chart Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id={`grid-${strategy.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path 
                      d="M 20 0 L 0 0 0 20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="0.5"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${strategy.id})`} />
              </svg>
            </div>

            {/* Chart Content */}
            <div className="relative z-10 w-full h-full">
              <StageAnalysisChart
                data={generateMockChartData()}
                symbol={strategy.symbol}
                selectedTimeframe={strategy.timeframe}
                showBenchmark={false}
              />
            </div>

            {/* Active Indicator */}
            {isActive && (
              <div className="absolute top-2 right-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                  title="Active strategy"
                />
              </div>
            )}

            {/* Click to Focus Indicator - Non-interactive overlay */}
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-5 transition-all pointer-events-none">
                <div 
                  className="text-xs px-3 py-1 rounded-full border opacity-0 hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--accent)',
                    color: 'var(--accent)'
                  }}
                >
                  Click to focus
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Below Chart */}
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
              <div 
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {strategy.sharpe.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div style={{ color: 'var(--text-secondary)' }}>Max DD</div>
              <div 
                className="font-medium"
                style={{ color: '#ef4444' }}
              >
                {strategy.maxDrawdown.toFixed(1)}%
              </div>
            </div>
            <div className="text-center">
              <div style={{ color: 'var(--text-secondary)' }}>Trades</div>
              <div 
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {strategy.totalTrades}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full strategy view mode
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Minimal Header */}
      <div
        className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          
          {/* Enhanced Strategy Info */}
          <div className="flex items-center space-x-6">
            {/* Strategy Name & Version */}
            <div className="flex items-center space-x-3">
              <div>
                <input
                  type="text"
                  value={strategy.name}
                  className="text-xl font-bold bg-transparent border-0 focus:outline-none focus:bg-opacity-10 px-2 py-1 rounded"
                  style={{ color: 'var(--text-primary)' }}
                  readOnly
                />
                <input
                  type="text"
                  value={strategy.version}
                  className="text-sm bg-transparent border-0 focus:outline-none focus:bg-opacity-10 px-2 py-0.5 rounded ml-2"
                  style={{ color: 'var(--text-secondary)' }}
                  readOnly
                />
              </div>
            </div>

            {/* Symbol Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Symbol:</span>
              <select
                value={strategy.symbol}
                readOnly
                className="px-2 py-1 text-sm rounded border bg-transparent"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value={strategy.symbol}>{strategy.symbol}</option>
                <option value="AAPL">AAPL</option>
                <option value="TSLA">TSLA</option>
                <option value="NVDA">NVDA</option>
                <option value="MSFT">MSFT</option>
              </select>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Timeframe:</span>
              <select
                value={strategy.timeframe}
                readOnly
                className="px-2 py-1 text-sm rounded border bg-transparent"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value={strategy.timeframe}>{strategy.timeframe}</option>
              </select>
            </div>

            {/* Period Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Period:</span>
              <div className="flex items-center space-x-1">
                <input
                  type="date"
                  value={strategy.startDate}
                  readOnly
                  className="px-2 py-1 text-xs rounded border bg-transparent"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>to</span>
                <input
                  type="date"
                  value={strategy.endDate}
                  readOnly
                  className="px-2 py-1 text-xs rounded border bg-transparent"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>

            {/* Strategy Notes - Expandable */}
            {strategy.keynote && (
              <div className="relative">
                <button
                  className="px-2 py-1 text-xs rounded border hover:bg-opacity-80 transition-colors"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)'
                  }}
                  title={strategy.keynote}
                >
                  Notes
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('single')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                viewMode === 'single' ? 'font-medium' : ''
              }`}
              style={{
                backgroundColor: viewMode === 'single' ? 'var(--accent)' : 'var(--surface)',
                color: viewMode === 'single' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: `1px solid ${viewMode === 'single' ? 'var(--accent)' : 'var(--border)'}`
              }}
            >
              Single Asset
            </button>
            <button
              onClick={() => setViewMode('portfolio')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                viewMode === 'portfolio' ? 'font-medium' : ''
              }`}
              style={{
                backgroundColor: viewMode === 'portfolio' ? 'var(--accent)' : 'var(--surface)',
                color: viewMode === 'portfolio' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: `1px solid ${viewMode === 'portfolio' ? 'var(--accent)' : 'var(--border)'}`
              }}
            >
              Portfolio
            </button>
          </div>

          {/* Benchmark Selector */}
          <select
            value={selectedBenchmark}
            onChange={(e) => setSelectedBenchmark(e.target.value)}
            className="px-3 py-1.5 text-sm rounded border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="SPY">vs SPY</option>
            <option value="QQQ">vs QQQ</option>
            <option value="VTI">vs VTI</option>
            <option value="BND">vs BND</option>
          </select>

          {/* Panel Toggle Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setLeftPanelVisible(!leftPanelVisible)}
              className="p-1.5 rounded border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: leftPanelVisible ? 'var(--accent)' : 'var(--surface)',
                borderColor: 'var(--border)',
                color: leftPanelVisible ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              title={leftPanelVisible ? 'Hide Left Panel' : 'Show Left Panel'}
            >
              {leftPanelVisible ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
            </button>
            <button
              onClick={() => setRightPanelVisible(!rightPanelVisible)}
              className="p-1.5 rounded border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: rightPanelVisible ? 'var(--accent)' : 'var(--surface)',
                borderColor: 'var(--border)',
                color: rightPanelVisible ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              title={rightPanelVisible ? 'Hide Right Panel' : 'Show Right Panel'}
            >
              {rightPanelVisible ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
            </button>
            <button
              onClick={() => setBottomPanelVisible(!bottomPanelVisible)}
              className="p-1.5 rounded border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: bottomPanelVisible ? 'var(--accent)' : 'var(--surface)',
                borderColor: 'var(--border)',
                color: bottomPanelVisible ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              title={bottomPanelVisible ? 'Hide Bottom Panel' : 'Show Bottom Panel'}
            >
              {bottomPanelVisible ? <PanelBottomClose size={14} /> : <PanelBottomOpen size={14} />}
            </button>
          </div>

          {/* Action Buttons */}
          <button
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            title="Configure Strategy"
          >
            <Cog size={16} />
            <span className="text-sm">Configure</span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
            title={viewMode === 'portfolio' ? 'Run Portfolio Test' : 'Run Backtest'}
          >
            <Play size={16} />
            <span className="text-sm">{viewMode === 'portfolio' ? 'Portfolio Test' : 'Run Test'}</span>
          </button>

          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              strategy.totalReturn >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
            style={{
              backgroundColor: strategy.totalReturn >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}
          >
            {strategy.totalReturn >= 0 ? '+' : ''}{strategy.totalReturn.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        {leftPanelVisible && (
          <div className="relative flex">
            <div
              className="border-r flex flex-col"
              style={{
                width: `${leftPanelWidth}px`,
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
          {/* Sidebar Tabs */}
          <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-1">
              {sidebarTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id ? 'ring-2' : ''
                    }`}
                    style={{
                      backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                      color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Portfolio Configuration
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Define the assets you want to trade and manage your portfolio allocation.
                  </p>
                </div>

                {/* Buy Watchlist */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Target size={16} />
                    <span>Buy Watchlist</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add ticker symbol..."
                        className="flex-1 px-3 py-2 text-sm border rounded"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <button
                        className="px-4 py-2 text-sm rounded transition-colors"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--bg-primary)'
                        }}
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Current Watchlist */}
                    <div className="space-y-2">
                      {[strategy.symbol, 'AAPL', 'TSLA', 'NVDA'].filter((symbol, index, arr) => arr.indexOf(symbol) === index).map((symbol, index) => (
                        <div key={`watchlist-${symbol}`} className="flex items-center justify-between p-2 rounded border" 
                          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{symbol}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${symbol === strategy.symbol ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {symbol === strategy.symbol ? 'Primary' : 'Watchlist'}
                            </span>
                          </div>
                          <button className="text-red-500 hover:bg-red-50 p-1 rounded text-xs">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Existing Portfolio (Pro Feature) */}
                {viewMode === 'portfolio' && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                      <Users size={16} />
                      <span>Existing Portfolio</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">PRO</span>
                    </h4>
                    <div className="space-y-2">
                      {[
                        { symbol: 'AAPL', shares: 100, avgCost: 145.23, entryDate: '2024-01-15', currentPrice: 158.42 },
                        { symbol: 'TSLA', shares: 50, avgCost: 187.65, entryDate: '2024-02-03', currentPrice: 195.18 },
                        { symbol: 'NVDA', shares: 25, avgCost: 425.80, entryDate: '2024-01-28', currentPrice: 448.92 }
                      ].map((position, index) => {
                        const pnl = ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
                        return (
                          <div key={index} className="p-3 rounded border" 
                            style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{position.symbol}</span>
                              <span className={`text-sm font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <div>Shares: {position.shares}</div>
                              <div>Avg: ${position.avgCost}</div>
                              <div>Entry: {position.entryDate}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Portfolio Settings */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Portfolio Settings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Available Cash:</span>
                      <input type="number" value="50000" className="w-24 px-2 py-1 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Max Positions:</span>
                      <input type="number" value="5" className="w-16 px-2 py-1 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Position Size Limit:</span>
                      <div className="flex items-center space-x-1">
                        <input type="number" value="20" className="w-16 px-2 py-1 text-sm border rounded" 
                          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>% of portfolio</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Performance Metrics Configuration
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Select which performance metrics to track and monitor during backtesting.
                  </p>
                </div>

                {/* Return Metrics */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <TrendingUp size={16} />
                    <span>Return Metrics</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Total Return</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Overall strategy performance</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Annualized Return</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yearly compound return rate</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Sharpe Ratio</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Risk-adjusted return measure</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Calmar Ratio</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Return vs maximum drawdown</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Metrics */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Shield size={16} />
                    <span>Risk Analysis Metrics</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Maximum Drawdown</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Largest peak-to-trough decline</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Value at Risk (VaR)</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Maximum expected loss (95% confidence)</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Beta</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Market sensitivity coefficient</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Volatility</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Standard deviation of returns</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trade Metrics */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Target size={16} />
                    <span>Trade Analysis Metrics</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Win Rate</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Percentage of profitable trades</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Profit Factor</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Gross profit / Gross loss</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Average Hold Time</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mean position duration</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Max Consecutive Losses</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Longest losing streak</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Metrics */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 size={16} />
                    <span>Advanced Metrics</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Sortino Ratio</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Downside risk-adjusted return</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Information Ratio</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Active return vs tracking error</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Recovery Factor</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total return / Maximum drawdown</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reporting Options */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <FileText size={16} />
                    <span>Reporting Configuration</span>
                  </h4>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Reporting Frequency:</span>
                        <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Include Benchmark Comparison:</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Export Format:</span>
                        <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                          <option value="pdf">PDF Report</option>
                          <option value="excel">Excel Spreadsheet</option>
                          <option value="csv">CSV Data</option>
                          <option value="json">JSON Data</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'indicators' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Technical Indicators Configuration  
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Configure all technical indicators used in your trading strategy.
                  </p>
                </div>

                {/* Trend Indicators */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <TrendingUp size={16} />
                    <span>Trend Indicators</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Simple Moving Averages</span>
                        <button className="text-xs px-2 py-1 rounded border hover:bg-opacity-50" 
                          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Configure</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>50 SMA:</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>150 SMA:</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>200 SMA:</span>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>VWAP</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>$158.42</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <label className="flex items-center space-x-1">
                          <input type="radio" name="vwap" value="daily" defaultChecked />
                          <span style={{ color: 'var(--text-secondary)' }}>Daily</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input type="radio" name="vwap" value="weekly" />
                          <span style={{ color: 'var(--text-secondary)' }}>Weekly</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input type="radio" name="vwap" value="monthly" />
                          <span style={{ color: 'var(--text-secondary)' }}>Monthly</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Momentum Indicators */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Activity size={16} />
                    <span>Momentum Indicators</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>RSI</span>
                        <span className="text-sm font-medium text-green-600">64.2</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                          <input type="number" value="14" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Overbought:</span>
                          <input type="number" value="70" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Oversold:</span>
                          <input type="number" value="30" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>MACD</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Fast:</span>
                          <input type="number" value="12" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Slow:</span>
                          <input type="number" value="26" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Signal:</span>
                          <input type="number" value="9" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volume Indicators */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 size={16} />
                    <span>Volume Indicators</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Volume Profile</span>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>POC Levels:</span>
                          <input type="number" value="5" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Lookback:</span>
                          <select className="w-16 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <option value="20">20d</option>
                            <option value="50">50d</option>
                            <option value="100">100d</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Turnover Ratio</span>
                        <span className="text-sm font-medium text-blue-600">2.3%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>High Threshold:</span>
                          <input type="number" value="5" step="0.1" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Low Threshold:</span>
                          <input type="number" value="0.5" step="0.1" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Simple Volume</span>
                        <span className="text-sm font-medium text-green-600">Above Avg</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>MA Period:</span>
                          <input type="number" value="20" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Spike Mult:</span>
                          <input type="number" value="2" step="0.1" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>CVD (Cumulative Volume Delta)</span>
                        <span className="text-sm font-medium text-yellow-600">+1.2M</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Threshold:</span>
                          <input type="number" value="0.5" step="0.1" className="w-16 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>OBV (On-Balance Volume)</span>
                        <span className="text-sm font-medium text-green-600">+85.2M</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <TrendingUp size={10} className="text-green-500" />
                          <span className="text-green-500">Trend Confirming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Volatility Indicators */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <AlertTriangle size={16} />
                    <span>Volatility Indicators</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>ATR</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>2.34</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                          <input type="number" value="14" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Multiplier:</span>
                          <input type="number" value="2.0" step="0.1" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Bollinger Bands</span>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                          <input type="number" value="20" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Std Dev:</span>
                          <input type="number" value="2" step="0.1" className="w-12 px-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quickstats' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Quick Stats & SATA Score
                </h3>
                
                {/* SATA Score Section */}
                <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--highlight)' }}>8.2</div>
                  <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>High Probability Setup</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-3 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Stage: 2</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Advancing</div>
                  </div>
                  <div className="text-center p-3 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>ATR: 2.3</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Moderate</div>
                  </div>
                </div>

                {/* SATA Score Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    SATA Score Breakdown
                  </h4>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stage Analysis</span>
                      <span className="font-semibold text-green-600">2.0</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>ATR Context</span>
                      <span className="font-semibold text-orange-600">2.0</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Trend Strength</span>
                      <span className="font-semibold text-green-600">2.5</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>A/D Pressure</span>
                      <span className="font-semibold text-yellow-600">1.7</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signals' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Active Signals & Recommendations
                </h3>
                
                {/* Current Stage */}
                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>Current Stage</h4>
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                    <div>
                      <div className="font-medium text-green-700">Stage 2: Advancing</div>
                      <div className="text-xs text-green-600">Strong uptrend confirmed</div>
                    </div>
                  </div>
                </div>

                {/* Active Signals */}
                <div className="space-y-2 text-sm">
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Active Signals</h4>
                  <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span style={{ color: 'var(--text-primary)' }}>RSI Momentum</span>
                    </div>
                    <span className="text-green-500 font-medium">BUY</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span style={{ color: 'var(--text-primary)' }}>VWAP Support</span>
                    </div>
                    <span className="text-green-500 font-medium">HOLD</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle size={14} className="text-yellow-500" />
                      <span style={{ color: 'var(--text-primary)' }}>CVD Divergence</span>
                    </div>
                    <span className="text-yellow-500 font-medium">WATCH</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-3 text-sm">
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Recommendations</h4>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Primary Action</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Add to position on VWAP pullback. Target: 5% above current levels.</p>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock size={14} style={{ color: 'var(--highlight)' }} />
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Risk Management</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>Set stop-loss at 2.5x ATR below VWAP support level.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Stage & SATA Configuration
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Configure Weinstein stage detection and SATA score calculation parameters.
                  </p>
                </div>

                {/* Current SATA Score Display */}
                <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--highlight)' }}>8.2</div>
                  <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current SATA Score</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>High Probability Setup</div>
                </div>

                {/* SATA Score Breakdown */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>SATA Score Components</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Stage Analysis</span>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current stage weighting</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-green-600">2.0</span>
                        <input type="range" min="0" max="4" step="0.1" value="2.0" className="w-16" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>ATR Context</span>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Volatility consideration</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-orange-600">2.0</span>
                        <input type="range" min="0" max="4" step="0.1" value="2.0" className="w-16" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Trend Strength</span>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Momentum analysis</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-green-600">2.5</span>
                        <input type="range" min="0" max="4" step="0.1" value="2.5" className="w-16" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>A/D Pressure</span>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Accumulation/Distribution</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-yellow-600">1.7</span>
                        <input type="range" min="0" max="4" step="0.1" value="1.7" className="w-16" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage Detection Settings */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Stage Detection Settings</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Moving Average Period:</span>
                      <div className="flex items-center space-x-2">
                        <input type="number" value="30" className="w-16 px-2 py-1 text-sm border rounded" 
                          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>weeks</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stage Transition Sensitivity:</span>
                      <select className="px-2 py-1 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Minimum Stage Duration:</span>
                      <div className="flex items-center space-x-2">
                        <input type="number" value="5" className="w-16 px-2 py-1 text-sm border rounded" 
                          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Stage Visual */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Current Stage Analysis</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)' }}>
                      <div className="text-sm font-medium text-gray-600">Stage 1</div>
                      <div className="text-xs text-gray-500">Basing</div>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.5)' }}>
                      <div className="text-sm font-medium text-green-700">Stage 2</div>
                      <div className="text-xs text-green-600">Advancing ✓</div>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)' }}>
                      <div className="text-sm font-medium text-gray-600">Stage 3</div>
                      <div className="text-xs text-gray-500">Topping</div>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)' }}>
                      <div className="text-sm font-medium text-gray-600">Stage 4</div>
                      <div className="text-xs text-gray-500">Declining</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Stage 2 Characteristics</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Price above rising 30-week MA</li>
                      <li>• Strong uptrend with higher highs</li>
                      <li>• RSI 50-80 range</li>
                      <li>• Volume confirming moves</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'portfolio' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Portfolio Assets
                </h3>
                {viewMode === 'portfolio' ? (
                  <div className="space-y-3">
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="text"
                        placeholder="Add symbol..."
                        className="flex-1 px-3 py-2 text-sm border rounded"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <button
                        className="px-3 py-2 text-sm rounded transition-colors"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--bg-primary)'
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {['AAPL', 'TSLA', 'NVDA', 'MSFT'].map((symbol, index) => (
                        <div key={`short-watchlist-${symbol}`} className="flex items-center justify-between p-2 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{symbol}</span>
                            <span className={`text-xs px-1 rounded ${index < 2 ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'}`}>
                              {index < 2 ? 'BUY' : 'HOLD'}
                            </span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>
                            {[8.5, 7.8, 6.2, 5.9][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users size={24} className="mx-auto mb-2" style={{ color: 'var(--text-secondary)' }} />
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Switch to Portfolio mode to manage multiple assets
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'signalhierarchy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Signal Hierarchy & Conditional Rules
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Configure indicator hierarchies and conditional rules for entry/exit signals.
                  </p>
                </div>

                {/* Signal Priority Hierarchy */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Zap size={16} />
                    <span>Signal Priority Hierarchy</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Primary Signal</span>
                        <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                          <option value="stage">Weinstein Stage</option>
                          <option value="sata">SATA Score</option>
                          <option value="momentum">Momentum</option>
                        </select>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Highest priority signal for trade decisions
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Secondary Signal</span>
                        <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                          <option value="rsi">RSI</option>
                          <option value="vwap">VWAP</option>
                          <option value="volume">Volume</option>
                        </select>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Confirmation signal for entries
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Filter Signal</span>
                        <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                          <option value="atr">ATR Context</option>
                          <option value="cvd">CVD</option>
                          <option value="obv">OBV</option>
                        </select>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Additional filter to reduce false signals
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditional Rules */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Settings size={16} />
                    <span>Conditional Rules</span>
                  </h4>
                  <div className="space-y-4">
                    
                    {/* Gap Down Rule */}
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Gap Down Adjustment</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Adjust stops and trim positions on gap downs</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Gap Threshold:</label>
                          <div className="flex items-center space-x-1 mt-1">
                            <input type="number" value="2" step="0.1" className="w-16 px-1 py-1 text-xs border rounded" 
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Trim Amount:</label>
                          <div className="flex items-center space-x-1 mt-1">
                            <input type="number" value="25" className="w-16 px-1 py-1 text-xs border rounded" 
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Moving Average Sell Conditions */}
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>MA-Based Sell Conditions</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sell if price drops % below moving average</div>
                        </div>
                        <input type="checkbox" defaultChecked className="rounded" />
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>MA Period:</label>
                            <select className="w-full mt-1 px-1 py-1 text-xs border rounded" 
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                              <option value="50">50 SMA</option>
                              <option value="150">150 SMA</option>
                              <option value="200">200 SMA</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Drop Threshold:</label>
                            <div className="flex items-center space-x-1 mt-1">
                              <input type="number" value="3" step="0.1" className="w-16 px-1 py-1 text-xs border rounded" 
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>%</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Action:</label>
                            <select className="w-full mt-1 px-1 py-1 text-xs border rounded" 
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                              <option value="full_exit">Full Exit</option>
                              <option value="partial_exit">Partial Exit</option>
                              <option value="trim_stop">Trim & Tighten Stop</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Additional MA conditions */}
                        <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center space-x-4 mb-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Enable secondary MA condition</span>
                          </div>
                          <div className="grid grid-cols-3 gap-3 opacity-50">
                            <select className="px-1 py-1 text-xs border rounded" disabled
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                              <option value="150">150 SMA</option>
                              <option value="200">200 SMA</option>
                            </select>
                            <div className="flex items-center space-x-1">
                              <input type="number" value="5" step="0.1" className="w-16 px-1 py-1 text-xs border rounded" disabled
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>%</span>
                            </div>
                            <select className="px-1 py-1 text-xs border rounded" disabled
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                              <option value="full_exit">Full Exit</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Volume Spike Rule */}
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Volume Spike Response</span>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>React to unusual volume activity</div>
                        </div>
                        <input type="checkbox" className="rounded" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Spike Multiplier:</label>
                          <div className="flex items-center space-x-1 mt-1">
                            <input type="number" value="3" step="0.1" className="w-16 px-1 py-1 text-xs border rounded" 
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>x avg</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Action:</label>
                          <select className="w-full mt-1 px-1 py-1 text-xs border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <option value="add_position">Add Position</option>
                            <option value="trim_position">Trim Position</option>
                            <option value="watch">Watch Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rule Testing */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Target size={16} />
                    <span>Rule Testing & Validation</span>
                  </h4>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Backtest Rule Performance</span>
                      <button className="px-3 py-1 text-xs border rounded transition-colors hover:bg-opacity-80"
                        style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
                        Test Rules
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-green-600">78%</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Rule Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>156</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Signals Generated</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">23</div>
                        <div style={{ color: 'var(--text-secondary)' }}>False Positives</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Trading Rules
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Entry Conditions</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Stage 2 confirmation</li>
                      <li>• SATA score &gt; 7.0</li>
                      <li>• Price above VWAP</li>
                      <li>• RSI 50-70 range</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Exit Conditions</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Stage transition to 3</li>
                      <li>• 2.5x ATR stop-loss</li>
                      <li>• RSI divergence</li>
                      <li>• CVD negative flow</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Position Management</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• 2% max risk per trade</li>
                      <li>• ATR-based position sizing</li>
                      <li>• Add on VWAP pullbacks</li>
                      <li>• Trim at 20% extension</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Backtest Execution Settings
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Configure final settings and execute the backtest with your current configuration.
                  </p>
                </div>

                {/* Execution Parameters */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Settings size={16} />
                    <span>Execution Parameters</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Initial Capital:</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">$</span>
                          <input type="number" value="100000" className="w-20 px-2 py-1 text-sm border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Commission per Trade:</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">$</span>
                          <input type="number" value="5.00" step="0.01" className="w-16 px-2 py-1 text-sm border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Slippage:</span>
                        <div className="flex items-center space-x-1">
                          <input type="number" value="0.05" step="0.01" className="w-16 px-2 py-1 text-sm border rounded" 
                            style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                          <span className="text-xs">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Strategy Parameters Summary */}
                {strategy.strategySettings && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                      <Target size={16} />
                      <span>Strategy Parameters Summary</span>
                    </h4>
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(strategy.strategySettings).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {typeof value === 'number' ? 
                                (key.includes('Loss') || key.includes('Profit') || key.includes('Threshold') || key.includes('Size')) ? 
                                  (value * 100).toFixed(1) + '%' : 
                                  value.toString() 
                                : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Backtest Options */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 size={16} />
                    <span>Backtest Options</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Save detailed trade log:</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Generate performance report:</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Compare with benchmark:</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Auto-save run to history:</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </div>
                </div>

                {/* Run Name */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Calendar size={16} />
                    <span>Run Configuration</span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Run Name:</label>
                      <input 
                        type="text" 
                        value={`${strategy.name} - ${new Date().toISOString().split('T')[0]}`}
                        className="w-full mt-1 px-3 py-2 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} 
                        placeholder="Enter a name for this backtest run"
                      />
                    </div>
                    <div>
                      <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Notes (optional):</label>
                      <textarea 
                        className="w-full mt-1 px-3 py-2 text-sm border rounded resize-none" 
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} 
                        rows={2}
                        placeholder="Add notes about this configuration..."
                      />
                    </div>
                  </div>
                </div>

                {/* Prominent RUN BACKTEST Button */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="space-y-4">
                    <button 
                      className="w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4"
                      style={{ 
                        backgroundColor: 'var(--accent)', 
                        color: 'var(--bg-primary)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        ringColor: 'rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <Play size={24} />
                        <span>RUN BACKTEST</span>
                      </div>
                    </button>
                    
                    <div className="text-center">
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Estimated completion time: ~2-3 minutes
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        All current settings from Portfolio through Performance will be applied
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Zap size={16} />
                    <span>Quick Actions</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      className="p-3 rounded-lg border text-sm transition-colors hover:bg-opacity-80"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                      <div className="flex items-center space-x-2">
                        <Download size={14} />
                        <span>Export Settings</span>
                      </div>
                    </button>
                    <button 
                      className="p-3 rounded-lg border text-sm transition-colors hover:bg-opacity-80"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    >
                      <div className="flex items-center space-x-2">
                        <Copy size={14} />
                        <span>Clone Strategy</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Risk Metrics
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Max Drawdown</div>
                    <div className="text-lg font-bold text-red-500">{strategy.maxDrawdown.toFixed(1)}%</div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{strategy.sharpe.toFixed(2)}</div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Calmar Ratio</div>
                    <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{strategy.calmarRatio.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Backtest Run History
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Track different backtest runs when you change settings and rerun the strategy.
                  </p>
                </div>

                {/* Pinned Runs */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Pin size={16} />
                    <span>Pinned Runs</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { 
                        id: 'run-001', 
                        name: 'Optimized Settings v2.1', 
                        date: '2025-01-30', 
                        return: 24.3, 
                        sharpe: 1.85, 
                        maxDD: -8.2, 
                        settings: 'ATR: 2.5x, RSI: 14, CVD: 0.7',
                        isPinned: true,
                        isBaseline: true
                      },
                      { 
                        id: 'run-002', 
                        name: 'Conservative Settings', 
                        date: '2025-01-28', 
                        return: 18.7, 
                        sharpe: 2.12, 
                        maxDD: -5.4, 
                        settings: 'ATR: 2.0x, RSI: 14, CVD: 0.5',
                        isPinned: true,
                        isBaseline: false
                      }
                    ].map((run) => (
                      <div 
                        key={run.id}
                        className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                        style={{ 
                          backgroundColor: run.isBaseline ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)', 
                          borderColor: run.isBaseline ? 'var(--accent)' : 'var(--border)',
                          borderWidth: run.isBaseline ? '2px' : '1px'
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {run.name}
                              </span>
                              {run.isBaseline && (
                                <span className="flex items-center space-x-1 text-xs px-1.5 py-0.5 rounded" 
                                      style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
                                  <Star size={10} />
                                  <span>BASELINE</span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                              {run.date} • {run.settings}
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                              <div className="text-center">
                                <div className={`font-medium ${run.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {run.return >= 0 ? '+' : ''}{run.return}%
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>Return</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {run.sharpe}
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-red-600">
                                  {run.maxDD}%
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>Max DD</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-3">
                            <button 
                              className="p-1 rounded hover:bg-opacity-50 transition-colors"
                              style={{ color: 'var(--accent)' }}
                              title="Unpin run"
                            >
                              <Pin size={12} />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-opacity-50 transition-colors"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Duplicate settings"
                            >
                              <Copy size={12} />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-opacity-50 transition-colors"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Export run"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Runs */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Clock size={16} />
                    <span>Recent Runs</span>
                  </h4>
                  <div 
                    className="space-y-2 overflow-y-auto pr-2"
                    style={{ 
                      height: 'calc(100vh - 720px)',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--border) transparent'
                    }}
                  >
                    {[
                      { 
                        id: 'run-003', 
                        name: 'Test Run - Higher CVD', 
                        date: '2025-01-25', 
                        return: 15.2, 
                        sharpe: 1.43, 
                        maxDD: -12.1, 
                        settings: 'ATR: 2.5x, RSI: 14, CVD: 1.0',
                        isPinned: false,
                        duration: '3 months'
                      },
                      { 
                        id: 'run-004', 
                        name: 'Lower ATR Multiplier', 
                        date: '2025-01-22', 
                        return: 11.8, 
                        sharpe: 1.67, 
                        maxDD: -6.8, 
                        settings: 'ATR: 1.5x, RSI: 14, CVD: 0.5',
                        isPinned: false,
                        duration: '3 months'
                      },
                      { 
                        id: 'run-005', 
                        name: 'RSI Period Test', 
                        date: '2025-01-20', 
                        return: 8.9, 
                        sharpe: 1.21, 
                        maxDD: -9.5, 
                        settings: 'ATR: 2.0x, RSI: 21, CVD: 0.5',
                        isPinned: false,
                        duration: '3 months'
                      },
                      { 
                        id: 'run-006', 
                        name: 'Aggressive Settings', 
                        date: '2025-01-18', 
                        return: -2.4, 
                        sharpe: -0.32, 
                        maxDD: -18.7, 
                        settings: 'ATR: 3.0x, RSI: 10, CVD: 1.2',
                        isPinned: false,
                        duration: '3 months'
                      },
                      { 
                        id: 'run-007', 
                        name: 'Stage Filter Only', 
                        date: '2025-01-15', 
                        return: 13.6, 
                        sharpe: 1.58, 
                        maxDD: -7.3, 
                        settings: 'Stage Filter Only, No RSI/CVD',
                        isPinned: false,
                        duration: '3 months'
                      }
                    ].map((run) => (
                      <div 
                        key={run.id}
                        className="p-3 rounded-lg border hover:bg-opacity-80 transition-colors cursor-pointer group"
                        style={{ 
                          backgroundColor: 'var(--bg-primary)', 
                          borderColor: 'var(--border)'
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {run.name}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 rounded" 
                                    style={{ backgroundColor: 'var(--surface)', color: 'var(--text-secondary)' }}>
                                {run.duration}
                              </span>
                            </div>
                            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                              {run.date} • {run.settings}
                            </div>
                            <div className="flex items-center space-x-4 text-xs">
                              <span className={run.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                                Return: {run.return >= 0 ? '+' : ''}{run.return}%
                              </span>
                              <span style={{ color: 'var(--text-secondary)' }}>
                                Sharpe: {run.sharpe}
                              </span>
                              <span className="text-red-600">
                                Max DD: {run.maxDD}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-3">
                            <button 
                              className="p-1 rounded hover:bg-opacity-50 transition-colors"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Pin run"
                            >
                              <Pin size={12} />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-opacity-50 transition-colors"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Duplicate settings"
                            >
                              <Copy size={12} />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-opacity-50 transition-colors"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Archive run"
                            >
                              <Archive size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                    Showing last 5 runs • <span className="text-blue-500 cursor-pointer hover:underline">View all runs</span>
                  </div>
                </div>

                {/* Run Comparison */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <BarChart3 size={16} />
                    <span>Quick Comparison</span>
                  </h4>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Best Performing Run:</span>
                        <div className="font-medium text-green-600">Optimized Settings v2.1 (+24.3%)</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Most Stable Run:</span>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>Conservative Settings (Sharpe: 2.12)</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Runs:</span>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>7</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-secondary)' }}>Avg Return:</span>
                        <div className="font-medium text-green-600">+13.2%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
            
            {/* Left Panel Resize Handle */}
            <div
              ref={leftResizeRef}
              className="w-1 cursor-col-resize hover:bg-blue-500 transition-colors group relative"
              onMouseDown={(e) => handleMouseDown('left', e)}
              style={{ backgroundColor: 'var(--border)' }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </div>
          </div>
        )}

        {/* Main Chart Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-1">
            {/* Chart Container */}
            <div className="flex-1 p-6">
              <StageAnalysisChart
                data={generateMockChartData()}
                symbol={strategy.symbol}
                selectedTimeframe={strategy.timeframe}
                showBenchmark={false}
              />
              
              {/* Trade Journal - Always visible below chart */}
              <div className="mt-6">
                <TradeJournal strategy={strategy} />
              </div>
            </div>

            {/* Right Analytics Panel */}
            {rightPanelVisible && (
              <div className="relative flex">
                {/* Right Panel Resize Handle */}
                <div
                  ref={rightResizeRef}
                  className="w-1 cursor-col-resize hover:bg-blue-500 transition-colors group relative"
                  onMouseDown={(e) => handleMouseDown('right', e)}
                  style={{ backgroundColor: 'var(--border)' }}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </div>
                
                <div
                  className="border-l flex flex-col p-6"
                  style={{
                    width: `${rightPanelWidth}px`,
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* Large SATA Score Gauge */}
                  <div className="mb-12">
                    <div className="relative">
                      <div 
                        className="mx-auto rounded-full border-8 flex items-center justify-center"
                        style={{
                          width: '270px',
                          height: '270px',
                          borderColor: 'var(--highlight)',
                          backgroundColor: 'var(--bg-primary)',
                          background: `conic-gradient(from 0deg, var(--highlight) 0deg, var(--highlight) ${(8.2/10) * 360}deg, var(--border) ${(8.2/10) * 360}deg, var(--border) 360deg)`
                        }}
                      >
                        <div className="text-center">
                          <div className="text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>8.2</div>
                          <div className="text-base" style={{ color: 'var(--text-secondary)' }}>SATA</div>
                        </div>
                      </div>
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium" style={{ color: 'var(--highlight)' }}>
                        HIGH PROBABILITY
                      </div>
                    </div>
                  </div>

                  {/* Stage Visualization Wheel */}
                  <div className="mb-12">
                    <div className="relative mx-auto" style={{ width: '270px', height: '270px' }}>
                      {/* Stage Wheel Background */}
                      <div className="absolute inset-0 rounded-full border-8" style={{ borderColor: 'var(--border)' }}>
                        {/* Only Stage 2 Active Segment */}
                        <div 
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(from 0deg, var(--border) 0deg, var(--border) 90deg, #10B981 90deg, #10B981 180deg, var(--border) 180deg, var(--border) 360deg)`
                          }}
                        />
                      </div>
                      
                      {/* Center content */}
                      <div className="absolute inset-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600">2</div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>ADVANCING</div>
                        </div>
                      </div>
                      
                      {/* Stage Labels - Only show current stage in color */}
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>1</div>
                      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 text-sm font-medium" style={{ color: '#10B981' }}>2</div>
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>3</div>
                      <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>4</div>
                    </div>
                  </div>

                  {/* Performance Trend & Loss Analytics - Bento Style */}
                  <div className="mb-12 flex space-x-4">
                    {/* Performance Trend Visualization - Half Width */}
                    <div className="flex-1">
                      <div 
                        className="rounded-lg border relative overflow-hidden"
                        style={{
                          height: '350px',
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border)'
                        }}
                      >
                        {/* Mini trend line */}
                        <svg className="absolute inset-0 w-full h-full">
                          <polyline
                            points="10,300 30,280 50,250 70,230 90,210 110,190 130,170 150,175 170,150 190,140 210,120"
                            fill="none"
                            stroke="var(--highlight)"
                            strokeWidth="3"
                            opacity="0.8"
                          />
                          <circle cx="210" cy="120" r="4" fill="var(--highlight)" />
                        </svg>
                        
                        {/* Performance label */}
                        <div className="absolute top-4 left-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          Performance Trend
                        </div>
                        <div className="absolute bottom-4 right-4 text-sm font-bold text-green-500">
                          +{strategy.totalReturn.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* Loss Analytics Panel - Right Side */}
                    <div className="flex-1">
                      {(() => {
                        // Helper functions for loss analytics
                        const calculateDrawdownDuration = (balanceProgression) => {
                          if (!balanceProgression || balanceProgression.length === 0) return 0;
                          
                          let maxDuration = 0;
                          let currentDuration = 0;
                          let peak = balanceProgression[0].balance;
                          
                          for (const point of balanceProgression) {
                            if (point.balance >= peak) {
                              peak = point.balance;
                              currentDuration = 0;
                            } else {
                              currentDuration++;
                              maxDuration = Math.max(maxDuration, currentDuration);
                            }
                          }
                          return Math.floor(maxDuration / 7); // Convert to days estimate
                        };

                        const calculateStopLossStats = (exits) => {
                          if (!exits || exits.length === 0) return { count: 0, rate: 0, totalLoss: 0 };
                          
                          const stopLosses = exits.filter(exit => 
                            exit.reason === 'Stop Loss' || exit.reason === 'Stop loss' || exit.reason.toLowerCase().includes('stop')
                          );
                          
                          return {
                            count: stopLosses.length,
                            rate: (stopLosses.length / exits.length) * 100,
                            totalLoss: stopLosses.reduce((sum, exit) => sum + (exit.pnl < 0 ? exit.pnl : 0), 0)
                          };
                        };

                        const calculateLossPattern = (exits) => {
                          if (!exits || exits.length === 0) return { avgLoss: 0, maxLoss: 0, distribution: [] };
                          
                          const losses = exits.filter(exit => exit.pnl < 0);
                          if (losses.length === 0) return { avgLoss: 0, maxLoss: 0, distribution: [] };
                          
                          const avgLoss = losses.reduce((sum, exit) => sum + exit.pnl, 0) / losses.length;
                          const maxLoss = Math.min(...losses.map(exit => exit.pnl));
                          const distribution = losses.slice(0, 10).map(exit => Math.abs(exit.pnl));
                          
                          return { avgLoss, maxLoss, distribution };
                        };

                        // Calculate metrics
                        const drawdownDuration = calculateDrawdownDuration(strategy.accountData?.balanceProgression);
                        const stopLossStats = calculateStopLossStats(strategy.tradeJournal?.exits);
                        const lossPattern = calculateLossPattern(strategy.tradeJournal?.exits);

                        const formatCurrency = (value) => {
                          const absValue = Math.abs(value);
                          if (absValue >= 1000) {
                            return `-$${(absValue / 1000).toFixed(1)}K`;
                          }
                          return `-$${absValue.toFixed(0)}`;
                        };

                        return (
                          <div 
                            className="p-6 rounded-lg border h-full"
                            style={{
                              height: '350px',
                              backgroundColor: 'var(--bg-primary)',
                              borderColor: 'var(--border)'
                            }}
                          >
                            {/* Max Drawdown Section */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Max Drawdown
                                </span>
                                <span className="text-sm font-medium text-red-500">
                                  -{strategy.maxDrawdown.toFixed(1)}%
                                </span>
                              </div>
                              
                              {/* Mini Drawdown Timeline */}
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <svg width="140" height="24" className="opacity-80">
                                    <path 
                                      d="M5,20 Q20,18 35,14 Q50,10 65,12 Q80,14 95,16 Q110,18 125,19 Q135,20 135,21"
                                      stroke="#ef4444" 
                                      strokeWidth="2" 
                                      fill="none"
                                    />
                                    <circle cx="50" cy="10" r="2" fill="#ef4444" />
                                    <path 
                                      d="M5,20 Q20,18 35,14 Q50,10 65,12 Q80,14 95,16 Q110,18 125,19 Q135,20 135,22 L5,22 Z"
                                      fill="#ef4444" 
                                      opacity="0.1"
                                    />
                                  </svg>
                                </div>
                                <span className="text-sm ml-3" style={{ color: 'var(--text-secondary)' }}>
                                  {drawdownDuration} days
                                </span>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t mb-6" style={{ borderColor: 'var(--border)' }}></div>

                            {/* Stop Losses Section */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Stop Losses
                                </span>
                                <span className="text-sm font-medium text-red-500">
                                  {stopLossStats.count} triggered
                                </span>
                              </div>
                              
                              {/* Stop Loss Dots */}
                              <div className="flex items-center justify-between">
                                <div className="flex space-x-1">
                                  {Array.from({length: 10}).map((_, i) => (
                                    <div 
                                      key={i}
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        i < Math.round((stopLossStats.rate / 100) * 10) ? 'bg-red-500' : 'bg-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm ml-3" style={{ color: 'var(--text-secondary)' }}>
                                  {stopLossStats.rate.toFixed(1)}%
                                </span>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t mb-6" style={{ borderColor: 'var(--border)' }}></div>

                            {/* Loss Pattern Section */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                  Loss Pattern
                                </span>
                              </div>
                              
                              {/* Mini Loss Bar Chart */}
                              <div className="flex items-end justify-center space-x-1 mb-4" style={{ height: '40px' }}>
                                {lossPattern.distribution.length > 0 ? (
                                  lossPattern.distribution.map((loss, i) => (
                                    <div 
                                      key={i}
                                      className="bg-red-400 rounded-t"
                                      style={{
                                        width: '12px',
                                        height: `${Math.max(6, (loss / Math.max(...lossPattern.distribution)) * 36)}px`,
                                      }}
                                      title={formatCurrency(-loss)}
                                    />
                                  ))
                                ) : (
                                  Array.from({length: 8}).map((_, i) => (
                                    <div 
                                      key={i}
                                      className="bg-gray-300 rounded-t"
                                      style={{
                                        width: '12px',
                                        height: `${6 + Math.random() * 30}px`,
                                      }}
                                    />
                                  ))
                                )}
                              </div>
                              
                              {/* Loss Metrics */}
                              <div className="flex items-center justify-between text-sm">
                                <span style={{ color: 'var(--text-secondary)' }}>
                                  Avg: {formatCurrency(lossPattern.avgLoss)}
                                </span>
                                <span style={{ color: 'var(--text-secondary)' }}>
                                  Max: {formatCurrency(lossPattern.maxLoss)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Signal Strength Visual */}
                  <div className="mb-12">
                    <div className="space-y-3">
                      {/* RSI Signal Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--text-secondary)' }}>RSI</span>
                          <span className="text-green-500 font-medium">STRONG</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
                          <div className="h-full rounded-full bg-green-500" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      {/* VWAP Signal Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--text-secondary)' }}>VWAP</span>
                          <span className="text-green-500 font-medium">HOLD</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
                          <div className="h-full rounded-full bg-green-500" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      
                      {/* CVD Signal Bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color: 'var(--text-secondary)' }}>CVD</span>
                          <span className="text-yellow-500 font-medium">WATCH</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
                          <div className="h-full rounded-full bg-yellow-500" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Bottom Accordion Panels */}
          {bottomPanelVisible && (
            <div className="relative">
              {/* Bottom Panel Resize Handle */}
              <div
                ref={bottomResizeRef}
                className="h-1 cursor-row-resize hover:bg-blue-500 transition-colors group relative border-t"
                onMouseDown={(e) => handleMouseDown('bottom', e)}
                style={{ backgroundColor: 'var(--border)', borderColor: 'var(--border)' }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity rotate-90">
                  <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
              
              <div 
                className="flex-shrink-0 overflow-y-auto"
                style={{ height: `${bottomPanelHeight}px` }}
              >
            {/* Enhanced Performance Analysis Accordion */}
            <div
              className="border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <button
                onClick={() => toggleAccordion('performance')}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Activity size={18} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Enhanced Performance Analysis
                  </span>
                </div>
                {expandedAccordions.has('performance') ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {expandedAccordions.has('performance') && (
                <div className="px-6 pb-4">
                  <EnhancedPerformanceMetrics strategy={strategy} />
                </div>
              )}
            </div>

            {/* Trade Analysis Accordion */}
            <div style={{ backgroundColor: 'var(--surface)' }}>
              <button
                onClick={() => toggleAccordion('trades')}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign size={18} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Trade Analysis
                  </span>
                </div>
                {expandedAccordions.has('trades') ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {expandedAccordions.has('trades') && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Trades</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{strategy.totalTrades}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
                      <div className="text-lg font-bold text-green-500">{strategy.winRate.toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Profit Factor</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{strategy.profitFactor.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg Hold Time</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{strategy.avgHoldTime}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Indicator Confluence Accordion */}
            <div
              className="border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <button
                onClick={() => toggleAccordion('confluence')}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Brain size={18} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Indicator Confluence
                  </span>
                </div>
                {expandedAccordions.has('confluence') ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {expandedAccordions.has('confluence') && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bullish Signals</div>
                      <div className="text-lg font-bold text-green-500">4/6</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>67% Agreement</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Neutral Signals</div>
                      <div className="text-lg font-bold text-yellow-500">1/6</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>17% Agreement</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bearish Signals</div>
                      <div className="text-lg font-bold text-red-500">1/6</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>17% Agreement</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Benchmark Comparison Accordion */}
            <div
              className="border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <button
                onClick={() => toggleAccordion('benchmark')}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 size={18} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    vs {selectedBenchmark} Benchmark
                  </span>
                </div>
                {expandedAccordions.has('benchmark') ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {expandedAccordions.has('benchmark') && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Strategy Return</div>
                      <div className="text-lg font-bold text-green-500">+{strategy.totalReturn.toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedBenchmark} Return</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>+{(strategy.totalReturn * 0.7).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Alpha</div>
                      <div className="text-lg font-bold text-green-500">+{(strategy.totalReturn * 0.3).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Beta</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>0.85</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Balance Progression Accordion */}
            <div
              className="border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <button
                onClick={() => toggleAccordion('account')}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <DollarSign size={18} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Account Balance Progression
                  </span>
                </div>
                {expandedAccordions.has('account') ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {expandedAccordions.has('account') && (
                <div className="px-6 pb-4">
                  <AccountBalanceChart strategy={strategy} />
                </div>
              )}
            </div>

            {/* Strategy Definition Accordion */}
            <div
              className="border-b"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
            >
              <button
                onClick={() => toggleAccordion('definition')}
                className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Settings size={18} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Strategy Definition & Logic
                  </span>
                </div>
                {expandedAccordions.has('definition') ? (
                  <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {expandedAccordions.has('definition') && (
                <div className="px-6 pb-4">
                  <StrategyDefinition strategy={strategy} />
                </div>
              )}
            </div>

            {/* Stage Transitions Accordion */}
            {viewMode === 'single' && (
              <div style={{ backgroundColor: 'var(--surface)' }}>
                <button
                  onClick={() => toggleAccordion('stages')}
                  className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <PieChart size={18} style={{ color: 'var(--highlight)' }} />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Stage Transitions
                    </span>
                  </div>
                  {expandedAccordions.has('stages') ? (
                    <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </button>
                
                {expandedAccordions.has('stages') && (
                  <div className="px-6 pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stage 1 → 2 Transitions</span>
                        <span className="font-medium text-green-600">3 (+15.2% avg)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stage 2 → 3 Transitions</span>
                        <span className="font-medium text-yellow-600">2 (+8.7% avg)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stage 3 → 4 Transitions</span>
                        <span className="font-medium text-red-600">1 (-12.3%)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Overview Accordion - Only in Portfolio Mode */}
            {viewMode === 'portfolio' && (
              <div style={{ backgroundColor: 'var(--surface)' }}>
                <button
                  onClick={() => toggleAccordion('portfolio-overview')}
                  className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-opacity-80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Users size={18} style={{ color: 'var(--highlight)' }} />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      Portfolio Overview
                    </span>
                  </div>
                  {expandedAccordions.has('portfolio-overview') ? (
                    <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </button>
                
                {expandedAccordions.has('portfolio-overview') && (
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Assets</div>
                        <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>4</div>
                      </div>
                      <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>High SATA (&gt;7)</div>
                        <div className="text-lg font-bold text-green-500">2</div>
                      </div>
                      <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stage 2 Assets</div>
                        <div className="text-lg font-bold text-green-500">3</div>
                      </div>
                      <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg Return</div>
                        <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>+{strategy.totalReturn.toFixed(1)}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyViewScreen;
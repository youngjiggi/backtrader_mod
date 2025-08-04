import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Settings, TrendingUp, BarChart3, Activity, Target, DollarSign, Calendar, ChevronDown, ChevronUp, Play, Cog, Users, TrendingDown, AlertTriangle, Zap, LineChart, PieChart, Brain, CheckCircle, XCircle, Clock, GripVertical, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen, Grid, Square, Columns, Rows } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import StageAnalysisChart from './StageAnalysisChart';

export type SplitLayout = '1x1' | '2x1' | '1x2' | '2x2';

interface SplitViewScreenProps {
  strategy: RecentRun;
  onBack: () => void;
}

interface TimeframeView {
  id: string;
  label: string;
  timeframe: string;
  active: boolean;
}

const SplitViewScreen: React.FC<SplitViewScreenProps> = ({ strategy, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['performance']));
  const [viewMode, setViewMode] = useState<'single' | 'portfolio'>('single');
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');
  const [layout, setLayout] = useState<SplitLayout>('2x2');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [activeChart, setActiveChart] = useState('1D');
  
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

  // Available timeframes for the same strategy
  const timeframes: TimeframeView[] = [
    { id: '1D', label: '1 Day', timeframe: '1D', active: activeChart === '1D' },
    { id: '4H', label: '4 Hours', timeframe: '4H', active: activeChart === '4H' },
    { id: '1H', label: '1 Hour', timeframe: '1H', active: activeChart === '1H' },
    { id: '15M', label: '15 Minutes', timeframe: '15M', active: activeChart === '15M' }
  ];

  const layoutConfigs = {
    '1x1': { cols: 1, rows: 1, gridClass: 'grid-cols-1 grid-rows-1' },
    '2x1': { cols: 2, rows: 1, gridClass: 'grid-cols-2 grid-rows-1' },
    '1x2': { cols: 1, rows: 2, gridClass: 'grid-cols-1 grid-rows-2' },
    '2x2': { cols: 2, rows: 2, gridClass: 'grid-cols-2 grid-rows-2' }
  };

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

  const getDisplayedTimeframes = () => {
    const config = layoutConfigs[layout];
    const maxTimeframes = config.cols * config.rows;
    return timeframes.slice(0, maxTimeframes);
  };

  const renderLayoutSelector = () => (
    <div className="absolute top-12 right-0 z-50 border rounded-lg shadow-lg p-4"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Chart Layout
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(layoutConfigs).map(([layoutKey, config]) => (
          <button
            key={layoutKey}
            onClick={() => {
              setLayout(layoutKey as SplitLayout);
              setShowLayoutSelector(false);
            }}
            className={`p-3 border rounded-lg transition-all hover:bg-opacity-50 ${
              layout === layoutKey ? 'ring-2' : ''
            }`}
            style={{
              borderColor: layout === layoutKey ? 'var(--accent)' : 'var(--border)',
              ringColor: 'var(--accent)',
              backgroundColor: layout === layoutKey ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
          >
            <div className="flex items-center justify-center mb-2">
              {layoutKey === '1x1' && <Square size={20} style={{ color: 'var(--text-primary)' }} />}
              {layoutKey === '2x1' && <Columns size={20} style={{ color: 'var(--text-primary)' }} />}
              {layoutKey === '1x2' && <Rows size={20} style={{ color: 'var(--text-primary)' }} />}
              {layoutKey === '2x2' && <Grid size={20} style={{ color: 'var(--text-primary)' }} />}
            </div>
            <div className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              {layoutKey}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderMultiTimeframeChart = (timeframe: TimeframeView, index: number) => (
    <div
      key={timeframe.id}
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        timeframe.active ? 'ring-2 ring-opacity-75' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: timeframe.active ? 'var(--accent)' : 'var(--border)',
        ringColor: timeframe.active ? 'var(--accent)' : 'transparent'
      }}
      onClick={() => setActiveChart(timeframe.id)}
    >
      {/* Chart Header */}
      <div 
        className={`px-4 py-2 border-b transition-colors ${
          timeframe.active ? 'bg-opacity-10' : ''
        }`}
        style={{ 
          borderColor: 'var(--border)',
          backgroundColor: timeframe.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <BarChart3 
                size={16} 
                style={{ color: timeframe.active ? 'var(--accent)' : 'var(--text-secondary)' }} 
              />
              <h3 
                className="font-semibold text-sm"
                style={{ color: timeframe.active ? 'var(--accent)' : 'var(--text-primary)' }}
              >
                {strategy.name} {strategy.version}
              </h3>
            </div>
            <div 
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)'
              }}
            >
              {timeframe.timeframe}
            </div>
          </div>
          
          {/* Key Metrics */}
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
      <div className="p-4">
        <div className="relative">
          {/* Chart Container */}
          <div 
            className="h-64 rounded border flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border)'
            }}
          >
            {/* Chart Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id={`grid-${timeframe.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path 
                      d="M 20 0 L 0 0 0 20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="0.5"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${timeframe.id})`} />
              </svg>
            </div>

            {/* Chart Content */}
            <div className="relative z-10 w-full h-full">
              <StageAnalysisChart
                strategy={{...strategy, timeframe: timeframe.timeframe}}
                timeInterval={timeframe.timeframe}
                className="w-full h-full"
              />
            </div>

            {/* Active Indicator */}
            {timeframe.active && (
              <div className="absolute top-2 right-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                  title="Active timeframe"
                />
              </div>
            )}

            {/* Click to Focus Indicator */}
            {!timeframe.active && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-5 transition-all">
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
        </div>
      </div>
    </div>
  );

  const sidebarTabs = [
    { id: 'overview', label: 'Strategy Info', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'indicators', label: 'Indicators', icon: LineChart },
    { id: 'stage', label: 'Stage & SATA', icon: PieChart },
    { id: 'portfolio', label: 'Portfolio', icon: Users },
    { id: 'rules', label: 'Trade Rules', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'risk', label: 'Risk Analysis', icon: Target },
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

  const displayedTimeframes = getDisplayedTimeframes();

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
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
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {strategy.name} {strategy.version} - Split View
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {strategy.symbol} • Multiple Timeframes • Active: {activeChart}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Layout Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLayoutSelector(!showLayoutSelector)}
              className="flex items-center space-x-2 px-3 py-2 border rounded-lg transition-colors hover:bg-opacity-50"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)'
              }}
            >
              <Grid size={16} />
              <span className="text-sm">{layout}</span>
            </button>
            {showLayoutSelector && renderLayoutSelector()}
          </div>

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
        {/* Left Sidebar - Same as StrategyViewScreen */}
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

          {/* Sidebar Content - Same as StrategyViewScreen but contextual to active timeframe */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Strategy Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Version:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Symbol:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Active Timeframe:</span>
                      <span style={{ color: 'var(--accent)' }}>{activeChart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.startDate} to {strategy.endDate}</span>
                    </div>
                  </div>
                </div>

                {strategy.keynote && (
                  <div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Strategy Notes
                    </h3>
                    <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                      "{strategy.keynote}"
                    </p>
                  </div>
                )}

                {/* Active Timeframe Info */}
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Active Timeframe: {activeChart}
                  </h3>
                  <div className="text-sm p-3 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Viewing {timeframes.find(t => t.id === activeChart)?.label} chart analysis for detailed signals and patterns.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional tabs would be similar to StrategyViewScreen but contextual to the active timeframe */}
            {activeTab === 'performance' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Key Metrics ({activeChart})
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {performanceMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {metric.label}
                        </span>
                        <span className="font-semibold" style={{ color: metric.color }}>
                          {metric.value}
                        </span>
                      </div>
                    </div>
                  ))}
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

        {/* Center Chart Grid Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-1">
            {/* Multi-Timeframe Chart Grid */}
            <div className="flex-1 p-6">
              <div className={`grid gap-4 h-full ${layoutConfigs[layout].gridClass}`}>
                {displayedTimeframes.map((timeframe, index) => renderMultiTimeframeChart(timeframe, index))}
              </div>
            </div>

            {/* Right Analytics Panel - Same as StrategyViewScreen */}
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
              {/* SATA Score Display */}
              <div className="mb-6">
                <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--highlight)' }}>8.2</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>SATA Score ({activeChart})</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>High Probability Setup</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Stage: 2</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Advancing</div>
                  </div>
                  <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>ATR: 2.3</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Moderate</div>
                  </div>
                </div>
              </div>

              {/* Current Stage Indicator for Active Timeframe */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Current Stage ({activeChart})</h3>
                <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                  <div>
                    <div className="font-medium text-green-700">Stage 2: Advancing</div>
                    <div className="text-xs text-green-600">Strong uptrend confirmed</div>
                  </div>
                </div>
              </div>

              {/* Signal Summary for Active Timeframe */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Active Signals ({activeChart})</h3>
                <div className="space-y-2 text-sm">
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
              </div>

              {/* Timeframe-specific Recommendations */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations ({activeChart})</h3>
                <div className="space-y-3 text-sm">
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
            </div>
              </div>
            )}
          </div>

          {/* Bottom Accordion Panels - Same as StrategyViewScreen */}
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
            {/* Performance Analysis Accordion */}
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
                    Performance Analysis ({activeChart})
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {performanceMetrics.slice(0, 4).map((metric, index) => (
                      <div key={index} className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{metric.label}</div>
                        <div className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}</div>
                      </div>
                    ))}
                  </div>
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
                    Trade Analysis ({activeChart})
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitViewScreen;
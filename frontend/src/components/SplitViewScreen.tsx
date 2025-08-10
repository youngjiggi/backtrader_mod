import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Settings, TrendingUp, BarChart3, Activity, Target, DollarSign, Calendar, ChevronDown, ChevronUp, Play, Cog, Users, Zap, LineChart, PieChart, GripVertical, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen, Grid, Square, Columns, Rows, SquareStack } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import { PanelManagerProvider, usePanelManager } from './PanelManager';
import { AnalyticsContent } from './AnalyticsPanel';

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

const SplitViewScreenContent: React.FC<SplitViewScreenProps> = ({ strategy, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['performance']));
  const [viewMode, setViewMode] = useState<'single' | 'portfolio'>('single');
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');
  const [layout, setLayout] = useState<SplitLayout>('2x2');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [activeChart, setActiveChart] = useState('1D');
  const [combinedMode, setCombinedMode] = useState<'configuration' | 'dashboard'>('configuration');
  
  // Use PanelManager instead of local state
  const { 
    leftPanelWidth, 
    rightPanelWidth, 
    bottomPanelHeight,
    leftPanelVisible, 
    rightPanelVisible, 
    bottomPanelVisible,
    layoutMode,
    dashboardSettings,
    setLeftPanelWidth,
    setRightPanelWidth,
    setBottomPanelHeight,
    toggleLeftPanel,
    toggleRightPanel,
    toggleBottomPanel,
    toggleLayoutMode
  } = usePanelManager();
  
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
      const newHeight = Math.max(200, Math.min(window.innerHeight * 0.8, window.innerHeight - e.clientY));
      setBottomPanelHeight(newHeight);
    }
  }, [setLeftPanelWidth, setRightPanelWidth, setBottomPanelHeight]);

  const handleMouseUp = useCallback(() => {
    isResizing.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  // Mock chart data generation for the strategy

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
        {Object.entries(layoutConfigs).map(([layoutKey]) => (
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

  const renderMultiTimeframeChart = (timeframe: TimeframeView) => (
    <div
      key={timeframe.id}
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        timeframe.active ? 'ring-2 ring-opacity-75' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: timeframe.active ? 'var(--accent)' : 'var(--border)'
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
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {timeframe.timeframe} Chart
              </div>
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
            {/* Panel Layout Toggle */}
            <button
              onClick={toggleLayoutMode}
              className="flex items-center space-x-1 px-2 py-1.5 rounded border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: layoutMode === 'combined' ? 'var(--accent)' : 'var(--surface)',
                borderColor: 'var(--border)',
                color: layoutMode === 'combined' ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              title={layoutMode === 'separate' ? 'Switch to Combined Panel Mode' : 'Switch to Separate Panels Mode'}
            >
              {layoutMode === 'separate' ? <Columns size={12} /> : <SquareStack size={12} />}
              <span className="text-xs">
                {layoutMode === 'separate' ? 'Sep' : 'Com'}
              </span>
            </button>
            
            <button
              onClick={toggleLeftPanel}
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
            {layoutMode === 'separate' && (
              <button
                onClick={toggleRightPanel}
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
            )}
            <button
              onClick={toggleBottomPanel}
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
        {/* Left Sidebar - Enhanced with combined mode support */}
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
          {/* Sidebar Header with Combined Mode Toggle */}
          <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            {layoutMode === 'combined' && (
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setCombinedMode('configuration')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1`}
                  style={{
                    backgroundColor: combinedMode === 'configuration' ? 'var(--accent)' : 'var(--surface)',
                    color: combinedMode === 'configuration' ? 'var(--bg-primary)' : 'var(--text-primary)',
                    border: `1px solid ${combinedMode === 'configuration' ? 'var(--accent)' : 'var(--border)'}`
                  }}
                >
                  <Cog size={16} />
                  <span>Configuration</span>
                </button>
                <button
                  onClick={() => setCombinedMode('dashboard')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1`}
                  style={{
                    backgroundColor: combinedMode === 'dashboard' ? 'var(--accent)' : 'var(--surface)',
                    color: combinedMode === 'dashboard' ? 'var(--bg-primary)' : 'var(--text-primary)',
                    border: `1px solid ${combinedMode === 'dashboard' ? 'var(--accent)' : 'var(--border)'}`
                  }}
                >
                  <BarChart3 size={16} />
                  <span>Dashboard</span>
                </button>
              </div>
            )}
            
            {/* Show tabs only in separate mode or when configuration is selected in combined mode */}
            {(layoutMode === 'separate' || combinedMode === 'configuration') && (
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
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Show dashboard content when in combined mode and dashboard is selected */}
            {layoutMode === 'combined' && combinedMode === 'dashboard' ? (
              <AnalyticsContent 
                strategy={strategy}
                sataScore={8.2}
                activeTimeframe={activeChart}
                settings={dashboardSettings}
              />
            ) : (
              /* Show configuration tabs */
              <>
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
              </>
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
                {displayedTimeframes.map((timeframe) => renderMultiTimeframeChart(timeframe))}
              </div>
            </div>

            {/* Right Analytics Panel - Only shown in separate mode */}
            {layoutMode === 'separate' && rightPanelVisible && (
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
              {/* Strategy Improvement Metrics - Moved to top */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Strategy Evolution</h3>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  {/* Version Comparison */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>vs Previous Version (v2.0)</span>
                      <span className="text-sm font-medium text-green-600">+4.2% better</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--surface)' }}>
                      <div className="h-full rounded-full bg-green-500" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  {/* Key Improvements Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--surface)' }}>
                      <div className="text-sm font-medium text-green-600">+8.5%</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
                    </div>
                    <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--surface)' }}>
                      <div className="text-sm font-medium text-green-600">-2.1%</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Max DD</div>
                    </div>
                  </div>

                  {/* Recent Changes */}
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div className="mb-1">✓ Improved RSI exit timing</div>
                    <div className="mb-1">✓ Enhanced CVD filtering</div>
                    <div>✓ Adjusted position sizing</div>
                  </div>
                </div>
              </div>

              {/* Enhanced SATA Score Display - Progressive Dot Fill */}
              <div className="mb-6">
                <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  {/* Dots grid filling top area - 4 rows of 10 dots each */}
                  <div className="mb-4">
                    <div className="grid grid-cols-10 grid-rows-4 gap-1 w-40 h-12 mx-auto">
                      {[...Array(40)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-300`}
                          style={{
                            backgroundColor: i < (8.2 * 4) ? 'var(--highlight)' : 'var(--border)',
                            opacity: i < (8.2 * 4) ? 1 : 0.2,
                            animationDelay: `${i * 30}ms`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Score and label at bottom */}
                  <div>
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--highlight)' }}>8.2</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>SATA Score ({activeChart})</div>
                  </div>
                </div>
                
                {/* Quick Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-center mb-1">
                      <PieChart size={16} style={{ color: 'var(--highlight)' }} />
                    </div>
                    <div className="font-semibold text-green-600">Stage 2</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Advancing</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-center mb-1">
                      <Activity size={16} style={{ color: 'var(--highlight)' }} />
                    </div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>2.3%</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>ATR</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="font-semibold text-green-600">{strategy.winRate.toFixed(0)}%</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-center mb-1">
                      <Target size={16} style={{ color: strategy.sharpe >= 1.5 ? '#10b981' : strategy.sharpe >= 1.0 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <div className="font-semibold" style={{ color: strategy.sharpe >= 1.5 ? '#10b981' : strategy.sharpe >= 1.0 ? '#f59e0b' : '#ef4444' }}>
                      {strategy.sharpe.toFixed(1)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
                  </div>
                </div>
              </div>

              {/* Performance Trend Chart */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Performance Trend ({activeChart})</h3>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  {/* Simple line chart visualization */}
                  <div className="relative h-20 mb-3">
                    <svg className="w-full h-full" viewBox="0 0 300 80">
                      {/* Grid lines */}
                      <defs>
                        <pattern id={`grid-${activeChart}`} width="30" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid-${activeChart})`} />
                      
                      {/* Performance line */}
                      <polyline
                        points="20,60 50,55 80,45 110,40 140,35 170,30 200,25 230,20 260,15 290,12"
                        fill="none"
                        stroke="var(--highlight)"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                      
                      {/* Data points */}
                      {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map((x, i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={60 - i * 5}
                          r="2"
                          fill="var(--highlight)"
                          opacity="0.6"
                        />
                      ))}
                    </svg>
                  </div>
                  
                  {/* Performance metrics below chart */}
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <span className="ml-1 font-medium" style={{ color: 'var(--text-primary)' }}>3M</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Return:</span>
                      <span className="ml-1 font-medium text-green-600">+{strategy.totalReturn.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Indicators/Signals */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Active Signals ({activeChart})</h3>
                <div className="space-y-2">
                  {/* RSI Signal */}
                  <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>RSI Momentum</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>RSI: 68.2 (Strong)</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">BUY</span>
                  </div>

                  {/* VWAP Signal */}
                  <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>VWAP Support</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Price: 2.1% above VWAP</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">HOLD</span>
                  </div>

                  {/* CVD Signal */}
                  <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>CVD Divergence</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Minor negative divergence</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">WATCH</span>
                  </div>

                  {/* Moving Average Signal */}
                  <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Moving Averages</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Above 50 & 150 SMA</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">BULLISH</span>
                  </div>
                </div>
              </div>


              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations ({activeChart})</h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Primary Action</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Add to position on VWAP pullback. Target: 5% above current levels.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-2 mb-1">
                      <Target size={14} style={{ color: 'var(--highlight)' }} />
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Risk Management</span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Set stop-loss at 2.5x ATR below VWAP support level.
                    </p>
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

const SplitViewScreen: React.FC<SplitViewScreenProps> = (props) => {
  return (
    <PanelManagerProvider>
      <SplitViewScreenContent {...props} />
    </PanelManagerProvider>
  );
};

export default SplitViewScreen;
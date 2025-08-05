import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Settings, TrendingUp, BarChart3, Activity, Target, DollarSign, Calendar, ChevronDown, ChevronUp, Play, Cog, Users, TrendingDown, AlertTriangle, Zap, LineChart, PieChart, Brain, CheckCircle, XCircle, Clock, GripVertical, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen, Grid, Square, Columns, Rows } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import StrategyViewScreen from './StrategyViewScreen';
import TradeJournal from './TradeJournal';

export type ChartGridLayout = '1x1' | '2x1' | '1x2' | '2x2';

interface MultiStrategyViewScreenProps {
  strategies: RecentRun[];
  onBack: () => void;
}

const MultiStrategyViewScreen: React.FC<MultiStrategyViewScreenProps> = ({ strategies, onBack }) => {
  const [activeStrategy, setActiveStrategy] = useState<RecentRun>(strategies[0]);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['performance']));
  const [viewMode, setViewMode] = useState<'single' | 'portfolio'>('single');
  const [selectedBenchmark, setSelectedBenchmark] = useState('SPY');
  const [gridLayout, setGridLayout] = useState<ChartGridLayout>('2x1');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  
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

  const gridLayoutConfigs = {
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

  const handleStrategySelect = useCallback((strategy: RecentRun) => {
    setActiveStrategy(strategy);
    console.log('Active strategy changed to:', strategy.name);
  }, []);

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


  const getDisplayedStrategies = () => {
    const config = gridLayoutConfigs[gridLayout];
    const maxStrategies = config.cols * config.rows;
    return strategies.slice(0, maxStrategies);
  };

  const renderLayoutSelector = () => (
    <div className="absolute top-12 right-0 z-50 border rounded-lg shadow-lg p-4"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Chart Grid Layout
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(gridLayoutConfigs).map(([layoutKey, config]) => (
          <button
            key={layoutKey}
            onClick={() => {
              setGridLayout(layoutKey as ChartGridLayout);
              setShowLayoutSelector(false);
            }}
            className={`p-3 border rounded-lg transition-all hover:bg-opacity-50 ${
              gridLayout === layoutKey ? 'ring-2' : ''
            }`}
            style={{
              borderColor: gridLayout === layoutKey ? 'var(--accent)' : 'var(--border)',
              ringColor: 'var(--accent)',
              backgroundColor: gridLayout === layoutKey ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
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

  const renderStrategyChart = (strategy: RecentRun, index: number) => (
    <StrategyViewScreen
      key={strategy.id}
      strategy={strategy}
      onBack={() => {}} // Not used in chartOnly mode
      chartOnly={true}
      onChartClick={() => handleStrategySelect(strategy)}
      isActive={activeStrategy.id === strategy.id}
    />
  );

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
    { label: 'Total Return', value: `${activeStrategy.totalReturn >= 0 ? '+' : ''}${activeStrategy.totalReturn.toFixed(2)}%`, color: activeStrategy.totalReturn >= 0 ? 'var(--highlight)' : '#ef4444' },
    { label: 'Win Rate', value: `${activeStrategy.winRate.toFixed(1)}%`, color: 'var(--text-primary)' },
    { label: 'Sharpe Ratio', value: activeStrategy.sharpe.toFixed(2), color: 'var(--text-primary)' },
    { label: 'Max Drawdown', value: `${activeStrategy.maxDrawdown.toFixed(1)}%`, color: '#ef4444' },
    { label: 'Total Trades', value: activeStrategy.totalTrades.toString(), color: 'var(--text-primary)' },
    { label: 'Avg Hold Time', value: activeStrategy.avgHoldTime, color: 'var(--text-primary)' },
    { label: 'Profit Factor', value: activeStrategy.profitFactor.toFixed(2), color: 'var(--text-primary)' },
    { label: 'Calmar Ratio', value: activeStrategy.calmarRatio.toFixed(2), color: 'var(--text-primary)' }
  ];

  const displayedStrategies = getDisplayedStrategies();

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
              Split View - Visual Strategy Comparison
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {displayedStrategies.length} strategies • Active: {activeStrategy.name} ({activeStrategy.symbol})
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
              <span className="text-sm">{gridLayout}</span>
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
              activeStrategy.totalReturn >= 0 ? 'text-green-700' : 'text-red-700'
            }`}
            style={{
              backgroundColor: activeStrategy.totalReturn >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
            }}
          >
            {activeStrategy.totalReturn >= 0 ? '+' : ''}{activeStrategy.totalReturn.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Main Content Area - Same Layout as StrategyViewScreen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Same as StrategyViewScreen but contextual to active strategy */}
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

          {/* Sidebar Content - Shows info for active strategy */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Portfolio Configuration - {activeStrategy.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Define the assets you want to trade and manage your portfolio allocation.
                  </p>
                </div>

                {/* Active Strategy Info */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                    <Target size={16} />
                    <span>Active Strategy Details</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{activeStrategy.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Version:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{activeStrategy.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Symbol:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{activeStrategy.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Timeframe:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{activeStrategy.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{activeStrategy.startDate} to {activeStrategy.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Split View Info */}
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Split View Overview
                  </h4>
                  <div className="text-sm p-3 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      Comparing {strategies.length} strategies in {gridLayout} layout. Click any chart to view its details in the side panels.
                    </div>
                  </div>
                </div>

                {activeStrategy.keynote && (
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Strategy Notes
                    </h4>
                    <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                      "{activeStrategy.keynote}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Key Metrics - {activeStrategy.name}
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

            {activeTab === 'stage' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Stage & SATA Analysis - {activeStrategy.name}
                </h3>
                
                {/* Current Stage */}
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Current Stage</h4>
                  <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                    <div>
                      <div className="font-medium text-green-700">Stage 2: Advancing</div>
                      <div className="text-xs text-green-600">Strong uptrend confirmed</div>
                    </div>
                  </div>
                </div>

                {/* SATA Score */}
                <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--highlight)' }}>8.2</div>
                  <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>High Probability Setup</div>
                </div>
              </div>
            )}

            {activeTab === 'indicators' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Active Indicators - {activeStrategy.name}
                </h3>
                
                <div className="space-y-2">
                  {['RSI (14)', 'VWAP', 'ATR (14)', 'Volume Profile'].map((indicator, index) => (
                    <div key={indicator} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{indicator}</span>
                      <span className={`px-2 py-1 text-xs rounded ${index < 2 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {index < 2 ? 'Active' : 'Monitoring'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'signalhierarchy' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Signal Hierarchy - {activeStrategy.name}
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Primary Signal:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Weinstein Stage</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Secondary Signal:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>RSI</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Filter Signal:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>VWAP</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Trading Rules - {activeStrategy.name}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Entry Conditions</h4>
                    <div className="space-y-2 text-sm">
                      {['Stage 2 confirmation', 'RSI < 70', 'Above VWAP', 'Volume > 1.5x avg'].map((rule, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span style={{ color: 'var(--text-primary)' }}>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Exit Conditions</h4>
                    <div className="space-y-2 text-sm">
                      {['Stop loss: 2x ATR', 'Take profit: 4x ATR', 'RSI > 80', 'Stage change'].map((rule, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <XCircle size={14} className="text-red-500" />
                          <span style={{ color: 'var(--text-primary)' }}>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Strategy Settings - {activeStrategy.name}
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Position Size:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>100 shares</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stop Loss:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>2.0% ATR</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Take Profit:</span>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>4.0% ATR</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Strategy History - {activeStrategy.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  {[
                    { date: '2024-01-15', action: 'Strategy created', version: 'v1.0' },
                    { date: '2024-01-20', action: 'Updated stop loss', version: 'v1.1' },
                    { date: '2024-02-01', action: 'Added VWAP filter', version: 'v2.0' },
                    { date: '2024-02-15', action: 'Optimized entry rules', version: 'v2.1' }
                  ].map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                      <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                      <div className="flex-1">
                        <div style={{ color: 'var(--text-primary)' }}>{event.action}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{event.date} - {event.version}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional tabs content complete */}
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

        {/* Center Chart Grid Area - THIS IS THE KEY DIFFERENCE */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-1">
            {/* Strategy Chart Grid with TradeJournal below */}
            <div className="flex-1 flex flex-col p-6">
              {/* Chart Grid - Upper Section */}
              <div className="flex-1 mb-4">
                <div className={`grid gap-4 h-full ${gridLayoutConfigs[gridLayout].gridClass}`}>
                  {displayedStrategies.map((strategy, index) => renderStrategyChart(strategy, index))}
                </div>
              </div>
              
              {/* TradeJournal - Lower Section */}
              <div className="h-80 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="h-full">
                  <TradeJournal 
                    strategy={activeStrategy} 
                    className="h-full"
                  />
                </div>
              </div>
            </div>

            {/* Right Analytics Panel - Same as StrategyViewScreen but contextual to active strategy */}
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
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
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
                    <div className="font-semibold text-green-600">{activeStrategy.winRate.toFixed(0)}%</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
                  </div>
                  <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-center mb-1">
                      <Target size={16} style={{ color: activeStrategy.sharpe >= 1.5 ? '#10b981' : activeStrategy.sharpe >= 1.0 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <div className="font-semibold" style={{ color: activeStrategy.sharpe >= 1.5 ? '#10b981' : activeStrategy.sharpe >= 1.0 ? '#f59e0b' : '#ef4444' }}>
                      {activeStrategy.sharpe.toFixed(1)}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
                  </div>
                </div>
              </div>

              {/* Performance Trend Chart */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Performance Trend</h3>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  {/* Simple line chart visualization */}
                  <div className="relative h-20 mb-3">
                    <svg className="w-full h-full" viewBox="0 0 300 80">
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="300" height="80" fill="url(#grid)" />
                      
                      {/* Performance line (simulated upward trend) */}
                      <polyline
                        fill="none"
                        stroke="var(--highlight)"
                        strokeWidth="2"
                        points="10,60 40,55 70,48 100,45 130,40 160,35 190,30 220,25 250,20 280,15"
                        className="animate-pulse"
                      />
                      
                      {/* Data points */}
                      {[{x: 10, y: 60}, {x: 70, y: 48}, {x: 130, y: 40}, {x: 190, y: 30}, {x: 250, y: 20}, {x: 280, y: 15}].map((point, i) => (
                        <circle key={i} cx={point.x} cy={point.y} r="2" fill="var(--highlight)" />
                      ))}
                    </svg>
                  </div>
                  
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>30D</span>
                    <span className="font-medium text-green-600">+{activeStrategy.totalReturn.toFixed(1)}%</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>

              {/* Combined Risk Metrics */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Risk Analysis</h3>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="space-y-4">
                    {/* Max Drawdown */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Max Drawdown</span>
                        <span className="font-medium text-red-500">{activeStrategy.maxDrawdown.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-red-100 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, activeStrategy.maxDrawdown * 2)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Sharpe Ratio */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</span>
                        <span className={`font-medium ${activeStrategy.sharpe >= 1.5 ? 'text-green-600' : activeStrategy.sharpe >= 1.0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {activeStrategy.sharpe.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            activeStrategy.sharpe >= 1.5 ? 'bg-green-500' : 
                            activeStrategy.sharpe >= 1.0 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (activeStrategy.sharpe / 3) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Win Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                        <span className="font-medium text-green-600">{activeStrategy.winRate.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${activeStrategy.winRate}%` }}
                        ></div>
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {Math.floor(activeStrategy.totalTrades * (activeStrategy.winRate / 100))} / {activeStrategy.totalTrades} trades
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Action Recommendations */}
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations</h3>
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

          {/* Bottom Accordion Panels - Same as StrategyViewScreen but contextual to active strategy */}
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
                    Performance Analysis - {activeStrategy.name}
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
                    Trade Analysis - {activeStrategy.name}
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
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{activeStrategy.totalTrades}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
                      <div className="text-lg font-bold text-green-500">{activeStrategy.winRate.toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Profit Factor</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{activeStrategy.profitFactor.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg Hold Time</div>
                      <div className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>{activeStrategy.avgHoldTime}</div>
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

export default MultiStrategyViewScreen;
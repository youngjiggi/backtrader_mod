import React, { useState, useRef, useCallback } from 'react';
import { ArrowLeft, Settings, TrendingUp, BarChart3, Activity, Target, DollarSign, Calendar, ChevronDown, ChevronUp, Play, Cog, Users, TrendingDown, AlertTriangle, Zap, LineChart, PieChart, Brain, CheckCircle, XCircle, Clock, GripVertical, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import StageAnalysisChart from './StageAnalysisChart';

interface StrategyViewScreenProps {
  strategy: RecentRun;
  onBack: () => void;
}

const StrategyViewScreen: React.FC<StrategyViewScreenProps> = ({ strategy, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['performance']));
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
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {strategy.name} {strategy.version}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {strategy.symbol} • {strategy.timeframe} • Full Strategy Analysis
            </p>
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
                      <span style={{ color: 'var(--text-secondary)' }}>Timeframe:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.timeframe}</span>
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
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Key Metrics
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

            {activeTab === 'indicators' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Technical Indicators
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {/* ATR Card */}
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>ATR</span>
                        <Cog size={12} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>2.34</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Volatility</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={10} className="text-orange-500" />
                        <span className="text-orange-500">Moderate</span>
                      </div>
                    </div>
                  </div>

                  {/* RSI Card */}
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>RSI</span>
                        <Cog size={12} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <span className="text-sm font-medium text-green-600">64.2</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Momentum</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={10} className="text-green-500" />
                        <span className="text-green-500">Bullish</span>
                      </div>
                    </div>
                  </div>

                  {/* VWAP Card */}
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>VWAP</span>
                        <Cog size={12} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>$158.42</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Support/Resistance</span>
                      <div className="flex items-center space-x-1">
                        <CheckCircle size={10} className="text-green-500" />
                        <span className="text-green-500">Above</span>
                      </div>
                    </div>
                  </div>

                  {/* CVD Card */}
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>CVD</span>
                        <AlertTriangle size={12} className="text-yellow-500" />
                      </div>
                      <span className="text-sm font-medium text-yellow-600">+1.2M</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Institutional Flow</span>
                      <div className="flex items-center space-x-1">
                        <AlertTriangle size={10} className="text-yellow-500" />
                        <span className="text-yellow-500">Diverging</span>
                      </div>
                    </div>
                  </div>

                  {/* OBV Card */}
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>OBV</span>
                        <Cog size={12} style={{ color: 'var(--text-secondary)' }} />
                      </div>
                      <span className="text-sm font-medium text-green-600">+85.2M</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Volume Trend</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp size={10} className="text-green-500" />
                        <span className="text-green-500">Confirming</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stage' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Weinstein Stage Analysis
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)' }}>
                    <div className="text-sm font-medium text-gray-600">Stage 1</div>
                    <div className="text-xs text-gray-500">Basing</div>
                  </div>
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.5)' }}>
                    <div className="text-sm font-medium text-green-700">Stage 2</div>
                    <div className="text-xs text-green-600">Advancing</div>
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
                
                <div className="space-y-3 mt-4">
                  <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Stage Characteristics</div>
                    <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <li>• Price above rising 30-week MA</li>
                      <li>• Strong uptrend with higher highs</li>
                      <li>• RSI 50-80 range</li>
                      <li>• Volume confirming moves</li>
                    </ul>
                  </div>
                </div>

                {/* SATA Scoring Subsection */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    SATA Score Breakdown
                  </h4>
                  <div className="space-y-3">
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
                    <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Total SATA Score</span>
                        <span className="text-lg font-bold" style={{ color: 'var(--highlight)' }}>8.2</span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>High Probability Setup (8-10 range)</div>
                    </div>
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
                        <div key={symbol} className="flex items-center justify-between p-2 rounded border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
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

            {activeTab === 'settings' && strategy.strategySettings && (
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Strategy Parameters
                </h3>
                <div className="space-y-3 text-sm">
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
              <div className="space-y-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Strategy History
                </h3>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>Current Run: {new Date(strategy.completedAt).toLocaleDateString()}</p>
                  <p>Total Trades: {strategy.totalTrades}</p>
                  <p>Average Hold Time: {strategy.avgHoldTime}</p>
                </div>

                {/* Execution History Subsection */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    Execution History
                  </h4>
                  
                  {/* Scrollable Log Container */}
                  <div 
                    className="space-y-2 overflow-y-auto pr-2 flex-1"
                    style={{ 
                      height: 'calc(100vh - 520px)',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--border) transparent'
                    }}
                  >
                    {/* Mock execution history entries */}
                    {[
                      { date: '2025-01-30', symbol: 'AAPL', return: 12.4, trades: 45, duration: '2.3d', status: 'completed' },
                      { date: '2025-01-28', symbol: 'TSLA', return: -3.2, trades: 32, duration: '1.8d', status: 'stopped' },
                      { date: '2025-01-25', symbol: 'NVDA', return: 18.7, trades: 67, duration: '3.1d', status: 'completed' },
                      { date: '2025-01-22', symbol: 'MSFT', return: 8.9, trades: 28, duration: '2.7d', status: 'completed' },
                      { date: '2025-01-20', symbol: 'AAPL', return: 15.2, trades: 52, duration: '2.9d', status: 'completed' },
                      { date: '2025-01-18', symbol: 'AMD', return: -1.8, trades: 23, duration: '1.2d', status: 'stopped' },
                      { date: '2025-01-15', symbol: 'GOOGL', return: 22.1, trades: 71, duration: '4.1d', status: 'completed' },
                      { date: '2025-01-12', symbol: 'TSLA', return: 6.3, trades: 34, duration: '2.5d', status: 'completed' }
                    ].map((run, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg border hover:bg-opacity-80 transition-colors cursor-pointer"
                        style={{ 
                          backgroundColor: 'var(--bg-primary)', 
                          borderColor: 'var(--border)',
                          borderLeft: `3px solid ${run.return >= 0 ? '#10b981' : '#ef4444'}`
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-xs" style={{ color: 'var(--text-primary)' }}>
                              {run.symbol}
                            </span>
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {run.date}
                            </span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              run.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {run.status}
                            </span>
                          </div>
                          <span className={`text-xs font-medium ${
                            run.return >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {run.return >= 0 ? '+' : ''}{run.return.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <span>{run.trades} trades</span>
                          <span>{run.duration} avg hold</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                    Showing last 8 executions • <span className="text-blue-500 cursor-pointer hover:underline">View all</span>
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
              {/* SATA Score Display */}
              <div className="mb-6">
                <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--highlight)' }}>8.2</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
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

              {/* Current Stage Indicator */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Current Stage</h3>
                <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                  <div>
                    <div className="font-medium text-green-700">Stage 2: Advancing</div>
                    <div className="text-xs text-green-600">Strong uptrend confirmed</div>
                  </div>
                </div>
              </div>

              {/* Signal Summary */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Active Signals</h3>
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
                    Performance Analysis
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
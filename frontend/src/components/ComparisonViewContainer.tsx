import React, { useState, useRef, useCallback } from 'react';
import { Grid, Square, Columns, Rows, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen, GripVertical, GripHorizontal, Settings, BarChart3, Activity, Target, DollarSign, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import StrategyChartPane from './StrategyChartPane';
import StageAnalysisChart from './StageAnalysisChart';

export type ComparisonLayout = '1x1' | '2x1' | '1x2' | '2x2';

interface ComparisonViewContainerProps {
  strategies: RecentRun[];
  onStrategySelect?: (strategy: RecentRun) => void;
  onBack?: () => void;
  className?: string;
}

const ComparisonViewContainer: React.FC<ComparisonViewContainerProps> = ({
  strategies,
  onStrategySelect,
  onBack,
  className = ''
}) => {
  const [activeStrategy, setActiveStrategy] = useState<RecentRun>(strategies[0]);
  const [layout, setLayout] = useState<ComparisonLayout>('2x1');
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  
  // Panel state management
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(300);
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [bottomPanelVisible, setBottomPanelVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set(['performance']));

  // Resize refs
  const leftResizeRef = useRef<HTMLDivElement>(null);
  const rightResizeRef = useRef<HTMLDivElement>(null);
  const bottomResizeRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef<string | null>(null);

  const layoutConfigs = {
    '1x1': { cols: 1, rows: 1, gridClass: 'grid-cols-1 grid-rows-1' },
    '2x1': { cols: 2, rows: 1, gridClass: 'grid-cols-2 grid-rows-1' },
    '1x2': { cols: 1, rows: 2, gridClass: 'grid-cols-1 grid-rows-2' },
    '2x2': { cols: 2, rows: 2, gridClass: 'grid-cols-2 grid-rows-2' }
  };

  const handleStrategySelect = useCallback((strategy: RecentRun) => {
    setActiveStrategy(strategy);
    if (onStrategySelect) {
      onStrategySelect(strategy);
    }
  }, [onStrategySelect]);

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

    const container = document.querySelector('.split-container') as HTMLElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    if (isResizing.current === 'left') {
      const newWidth = Math.max(200, Math.min(600, e.clientX - rect.left));
      setLeftPanelWidth(newWidth);
    } else if (isResizing.current === 'right') {
      const newWidth = Math.max(200, Math.min(600, rect.right - e.clientX));
      setRightPanelWidth(newWidth);
    } else if (isResizing.current === 'bottom') {
      const newHeight = Math.max(200, Math.min(500, rect.bottom - e.clientY));
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
    const config = layoutConfigs[layout];
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
        Comparison Layout
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(layoutConfigs).map(([layoutKey, config]) => (
          <button
            key={layoutKey}
            onClick={() => {
              setLayout(layoutKey as ComparisonLayout);
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

  const renderLeftPanel = () => (
    <div className="h-full flex flex-col border-r" style={{ borderColor: 'var(--border)' }}>
      {/* Left Panel Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          Strategy Info
        </h3>
        <button
          onClick={() => setLeftPanelVisible(false)}
          className="p-1 rounded hover:bg-opacity-50 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex">
          {['overview', 'indicators', 'stage-analysis', 'portfolio', 'trade-rules'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-b-2' : 'border-transparent'
              }`}
              style={{
                borderBottomColor: activeTab === tab ? 'var(--accent)' : 'transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {activeStrategy.name} {activeStrategy.version}
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {activeStrategy.keynote}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded border" style={{ borderColor: 'var(--border)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {activeStrategy.totalReturn.toFixed(1)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Return</div>
              </div>
              <div className="text-center p-3 rounded border" style={{ borderColor: 'var(--border)' }}>
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {activeStrategy.winRate.toFixed(1)}%
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'indicators' && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Indicator settings for {activeStrategy.name}
          </div>
        )}
        
        {/* Add other tab content as needed */}
      </div>
    </div>
  );

  const renderRightPanel = () => (
    <div className="h-full flex flex-col border-l" style={{ borderColor: 'var(--border)' }}>
      {/* Right Panel Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          Live Analytics
        </h3>
        <button
          onClick={() => setRightPanelVisible(false)}
          className="p-1 rounded hover:bg-opacity-50 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <PanelRightClose size={16} />
        </button>
      </div>

      {/* SATA Score */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="text-center">
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
            8.5
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            SATA Score
          </div>
        </div>
      </div>

      {/* Right Panel Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div>Real-time analytics for {activeStrategy.name}</div>
          <div>Stage: 2 (Advancing)</div>
          <div>ATR: Expanding</div>
          <div>Volume: Above Average</div>
        </div>
      </div>
    </div>
  );

  const renderBottomPanel = () => (
    <div className="flex flex-col border-t" style={{ borderColor: 'var(--border)' }}>
      {/* Bottom Panel Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          Performance Analysis
        </h3>
        <button
          onClick={() => setBottomPanelVisible(false)}
          className="p-1 rounded hover:bg-opacity-50 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <PanelBottomClose size={16} />
        </button>
      </div>

      {/* Accordion Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Performance Accordion */}
          <div className="border rounded" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => toggleAccordion('performance')}
              className="w-full flex items-center justify-between p-3 hover:bg-opacity-50 transition-colors"
              style={{ backgroundColor: 'var(--surface)' }}
            >
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Performance Metrics
              </span>
              {expandedAccordions.has('performance') ? 
                <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} /> :
                <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              }
            </button>
            {expandedAccordions.has('performance') && (
              <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {activeStrategy.sharpe.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>Max Drawdown</div>
                    <div className="font-medium" style={{ color: '#ef4444' }}>
                      {activeStrategy.maxDrawdown.toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>Total Trades</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {activeStrategy.totalTrades}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)' }}>Avg Hold Time</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {activeStrategy.avgHoldTime}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const displayedStrategies = getDisplayedStrategies();

  return (
    <div className={`h-screen flex flex-col split-container ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Strategy Comparison
          </h1>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {displayedStrategies.length} strategies • Active: {activeStrategy.name}
          </div>
        </div>

        <div className="flex items-center space-x-2">
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

          {/* Panel Toggles */}
          {!leftPanelVisible && (
            <button
              onClick={() => setLeftPanelVisible(true)}
              className="p-2 border rounded hover:bg-opacity-50 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <PanelLeftOpen size={16} />
            </button>
          )}
          {!rightPanelVisible && (
            <button
              onClick={() => setRightPanelVisible(true)}
              className="p-2 border rounded hover:bg-opacity-50 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <PanelRightOpen size={16} />
            </button>
          )}
          {!bottomPanelVisible && (
            <button
              onClick={() => setBottomPanelVisible(true)}
              className="p-2 border rounded hover:bg-opacity-50 transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              <PanelBottomOpen size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel */}
        {leftPanelVisible && (
          <>
            <div style={{ width: leftPanelWidth }}>
              {renderLeftPanel()}
            </div>
            <div
              ref={leftResizeRef}
              className="w-1 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-30 transition-colors"
              onMouseDown={(e) => handleMouseDown('left', e)}
              style={{ backgroundColor: 'var(--border)' }}
            />
          </>
        )}

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Chart Grid */}
          <div className="flex-1 p-4">
            <div className={`grid gap-4 h-full ${layoutConfigs[layout].gridClass}`}>
              {displayedStrategies.map((strategy, index) => (
                <StrategyChartPane
                  key={strategy.id}
                  strategy={strategy}
                  isActive={activeStrategy.id === strategy.id}
                  onSelect={() => handleStrategySelect(strategy)}
                  className="h-full"
                />
              ))}
            </div>
          </div>

          {/* Bottom Panel */}
          {bottomPanelVisible && (
            <>
              <div
                className="h-1 cursor-row-resize hover:bg-blue-500 hover:bg-opacity-30 transition-colors"
                onMouseDown={(e) => handleMouseDown('bottom', e)}
                style={{ backgroundColor: 'var(--border)' }}
              />
              <div style={{ height: bottomPanelHeight }}>
                {renderBottomPanel()}
              </div>
            </>
          )}
        </div>

        {/* Right Panel */}
        {rightPanelVisible && (
          <>
            <div
              className="w-1 cursor-col-resize hover:bg-blue-500 hover:bg-opacity-30 transition-colors"
              onMouseDown={(e) => handleMouseDown('right', e)}
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div style={{ width: rightPanelWidth }}>
              {renderRightPanel()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComparisonViewContainer;
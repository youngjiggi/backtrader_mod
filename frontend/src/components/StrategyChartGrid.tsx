import React, { useState } from 'react';
import { Grid, Square, Columns, Rows } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import AccountBalanceChart from './AccountBalanceChart';

export type ChartGridLayout = '1x1' | '2x1' | '1x2' | '2x2';

interface StrategyChartGridProps {
  strategies: RecentRun[];
  activeStrategy: RecentRun;
  onStrategySelect: (strategy: RecentRun) => void;
  gridLayout?: ChartGridLayout;
  onLayoutChange?: (layout: ChartGridLayout) => void;
  className?: string;
}

const StrategyChartGrid: React.FC<StrategyChartGridProps> = ({
  strategies,
  activeStrategy,
  onStrategySelect,
  gridLayout = '2x1',
  onLayoutChange,
  className = ''
}) => {
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);

  const gridLayoutConfigs = {
    '1x1': { cols: 1, rows: 1, gridClass: 'grid-cols-1 grid-rows-1' },
    '2x1': { cols: 2, rows: 1, gridClass: 'grid-cols-2 grid-rows-1' },
    '1x2': { cols: 1, rows: 2, gridClass: 'grid-cols-1 grid-rows-2' },
    '2x2': { cols: 2, rows: 2, gridClass: 'grid-cols-2 grid-rows-2' }
  };

  const getDisplayedStrategies = () => {
    const config = gridLayoutConfigs[gridLayout];
    const maxStrategies = config.cols * config.rows;
    return strategies.slice(0, maxStrategies);
  };

  const renderStrategyChart = (strategy: RecentRun, index: number) => (
    <div
      key={strategy.id}
      className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        activeStrategy.id === strategy.id ? 'ring-2' : ''
      }`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: activeStrategy.id === strategy.id ? 'var(--accent)' : 'var(--border)',
        '--tw-ring-color': 'var(--accent)'
      }}
      onClick={() => onStrategySelect(strategy)}
    >
      {/* Strategy Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {strategy.name}
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {strategy.symbol} • {strategy.timeframe}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${strategy.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {strategy.totalReturn >= 0 ? '+' : ''}{strategy.totalReturn.toFixed(1)}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {strategy.totalTrades} trades
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-full">
        <AccountBalanceChart strategy={strategy} />
      </div>

      {/* Performance Metrics */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="text-green-600 font-medium">{strategy.winRate.toFixed(0)}%</div>
          <div style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
        </div>
        <div className="text-center">
          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {strategy.sharpe.toFixed(1)}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
        </div>
        <div className="text-center">
          <div className="text-red-500 font-medium">{strategy.maxDrawdown.toFixed(1)}%</div>
          <div style={{ color: 'var(--text-secondary)' }}>Max DD</div>
        </div>
      </div>
    </div>
  );

  const displayedStrategies = getDisplayedStrategies();

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Layout Controls */}
      {onLayoutChange && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Layout:
            </span>
            <div className="relative">
              <button
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className="flex items-center space-x-2 px-3 py-1 rounded border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <Grid size={14} />
                <span className="text-sm">{gridLayout}</span>
              </button>

              {showLayoutSelector && (
                <div
                  className="absolute top-full left-0 mt-1 p-2 rounded border shadow-lg z-10 grid grid-cols-2 gap-2"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {Object.entries(gridLayoutConfigs).map(([layoutKey, config]) => (
                    <button
                      key={layoutKey}
                      onClick={() => {
                        onLayoutChange(layoutKey as ChartGridLayout);
                        setShowLayoutSelector(false);
                      }}
                      className={`p-2 rounded text-xs transition-colors ${
                        gridLayout === layoutKey ? 'ring-2' : ''
                      }`}
                      style={{
                        borderColor: gridLayout === layoutKey ? 'var(--accent)' : 'var(--border)',
                        color: 'var(--text-primary)',
                        backgroundColor: gridLayout === layoutKey ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                      }}
                    >
                      {layoutKey === '1x1' && <Square size={16} />}
                      {layoutKey === '2x1' && <Columns size={16} />}
                      {layoutKey === '1x2' && <Rows size={16} />}
                      {layoutKey === '2x2' && <Grid size={16} />}
                      <div className="mt-1">{layoutKey}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Comparing {strategies.length} strategies in {gridLayout} layout
          </div>
        </div>
      )}

      {/* Chart Grid */}
      <div className={`grid gap-4 flex-1 ${gridLayoutConfigs[gridLayout].gridClass}`}>
        {displayedStrategies.map((strategy, index) => renderStrategyChart(strategy, index))}
      </div>
    </div>
  );
};

export default StrategyChartGrid;
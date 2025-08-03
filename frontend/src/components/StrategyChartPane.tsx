import React from 'react';
import { TrendingUp, BarChart3, Target } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';
import StageAnalysisChart from './StageAnalysisChart';

interface StrategyChartPaneProps {
  strategy: RecentRun;
  isActive: boolean;
  onSelect: () => void;
  className?: string;
}

const StrategyChartPane: React.FC<StrategyChartPaneProps> = ({
  strategy,
  isActive,
  onSelect,
  className = ''
}) => {
  return (
    <div
      className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isActive ? 'ring-2 ring-opacity-75' : 'hover:shadow-md'
      } ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: isActive ? 'var(--accent)' : 'var(--border)',
        ringColor: isActive ? 'var(--accent)' : 'transparent'
      }}
      onClick={onSelect}
    >
      {/* Minimal Header */}
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
              <h3 
                className="font-semibold text-sm"
                style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}
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
              {strategy.symbol}
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

            {/* Mock Chart Content */}
            <div className="relative z-10 w-full h-full flex flex-col">
              {/* Mock Price Chart */}
              <div className="flex-1 relative">
                <svg className="w-full h-full" viewBox="0 0 300 180">
                  {/* Mock candlesticks or line chart */}
                  <path
                    d="M 10 140 Q 50 120 100 100 T 200 80 T 290 60"
                    fill="none"
                    stroke={strategy.totalReturn >= 0 ? '#10b981' : '#ef4444'}
                    strokeWidth="2"
                    className="opacity-80"
                  />
                  {/* Mock volume bars */}
                  {Array.from({ length: 15 }, (_, i) => (
                    <rect
                      key={i}
                      x={20 + i * 18}
                      y={160 + Math.random() * 15}
                      width="12"
                      height={Math.random() * 15 + 5}
                      fill="var(--text-secondary)"
                      opacity="0.3"
                    />
                  ))}
                </svg>
              </div>

              {/* Chart Type Indicator */}
              <div className="absolute top-2 left-2">
                <div 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {strategy.timeframe}
                </div>
              </div>

              {/* Click to Focus Indicator */}
              {!isActive && (
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
            </div>
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
    </div>
  );
};

export default StrategyChartPane;
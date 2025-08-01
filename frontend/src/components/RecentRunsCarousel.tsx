import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar, BarChart3, Star, Target } from 'lucide-react';
import StrategyContextMenu from './StrategyContextMenu';

export interface RecentRun {
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
  completedAt: string;
  keynote: string;
  // Strategy settings
  strategySettings?: {
    atrPeriod: number;
    atrMultiplier: number;
    cvdThreshold: number;
    rsiPeriod: number;
    rsiOversold: number;
    rsiOverbought: number;
    stopLoss: number;
    takeProfit: number;
    positionSize: number;
    maxPositions: number;
  };
  // Time-period specific data
  periodData: {
    [key: string]: {
      totalReturn: number;
      winRate: number;
      sharpe: number;
      maxDrawdown: number;
      totalTrades: number;
      avgHoldTime: string;
      profitFactor: number;
      calmarRatio: number;
    }
  };
}

interface RecentRunsCarouselProps {
  runs: RecentRun[];
  selectedRunId: string | null;
  onRunSelect: (run: RecentRun) => void;
  timeInterval: string;
  onTimeIntervalChange: (interval: string) => void;
  baseStrategyId: string;
  comparisonStrategies: string[];
  onSetBaseStrategy: (strategyId: string) => void;
  onAddToComparison: (strategyId: string) => void;
  onRemoveFromComparison: (strategyId: string) => void;
}

const RecentRunsCarousel: React.FC<RecentRunsCarouselProps> = ({
  runs,
  selectedRunId,
  onRunSelect,
  timeInterval,
  onTimeIntervalChange,
  baseStrategyId,
  comparisonStrategies,
  onSetBaseStrategy,
  onAddToComparison,
  onRemoveFromComparison
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    strategyId: string;
    strategyName: string;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    strategyId: '',
    strategyName: ''
  });

  const timeIntervals = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
    { label: 'YTD', value: 'YTD' },
    { label: 'All', value: 'All' }
  ];

  // Get metrics for the current time period
  const getCurrentPeriodMetrics = (run: RecentRun, period: string) => {
    if (run.periodData && run.periodData[period]) {
      return run.periodData[period];
    }
    // Fallback to default metrics if period data not available
    return {
      totalReturn: run.totalReturn,
      winRate: run.winRate,
      sharpe: run.sharpe,
      maxDrawdown: run.maxDrawdown,
      totalTrades: run.totalTrades,
      avgHoldTime: run.avgHoldTime,
      profitFactor: run.profitFactor,
      calmarRatio: run.calmarRatio
    };
  };

  // Auto-select first run on load
  useEffect(() => {
    if (runs.length > 0 && !selectedRunId) {
      onRunSelect(runs[0]);
    }
  }, [runs, selectedRunId, onRunSelect]);

  // Update current index when selection changes
  useEffect(() => {
    if (selectedRunId) {
      const index = runs.findIndex(run => run.id === selectedRunId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedRunId, runs]);

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : runs.length - 1;
    setCurrentIndex(newIndex);
    onRunSelect(runs[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < runs.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onRunSelect(runs[newIndex]);
  };

  const handleCardClick = (run: RecentRun, index: number) => {
    setCurrentIndex(index);
    onRunSelect(run);
  };

  const handleRightClick = (e: React.MouseEvent, run: RecentRun) => {
    e.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
      strategyId: run.id,
      strategyName: `${run.name} ${run.version}`
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isOpen: false }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  };

  if (runs.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Top Performant Strategies
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-lg border transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            title="Previous run"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-lg border transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            title="Next run"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Time Interval Buttons */}
      <div className="flex space-x-1 mb-4">
        {timeIntervals.map((interval) => (
          <button
            key={interval.value}
            onClick={() => onTimeIntervalChange(interval.value)}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              timeInterval === interval.value ? 'font-medium' : ''
            }`}
            style={{
              backgroundColor: timeInterval === interval.value ? 'var(--accent)' : 'var(--surface)',
              color: timeInterval === interval.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: `1px solid ${timeInterval === interval.value ? 'var(--accent)' : 'var(--border)'}`
            }}
          >
            {interval.label}
          </button>
        ))}
      </div>

      <div 
        className="relative overflow-hidden"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out space-x-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / Math.min(runs.length, 3))}%)`
          }}
        >
          {runs.map((run, index) => {
            const isBaseStrategy = run.id === baseStrategyId;
            const isInComparison = comparisonStrategies.includes(run.id);
            
            return (
            <div
              key={run.id}
              className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                Math.min(runs.length, 3) === 1 ? 'w-full' : 
                Math.min(runs.length, 3) === 2 ? 'w-1/2' : 'w-1/3'
              }`}
              onClick={() => handleCardClick(run, index)}
              onContextMenu={(e) => handleRightClick(e, run)}
            >
              <div
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-lg ${
                  selectedRunId === run.id ? 'ring-2' : ''
                } ${isBaseStrategy ? 'ring-2 ring-yellow-500' : ''} ${isInComparison ? 'ring-2 ring-blue-500' : ''}`}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: isBaseStrategy ? '#eab308' : 
                              isInComparison ? '#3b82f6' : 
                              selectedRunId === run.id ? 'var(--accent)' : 'var(--border)',
                  '--tw-ring-color': isBaseStrategy ? '#eab308' : 
                                    isInComparison ? '#3b82f6' : 'var(--accent)',
                  borderWidth: isBaseStrategy || isInComparison ? '2px' : '1px'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {run.name} {run.version}
                      </h3>
                      {isBaseStrategy && (
                        <span className="flex items-center space-x-1 text-xs px-1.5 py-0.5 rounded" 
                              style={{ backgroundColor: '#eab308', color: 'white' }}>
                          <Star size={10} />
                          <span>PORTFOLIO</span>
                        </span>
                      )}
                      {isInComparison && (
                        <span className="flex items-center space-x-1 text-xs px-1.5 py-0.5 rounded" 
                              style={{ backgroundColor: '#3b82f6', color: 'white' }}>
                          <Target size={10} />
                          <span>COMPARING</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {run.symbol} • {run.timeframe}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {(() => {
                      const metrics = getCurrentPeriodMetrics(run, timeInterval);
                      return (
                        <>
                          {metrics.totalReturn >= 0 ? (
                            <TrendingUp size={16} className="text-green-500" />
                          ) : (
                            <TrendingDown size={16} className="text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(1)}%
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {(() => {
                    const metrics = getCurrentPeriodMetrics(run, timeInterval);
                    return (
                      <>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <BarChart3 size={12} style={{ color: 'var(--highlight)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              Win Rate
                            </span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {metrics.winRate.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-1 mb-1">
                            <BarChart3 size={12} style={{ color: 'var(--highlight)' }} />
                            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              Sharpe
                            </span>
                          </div>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {metrics.sharpe.toFixed(2)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Date */}
                <div className="flex items-center space-x-1">
                  <Calendar size={12} style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(run.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      {runs.length > 3 && (
        <div className="flex justify-center space-x-4 mt-4">
          {runs.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardClick(runs[index], index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 ${
                index === currentIndex ? 'opacity-100' : 'opacity-40'
              }`}
              style={{
                backgroundColor: 'var(--accent)'
              }}
            />
          ))}
        </div>
      )}

      {/* Context Menu */}
      <StrategyContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        strategyId={contextMenu.strategyId}
        strategyName={contextMenu.strategyName}
        isBaseStrategy={contextMenu.strategyId === baseStrategyId}
        isInComparison={comparisonStrategies.includes(contextMenu.strategyId)}
        onSetBaseStrategy={onSetBaseStrategy}
        onAddToComparison={onAddToComparison}
        onRemoveFromComparison={onRemoveFromComparison}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
};

export default RecentRunsCarousel;
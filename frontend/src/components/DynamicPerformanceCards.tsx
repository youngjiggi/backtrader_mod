import React from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3, DollarSign, Activity, Clock } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface DynamicPerformanceCardsProps {
  selectedRun: RecentRun | null;
  timeInterval: string;
}

const DynamicPerformanceCards: React.FC<DynamicPerformanceCardsProps> = ({ selectedRun, timeInterval }) => {
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

  if (!selectedRun) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Loading state */}
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="p-6 rounded-lg border animate-pulse"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="h-6 w-6 rounded mb-4" style={{ backgroundColor: 'var(--border)' }}></div>
            <div className="h-8 w-20 rounded mb-2" style={{ backgroundColor: 'var(--border)' }}></div>
            <div className="h-4 w-16 rounded" style={{ backgroundColor: 'var(--border)' }}></div>
          </div>
        ))}
      </div>
    );
  }

  const currentMetrics = getCurrentPeriodMetrics(selectedRun, timeInterval);
  
  const performanceCards = [
    {
      title: 'Total Return',
      value: `${currentMetrics.totalReturn >= 0 ? '+' : ''}${currentMetrics.totalReturn.toFixed(2)}%`,
      icon: currentMetrics.totalReturn >= 0 ? TrendingUp : TrendingDown,
      color: currentMetrics.totalReturn >= 0 ? '#10b981' : '#ef4444',
      change: null
    },
    {
      title: 'Win Rate',
      value: `${currentMetrics.winRate.toFixed(1)}%`,
      icon: Target,
      color: 'var(--highlight)',
      change: null
    },
    {
      title: 'Sharpe Ratio',
      value: currentMetrics.sharpe.toFixed(2),
      icon: BarChart3,
      color: 'var(--highlight)',
      change: null
    },
    {
      title: 'Max Drawdown',
      value: `${currentMetrics.maxDrawdown.toFixed(1)}%`,
      icon: TrendingDown,
      color: '#ef4444',
      change: null
    },
    {
      title: 'Total Trades',
      value: currentMetrics.totalTrades.toString(),
      icon: Activity,
      color: 'var(--highlight)',
      change: null
    },
    {
      title: 'Avg Hold Time',
      value: currentMetrics.avgHoldTime,
      icon: Clock,
      color: 'var(--highlight)',
      change: null
    },
    {
      title: 'Profit Factor',
      value: currentMetrics.profitFactor.toFixed(2),
      icon: DollarSign,
      color: 'var(--highlight)',
      change: null
    },
    {
      title: 'Calmar Ratio',
      value: currentMetrics.calmarRatio.toFixed(2),
      icon: BarChart3,
      color: 'var(--highlight)',
      change: null
    }
  ];

  // Show top 4 most important metrics
  const topMetrics = performanceCards.slice(0, 4);

  return (
    <div className="mb-8">
      {/* Selected Run Header */}
      <div className="mb-6 p-4 rounded-lg border" style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {selectedRun.name} {selectedRun.version}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedRun.symbol} • {selectedRun.timeframe} • {selectedRun.startDate} to {selectedRun.endDate}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              {currentMetrics.totalReturn >= 0 ? (
                <TrendingUp size={20} className="text-green-500" />
              ) : (
                <TrendingDown size={20} className="text-red-500" />
              )}
              <span
                className={`text-xl font-bold ${
                  currentMetrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {currentMetrics.totalReturn >= 0 ? '+' : ''}{currentMetrics.totalReturn.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Completed {new Date(selectedRun.completedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {selectedRun.keynote && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
              "{selectedRun.keynote}"
            </p>
          </div>
        )}
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-lg border transition-all duration-300 hover:shadow-lg transform hover:scale-105"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span style={{ color: metric.color }}>
                  <IconComponent size={24} />
                </span>
                {metric.change && (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium" style={{ color: metric.color }}>
                      {metric.change}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </h3>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {metric.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {performanceCards.slice(4).map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index + 4}
              className="p-4 rounded-lg border transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center space-x-3">
                <span style={{ color: metric.color }}>
                  <IconComponent size={18} />
                </span>
                <div>
                  <p className="text-lg font-semibold" style={{ color: metric.color }}>
                    {metric.value}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {metric.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicPerformanceCards;
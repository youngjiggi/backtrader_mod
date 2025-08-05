import React from 'react';
import { TrendingUp, TrendingDown, Target, Activity, PieChart } from 'lucide-react';

interface PerformanceMetricsProps {
  strategy?: {
    totalReturn: number;
    winRate: number;
    sharpe: number;
    maxDrawdown: number;
    totalTrades: number;
    avgWin?: number;
    avgLoss?: number;
    profitFactor?: number;
  };
  variant?: 'grid' | 'list' | 'compact';
  showTrend?: boolean;
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  strategy,
  variant = 'grid',
  showTrend = true,
  className = ''
}) => {
  if (!strategy) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p style={{ color: 'var(--text-secondary)' }}>No strategy data available</p>
      </div>
    );
  }

  const getMetricColor = (value: number, type: 'return' | 'winRate' | 'sharpe' | 'drawdown') => {
    switch (type) {
      case 'return':
        return value >= 0 ? '#10b981' : '#ef4444';
      case 'winRate':
        return value >= 60 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
      case 'sharpe':
        return value >= 1.5 ? '#10b981' : value >= 1.0 ? '#f59e0b' : '#ef4444';
      case 'drawdown':
        return value <= 10 ? '#10b981' : value <= 20 ? '#f59e0b' : '#ef4444';
      default:
        return 'var(--text-primary)';
    }
  };

  const formatPercentage = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  const renderGridVariant = () => (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
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
        <div className="font-semibold" style={{ color: getMetricColor(strategy.winRate, 'winRate') }}>
          {strategy.winRate.toFixed(0)}%
        </div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
      </div>
      <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-center mb-1">
          <Target size={16} style={{ color: getMetricColor(strategy.sharpe, 'sharpe') }} />
        </div>
        <div className="font-semibold" style={{ color: getMetricColor(strategy.sharpe, 'sharpe') }}>
          {strategy.sharpe.toFixed(1)}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
      </div>
    </div>
  );

  const renderListVariant = () => (
    <div className={`space-y-4 ${className}`}>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Return</span>
          <span className="font-medium" style={{ color: getMetricColor(strategy.totalReturn, 'return') }}>
            {formatPercentage(strategy.totalReturn)}
          </span>
        </div>
        {showTrend && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.abs(strategy.totalReturn))}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
          <span className="font-medium" style={{ color: getMetricColor(strategy.winRate, 'winRate') }}>
            {strategy.winRate.toFixed(0)}%
          </span>
        </div>
        {showTrend && (
          <div className="w-full rounded-full h-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}>
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${strategy.winRate}%` }}
            ></div>
          </div>
        )}
        {showTrend && (
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {Math.floor(strategy.totalTrades * (strategy.winRate / 100))} / {strategy.totalTrades} trades
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Max Drawdown</span>
          <span className="font-medium" style={{ color: getMetricColor(strategy.maxDrawdown, 'drawdown') }}>
            {strategy.maxDrawdown.toFixed(1)}%
          </span>
        </div>
        {showTrend && (
          <div className="w-full bg-red-100 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, strategy.maxDrawdown * 2)}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</span>
          <span className="font-medium" style={{ color: getMetricColor(strategy.sharpe, 'sharpe') }}>
            {strategy.sharpe.toFixed(2)}
          </span>
        </div>
        {showTrend && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                strategy.sharpe >= 1.5 ? 'bg-green-500' : 
                strategy.sharpe >= 1.0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, (strategy.sharpe / 3) * 100)}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompactVariant = () => (
    <div className={`space-y-2 text-sm ${className}`}>
      <div className="flex justify-between">
        <span style={{ color: 'var(--text-secondary)' }}>Return:</span>
        <span style={{ color: getMetricColor(strategy.totalReturn, 'return') }}>
          {formatPercentage(strategy.totalReturn)}
        </span>
      </div>
      <div className="flex justify-between">
        <span style={{ color: 'var(--text-secondary)' }}>Win Rate:</span>
        <span style={{ color: getMetricColor(strategy.winRate, 'winRate') }}>
          {strategy.winRate.toFixed(0)}%
        </span>
      </div>
      <div className="flex justify-between">
        <span style={{ color: 'var(--text-secondary)' }}>Sharpe:</span>
        <span style={{ color: getMetricColor(strategy.sharpe, 'sharpe') }}>
          {strategy.sharpe.toFixed(1)}
        </span>
      </div>
      <div className="flex justify-between">
        <span style={{ color: 'var(--text-secondary)' }}>Max DD:</span>
        <span style={{ color: getMetricColor(strategy.maxDrawdown, 'drawdown') }}>
          {strategy.maxDrawdown.toFixed(1)}%
        </span>
      </div>
    </div>
  );

  switch (variant) {
    case 'list':
      return renderListVariant();
    case 'compact':
      return renderCompactVariant();
    default:
      return renderGridVariant();
  }
};

export default PerformanceMetrics;
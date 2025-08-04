import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  BarChart3, 
  Target, 
  Calendar,
  Activity,
  AlertTriangle,
  Award,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface EnhancedPerformanceMetricsProps {
  strategy: RecentRun;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend = 'neutral',
  color = 'var(--text-primary)',
  description
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={12} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-red-500" />;
    return null;
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 100 || val <= -100) return val.toFixed(0);
      if (val >= 10 || val <= -10) return val.toFixed(1);
      return val.toFixed(2);
    }
    return val;
  };

  return (
    <div
      className="relative p-4 rounded-lg border hover:shadow-lg transition-all duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
      onMouseEnter={() => description && setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <h4 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </h4>
        </div>
        {getTrendIcon()}
      </div>
      
      <div className="mb-1">
        <span className="text-2xl font-bold" style={{ color }}>
          {formatValue(value)}
        </span>
      </div>
      
      {subtitle && (
        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </div>
      )}

      {/* Tooltip */}
      {description && showDescription && (
        <div
          className="absolute z-10 p-3 rounded-lg shadow-lg border max-w-xs bottom-full mb-2 left-1/2 transform -translate-x-1/2"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <div className="text-xs">{description}</div>
        </div>
      )}
    </div>
  );
};

const EnhancedPerformanceMetrics: React.FC<EnhancedPerformanceMetricsProps> = ({ 
  strategy, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'returns' | 'consistency' | 'benchmark'>('risk');

  // Generate mock enhanced metrics if not provided
  const enhancedMetrics = useMemo(() => {
    if (strategy.enhancedMetrics) return strategy.enhancedMetrics;
    
    // Generate realistic mock data based on existing metrics
    const totalReturn = strategy.totalReturn;
    const sharpe = strategy.sharpe;
    const maxDrawdown = strategy.maxDrawdown;
    
    return {
      // Risk metrics
      valueAtRisk: totalReturn * -0.15,
      conditionalValueAtRisk: totalReturn * -0.22,
      maximumDrawdownDays: Math.floor(Math.random() * 45 + 15),
      recoveryFactor: totalReturn / maxDrawdown,
      ulcerIndex: Math.abs(maxDrawdown * 0.7),
      
      // Return metrics
      annualizedReturn: totalReturn * 1.2,
      monthlyReturns: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleDateString('en-US', { month: 'short' }),
        return: (Math.random() - 0.5) * 20
      })),
      bestMonth: { month: 'Mar', return: 15.8 },
      worstMonth: { month: 'Aug', return: -8.4 },
      positiveMonths: 8,
      
      // Consistency metrics
      winStreakMax: Math.floor(Math.random() * 8 + 3),
      loseStreakMax: Math.floor(Math.random() * 4 + 1),
      consistency: Math.min(0.95, sharpe / 2 + 0.5),
      stabilityRatio: Math.max(0.1, Math.min(0.9, sharpe / 3 + 0.3)),
      
      // Benchmark comparison
      benchmarkCorrelation: Math.random() * 0.6 + 0.2,
      beta: Math.random() * 1.5 + 0.5,
      alpha: totalReturn - (Math.random() * 10 + 5),
      trackingError: Math.random() * 5 + 2,
      informationRatio: sharpe * 0.8
    };
  }, [strategy]);

  const formatPercentage = (value: number, decimals: number = 2) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const getRiskColor = (value: number, type: 'risk' | 'return') => {
    if (type === 'risk') {
      return value > 15 ? '#EF4444' : value > 8 ? '#F59E0B' : '#10B981';
    } else {
      return value > 10 ? '#10B981' : value > 0 ? '#F59E0B' : '#EF4444';
    }
  };

  const renderRiskMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="Value at Risk (95%)"
        value={formatPercentage(enhancedMetrics.valueAtRisk)}
        subtitle="Maximum expected loss"
        icon={<AlertTriangle size={16} style={{ color: '#EF4444' }} />}
        color="#EF4444"
        description="The maximum loss expected over a given time period with 95% confidence"
      />
      <MetricCard
        title="Conditional VaR"
        value={formatPercentage(enhancedMetrics.conditionalValueAtRisk)}
        subtitle="Expected loss beyond VaR"
        icon={<Shield size={16} style={{ color: '#EF4444' }} />}
        color="#EF4444"
        description="The expected loss when losses exceed the VaR threshold"
      />
      <MetricCard
        title="Recovery Factor"
        value={formatNumber(enhancedMetrics.recoveryFactor)}
        subtitle="Return / Max Drawdown"
        icon={<Activity size={16} style={{ color: getRiskColor(enhancedMetrics.recoveryFactor, 'return') }} />}
        color={getRiskColor(enhancedMetrics.recoveryFactor, 'return')}
        trend={enhancedMetrics.recoveryFactor > 2 ? 'up' : enhancedMetrics.recoveryFactor > 1 ? 'neutral' : 'down'}
        description="Higher values indicate better recovery from drawdowns"
      />
      <MetricCard
        title="Ulcer Index"
        value={formatNumber(enhancedMetrics.ulcerIndex)}
        subtitle="Drawdown severity"
        icon={<TrendingDown size={16} style={{ color: '#F59E0B' }} />}
        color="#F59E0B"
        description="Measures the depth and duration of percentage drawdowns"
      />
      <MetricCard
        title="Max DD Duration"
        value={`${enhancedMetrics.maximumDrawdownDays} days`}
        subtitle="Longest drawdown period"
        icon={<Calendar size={16} style={{ color: 'var(--highlight)' }} />}
        description="The longest period between equity peaks"
      />
      <MetricCard
        title="Current Drawdown"
        value={formatPercentage(-strategy.maxDrawdown * 0.6)}
        subtitle="From peak equity"
        icon={<TrendingDown size={16} style={{ color: '#EF4444' }} />}
        color="#EF4444"
        description="Current unrealized loss from the highest portfolio value"
      />
    </div>
  );

  const renderReturnMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Annualized Return"
          value={formatPercentage(enhancedMetrics.annualizedReturn)}
          subtitle="Compound annual growth"
          icon={<TrendingUp size={16} style={{ color: '#10B981' }} />}
          color={getRiskColor(enhancedMetrics.annualizedReturn, 'return')}
          trend={enhancedMetrics.annualizedReturn > 10 ? 'up' : 'neutral'}
        />
        <MetricCard
          title="Best Month"
          value={formatPercentage(enhancedMetrics.bestMonth.return)}
          subtitle={enhancedMetrics.bestMonth.month}
          icon={<Award size={16} style={{ color: '#10B981' }} />}
          color="#10B981"
          trend="up"
        />
        <MetricCard
          title="Worst Month"
          value={formatPercentage(enhancedMetrics.worstMonth.return)}
          subtitle={enhancedMetrics.worstMonth.month}
          icon={<AlertTriangle size={16} style={{ color: '#EF4444' }} />}
          color="#EF4444"
          trend="down"
        />
        <MetricCard
          title="Positive Months"
          value={`${enhancedMetrics.positiveMonths}/12`}
          subtitle={formatPercentage((enhancedMetrics.positiveMonths / 12) * 100, 0)}
          icon={<Target size={16} style={{ color: 'var(--highlight)' }} />}
          color={enhancedMetrics.positiveMonths >= 8 ? '#10B981' : enhancedMetrics.positiveMonths >= 6 ? '#F59E0B' : '#EF4444'}
        />
      </div>

      {/* Monthly Returns Chart */}
      <div 
        className="p4 rounded-lg border"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <h4 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          Monthly Returns Distribution
        </h4>
        <div className="flex items-end space-x-1 h-32">
          {enhancedMetrics.monthlyReturns.map((month, index) => {
            const height = Math.abs(month.return) * 2 + 10;
            const isPositive = month.return >= 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full rounded-t transition-all duration-200 hover:opacity-80"
                  style={{ 
                    height: `${height}px`,
                    backgroundColor: isPositive ? '#10B981' : '#EF4444',
                    marginBottom: isPositive ? '0' : `${height}px`,
                    marginTop: isPositive ? `${120 - height}px` : '0'
                  }}
                  title={`${month.month}: ${formatPercentage(month.return)}`}
                />
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {month.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderConsistencyMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Consistency Score"
        value={formatPercentage(enhancedMetrics.consistency * 100, 1)}
        subtitle="Return predictability"
        icon={<BarChart3 size={16} style={{ color: 'var(--highlight)' }} />}
        color={enhancedMetrics.consistency > 0.7 ? '#10B981' : enhancedMetrics.consistency > 0.5 ? '#F59E0B' : '#EF4444'}
        trend={enhancedMetrics.consistency > 0.6 ? 'up' : 'neutral'}
        description="Measures how consistent returns are over time"
      />
      <MetricCard
        title="Stability Ratio"
        value={formatNumber(enhancedMetrics.stabilityRatio, 3)}
        subtitle="Return stability"
        icon={<Activity size={16} style={{ color: 'var(--highlight)' }} />}
        color={enhancedMetrics.stabilityRatio > 0.6 ? '#10B981' : '#F59E0B'}
        description="Ratio of consistent periods to total periods"
      />
      <MetricCard
        title="Max Win Streak"
        value={`${enhancedMetrics.winStreakMax} trades`}
        subtitle="Consecutive winners"
        icon={<Zap size={16} style={{ color: '#10B981' }} />}
        color="#10B981"
        trend="up"
        description="Longest sequence of profitable trades"
      />
      <MetricCard
        title="Max Loss Streak"
        value={`${enhancedMetrics.loseStreakMax} trades`}
        subtitle="Consecutive losers"
        icon={<TrendingDown size={16} style={{ color: '#EF4444' }} />}
        color="#EF4444"
        trend="down"
        description="Longest sequence of losing trades"
      />
    </div>
  );

  const renderBenchmarkMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Alpha"
          value={formatPercentage(enhancedMetrics.alpha)}
          subtitle="Excess return vs benchmark"
          icon={<Award size={16} style={{ color: getRiskColor(enhancedMetrics.alpha, 'return') }} />}
          color={getRiskColor(enhancedMetrics.alpha, 'return')}
          trend={enhancedMetrics.alpha > 2 ? 'up' : enhancedMetrics.alpha > -2 ? 'neutral' : 'down'}
          description="Return generated independent of market movements"
        />
        <MetricCard
          title="Beta"
          value={formatNumber(enhancedMetrics.beta)}
          subtitle="Market sensitivity"
          icon={<BarChart3 size={16} style={{ color: 'var(--highlight)' }} />}
          color={enhancedMetrics.beta > 1.5 ? '#EF4444' : enhancedMetrics.beta < 0.5 ? '#F59E0B' : '#10B981'}
          description="Sensitivity to market movements (1.0 = market average)"
        />
        <MetricCard
          title="Correlation"
          value={formatNumber(enhancedMetrics.benchmarkCorrelation)}
          subtitle="Market relationship"
          icon={<Activity size={16} style={{ color: 'var(--highlight)' }} />}
          color={enhancedMetrics.benchmarkCorrelation > 0.7 ? '#EF4444' : '#10B981'}
          description="How closely returns move with the benchmark"
        />
        <MetricCard
          title="Information Ratio"
          value={formatNumber(enhancedMetrics.informationRatio)}
          subtitle="Risk-adjusted alpha"
          icon={<Target size={16} style={{ color: 'var(--highlight)' }} />}
          color={enhancedMetrics.informationRatio > 0.5 ? '#10B981' : '#F59E0B'}
          trend={enhancedMetrics.informationRatio > 0.5 ? 'up' : 'neutral'}
          description="Alpha divided by tracking error"
        />
        <MetricCard
          title="Tracking Error"
          value={formatPercentage(enhancedMetrics.trackingError)}
          subtitle="Benchmark deviation"
          icon={<AlertTriangle size={16} style={{ color: '#F59E0B' }} />}
          color="#F59E0B"
          description="Standard deviation of return differences vs benchmark"
        />
      </div>

      {/* Risk-Return Scatter Plot Mock */}
      <div 
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <h4 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
          Risk-Return Profile vs Benchmark
        </h4>
        <div 
          className="h-48 border-2 border-dashed rounded-lg flex items-center justify-center relative"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-primary)' }}
        >
          <div className="text-center">
            <BarChart3 size={32} className="mx-auto mb-2" style={{ color: 'var(--highlight)' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Risk-Return scatter plot visualization
            </p>
          </div>
          
          {/* Mock data points */}
          <div 
            className="absolute w-3 h-3 rounded-full bg-blue-500"
            style={{ left: '60%', bottom: '70%' }}
            title="Strategy"
          />
          <div 
            className="absolute w-3 h-3 rounded-full bg-gray-500"
            style={{ left: '45%', bottom: '50%' }}
            title="Benchmark"
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'risk', label: 'Risk Analysis', icon: <Shield size={16} /> },
    { id: 'returns', label: 'Return Analysis', icon: <TrendingUp size={16} /> },
    { id: 'consistency', label: 'Consistency', icon: <BarChart3 size={16} /> },
    { id: 'benchmark', label: 'Benchmark', icon: <Target size={16} /> }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Enhanced Performance Analysis
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Comprehensive risk and return metrics for {strategy.name} {strategy.version}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex space-x-4 text-sm">
          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(strategy.sharpe)}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
          </div>
          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(enhancedMetrics.informationRatio)}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Info Ratio</div>
          </div>
          <div className="text-center">
            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {formatPercentage(enhancedMetrics.consistency * 100, 0)}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Consistency</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'font-medium' : ''
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'var(--surface)',
              color: activeTab === tab.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent)' : 'var(--border)'}`
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'risk' && renderRiskMetrics()}
        {activeTab === 'returns' && renderReturnMetrics()}
        {activeTab === 'consistency' && renderConsistencyMetrics()}
        {activeTab === 'benchmark' && renderBenchmarkMetrics()}
      </div>
    </div>
  );
};

export default EnhancedPerformanceMetrics;
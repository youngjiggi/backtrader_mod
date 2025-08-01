import React, { useState } from 'react';
import { LineChart, TrendingUp, TrendingDown, BarChart3, Eye, EyeOff } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface StrategyComparisonChartProps {
  baseStrategy: RecentRun | null;
  comparisonStrategies: RecentRun[];
  timeInterval: string;
}

const StrategyComparisonChart: React.FC<StrategyComparisonChartProps> = ({
  baseStrategy,
  comparisonStrategies,
  timeInterval
}) => {
  const [visibleStrategies, setVisibleStrategies] = useState<Set<string>>(new Set());

  // Initialize all strategies as visible
  React.useEffect(() => {
    const allStrategyIds = new Set<string>();
    if (baseStrategy) allStrategyIds.add(baseStrategy.id);
    comparisonStrategies.forEach(s => allStrategyIds.add(s.id));
    setVisibleStrategies(allStrategyIds);
  }, [baseStrategy, comparisonStrategies]);

  const toggleStrategyVisibility = (strategyId: string) => {
    setVisibleStrategies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(strategyId)) {
        newSet.delete(strategyId);
      } else {
        newSet.add(strategyId);
      }
      return newSet;
    });
  };

  // Strategy colors
  const getStrategyColor = (strategyId: string, index: number) => {
    if (baseStrategy && strategyId === baseStrategy.id) {
      return '#eab308'; // Gold for base strategy
    }
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316'];
    return colors[index % colors.length];
  };

  // Mock chart data generation
  const generateChartData = (strategy: RecentRun) => {
    const startValue = 10000;
    const endValue = startValue * (1 + strategy.totalReturn / 100);
    const points = 30; // 30 data points
    const data = [];
    
    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      // Add some randomness for realistic curve
      const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
      const value = startValue + (endValue - startValue) * progress * randomFactor;
      data.push({
        date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        value: value
      });
    }
    return data;
  };

  const allStrategies = [...(baseStrategy ? [baseStrategy] : []), ...comparisonStrategies];
  
  if (allStrategies.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div
        className="border rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LineChart size={20} style={{ color: 'var(--highlight)' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Strategy Performance Comparison
              </h3>
              <span className="text-xs px-2 py-1 rounded" style={{ 
                backgroundColor: 'var(--highlight)', 
                color: 'var(--bg-primary)' 
              }}>
                {timeInterval}
              </span>
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {allStrategies.length} {allStrategies.length === 1 ? 'Strategy' : 'Strategies'}
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="p-6">
          <div
            className="border-2 border-dashed rounded-lg relative"
            style={{
              borderColor: 'var(--border)',
              height: '400px',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            {/* Chart Placeholder Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <BarChart3 size={48} className="mb-4" style={{ color: 'var(--highlight)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Performance Comparison Chart
              </h3>
              <p className="text-center mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Interactive line chart showing equity curves for selected strategies<br/>
                over the {timeInterval} time period with cumulative returns
              </p>
            </div>

            {/* Mock Performance Lines Overlay */}
            <div className="absolute inset-8 pointer-events-none">
              {allStrategies.map((strategy, index) => {
                const color = getStrategyColor(strategy.id, index);
                const isVisible = visibleStrategies.has(strategy.id);
                if (!isVisible) return null;
                
                return (
                  <div key={strategy.id} className="absolute inset-0">
                    {/* Simulated line chart path */}
                    <div 
                      className="absolute h-0.5 opacity-80 rounded"
                      style={{
                        backgroundColor: color,
                        left: '10%',
                        right: '10%',
                        top: `${20 + index * 8}%`,
                        transform: `rotate(${strategy.totalReturn > 0 ? 2 : -2}deg)`
                      }}
                    />
                    <div 
                      className="absolute h-0.5 opacity-60 rounded"
                      style={{
                        backgroundColor: color,
                        left: '30%',
                        right: '30%',
                        top: `${30 + index * 8}%`,
                        transform: `rotate(${strategy.totalReturn > 0 ? 1 : -1}deg)`
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Performance Summary Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {allStrategies.slice(0, 4).map((strategy, index) => {
                  const color = getStrategyColor(strategy.id, index);
                  const isVisible = visibleStrategies.has(strategy.id);
                  if (!isVisible) return null;
                  
                  return (
                    <div key={strategy.id} className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <div 
                          className="w-3 h-0.5 rounded"
                          style={{ backgroundColor: color }}
                        />
                        <span style={{ color: 'var(--text-primary)' }}>
                          {strategy.name}
                        </span>
                      </div>
                      <div className="font-semibold" style={{ color: color }}>
                        {strategy.totalReturn >= 0 ? '+' : ''}{strategy.totalReturn.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Legend and Controls */}
        <div
          className="border-t px-6 py-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {allStrategies.map((strategy, index) => {
                const color = getStrategyColor(strategy.id, index);
                const isVisible = visibleStrategies.has(strategy.id);
                const isBase = baseStrategy && strategy.id === baseStrategy.id;
                
                return (
                  <button
                    key={strategy.id}
                    onClick={() => toggleStrategyVisibility(strategy.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all text-sm ${
                      isVisible ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                      backgroundColor: isVisible ? 'var(--bg-primary)' : 'var(--surface)',
                      borderColor: color,
                      borderWidth: '2px'
                    }}
                  >
                    <div 
                      className="w-4 h-1 rounded"
                      style={{ backgroundColor: color }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>
                      {strategy.name} {strategy.version}
                      {isBase && ' (Portfolio)'}
                    </span>
                    <div className="flex items-center space-x-1">
                      {strategy.totalReturn >= 0 ? (
                        <TrendingUp size={12} className="text-green-500" />
                      ) : (
                        <TrendingDown size={12} className="text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          strategy.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {strategy.totalReturn >= 0 ? '+' : ''}{strategy.totalReturn.toFixed(1)}%
                      </span>
                    </div>
                    {isVisible ? (
                      <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
                    ) : (
                      <EyeOff size={14} style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Click strategies to show/hide • Right-click cards to manage comparison
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyComparisonChart;
import React from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Target, BarChart3, Download } from 'lucide-react';

interface BacktestData {
  id: string;
  name: string;
  version: string;
  date: string;
  symbol: string;
  timeframe: string;
  winRate: number;
  sharpe: number;
  totalReturn: number;
  maxDrawdown: number;
  totalTrades: number;
  avgHoldTime: string;
  keynote: string;
}

interface ComparisonScreenProps {
  selectedBacktests: BacktestData[];
  onBack: () => void;
}

const ComparisonScreen: React.FC<ComparisonScreenProps> = ({ selectedBacktests, onBack }) => {
  const metrics = [
    { key: 'totalReturn', label: 'Total Return', format: (val: number | string) => typeof val === 'number' ? `${val > 0 ? '+' : ''}${val.toFixed(1)}%` : String(val), type: 'percentage' },
    { key: 'winRate', label: 'Win Rate', format: (val: number | string) => typeof val === 'number' ? `${val.toFixed(1)}%` : String(val), type: 'percentage' },
    { key: 'sharpe', label: 'Sharpe Ratio', format: (val: number | string) => typeof val === 'number' ? val.toFixed(2) : String(val), type: 'number' },
    { key: 'maxDrawdown', label: 'Max Drawdown', format: (val: number | string) => typeof val === 'number' ? `${val.toFixed(1)}%` : String(val), type: 'percentage' },
    { key: 'totalTrades', label: 'Total Trades', format: (val: number | string) => typeof val === 'number' ? val.toString() : String(val), type: 'number' },
    { key: 'avgHoldTime', label: 'Avg Hold Time', format: (val: number | string) => String(val), type: 'string' }
  ];

  const getBestValue = (metricKey: string) => {
    if (metricKey === 'maxDrawdown') {
      return Math.max(...selectedBacktests.map(bt => bt[metricKey as keyof BacktestData] as number));
    }
    if (metricKey === 'avgHoldTime') {
      return selectedBacktests[0][metricKey as keyof BacktestData]; // Just return first for string comparison
    }
    return Math.max(...selectedBacktests.map(bt => bt[metricKey as keyof BacktestData] as number));
  };

  const isBestValue = (backtest: BacktestData, metricKey: string) => {
    const value = backtest[metricKey as keyof BacktestData];
    const bestValue = getBestValue(metricKey);
    
    if (metricKey === 'maxDrawdown') {
      return value === bestValue; // Highest (least negative) drawdown is best
    }
    return value === bestValue;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="border-b px-6 py-4"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
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
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Strategy Comparison
            </h1>
          </div>
          
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {selectedBacktests.map((backtest, index) => (
            <div
              key={backtest.id}
              className="border rounded-lg p-6"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {backtest.name}
                </h3>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: index === 0 ? 'var(--accent)' : 'var(--highlight)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  {index === 0 ? 'A' : index === 1 ? 'B' : 'C'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Symbol:</span>
                  <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{backtest.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Timeframe:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{backtest.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{new Date(backtest.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Charts Placeholder */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Performance Comparison
          </h2>
          <div
            className="border rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              minHeight: '300px'
            }}
          >
            <BarChart3 size={48} className="mx-auto mb-4" style={{ color: 'var(--highlight)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Interactive Charts Coming Soon
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Side-by-side equity curves, drawdown charts, and rolling metrics will be displayed here
            </p>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Detailed Metrics
          </h2>
          
          <div
            className="border rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <th
                      className="text-left py-4 px-6 font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      Metric
                    </th>
                    {selectedBacktests.map((backtest, index) => (
                      <th
                        key={backtest.id}
                        className="text-center py-4 px-6 font-medium"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: index === 0 ? 'var(--accent)' : 'var(--highlight)',
                              color: 'var(--bg-primary)'
                            }}
                          >
                            {index === 0 ? 'A' : index === 1 ? 'B' : 'C'}
                          </span>
                          <span className="hidden sm:inline">{backtest.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric) => (
                    <tr
                      key={metric.key}
                      className="border-b hover:bg-opacity-50 transition-colors"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td
                        className="py-4 px-6 font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <div className="flex items-center space-x-2">
                          {metric.key.includes('return') || metric.key.includes('Rate') ? (
                            <TrendingUp size={16} style={{ color: 'var(--highlight)' }} />
                          ) : metric.key.includes('drawdown') ? (
                            <TrendingDown size={16} style={{ color: 'var(--highlight)' }} />
                          ) : metric.key.includes('win') ? (
                            <Target size={16} style={{ color: 'var(--highlight)' }} />
                          ) : (
                            <BarChart3 size={16} style={{ color: 'var(--highlight)' }} />
                          )}
                          <span>{metric.label}</span>
                        </div>
                      </td>
                      {selectedBacktests.map((backtest) => {
                        const value = backtest[metric.key as keyof BacktestData];
                        const isString = typeof value === 'string';
                        const isBest = !isString && isBestValue(backtest, metric.key);
                        
                        return (
                          <td
                            key={backtest.id}
                            className="py-4 px-6 text-center font-medium"
                          >
                            <span
                              className={`${isBest ? 'font-bold' : ''}`}
                              style={{
                                color: isBest ? 'var(--accent)' : 
                                       metric.key === 'totalReturn' && typeof value === 'number' ? 
                                       (value > 0 ? '#10b981' : '#ef4444') : 'var(--text-primary)'
                              }}
                            >
                              {metric.format(value as number | string)}
                              {isBest && ' ★'}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Keynotes Comparison */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Strategy Notes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedBacktests.map((backtest, index) => (
              <div
                key={backtest.id}
                className="border rounded-lg p-4"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: index === 0 ? 'var(--accent)' : 'var(--highlight)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    {index === 0 ? 'A' : index === 1 ? 'B' : 'C'}
                  </span>
                  <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {backtest.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {backtest.keynote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonScreen;
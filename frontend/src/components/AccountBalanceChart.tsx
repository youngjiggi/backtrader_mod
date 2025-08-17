import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Eye, EyeOff } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface AccountBalanceChartProps {
  strategy: RecentRun;
  className?: string;
  showHeaders?: boolean; // Controls if headers and performance metrics are shown
  compact?: boolean; // Controls layout density
}

interface ChartPoint {
  date: string;
  balance: number;
  equity: number;
  drawdown: number;
  displayDate: string;
}

const AccountBalanceChart: React.FC<AccountBalanceChartProps> = ({ 
  strategy, 
  className = '',
  showHeaders = true, // Default to true for backward compatibility
  compact = false 
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [showEquity, setShowEquity] = useState(true);
  const [showDrawdown, setShowDrawdown] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // Process balance progression data
  const chartData = useMemo(() => {
    if (!strategy.accountData?.balanceProgression) return [];

    return strategy.accountData.balanceProgression.map(point => ({
      date: point.date,
      balance: point.balance,
      equity: point.equity,
      drawdown: point.drawdown,
      displayDate: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));
  }, [strategy.accountData?.balanceProgression]);

  // Calculate chart dimensions and scales
  const chartDimensions = useMemo(() => {
    if (chartData.length === 0) return null;

    const minBalance = Math.min(...chartData.map(d => Math.min(d.balance, d.equity)));
    const maxBalance = Math.max(...chartData.map(d => Math.max(d.balance, d.equity)));
    const maxDrawdown = Math.max(...chartData.map(d => Math.abs(d.drawdown)));
    
    const padding = (maxBalance - minBalance) * 0.1;
    
    return {
      minValue: minBalance - padding,
      maxValue: maxBalance + padding,
      maxDrawdown: maxDrawdown,
      range: maxBalance - minBalance + (2 * padding)
    };
  }, [chartData]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!strategy.accountData || chartData.length === 0) return null;

    const totalReturn = ((strategy.accountData.endingBalance - strategy.accountData.startingBalance) / strategy.accountData.startingBalance) * 100;
    const maxDrawdownPercent = (chartDimensions?.maxDrawdown || 0) / strategy.accountData.startingBalance * 100;
    const peakBalance = strategy.accountData.peakBalance;
    const currentDrawdown = ((peakBalance - strategy.accountData.endingBalance) / peakBalance) * 100;

    return {
      totalReturn,
      maxDrawdownPercent,
      currentDrawdown,
      startingBalance: strategy.accountData.startingBalance,
      endingBalance: strategy.accountData.endingBalance,
      peakBalance
    };
  }, [strategy.accountData, chartData, chartDimensions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Mock chart visualization (in production, you'd use a real charting library)
  const renderMockChart = () => {
    const chartHeight = 300;
    const chartWidth = 800;

    if (!chartDimensions || chartData.length === 0) {
      return (
        <div 
          className="border-2 border-dashed rounded-lg flex items-center justify-center"
          style={{ 
            height: chartHeight,
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-primary)'
          }}
        >
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto mb-4" style={{ color: 'var(--highlight)' }} />
            <h4 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Account Balance Chart
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              Balance progression visualization would appear here
            </p>
          </div>
        </div>
      );
    }

    // Simulate chart with mock data points
    const dataPoints = chartData.length > 50 ? 
      chartData.filter((_, i) => i % Math.ceil(chartData.length / 50) === 0) : 
      chartData;

    return (
      <div className="relative">
        <div 
          className="border rounded-lg p-4 relative overflow-hidden"
          style={{ 
            height: chartHeight,
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          {/* Y-axis labels */}
          <div className="absolute left-2 top-4 bottom-4 flex flex-col justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>{formatCurrency(chartDimensions.maxValue)}</span>
            <span>{formatCurrency((chartDimensions.maxValue + chartDimensions.minValue) / 2)}</span>
            <span>{formatCurrency(chartDimensions.minValue)}</span>
          </div>

          {/* Chart area */}
          <div className="ml-16 mr-4 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[0, 25, 50, 75, 100].map(percent => (
                <div
                  key={percent}
                  className="absolute w-full border-t opacity-20"
                  style={{ 
                    top: `${percent}%`,
                    borderColor: 'var(--border)'
                  }}
                />
              ))}
            </div>

            {/* Mock balance line */}
            {showBalance && (
              <div className="absolute inset-0">
                {dataPoints.slice(1).map((point, index) => {
                  const prevPoint = dataPoints[index];
                  const x1 = (index / (dataPoints.length - 1)) * 100;
                  const x2 = ((index + 1) / (dataPoints.length - 1)) * 100;
                  const y1 = ((chartDimensions.maxValue - prevPoint.balance) / chartDimensions.range) * 100;
                  const y2 = ((chartDimensions.maxValue - point.balance) / chartDimensions.range) * 100;

                  return (
                    <svg
                      key={`balance-${index}`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ overflow: 'visible' }}
                    >
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="var(--accent)"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    </svg>
                  );
                })}
              </div>
            )}

            {/* Mock equity line */}
            {showEquity && (
              <div className="absolute inset-0">
                {dataPoints.slice(1).map((point, index) => {
                  const prevPoint = dataPoints[index];
                  const x1 = (index / (dataPoints.length - 1)) * 100;
                  const x2 = ((index + 1) / (dataPoints.length - 1)) * 100;
                  const y1 = ((chartDimensions.maxValue - prevPoint.equity) / chartDimensions.range) * 100;
                  const y2 = ((chartDimensions.maxValue - point.equity) / chartDimensions.range) * 100;

                  return (
                    <svg
                      key={`equity-${index}`}
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ overflow: 'visible' }}
                    >
                      <line
                        x1={`${x1}%`}
                        y1={`${y1}%`}
                        x2={`${x2}%`}
                        y2={`${y2}%`}
                        stroke="#10B981"
                        strokeWidth="2"
                        opacity="0.6"
                        strokeDasharray="4,4"
                      />
                    </svg>
                  );
                })}
              </div>
            )}

            {/* Drawdown area */}
            {showDrawdown && (
              <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30" style={{ backgroundColor: '#EF4444' }}>
                <div className="text-xs text-center pt-2 text-white font-medium">Drawdown Area</div>
              </div>
            )}

            {/* Data point hover targets */}
            {dataPoints.map((point, index) => {
              const x = (index / (dataPoints.length - 1)) * 100;
              const y = ((chartDimensions.maxValue - point.balance) / chartDimensions.range) * 100;

              return (
                <div
                  key={`point-${index}`}
                  className="absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: 'var(--accent)',
                    border: '2px solid white'
                  }}
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-2 left-16 right-4 flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>{chartData[0]?.displayDate}</span>
            <span>Mid Period</span>
            <span>{chartData[chartData.length - 1]?.displayDate}</span>
          </div>

          {/* Hover tooltip */}
          {hoveredPoint && (
            <div 
              className="absolute z-10 p-3 rounded-lg shadow-lg border pointer-events-none"
              style={{ 
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                top: '20px',
                right: '20px'
              }}
            >
              <div className="text-sm font-medium mb-1">{hoveredPoint.displayDate}</div>
              <div className="space-y-1 text-xs">
                <div>Balance: {formatCurrency(hoveredPoint.balance)}</div>
                <div>Equity: {formatCurrency(hoveredPoint.equity)}</div>
                <div>Drawdown: {formatPercentage(hoveredPoint.drawdown)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${compact ? 'space-y-2' : 'space-y-4'} ${className}`}>
      {/* Header with Performance Summary - Only show if showHeaders is true */}
      {showHeaders && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Account Balance Progression
            </h3>
            {performanceMetrics && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <DollarSign size={14} style={{ color: 'var(--highlight)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Total Return:</span>
                  <span className={`font-medium ${performanceMetrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatPercentage(performanceMetrics.totalReturn)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingDown size={14} style={{ color: 'var(--highlight)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Max Drawdown:</span>
                  <span className="font-medium text-red-500">
                    -{formatPercentage(performanceMetrics.maxDrawdownPercent)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity size={14} style={{ color: 'var(--highlight)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Peak Balance:</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(performanceMetrics.peakBalance)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Balance Summary Cards */}
          {performanceMetrics && (
            <div className="flex space-x-4">
              <div 
                className="p-3 rounded-lg border text-center"
                style={{ 
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Starting</div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(performanceMetrics.startingBalance)}
                </div>
              </div>
              <div 
                className="p-3 rounded-lg border text-center"
                style={{ 
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ending</div>
                <div className={`font-medium ${performanceMetrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(performanceMetrics.endingBalance)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chart Controls - Only show if showHeaders is true */}
      {showHeaders && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded transition-colors ${
                showBalance ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: showBalance ? 'rgba(59, 130, 246, 0.1)' : 'var(--surface)',
                borderColor: showBalance ? 'var(--accent)' : 'var(--border)',
                color: showBalance ? 'var(--accent)' : 'var(--text-secondary)',
                border: '1px solid',
                ringColor: 'var(--accent)'
              }}
            >
              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Balance</span>
            </button>
            
            <button
              onClick={() => setShowEquity(!showEquity)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded transition-colors ${
                showEquity ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: showEquity ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
                borderColor: showEquity ? '#10B981' : 'var(--border)',
                color: showEquity ? '#10B981' : 'var(--text-secondary)',
                border: '1px solid',
                ringColor: '#10B981'
              }}
            >
              {showEquity ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Equity</span>
            </button>
            
            <button
              onClick={() => setShowDrawdown(!showDrawdown)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm rounded transition-colors ${
                showDrawdown ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: showDrawdown ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)',
                borderColor: showDrawdown ? '#EF4444' : 'var(--border)',
                color: showDrawdown ? '#EF4444' : 'var(--text-secondary)',
                border: '1px solid',
                ringColor: '#EF4444'
              }}
            >
              {showDrawdown ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Drawdown</span>
            </button>
          </div>

          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {chartData.length} data points • Hover for details
          </div>
        </div>
      )}

      {/* Chart */}
      {renderMockChart()}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
          <span style={{ color: 'var(--text-secondary)' }}>Account Balance</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 rounded bg-green-500" style={{ borderTop: '2px dashed #10B981', borderBottom: '2px dashed #10B981' }}></div>
          <span style={{ color: 'var(--text-secondary)' }}>Equity</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-2 rounded bg-red-500 opacity-30"></div>
          <span style={{ color: 'var(--text-secondary)' }}>Drawdown</span>
        </div>
      </div>
    </div>
  );
};

// Export helper function to get performance metrics for other components
export const getPerformanceMetrics = (strategy: RecentRun) => {
  if (!strategy.accountData) return null;

  const totalReturn = ((strategy.accountData.endingBalance - strategy.accountData.startingBalance) / strategy.accountData.startingBalance) * 100;
  const maxDrawdownPercent = (strategy.accountData.maxDrawdown || 0) / strategy.accountData.startingBalance * 100;
  const peakBalance = strategy.accountData.peakBalance;
  const currentDrawdown = ((peakBalance - strategy.accountData.endingBalance) / peakBalance) * 100;

  return {
    totalReturn,
    maxDrawdownPercent,
    currentDrawdown,
    startingBalance: strategy.accountData.startingBalance,
    endingBalance: strategy.accountData.endingBalance,
    peakBalance
  };
};

export default AccountBalanceChart;
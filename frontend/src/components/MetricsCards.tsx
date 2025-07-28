import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Clock, Activity } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, icon }) => {
  return (
    <div
      className="p-6 rounded-lg border transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span style={{ color: 'var(--highlight)' }}>
          {icon}
        </span>
        {change && (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp size={16} className="text-green-500" />
            ) : (
              <TrendingDown size={16} className="text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
      
      <div>
        <h3
          className="text-2xl font-bold mb-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </h3>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </p>
      </div>
    </div>
  );
};

type TimePeriod = '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y';

const MetricsCards: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('YTD');

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: 'YTD', label: 'YTD' },
    { value: '1Y', label: '1Y' },
    { value: '5Y', label: '5Y' }
  ];

  // Performance data for different time periods
  const performanceData = {
    '1W': {
      strategyReturn: '+2.3%',
      strategyChange: '+0.8%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+1.2%', outperformance: '+1.1%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+1.8%', outperformance: '+0.5%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '-0.3%', outperformance: '+2.6%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+0.9%', outperformance: '+1.4%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+1.1%', outperformance: '+1.2%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+0.1%', outperformance: '+2.2%', isOutperforming: true }
      ]
    },
    '1M': {
      strategyReturn: '+8.4%',
      strategyChange: '+1.2%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+5.8%', outperformance: '+2.6%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+6.9%', outperformance: '+1.5%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+2.1%', outperformance: '+6.3%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+4.8%', outperformance: '+3.6%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+5.5%', outperformance: '+2.9%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+0.8%', outperformance: '+7.6%', isOutperforming: true }
      ]
    },
    '3M': {
      strategyReturn: '+18.9%',
      strategyChange: '+1.8%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+12.4%', outperformance: '+6.5%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+15.2%', outperformance: '+3.7%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+4.8%', outperformance: '+14.1%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+9.8%', outperformance: '+9.1%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+11.9%', outperformance: '+7.0%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+1.9%', outperformance: '+17.0%', isOutperforming: true }
      ]
    },
    '6M': {
      strategyReturn: '+22.1%',
      strategyChange: '+2.0%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+16.8%', outperformance: '+5.3%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+19.4%', outperformance: '+2.7%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+6.9%', outperformance: '+15.2%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+13.2%', outperformance: '+8.9%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+16.1%', outperformance: '+6.0%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+2.8%', outperformance: '+19.3%', isOutperforming: true }
      ]
    },
    'YTD': {
      strategyReturn: '+24.7%',
      strategyChange: '+2.1%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+18.2%', outperformance: '+6.5%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+21.8%', outperformance: '+2.9%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+8.4%', outperformance: '+16.3%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+15.6%', outperformance: '+9.1%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+17.9%', outperformance: '+6.8%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+3.2%', outperformance: '+21.5%', isOutperforming: true }
      ]
    },
    '1Y': {
      strategyReturn: '+31.8%',
      strategyChange: '+2.4%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+24.1%', outperformance: '+7.7%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+28.9%', outperformance: '+2.9%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+12.8%', outperformance: '+19.0%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+19.4%', outperformance: '+12.4%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+23.2%', outperformance: '+8.6%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+4.8%', outperformance: '+27.0%', isOutperforming: true }
      ]
    },
    '5Y': {
      strategyReturn: '+184.2%',
      strategyChange: '+8.1%',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+98.4%', outperformance: '+85.8%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+142.1%', outperformance: '+42.1%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+48.9%', outperformance: '+135.3%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+76.2%', outperformance: '+108.0%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+94.8%', outperformance: '+89.4%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+18.9%', outperformance: '+165.3%', isOutperforming: true }
      ]
    }
  };

  const currentData = performanceData[selectedPeriod];
  const outperformingCount = currentData.benchmarks.filter(b => b.isOutperforming).length;

  const metrics = [
    {
      title: `Strategy Return (${selectedPeriod})`,
      value: currentData.strategyReturn,
      change: currentData.strategyChange,
      isPositive: true,
      icon: <TrendingUp size={24} />
    },
    {
      title: 'Win Rate',
      value: '68.4%',
      change: '+1.2%',
      isPositive: true,
      icon: <Target size={24} />
    },
    {
      title: 'Sharpe Ratio',
      value: '1.84',
      change: '-0.05',
      isPositive: false,
      icon: <BarChart3 size={24} />
    },
    {
      title: 'Max Drawdown',
      value: '-8.2%',
      change: '+0.8%',
      isPositive: true,
      icon: <TrendingDown size={24} />
    },
    {
      title: 'Total Trades',
      value: '1,247',
      change: '+43',
      isPositive: true,
      icon: <DollarSign size={24} />
    },
    {
      title: 'Avg Hold Time',
      value: '3.2d',
      change: '-0.1d',
      isPositive: true,
      icon: <Clock size={24} />
    }
  ];


  return (
    <div className="space-y-8">
      {/* Strategy Performance Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Strategy Performance
        </h2>
        <div className="flex items-center space-x-2">
          {/* Time Period Selector */}
          <div className="flex items-center space-x-1 p-1 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            {timePeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
                  selectedPeriod === period.value ? 'font-bold' : ''
                }`}
                style={{
                  backgroundColor: selectedPeriod === period.value ? 'var(--accent)' : 'transparent',
                  color: selectedPeriod === period.value ? 'var(--bg-primary)' : 'var(--text-secondary)'
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Strategy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Market Benchmark Comparison */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Activity size={20} style={{ color: 'var(--highlight)' }} />
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            vs. Market Benchmarks
          </h3>
        </div>
        
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentData.benchmarks.map((benchmark, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className="font-semibold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {benchmark.name}
                      </span>
                      <span
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: benchmark.isOutperforming ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: benchmark.isOutperforming ? '#10b981' : '#ef4444'
                        }}
                      >
                        {benchmark.isOutperforming ? 'BEAT' : 'BEHIND'}
                      </span>
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {benchmark.fullName}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div
                    className="text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {benchmark.return}
                  </div>
                  <div className="flex items-center space-x-1">
                    {benchmark.isOutperforming ? (
                      <TrendingUp size={12} className="text-green-500" />
                    ) : (
                      <TrendingDown size={12} className="text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        benchmark.isOutperforming ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {benchmark.outperformance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-green-500" />
                <span
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Strategy outperforming all tracked benchmarks
                </span>
              </div>
              <span
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981'
                }}
              >
                {outperformingCount}/{currentData.benchmarks.length} Benchmarks Beat
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
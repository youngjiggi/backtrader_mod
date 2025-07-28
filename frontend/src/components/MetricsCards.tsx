import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3, Clock, Activity } from 'lucide-react';
import Tooltip from './Tooltip';
import DateRangeModal from './DateRangeModal';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  tooltip?: {
    title: string;
    definition: string;
    formula?: string;
    learnMoreUrl?: string;
  } | null;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, icon, tooltip }) => {
  const cardContent = (
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

  // Wrap with tooltip if tooltip data is provided
  if (tooltip) {
    return (
      <Tooltip
        title={tooltip.title}
        definition={tooltip.definition}
        formula={tooltip.formula}
        learnMoreUrl={tooltip.learnMoreUrl}
      >
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
};

type TimePeriod = '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'Custom';

const MetricsCards: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('YTD');
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const timePeriods: { value: TimePeriod; label: string }[] = [
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
    { value: '3M', label: '3M' },
    { value: '6M', label: '6M' },
    { value: 'YTD', label: 'YTD' },
    { value: '1Y', label: '1Y' },
    { value: '5Y', label: '5Y' },
    { value: 'Custom', label: 'Custom' }
  ];

  // Performance data for different time periods
  const performanceData = {
    '1W': {
      strategyReturn: '+2.3%',
      strategyChange: '+0.8%',
      winRate: '71.2%',
      winRateChange: '+2.8%',
      sharpeRatio: '1.92',
      sharpeChange: '+0.08',
      maxDrawdown: '-1.8%',
      drawdownChange: '+0.4%',
      totalTrades: '24',
      tradesChange: '+8',
      avgHoldTime: '2.1d',
      holdTimeChange: '-0.2d',
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
      winRate: '69.8%',
      winRateChange: '+1.4%',
      sharpeRatio: '1.76',
      sharpeChange: '-0.08',
      maxDrawdown: '-4.2%',
      drawdownChange: '+1.6%',
      totalTrades: '127',
      tradesChange: '+15',
      avgHoldTime: '2.8d',
      holdTimeChange: '-0.4d',
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
      winRate: '67.9%',
      winRateChange: '-0.5%',
      sharpeRatio: '1.68',
      sharpeChange: '+0.16',
      maxDrawdown: '-6.8%',
      drawdownChange: '+0.6%',
      totalTrades: '389',
      tradesChange: '+52',
      avgHoldTime: '3.1d',
      holdTimeChange: '+0.1d',
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
      winRate: '66.8%',
      winRateChange: '-1.1%',
      sharpeRatio: '1.72',
      sharpeChange: '+0.04',
      maxDrawdown: '-7.9%',
      drawdownChange: '-0.3%',
      totalTrades: '698',
      tradesChange: '+89',
      avgHoldTime: '3.4d',
      holdTimeChange: '+0.2d',
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
      winRate: '68.4%',
      winRateChange: '+1.2%',
      sharpeRatio: '1.84',
      sharpeChange: '-0.05',
      maxDrawdown: '-8.2%',
      drawdownChange: '+0.8%',
      totalTrades: '1,247',
      tradesChange: '+43',
      avgHoldTime: '3.2d',
      holdTimeChange: '-0.1d',
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
      winRate: '70.2%',
      winRateChange: '+1.8%',
      sharpeRatio: '1.96',
      sharpeChange: '+0.12',
      maxDrawdown: '-9.1%',
      drawdownChange: '-0.9%',
      totalTrades: '2,184',
      tradesChange: '+156',
      avgHoldTime: '3.8d',
      holdTimeChange: '+0.6d',
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
      winRate: '72.8%',
      winRateChange: '+4.4%',
      sharpeRatio: '2.14',
      sharpeChange: '+0.30',
      maxDrawdown: '-12.4%',
      drawdownChange: '-4.2%',
      totalTrades: '8,923',
      tradesChange: '+1,267',
      avgHoldTime: '4.2d',
      holdTimeChange: '+1.0d',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+98.4%', outperformance: '+85.8%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+142.1%', outperformance: '+42.1%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+48.9%', outperformance: '+135.3%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+76.2%', outperformance: '+108.0%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+94.8%', outperformance: '+89.4%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+18.9%', outperformance: '+165.3%', isOutperforming: true }
      ]
    },
    'Custom': {
      strategyReturn: '+16.4%',
      strategyChange: '+1.7%',
      winRate: '68.9%',
      winRateChange: '+0.5%',
      sharpeRatio: '1.78',
      sharpeChange: '+0.06',
      maxDrawdown: '-5.8%',
      drawdownChange: '+1.4%',
      totalTrades: '542',
      tradesChange: '+28',
      avgHoldTime: '3.0d',
      holdTimeChange: '-0.2d',
      benchmarks: [
        { name: 'SPX', fullName: 'S&P 500', return: '+11.2%', outperformance: '+5.2%', isOutperforming: true },
        { name: 'QQQ', fullName: 'NASDAQ 100', return: '+14.1%', outperformance: '+2.3%', isOutperforming: true },
        { name: 'GLD', fullName: 'Gold ETF', return: '+3.8%', outperformance: '+12.6%', isOutperforming: true },
        { name: 'IWM', fullName: 'Russell 2000', return: '+8.9%', outperformance: '+7.5%', isOutperforming: true },
        { name: 'VTI', fullName: 'Total Stock Market', return: '+10.7%', outperformance: '+5.7%', isOutperforming: true },
        { name: 'BND', fullName: 'Total Bond Market', return: '+2.1%', outperformance: '+14.3%', isOutperforming: true }
      ]
    }
  };

  const currentData = performanceData[selectedPeriod];
  const outperformingCount = currentData.benchmarks.filter(b => b.isOutperforming).length;

  // Handle time period selection
  const handlePeriodSelect = (period: TimePeriod) => {
    if (period === 'Custom') {
      setIsDateRangeModalOpen(true);
    } else {
      setSelectedPeriod(period);
    }
  };

  // Handle custom date range selection
  const handleDateRangeSelect = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setSelectedPeriod('Custom');
    setIsDateRangeModalOpen(false);
  };

  // Format custom date range for display
  const formatCustomPeriodLabel = () => {
    if (selectedPeriod === 'Custom' && customStartDate && customEndDate) {
      const start = new Date(customStartDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      const end = new Date(customEndDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      return `${start} - ${end}`;
    }
    return selectedPeriod;
  };

  // Tooltip definitions for technical terms
  const tooltipDefinitions = {
    winRate: {
      title: "Win Rate",
      definition: "The percentage of profitable trades out of the total number of trades executed. A higher win rate indicates more consistent profitable trading.",
      formula: "(Profitable Trades ÷ Total Trades) × 100",
      learnMoreUrl: "https://www.investopedia.com/terms/w/win-loss-ratio.asp"
    },
    sharpeRatio: {
      title: "Sharpe Ratio",
      definition: "A measure of risk-adjusted return that calculates excess return per unit of risk. Values above 1.0 are considered good, above 2.0 are excellent.",
      formula: "(Portfolio Return - Risk-free Rate) ÷ Portfolio Standard Deviation",
      learnMoreUrl: "https://www.investopedia.com/terms/s/sharperatio.asp"
    },
    maxDrawdown: {
      title: "Maximum Drawdown",
      definition: "The largest peak-to-trough decline in portfolio value during a specific period. It measures the worst-case scenario loss an investor would have experienced.",
      formula: "(Trough Value - Peak Value) ÷ Peak Value × 100",
      learnMoreUrl: "https://www.investopedia.com/terms/m/maximum-drawdown-mdd.asp"
    },
    totalTrades: {
      title: "Total Trades",
      definition: "The total number of completed buy and sell transactions executed by the strategy during the selected time period.",
      learnMoreUrl: "https://www.investopedia.com/terms/t/trade.asp"
    },
    avgHoldTime: {
      title: "Average Hold Time",
      definition: "The average duration that positions are held before being closed. Shorter hold times indicate more active trading strategies.",
      formula: "Sum of all holding periods ÷ Number of trades",
      learnMoreUrl: "https://www.investopedia.com/terms/h/holdingperiod.asp"
    }
  };

  const metrics = [
    {
      title: `Strategy Return (${formatCustomPeriodLabel()})`,
      value: currentData.strategyReturn,
      change: currentData.strategyChange,
      isPositive: true,
      icon: <TrendingUp size={24} />,
      tooltip: null
    },
    {
      title: 'Win Rate',
      value: currentData.winRate,
      change: currentData.winRateChange,
      isPositive: currentData.winRateChange.startsWith('+'),
      icon: <Target size={24} />,
      tooltip: tooltipDefinitions.winRate
    },
    {
      title: 'Sharpe Ratio',
      value: currentData.sharpeRatio,
      change: currentData.sharpeChange,
      isPositive: currentData.sharpeChange.startsWith('+'),
      icon: <BarChart3 size={24} />,
      tooltip: tooltipDefinitions.sharpeRatio
    },
    {
      title: 'Max Drawdown',
      value: currentData.maxDrawdown,
      change: currentData.drawdownChange,
      isPositive: currentData.drawdownChange.startsWith('+'),
      icon: <TrendingDown size={24} />,
      tooltip: tooltipDefinitions.maxDrawdown
    },
    {
      title: 'Total Trades',
      value: currentData.totalTrades,
      change: currentData.tradesChange,
      isPositive: currentData.tradesChange.startsWith('+'),
      icon: <DollarSign size={24} />,
      tooltip: tooltipDefinitions.totalTrades
    },
    {
      title: 'Avg Hold Time',
      value: currentData.avgHoldTime,
      change: currentData.holdTimeChange,
      isPositive: currentData.holdTimeChange.startsWith('+'),
      icon: <Clock size={24} />,
      tooltip: tooltipDefinitions.avgHoldTime
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
                onClick={() => handlePeriodSelect(period.value)}
                className={`px-3 py-1 text-sm font-medium rounded transition-all duration-200 ${
                  selectedPeriod === period.value ? 'font-bold' : ''
                }`}
                style={{
                  backgroundColor: selectedPeriod === period.value ? 'var(--accent)' : 'transparent',
                  color: selectedPeriod === period.value ? 'var(--bg-primary)' : 'var(--text-secondary)'
                }}
              >
                {period.value === 'Custom' && selectedPeriod === 'Custom' && customStartDate 
                  ? 'Custom' 
                  : period.label}
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
            tooltip={metric.tooltip}
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

      {/* Date Range Modal */}
      <DateRangeModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        onDateRangeSelect={handleDateRangeSelect}
        currentStartDate={customStartDate}
        currentEndDate={customEndDate}
      />
    </div>
  );
};

export default MetricsCards;
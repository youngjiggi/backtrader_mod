import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, BarChart3, Target, Plus, X, GripHorizontal } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface BenchmarkData {
  name: string;
  symbol: string;
  totalReturn: number;
  winRate: number;
  sharpe: number;
  maxDrawdown: number;
  volatility: number;
  // Time-period specific data
  periodData?: {
    [key: string]: {
      totalReturn: number;
      winRate: number;
      sharpe: number;
      maxDrawdown: number;
      volatility: number;
    }
  };
}

interface BenchmarkComparisonProps {
  selectedRun: RecentRun | null;
  timeInterval: string;
}

const BenchmarkComparison: React.FC<BenchmarkComparisonProps> = ({ selectedRun, timeInterval }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customBenchmarks, setCustomBenchmarks] = useState<BenchmarkData[]>([]);
  const [showAddBenchmark, setShowAddBenchmark] = useState(false);
  const [newBenchmarkSymbol, setNewBenchmarkSymbol] = useState('');
  const [selectedPopularAssets, setSelectedPopularAssets] = useState<string[]>([]);
  const [sectionHeight, setSectionHeight] = useState(300);
  const [isResizing, setIsResizing] = useState(false);

  // Move useCallback to top level to maintain hooks order
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startY = e.clientY;
    const startHeight = sectionHeight;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(200, Math.min(600, startHeight + deltaY));
      setSectionHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [sectionHeight]);

  // Get metrics for the current time period - for strategy
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

  // Get metrics for the current time period - for benchmarks
  const getBenchmarkPeriodMetrics = (benchmark: BenchmarkData, period: string) => {
    if (benchmark.periodData && benchmark.periodData[period]) {
      return benchmark.periodData[period];
    }
    // Fallback to default metrics if period data not available
    return {
      totalReturn: benchmark.totalReturn,
      winRate: benchmark.winRate,
      sharpe: benchmark.sharpe,
      maxDrawdown: benchmark.maxDrawdown,
      volatility: benchmark.volatility
    };
  };

  // Sample benchmark data - in real app this would come from props or API
  const benchmarks: BenchmarkData[] = [
    {
      name: 'S&P 500',
      symbol: 'SPY',
      totalReturn: 13.2,
      winRate: 58.3,
      sharpe: 0.85,
      maxDrawdown: -12.5,
      volatility: 18.2,
      periodData: {
        '1M': { totalReturn: 1.2, winRate: 55.1, sharpe: 0.65, maxDrawdown: -3.8, volatility: 16.5 },
        '3M': { totalReturn: 4.1, winRate: 56.8, sharpe: 0.72, maxDrawdown: -7.2, volatility: 17.1 },
        '6M': { totalReturn: 8.5, winRate: 57.9, sharpe: 0.79, maxDrawdown: -9.8, volatility: 17.8 },
        '1Y': { totalReturn: 13.2, winRate: 58.3, sharpe: 0.85, maxDrawdown: -12.5, volatility: 18.2 },
        'YTD': { totalReturn: 0.9, winRate: 54.2, sharpe: 0.58, maxDrawdown: -3.1, volatility: 15.8 },
        'All': { totalReturn: 13.2, winRate: 58.3, sharpe: 0.85, maxDrawdown: -12.5, volatility: 18.2 }
      }
    },
    {
      name: 'Buy & Hold',
      symbol: selectedRun?.symbol || 'AAPL',
      totalReturn: 15.8,
      winRate: 62.1,
      sharpe: 0.92,
      maxDrawdown: -18.3,
      volatility: 22.4,
      periodData: {
        '1M': { totalReturn: 1.8, winRate: 58.5, sharpe: 0.68, maxDrawdown: -4.2, volatility: 20.1 },
        '3M': { totalReturn: 5.2, winRate: 60.1, sharpe: 0.78, maxDrawdown: -8.1, volatility: 21.2 },
        '6M': { totalReturn: 9.8, winRate: 61.3, sharpe: 0.86, maxDrawdown: -12.7, volatility: 21.8 },
        '1Y': { totalReturn: 15.8, winRate: 62.1, sharpe: 0.92, maxDrawdown: -18.3, volatility: 22.4 },
        'YTD': { totalReturn: 1.1, winRate: 57.8, sharpe: 0.62, maxDrawdown: -3.5, volatility: 19.6 },
        'All': { totalReturn: 15.8, winRate: 62.1, sharpe: 0.92, maxDrawdown: -18.3, volatility: 22.4 }
      }
    },
    {
      name: 'Nasdaq 100',
      symbol: 'QQQ',
      totalReturn: 16.7,
      winRate: 61.2,
      sharpe: 0.89,
      maxDrawdown: -15.2,
      volatility: 20.8,
      periodData: {
        '1M': { totalReturn: 2.1, winRate: 57.8, sharpe: 0.71, maxDrawdown: -4.1, volatility: 18.9 },
        '3M': { totalReturn: 6.2, winRate: 59.5, sharpe: 0.81, maxDrawdown: -8.5, volatility: 19.7 },
        '6M': { totalReturn: 11.1, winRate: 60.6, sharpe: 0.86, maxDrawdown: -11.8, volatility: 20.2 },
        '1Y': { totalReturn: 16.7, winRate: 61.2, sharpe: 0.89, maxDrawdown: -15.2, volatility: 20.8 },
        'YTD': { totalReturn: 1.5, winRate: 56.9, sharpe: 0.65, maxDrawdown: -3.2, volatility: 18.1 },
        'All': { totalReturn: 16.7, winRate: 61.2, sharpe: 0.89, maxDrawdown: -15.2, volatility: 20.8 }
      }
    }
  ];

  if (!selectedRun) {
    return null;
  }

  const getComparisonColor = (strategyValue: number, benchmarkValue: number, higherIsBetter: boolean = true) => {
    const isStrategyBetter = higherIsBetter ? strategyValue > benchmarkValue : strategyValue < benchmarkValue;
    return isStrategyBetter ? '#10b981' : '#ef4444';
  };

  const getComparisonIcon = (strategyValue: number, benchmarkValue: number, higherIsBetter: boolean = true) => {
    const isStrategyBetter = higherIsBetter ? strategyValue > benchmarkValue : strategyValue < benchmarkValue;
    return isStrategyBetter ? TrendingUp : TrendingDown;
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };


  const popularAssets = [
    { symbol: 'BTC-USD', name: 'Bitcoin', category: 'Crypto' },
    { symbol: 'ETH-USD', name: 'Ethereum', category: 'Crypto' },
    { symbol: 'GLD', name: 'Gold ETF', category: 'Commodities' },
    { symbol: 'TLT', name: '20+ Year Treasury', category: 'Bonds' },
    { symbol: 'VTI', name: 'Total Stock Market', category: 'ETF' },
    { symbol: 'VXUS', name: 'International Stocks', category: 'ETF' }
  ];

  const createBenchmarkData = (symbol: string): BenchmarkData => {
    const generatePeriodData = () => {
      const baseReturn = Math.random() * 30 - 5;
      return {
        '1M': {
          totalReturn: baseReturn * 0.08 + (Math.random() - 0.5) * 2,
          winRate: 50 + Math.random() * 20,
          sharpe: Math.random() * 1.5,
          maxDrawdown: -(Math.random() * 5 + 1),
          volatility: Math.random() * 10 + 8
        },
        '3M': {
          totalReturn: baseReturn * 0.25 + (Math.random() - 0.5) * 3,
          winRate: 52 + Math.random() * 18,
          sharpe: Math.random() * 1.8,
          maxDrawdown: -(Math.random() * 8 + 2),
          volatility: Math.random() * 12 + 10
        },
        '6M': {
          totalReturn: baseReturn * 0.5 + (Math.random() - 0.5) * 4,
          winRate: 54 + Math.random() * 16,
          sharpe: Math.random() * 2,
          maxDrawdown: -(Math.random() * 12 + 3),
          volatility: Math.random() * 15 + 12
        },
        '1Y': {
          totalReturn: baseReturn,
          winRate: 55 + Math.random() * 15,
          sharpe: Math.random() * 2.2,
          maxDrawdown: -(Math.random() * 20 + 5),
          volatility: Math.random() * 18 + 15
        },
        'YTD': {
          totalReturn: baseReturn * 0.1 + (Math.random() - 0.5) * 1.5,
          winRate: 48 + Math.random() * 24,
          sharpe: Math.random() * 1.3,
          maxDrawdown: -(Math.random() * 4 + 0.5),
          volatility: Math.random() * 8 + 6
        },
        'All': {
          totalReturn: baseReturn,
          winRate: 55 + Math.random() * 15,
          sharpe: Math.random() * 2.2,
          maxDrawdown: -(Math.random() * 20 + 5),
          volatility: Math.random() * 18 + 15
        }
      };
    };

    const periodData = generatePeriodData();
    return {
      name: symbol.toUpperCase(),
      symbol: symbol.toUpperCase(),
      totalReturn: periodData['1Y'].totalReturn,
      winRate: periodData['1Y'].winRate,
      sharpe: periodData['1Y'].sharpe,
      maxDrawdown: periodData['1Y'].maxDrawdown,
      volatility: periodData['1Y'].volatility,
      periodData
    };
  };

  const handleAddBenchmark = () => {
    const symbolsToAdd: string[] = [];
    
    // Add symbols from text input (comma or space separated)
    if (newBenchmarkSymbol.trim()) {
      const inputSymbols = newBenchmarkSymbol
        .split(/[,\s]+/)
        .map(s => s.trim().toUpperCase())
        .filter(s => s.length > 0);
      symbolsToAdd.push(...inputSymbols);
    }
    
    // Add selected popular assets
    symbolsToAdd.push(...selectedPopularAssets);
    
    // Remove duplicates and filter out already existing benchmarks
    const existingSymbols = [...benchmarks, ...customBenchmarks].map(b => b.symbol);
    const uniqueNewSymbols = [...new Set(symbolsToAdd)].filter(symbol => 
      !existingSymbols.includes(symbol)
    );
    
    if (uniqueNewSymbols.length > 0) {
      const newBenchmarks = uniqueNewSymbols.map(symbol => createBenchmarkData(symbol));
      setCustomBenchmarks(prev => [...prev, ...newBenchmarks]);
      setNewBenchmarkSymbol('');
      setSelectedPopularAssets([]);
      setShowAddBenchmark(false);
    }
  };

  const togglePopularAsset = (symbol: string) => {
    setSelectedPopularAssets(prev => 
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const handleRemoveBenchmark = (symbol: string) => {
    setCustomBenchmarks(prev => prev.filter(b => b.symbol !== symbol));
  };

  const allBenchmarks = [...benchmarks, ...customBenchmarks];

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
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <BarChart3 size={18} style={{ color: 'var(--highlight)' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                vs Market Benchmarks
              </h3>
              <span className="text-xs px-2 py-1 rounded" style={{ 
                backgroundColor: 'var(--highlight)', 
                color: 'var(--bg-primary)' 
              }}>
                {selectedRun.name} {selectedRun.version}
              </span>
              {isExpanded ? (
                <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddBenchmark(!showAddBenchmark)}
                className="p-1.5 rounded-lg border transition-colors hover:bg-opacity-80"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
                title="Add benchmark"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Add Benchmark Section */}
        {showAddBenchmark && (
          <div className="border-t px-6 py-3" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Add Custom Benchmark
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newBenchmarkSymbol}
                    onChange={(e) => setNewBenchmarkSymbol(e.target.value.toUpperCase())}
                    placeholder="Enter symbols (e.g., TSLA, BTC-USD, AAPL)"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                  />
                  <button
                    onClick={handleAddBenchmark}
                    disabled={!newBenchmarkSymbol.trim() && selectedPopularAssets.length === 0}
                    className="px-3 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    Add ({(newBenchmarkSymbol.split(/[,\s]+/).filter(s => s.trim()).length + selectedPopularAssets.length) || 0})
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Separate multiple symbols with commas or spaces
                </p>
              </div>
              
              {/* Popular Assets */}
              <div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Popular Assets (click to select multiple):
                </p>
                <div className="flex flex-wrap gap-1">
                  {popularAssets.map((asset) => {
                    const isSelected = selectedPopularAssets.includes(asset.symbol);
                    const isAlreadyAdded = [...benchmarks, ...customBenchmarks].some(b => b.symbol === asset.symbol);
                    
                    return (
                      <button
                        key={asset.symbol}
                        onClick={() => !isAlreadyAdded && togglePopularAsset(asset.symbol)}
                        disabled={isAlreadyAdded}
                        className={`px-2 py-1 text-xs rounded border transition-colors hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isSelected ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'var(--accent)' : 'var(--surface)',
                          borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                          color: isSelected ? 'var(--bg-primary)' : 'var(--text-primary)',
                          '--tw-ring-color': 'var(--accent)'
                        }}
                        title={isAlreadyAdded ? 'Already added as benchmark' : `${asset.name} (${asset.category})`}
                      >
                        {asset.symbol}
                        {isSelected && ' ✓'}
                      </button>
                    );
                  })}
                </div>
                {selectedPopularAssets.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Selected: {selectedPopularAssets.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="relative">
            <div 
              className="px-6 pb-4 overflow-y-auto"
              style={{ 
                height: `${sectionHeight}px`,
                maxHeight: '600px',
                minHeight: '200px'
              }}
            >
              <div className="space-y-3">
                {allBenchmarks.map((benchmark, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-base" style={{ color: 'var(--text-primary)' }}>
                        {benchmark.name}
                      </h4>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {benchmark.symbol}
                      </p>
                    </div>
                    {customBenchmarks.some(cb => cb.symbol === benchmark.symbol) && (
                      <button
                        onClick={() => handleRemoveBenchmark(benchmark.symbol)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
                        title="Remove benchmark"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Comparison Grid - More Compact */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {(() => {
                      const strategyMetrics = getCurrentPeriodMetrics(selectedRun, timeInterval);
                      const benchmarkMetrics = getBenchmarkPeriodMetrics(benchmark, timeInterval);
                      
                      return (
                        <>
                          {/* Total Return */}
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              {(() => {
                                const Icon = getComparisonIcon(strategyMetrics.totalReturn, benchmarkMetrics.totalReturn);
                                return <Icon size={12} style={{ color: getComparisonColor(strategyMetrics.totalReturn, benchmarkMetrics.totalReturn) }} />;
                              })()}
                              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Return
                              </span>
                            </div>
                            <div className="text-sm font-bold" style={{ color: getComparisonColor(strategyMetrics.totalReturn, benchmarkMetrics.totalReturn) }}>
                              {formatPercentage(strategyMetrics.totalReturn)}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              vs {formatPercentage(benchmarkMetrics.totalReturn)}
                            </div>
                          </div>

                          {/* Win Rate */}
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <Target size={12} style={{ color: 'var(--highlight)' }} />
                              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Win Rate
                              </span>
                            </div>
                            <div className="text-sm font-bold" style={{ color: getComparisonColor(strategyMetrics.winRate, benchmarkMetrics.winRate) }}>
                              {strategyMetrics.winRate.toFixed(1)}%
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              vs {benchmarkMetrics.winRate.toFixed(1)}%
                            </div>
                          </div>

                          {/* Sharpe Ratio */}
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <BarChart3 size={12} style={{ color: 'var(--highlight)' }} />
                              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Sharpe
                              </span>
                            </div>
                            <div className="text-sm font-bold" style={{ color: getComparisonColor(strategyMetrics.sharpe, benchmarkMetrics.sharpe) }}>
                              {strategyMetrics.sharpe.toFixed(2)}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              vs {benchmarkMetrics.sharpe.toFixed(2)}
                            </div>
                          </div>

                          {/* Max Drawdown */}
                          <div className="text-center">
                            <div className="flex items-center justify-center space-x-1 mb-1">
                              <TrendingDown size={12} style={{ color: '#ef4444' }} />
                              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                Drawdown
                              </span>
                            </div>
                            <div className="text-sm font-bold" style={{ color: getComparisonColor(strategyMetrics.maxDrawdown, benchmarkMetrics.maxDrawdown, false) }}>
                              {strategyMetrics.maxDrawdown.toFixed(1)}%
                            </div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              vs {benchmarkMetrics.maxDrawdown.toFixed(1)}%
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 rounded-lg border" style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}>
              <h4 className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                Performance Summary
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {selectedRun.name} {selectedRun.version} on {selectedRun.symbol} shows{' '}
                {selectedRun.totalReturn > allBenchmarks[0].totalReturn ? 'superior' : 'underperforming'} returns compared to major benchmarks,{' '}
                with {selectedRun.sharpe > allBenchmarks[0].sharpe ? 'better' : 'lower'} risk-adjusted performance{' '}
                and {Math.abs(selectedRun.maxDrawdown) < Math.abs(allBenchmarks[0].maxDrawdown) ? 'lower' : 'higher'} maximum drawdown.
              </p>
            </div>
            </div>

            {/* Resize Handle */}
            <div 
              className="flex justify-center py-2 cursor-ns-resize border-t"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center space-x-1">
                <GripHorizontal 
                  size={16} 
                  style={{ color: 'var(--text-secondary)' }}
                  className={`transition-colors ${isResizing ? 'text-accent' : 'hover:opacity-70'}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BenchmarkComparison;
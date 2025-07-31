import React, { useState } from 'react';
import { ArrowLeft, Download, BarChart3, TrendingUp, TrendingDown, Target, Calendar, Edit, Save, ChevronDown, ChevronRight } from 'lucide-react';
import StageAnalysisChart from './StageAnalysisChart';
import WeinsteinLegend from './WeinsteinLegend';

interface BacktestReportData {
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
  conflictLog: string[];
  trimEvents?: {
    count: number;
    avgReduction: number;
  };
  phaseDetection?: {
    reversals: number;
    consolidations: number;
    exhaustions: number;
  };
  keynote: string;
  chartData: {
    equity: { date: string; value: number }[];
    drawdown: { date: string; value: number }[];
    trades: { date: string; type: 'entry' | 'exit'; price: number; size: number }[];
    priceData: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
    movingAverage30W: { date: string; value: number }[];
    stageAnalysis: {
      stages: { date: string; stage: 1 | 2 | 3 | 4; sataScore: number }[];
      relativeStrength: { date: string; value: number }[];
      momentum: { date: string; value: number }[];
      stageTransitions: { date: string; fromStage: 1 | 2 | 3 | 4; toStage: 1 | 2 | 3 | 4; trigger: string }[];
    };
  };
}

interface ReportScreenProps {
  backtest: BacktestReportData;
  onBack: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ backtest, onBack }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showStageAnalysis, setShowStageAnalysis] = useState(true);
  const [keynote, setKeynote] = useState(backtest.keynote);
  const [isEditingKeynote, setIsEditingKeynote] = useState(false);
  const [showBenchmarkComparison, setShowBenchmarkComparison] = useState(false);

  const timeframes = ['1h', '4h', '1d', '1w'];

  const handleSaveKeynote = () => {
    setIsEditingKeynote(false);
    // TODO: Save keynote to backend
    console.log('Saving keynote:', keynote);
  };

  const handleExport = () => {
    console.log('Exporting report for:', backtest.id);
    // TODO: Implement CSV export
  };

  const performanceMetrics = [
    { label: 'Total Return', value: `${backtest.totalReturn > 0 ? '+' : ''}${backtest.totalReturn.toFixed(2)}%`, icon: TrendingUp, color: backtest.totalReturn > 0 ? '#10b981' : '#ef4444' },
    { label: 'Win Rate', value: `${backtest.winRate.toFixed(1)}%`, icon: Target, color: 'var(--highlight)' },
    { label: 'Sharpe Ratio', value: backtest.sharpe.toFixed(2), icon: BarChart3, color: 'var(--highlight)' },
    { label: 'Max Drawdown', value: `${backtest.maxDrawdown.toFixed(2)}%`, icon: TrendingDown, color: '#ef4444' },
    { label: 'Total Trades', value: backtest.totalTrades.toString(), icon: BarChart3, color: 'var(--highlight)' },
    { label: 'Avg Hold Time', value: backtest.avgHoldTime, icon: Calendar, color: 'var(--highlight)' },
    { label: 'Profit Factor', value: backtest.profitFactor.toFixed(2), icon: TrendingUp, color: 'var(--highlight)' },
    { label: 'Calmar Ratio', value: backtest.calmarRatio.toFixed(2), icon: BarChart3, color: 'var(--highlight)' }
  ];

  // Mock benchmark comparison data
  const benchmarkComparisons = [
    { 
      benchmark: 'S&P 500', 
      strategyReturn: backtest.totalReturn, 
      benchmarkReturn: 12.4, 
      alpha: backtest.totalReturn - 12.4,
      beta: 1.15
    },
    { 
      benchmark: 'Sector ETF', 
      strategyReturn: backtest.totalReturn, 
      benchmarkReturn: 8.7, 
      alpha: backtest.totalReturn - 8.7,
      beta: 0.98
    },
    { 
      benchmark: 'Buy & Hold', 
      strategyReturn: backtest.totalReturn, 
      benchmarkReturn: 15.2, 
      alpha: backtest.totalReturn - 15.2,
      beta: 1.05
    }
  ];

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
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Backtest Report: {backtest.name} {backtest.version}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {backtest.symbol} • {backtest.timeframe} • {backtest.startDate} to {backtest.endDate}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSaveKeynote}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface)'
              }}
            >
              <Save size={16} />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left: Chart Area (70%) */}
          <div className="lg:col-span-7">
            <div
              className="border rounded-lg overflow-hidden"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              {/* Chart Header */}
              <div
                className="border-b px-6 py-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Strategy Performance
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowBenchmark(!showBenchmark)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        showBenchmark ? 'font-medium' : ''
                      }`}
                      style={{
                        backgroundColor: showBenchmark ? 'var(--accent)' : 'var(--surface)',
                        color: showBenchmark ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      Benchmark
                    </button>
                    <button
                      onClick={() => setShowStageAnalysis(!showStageAnalysis)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        showStageAnalysis ? 'font-medium' : ''
                      }`}
                      style={{
                        backgroundColor: showStageAnalysis ? 'var(--accent)' : 'var(--surface)',
                        color: showStageAnalysis ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      Stage Analysis
                    </button>
                  </div>
                </div>

                {/* Timeframe Tabs */}
                <div className="flex space-x-2">
                  {timeframes.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        selectedTimeframe === tf ? 'font-bold' : ''
                      }`}
                      style={{
                        backgroundColor: selectedTimeframe === tf ? 'var(--accent)' : 'var(--bg-primary)',
                        color: selectedTimeframe === tf ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Area */}
              <div className="p-6">
                {showStageAnalysis ? (
                  <StageAnalysisChart
                    data={{
                      priceData: backtest.chartData.priceData,
                      movingAverage30W: backtest.chartData.movingAverage30W,
                      stageAnalysis: backtest.chartData.stageAnalysis,
                      trades: backtest.chartData.trades
                    }}
                    symbol={backtest.symbol}
                    selectedTimeframe={selectedTimeframe}
                    showBenchmark={showBenchmark}
                  />
                ) : (
                  <div
                    className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center"
                    style={{
                      borderColor: 'var(--border)',
                      minHeight: '400px'
                    }}
                  >
                    <BarChart3 size={64} className="mb-4" style={{ color: 'var(--highlight)' }} />
                    <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Standard Chart View
                    </h3>
                    <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
                      Basic candlestick chart with entry/exit markers<br/>
                      and benchmark comparison
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Metrics Sidebar (30%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Weinstein Stage Legend */}
            {showStageAnalysis && (
              <div
                className="border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <WeinsteinLegend
                  isVisible={showLegend}
                  onToggle={() => setShowLegend(!showLegend)}
                />
              </div>
            )}

            {/* Performance Metrics */}
            <div
              className="border rounded-lg p-6"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Performance Metrics
              </h3>
              <div className="space-y-3">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon size={16} style={{ color: metric.color }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {metric.label}
                      </span>
                    </div>
                    <span className="font-medium" style={{ color: metric.color }}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vs Market Benchmarks - Accordion */}
            <div
              className="border rounded-lg"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <button
                onClick={() => setShowBenchmarkComparison(!showBenchmarkComparison)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-opacity-80 transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Vs Market Benchmarks
                </h3>
                {showBenchmarkComparison ? (
                  <ChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              
              {showBenchmarkComparison && (
                <div 
                  className="px-6 pb-6 border-t"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="space-y-4 pt-4">
                    {benchmarkComparisons.map((comparison, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded border"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {comparison.benchmark}
                          </h4>
                          <span 
                            className="text-sm font-medium"
                            style={{ 
                              color: comparison.alpha >= 0 ? '#10b981' : '#ef4444' 
                            }}
                          >
                            Alpha: {comparison.alpha >= 0 ? '+' : ''}{comparison.alpha.toFixed(1)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--text-secondary)' }}>Strategy</span>
                              <span 
                                className="font-medium"
                                style={{ color: comparison.strategyReturn >= 0 ? '#10b981' : '#ef4444' }}
                              >
                                {comparison.strategyReturn >= 0 ? '+' : ''}{comparison.strategyReturn.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--text-secondary)' }}>Benchmark</span>
                              <span 
                                className="font-medium"
                                style={{ color: comparison.benchmarkReturn >= 0 ? '#10b981' : '#ef4444' }}
                              >
                                {comparison.benchmarkReturn >= 0 ? '+' : ''}{comparison.benchmarkReturn.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--text-secondary)' }}>Beta</span>
                              <span className="font-medium" style={{ color: 'var(--highlight)' }}>
                                {comparison.beta.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'var(--text-secondary)' }}>Outperformance</span>
                              <span 
                                className="font-medium"
                                style={{ color: comparison.alpha >= 0 ? '#10b981' : '#ef4444' }}
                              >
                                {comparison.alpha >= 0 ? '+' : ''}{comparison.alpha.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Conflict Log */}
            {backtest.conflictLog.length > 0 && (
              <div
                className="border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Signal Conflicts
                </h3>
                <div className="space-y-2">
                  {backtest.conflictLog.map((conflict, index) => (
                    <div
                      key={index}
                      className="text-sm p-2 rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      • {conflict}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategy-Specific Summaries */}
            {(backtest.trimEvents || backtest.phaseDetection) && (
              <div
                className="border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Strategy Features
                </h3>
                <div className="space-y-4">
                  {backtest.trimEvents && (
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        ATR Trim Events
                      </h4>
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div>Count: {backtest.trimEvents.count}</div>
                        <div>Avg Reduction: {backtest.trimEvents.avgReduction}%</div>
                      </div>
                    </div>
                  )}
                  {backtest.phaseDetection && (
                    <div>
                      <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Phase Detection
                      </h4>
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div>Reversals: {backtest.phaseDetection.reversals}</div>
                        <div>Consolidations: {backtest.phaseDetection.consolidations}</div>
                        <div>Exhaustions: {backtest.phaseDetection.exhaustions}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Keynote */}
            <div
              className="border rounded-lg p-6"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Strategy Notes
                </h3>
                <button
                  onClick={() => setIsEditingKeynote(!isEditingKeynote)}
                  className="p-1 rounded transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Edit size={16} />
                </button>
              </div>
              {isEditingKeynote ? (
                <textarea
                  value={keynote}
                  onChange={(e) => setKeynote(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="Add your analysis notes..."
                />
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {keynote || 'No notes added yet. Click the edit icon to add your analysis.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Volume2, Activity } from 'lucide-react';

interface StageAnalysisData {
  priceData: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
  movingAverage30W: { date: string; value: number }[];
  stageAnalysis: {
    stages: { date: string; stage: 1 | 2 | 3 | 4; sataScore: number }[];
    relativeStrength: { date: string; value: number }[];
    momentum: { date: string; value: number }[];
    stageTransitions: { date: string; fromStage: 1 | 2 | 3 | 4; toStage: 1 | 2 | 3 | 4; trigger: string }[];
  };
  trades: { date: string; type: 'entry' | 'exit'; price: number; size: number }[];
}

interface StageAnalysisChartProps {
  data: StageAnalysisData;
  symbol: string;
  selectedTimeframe: string;
  showBenchmark: boolean;
}

const StageAnalysisChart: React.FC<StageAnalysisChartProps> = ({ 
  data, 
  symbol, 
  selectedTimeframe: _selectedTimeframe, 
  showBenchmark: _showBenchmark 
}) => {
  const [_hoveredPoint, _setHoveredPoint] = useState<{ x: number; y: number; data: any } | null>(null);

  // Stage colors matching the legend
  const stageColors = {
    1: '#9CA3AF', // Gray - Basing
    2: '#10B981', // Green - Advancing  
    3: '#F59E0B', // Orange - Topping
    4: '#EF4444'  // Red - Declining
  };

  const stageName = {
    1: 'Basing',
    2: 'Advancing',
    3: 'Topping', 
    4: 'Declining'
  };

  // Mock chart dimensions for demonstration
  const chartHeight = 400;

  // Get current stage and SATA score (latest data point)
  const currentStage = data.stageAnalysis.stages[data.stageAnalysis.stages.length - 1];
  const latestPrice = data.priceData[data.priceData.length - 1];
  const latestMA = data.movingAverage30W[data.movingAverage30W.length - 1];

  // Stage statistics
  const stageStats = data.stageAnalysis.stages.reduce((acc, stage) => {
    acc[stage.stage] = (acc[stage.stage] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const totalPoints = data.stageAnalysis.stages.length;

  return (
    <div className="space-y-4">
      {/* Chart Header with Current Stage Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: stageColors[currentStage?.stage || 1] }}
            />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Current: Stage {currentStage?.stage} - {stageName[currentStage?.stage || 1]}
            </span>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            SATA Score: {currentStage?.sataScore.toFixed(1)}/10
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div style={{ color: 'var(--text-secondary)' }}>
            Price: ${latestPrice?.close.toFixed(2)}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            30W MA: ${latestMA?.value.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div
        className="border rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          height: chartHeight + 100
        }}
      >
        {/* Mock Chart Visualization */}
        <div className="relative p-6">
          <div
            className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center relative"
            style={{
              borderColor: 'var(--border)',
              height: chartHeight,
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            {/* Chart Placeholder Content */}
            <BarChart3 size={48} className="mb-4" style={{ color: 'var(--highlight)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Stage Analysis Chart - {symbol}
            </h3>
            <p className="text-center mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Interactive candlestick chart with stage overlays, 30-week MA,<br/>
              volume profile, and stage transition markers
            </p>

            {/* Stage Distribution Bars */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                Stage Distribution:
              </div>
              <div className="flex space-x-1 h-6">
                {[1, 2, 3, 4].map(stage => {
                  const percentage = ((stageStats[stage] || 0) / totalPoints) * 100;
                  return (
                    <div
                      key={stage}
                      className="flex-1 rounded flex items-center justify-center text-xs text-white font-medium"
                      style={{
                        backgroundColor: stageColors[stage as keyof typeof stageColors],
                        minHeight: '24px'
                      }}
                    >
                      {percentage > 5 ? `${percentage.toFixed(0)}%` : ''}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mock Data Points Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Simulated stage zones */}
              <div className="absolute top-8 left-8 right-8 h-4 opacity-30 rounded"
                   style={{ backgroundColor: stageColors[2] }}>
              </div>
              <div className="absolute top-16 left-8 right-8 h-4 opacity-30 rounded"
                   style={{ backgroundColor: stageColors[3] }}>
              </div>
              <div className="absolute top-24 left-8 right-8 h-4 opacity-30 rounded"
                   style={{ backgroundColor: stageColors[4] }}>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Legend/Controls */}
        <div
          className="border-t px-6 py-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>Price</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 rounded" style={{ backgroundColor: 'var(--highlight)' }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>30W MA</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Buy Signals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span style={{ color: 'var(--text-secondary)' }}>Sell Signals</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors"
                      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                <Volume2 size={12} />
                <span>Volume</span>
              </button>
              <button className="flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors"
                      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                <Activity size={12} />
                <span>RS</span>
              </button>
              <button className="flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors"
                      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
                <TrendingUp size={12} />
                <span>Momentum</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Transitions Timeline */}
      {data.stageAnalysis.stageTransitions.length > 0 && (
        <div
          className="border rounded-lg p-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Recent Stage Transitions
          </h4>
          <div className="space-y-2">
            {data.stageAnalysis.stageTransitions.slice(-5).map((transition, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(transition.date).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stageColors[transition.fromStage] }}
                  />
                  <span>→</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stageColors[transition.toStage] }}
                  />
                </div>
                <div style={{ color: 'var(--text-primary)' }}>
                  Stage {transition.fromStage} → Stage {transition.toStage}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  ({transition.trigger})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StageAnalysisChart;
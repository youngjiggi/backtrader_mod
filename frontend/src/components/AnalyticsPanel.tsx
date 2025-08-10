import React from 'react';
import { PieChart, Activity, TrendingUp, Target } from 'lucide-react';
import ResizablePanel from './ResizablePanel';
import { usePanelManager, DashboardSettings } from './PanelManager';

interface AnalyticsPanelProps {
  strategy?: any; // Replace with proper strategy type
  sataScore?: number;
  variant?: 'single' | 'multi';
  activeTimeframe?: string;
  className?: string;
}

// Extracted content component for reuse in combined mode
export const AnalyticsContent: React.FC<{
  strategy?: any;
  sataScore?: number;
  activeTimeframe?: string;
  settings?: DashboardSettings;
}> = ({
  strategy,
  sataScore = 8.2,
  activeTimeframe = '1D',
  settings
}) => (
    <>
      {/* Strategy Improvement Metrics - Moved to top */}
      {(!settings || settings.strategyEvolution) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Strategy Evolution</h3>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          {/* Version Comparison */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>vs Previous Version (v2.0)</span>
              <span className="text-sm font-medium text-green-600">+4.2% better</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="h-full rounded-full bg-green-500" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Key Improvements Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="text-sm font-medium text-green-600">+8.5%</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
            </div>
            <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--surface)' }}>
              <div className="text-sm font-medium text-green-600">-2.1%</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Max DD</div>
            </div>
          </div>

          {/* Recent Changes */}
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            <div className="mb-1">✓ Improved RSI exit timing</div>
            <div className="mb-1">✓ Enhanced CVD filtering</div>
            <div>✓ Adjusted position sizing</div>
          </div>
        </div>
        </div>
      )}

      {/* Enhanced SATA Score Display - Progressive Dot Fill */}
      {(!settings || settings.sataScore) && (
        <div className="mb-6">
        <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          {/* Dots grid filling top area - 4 rows of 10 dots each */}
          <div className="mb-4">
            <div className="grid grid-cols-10 grid-rows-4 gap-1 w-40 h-12 mx-auto">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300`}
                  style={{
                    backgroundColor: i < (sataScore * 4) ? 'var(--highlight)' : 'var(--border)',
                    opacity: i < (sataScore * 4) ? 1 : 0.2,
                    animationDelay: `${i * 30}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Score and label at bottom */}
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: 'var(--highlight)' }}>{sataScore}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
          </div>
        </div>
        
        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
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
            <div className="font-semibold text-green-600">{strategy?.winRate?.toFixed(0) || '72'}%</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Win Rate</div>
          </div>
          <div className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-center mb-1">
              <Target size={16} style={{ color: (strategy?.sharpe || 1.8) >= 1.5 ? '#10b981' : (strategy?.sharpe || 1.8) >= 1.0 ? '#f59e0b' : '#ef4444' }} />
            </div>
            <div className="font-semibold" style={{ color: (strategy?.sharpe || 1.8) >= 1.5 ? '#10b981' : (strategy?.sharpe || 1.8) >= 1.0 ? '#f59e0b' : '#ef4444' }}>
              {(strategy?.sharpe || 1.8).toFixed(1)}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
          </div>
        </div>
        </div>
      )}

      {/* Performance Trend Chart */}
      {(!settings || settings.performanceTrend) && (
        <div className="mb-6">
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Performance Trend</h3>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          {/* Simple line chart visualization */}
          <div className="relative h-20 mb-3">
            <svg className="w-full h-full" viewBox="0 0 300 80">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Performance line */}
              <polyline
                points="20,60 50,55 80,45 110,40 140,35 170,30 200,25 230,20 260,15 290,12"
                fill="none"
                stroke="var(--highlight)"
                strokeWidth="2"
                opacity="0.8"
              />
              
              {/* Data points */}
              {[20, 50, 80, 110, 140, 170, 200, 230, 260, 290].map((x, i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={60 - i * 5}
                  r="2"
                  fill="var(--highlight)"
                  opacity="0.6"
                />
              ))}
            </svg>
          </div>
          
          {/* Performance metrics below chart */}
          <div className="flex justify-between items-center text-sm">
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
              <span className="ml-1 font-medium" style={{ color: 'var(--text-primary)' }}>3M</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Return:</span>
              <span className="ml-1 font-medium text-green-600">+{strategy?.totalReturn?.toFixed(1) || '12.5'}%</span>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Key Indicators/Signals */}
      {((!settings || settings.rsiSignal) || (!settings || settings.vwapSignal) || (!settings || settings.cvdSignal) || (!settings || settings.movingAverageSignal)) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Active Signals ({activeTimeframe})</h3>
          <div className="space-y-2">
            {/* RSI Signal */}
            {(!settings || settings.rsiSignal) && (
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>RSI Momentum</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>RSI: 68.2 (Strong)</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">BUY</span>
              </div>
            )}

            {/* VWAP Signal */}
            {(!settings || settings.vwapSignal) && (
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>VWAP Support</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Price: 2.1% above VWAP</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">HOLD</span>
              </div>
            )}

            {/* CVD Signal */}
            {(!settings || settings.cvdSignal) && (
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>CVD Divergence</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Minor negative divergence</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-yellow-600">WATCH</span>
              </div>
            )}

            {/* Moving Average Signal */}
            {(!settings || settings.movingAverageSignal) && (
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Moving Averages</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Above 50 & 150 SMA</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">BULLISH</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {(!settings || settings.recommendations) && (
        <div>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations</h3>
        <div className="space-y-2">
          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Primary Action</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Add to position on VWAP pullback. Target: 5% above current levels.
            </p>
          </div>
          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <Target size={14} style={{ color: 'var(--highlight)' }} />
              <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Risk Management</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Set stop-loss at 2.5x ATR below VWAP support level.
            </p>
          </div>
        </div>
        </div>
      )}
    </>
);

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  strategy,
  sataScore = 8.2,
  activeTimeframe = '1D',
  className = ''
}) => {
  const { rightPanelWidth, rightPanelVisible, setRightPanelWidth, dashboardSettings } = usePanelManager();

  return (
    <ResizablePanel
      position="right"
      size={rightPanelWidth}
      visible={rightPanelVisible}
      onResize={setRightPanelWidth}
      className={`p-6 ${className}`}
    >
      <AnalyticsContent 
        strategy={strategy}
        sataScore={sataScore}
        activeTimeframe={activeTimeframe}
        settings={dashboardSettings}
      />
    </ResizablePanel>
  );
};

export default AnalyticsPanel;
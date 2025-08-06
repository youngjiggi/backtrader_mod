import React from 'react';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import ResizablePanel from './ResizablePanel';
import { usePanelManager } from './PanelManager';

interface AnalyticsPanelProps {
  strategy?: any; // Replace with proper strategy type
  sataScore?: number;
  variant?: 'single' | 'multi';
  activeTimeframe?: string;
  className?: string;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  sataScore = 8.2,
  activeTimeframe = '1D',
  className = ''
}) => {
  const { rightPanelWidth, rightPanelVisible, setRightPanelWidth } = usePanelManager();

  const renderContent = () => (
    <>
      {/* SATA Score Display */}
      <div className="mb-6">
        <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: 'var(--highlight)' }}>{sataScore}</div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>SATA Score ({activeTimeframe})</div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>High Probability Setup</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Stage: 2</div>
            <div style={{ color: 'var(--text-secondary)' }}>Advancing</div>
          </div>
          <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>ATR: 2.3</div>
            <div style={{ color: 'var(--text-secondary)' }}>Moderate</div>
          </div>
        </div>
      </div>

      {/* Current Stage Indicator for Active Timeframe */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Current Stage ({activeTimeframe})</h3>
        <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
          <div>
            <div className="font-medium text-green-700">Stage 2: Advancing</div>
            <div className="text-xs text-green-600">Strong uptrend confirmed</div>
          </div>
        </div>
      </div>

      {/* Signal Summary for Active Timeframe */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Active Signals ({activeTimeframe})</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-500" />
              <span style={{ color: 'var(--text-primary)' }}>RSI Momentum</span>
            </div>
            <span className="text-green-500 font-medium">BUY</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex items-center space-x-2">
              <CheckCircle size={14} className="text-green-500" />
              <span style={{ color: 'var(--text-primary)' }}>VWAP Support</span>
            </div>
            <span className="text-green-500 font-medium">HOLD</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={14} className="text-yellow-500" />
              <span style={{ color: 'var(--text-primary)' }}>CVD Divergence</span>
            </div>
            <span className="text-yellow-500 font-medium">WATCH</span>
          </div>
        </div>
      </div>

      {/* Timeframe-specific Recommendations */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations ({activeTimeframe})</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Primary Action</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Add to position on VWAP pullback. Target: 5% above current levels.</p>
          </div>
          <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <Clock size={14} style={{ color: 'var(--highlight)' }} />
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Risk Management</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>Set stop-loss at 2.5x ATR below VWAP support level.</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <ResizablePanel
      position="right"
      size={rightPanelWidth}
      visible={rightPanelVisible}
      onResize={setRightPanelWidth}
      className={`p-6 ${className}`}
    >
      {renderContent()}
    </ResizablePanel>
  );
};

export default AnalyticsPanel;
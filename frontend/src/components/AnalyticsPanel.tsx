import React from 'react';
import ResizablePanel from './ResizablePanel';
import SATAScoreDisplay from './SATAScoreDisplay';
import PerformanceMetrics from './PerformanceMetrics';
import { usePanelManager } from './PanelManager';

interface AnalyticsPanelProps {
  strategy?: any; // Replace with proper strategy type
  sataScore?: number;
  variant?: 'single' | 'multi';
  className?: string;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  strategy,
  sataScore = 8.2,
  variant = 'single',
  className = ''
}) => {
  const { rightPanelWidth, rightPanelVisible, setRightPanelWidth } = usePanelManager();

  const renderPerformanceTrend = () => (
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
            <rect width="300" height="80" fill="url(#grid)" />
            
            {/* Performance line (simulated upward trend) */}
            <polyline
              fill="none"
              stroke="var(--highlight)"
              strokeWidth="2"
              points="10,60 40,55 70,48 100,45 130,40 160,35 190,30 220,25 250,20 280,15"
              className="animate-pulse"
            />
            
            {/* Data points */}
            {[{x: 10, y: 60}, {x: 70, y: 48}, {x: 130, y: 40}, {x: 190, y: 30}, {x: 250, y: 20}, {x: 280, y: 15}].map((point, i) => (
              <circle key={i} cx={point.x} cy={point.y} r="2" fill="var(--highlight)" />
            ))}
          </svg>
        </div>
        
        <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>30D</span>
          <span className="font-medium text-green-600">
            +{strategy?.totalReturn?.toFixed(1) || '12.5'}%
          </span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );

  const renderRiskAnalysis = () => (
    <div className="mb-6">
      <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Risk Analysis</h3>
      <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <PerformanceMetrics 
          strategy={strategy}
          variant="list"
          showTrend={true}
        />
      </div>
    </div>
  );

  const renderSingleViewContent = () => (
    <>
      {/* Large SATA Score Gauge */}
      <div className="mb-12">
        <SATAScoreDisplay 
          score={sataScore}
          variant="gauge"
          size="large"
        />
      </div>

      {/* Performance Summary */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Quick Stats & SATA Score
        </h3>
        <SATAScoreDisplay 
          score={sataScore}
          variant="simple"
          size="medium"
          showBreakdown={true}
        />
      </div>

      {/* Stage Configuration */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Stage & SATA Configuration
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Configure Weinstein stage detection and SATA score calculation parameters.
        </p>
        <SATAScoreDisplay 
          score={sataScore}
          variant="simple"
          size="small"
        />
      </div>
    </>
  );

  const renderMultiViewContent = () => (
    <>
      {/* Enhanced SATA Score Display */}
      <div className="mb-6">
        <SATAScoreDisplay 
          score={sataScore}
          variant="dots"
          size="medium"
        />
        
        {/* Quick Metrics Grid */}
        <PerformanceMetrics 
          strategy={strategy}
          variant="grid"
          className="mt-4"
        />
      </div>

      {renderPerformanceTrend()}
      {renderRiskAnalysis()}
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
      {variant === 'single' ? renderSingleViewContent() : renderMultiViewContent()}
    </ResizablePanel>
  );
};

export default AnalyticsPanel;
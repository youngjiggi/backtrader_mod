import React from 'react';
import { ArrowLeft, PanelLeftClose, PanelRightClose, PanelBottomClose, PanelLeftOpen, PanelRightOpen, PanelBottomOpen } from 'lucide-react';
import { PanelManagerProvider, usePanelManager } from './PanelManager';
import SidebarPanel from './SidebarPanel';
import AnalyticsPanel from './AnalyticsPanel';
import BottomPanel from './BottomPanel';

interface StrategyLayoutProps {
  title: string;
  onBack: () => void;
  strategy?: any; // Replace with proper strategy type
  strategies?: any[]; // For multi-strategy views
  children: React.ReactNode; // Chart area content
  variant?: 'single' | 'multi';
  showBottomPanel?: boolean;
  sidebarContent?: (tabId: string, strategy?: any) => React.ReactNode;
  className?: string;
}

const StrategyLayoutHeader: React.FC<{
  title: string;
  onBack: () => void;
}> = ({ title, onBack }) => {
  const { 
    leftPanelVisible, 
    rightPanelVisible, 
    bottomPanelVisible,
    toggleLeftPanel,
    toggleRightPanel,
    toggleBottomPanel
  } = usePanelManager();

  return (
    <div className="flex-shrink-0 flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--surface)',
            color: 'var(--text-primary)'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Panel Toggle Buttons */}
        <button
          onClick={toggleLeftPanel}
          className="p-2 rounded transition-colors"
          style={{
            backgroundColor: leftPanelVisible ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid var(--border)`,
            color: leftPanelVisible ? 'var(--bg-primary)' : 'var(--text-primary)'
          }}
          title={leftPanelVisible ? 'Hide Left Panel' : 'Show Left Panel'}
        >
          {leftPanelVisible ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
        </button>

        <button
          onClick={toggleRightPanel}
          className="p-2 rounded transition-colors"
          style={{
            backgroundColor: rightPanelVisible ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid var(--border)`,
            color: rightPanelVisible ? 'var(--bg-primary)' : 'var(--text-primary)'
          }}
          title={rightPanelVisible ? 'Hide Right Panel' : 'Show Right Panel'}
        >
          {rightPanelVisible ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
        </button>

        <button
          onClick={toggleBottomPanel}
          className="p-2 rounded transition-colors"
          style={{
            backgroundColor: bottomPanelVisible ? 'var(--accent)' : 'var(--surface)',
            border: `1px solid var(--border)`,
            color: bottomPanelVisible ? 'var(--bg-primary)' : 'var(--text-primary)'
          }}
          title={bottomPanelVisible ? 'Hide Bottom Panel' : 'Show Bottom Panel'}
        >
          {bottomPanelVisible ? <PanelBottomClose size={14} /> : <PanelBottomOpen size={14} />}
        </button>
      </div>
    </div>
  );
};

const StrategyLayoutContent: React.FC<Omit<StrategyLayoutProps, 'title' | 'onBack'>> = ({
  strategy,
  strategies,
  children,
  variant = 'single',
  showBottomPanel = true,
  sidebarContent,
  className = ''
}) => {
  const { bottomPanelVisible } = usePanelManager();

  return (
    <div className={`flex flex-1 overflow-hidden ${className}`}>
      {/* Left Sidebar */}
      <SidebarPanel 
        strategy={variant === 'multi' ? strategies?.[0] : strategy}
        renderTabContent={sidebarContent}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Chart Area */}
        <div className="flex flex-1">
          <div className="flex-1 flex flex-col">
            {/* Chart Content */}
            <div className="flex-1 p-6">
              {children}
            </div>
            
            {/* Bottom Panel - Integrated into chart area for multi-view */}
            {showBottomPanel && variant === 'multi' && (
              <BottomPanel 
                strategy={strategies?.[0]}
                variant="integrated"
                className="h-80"
              />
            )}
          </div>

          {/* Right Analytics Panel */}
          <AnalyticsPanel 
            strategy={variant === 'multi' ? strategies?.[0] : strategy}
            variant={variant}
          />
        </div>

        {/* Bottom Panel - Standalone for single view */}
        {showBottomPanel && variant === 'single' && bottomPanelVisible && (
          <BottomPanel 
            strategy={strategy}
            variant="standalone"
          />
        )}
      </div>
    </div>
  );
};

const StrategyLayout: React.FC<StrategyLayoutProps> = (props) => {
  const { title, onBack, ...contentProps } = props;

  return (
    <PanelManagerProvider>
      <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <StrategyLayoutHeader title={title} onBack={onBack} />
        <StrategyLayoutContent {...contentProps} />
      </div>
    </PanelManagerProvider>
  );
};

export default StrategyLayout;
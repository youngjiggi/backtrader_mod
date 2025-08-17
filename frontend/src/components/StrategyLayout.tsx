import React from 'react';
import { PanelManagerProvider, usePanelManager } from './PanelManager';
import SidebarPanel from './SidebarPanel';
import AnalyticsPanel from './AnalyticsPanel';
import BottomPanel from './BottomPanel';
import SingleNavigationBar from './SingleNavigationBar';
import ResizableChartContainer from './ResizableChartContainer';

interface StrategyLayoutProps {
  title: string;
  onBack: () => void;
  strategy?: any; // Replace with proper strategy type
  strategies?: any[]; // For multi-strategy views
  children: React.ReactNode; // Chart area content
  variant?: 'single' | 'multi';
  showBottomPanel?: boolean;
  sidebarContent?: (tabId: string, strategy?: any) => React.ReactNode;
  activeTimeframe?: string; // Current active timeframe
  className?: string;
  // New navigation props
  onLibraryClick?: () => void;
  onCompareClick?: () => void;
  onStrategyClose?: (strategyId: string) => void;
}

const StrategyLayoutHeader: React.FC<{
  title: string;
  onBack: () => void;
  onLibraryClick?: () => void;
  onCompareClick?: () => void;
  onStrategyClose?: (strategyId: string) => void;
  strategy?: any;
  strategies?: any[];
}> = ({ title, onBack, onLibraryClick, onCompareClick, onStrategyClose, strategy, strategies }) => {
  // Create strategy tabs from current strategy data
  const strategyTabs = strategies ? strategies.map((s, index) => ({
    id: s.id || `strategy-${index}`,
    name: s.name || `Strategy ${index + 1}`,
    isActive: s.id === strategy?.id || index === 0
  })) : [{
    id: strategy?.id || '1',
    name: strategy?.name || title.replace('Strategy Analysis - ', ''),
    isActive: true
  }];

  return (
    <SingleNavigationBar
      onBack={onBack}
      currentStrategy={strategy?.name || title}
      strategies={strategyTabs}
      onLibraryClick={onLibraryClick}
      onCompareClick={onCompareClick}
      onStrategyClose={onStrategyClose}
      className="flex-shrink-0"
    />
  );
};

const StrategyLayoutContent: React.FC<Omit<StrategyLayoutProps, 'title' | 'onBack' | 'onLibraryClick' | 'onCompareClick'>> = ({
  strategy,
  strategies,
  children,
  variant = 'single',
  showBottomPanel = true,
  sidebarContent,
  activeTimeframe = '1D',
  className = ''
}) => {
  const { bottomPanelVisible, layoutMode } = usePanelManager();

  return (
    <div className={`flex flex-1 ${className}`}>
      {/* Left Sidebar - Full Height */}
      <SidebarPanel 
        strategy={variant === 'multi' ? strategies?.[0] : strategy}
        renderTabContent={sidebarContent}
        activeTimeframe={activeTimeframe}
        sataScore={8.2} // TODO: Get from strategy data
        hideHeader={true} // Hide the combined mode toggle in strategy views
      />

      {/* Right Side Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Chart and Bottom Panel Area */}
        <div className="flex flex-1">
          <div className="flex-1 flex flex-col">
            {/* Resizable Chart Container - No gaps */}
            <div className="p-4 pb-0"> {/* Remove bottom padding to eliminate gap */}
              <ResizableChartContainer
                defaultHeight={400}
                minHeight={200}
                maxHeight={600}
              >
                {children}
              </ResizableChartContainer>
            </div>

            {/* Bottom Panel - Directly below chart with no gap */}
            {showBottomPanel && bottomPanelVisible && (
              <div className="px-4"> {/* Only horizontal padding, no vertical gap */}
                <BottomPanel 
                  strategy={variant === 'multi' ? strategies?.[0] : strategy}
                  variant="integrated" // Use integrated variant to avoid extra padding
                />
              </div>
            )}
          </div>

          {/* Right Analytics Panel - Only in separate mode */}
          {layoutMode === 'separate' && (
            <AnalyticsPanel 
              strategy={variant === 'multi' ? strategies?.[0] : strategy}
              variant={variant}
              activeTimeframe={activeTimeframe}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const StrategyLayout: React.FC<StrategyLayoutProps> = (props) => {
  const { title, onBack, onLibraryClick, onCompareClick, onStrategyClose, strategy, strategies, ...contentProps } = props;

  return (
    <PanelManagerProvider>
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <StrategyLayoutHeader 
          title={title} 
          onBack={onBack} 
          onLibraryClick={onLibraryClick}
          onCompareClick={onCompareClick}
          onStrategyClose={onStrategyClose}
          strategy={strategy}
          strategies={strategies}
        />
        <StrategyLayoutContent 
          strategy={strategy}
          strategies={strategies}
          {...contentProps} 
        />
      </div>
    </PanelManagerProvider>
  );
};

export default StrategyLayout;
import React from 'react';
import { RecentRun } from './RecentRunsCarousel';
import StrategyLayout from './StrategyLayout';
import AccountBalanceChart from './AccountBalanceChart';
import SidebarPanel from './SidebarPanel';
import BottomPanel from './BottomPanel';
import ResizableChartContainer from './ResizableChartContainer';
import AnalyticsPanel from './AnalyticsPanel';
import { usePanelManager } from './PanelManager';

interface StrategyViewScreenProps {
  strategy: RecentRun;
  onBack: () => void;
  onLibraryClick?: () => void;
  onCompareClick?: () => void;
  onStrategyClose?: (strategyId: string) => void;
  hideHeader?: boolean; // Hide header when rendered within TabbedLibrary
}

const StrategyViewScreen: React.FC<StrategyViewScreenProps> = ({ strategy, onBack, onLibraryClick, onCompareClick, onStrategyClose, hideHeader = false }) => {
  const { layoutMode } = usePanelManager();

  const renderChartContent = () => (
    <div className="flex flex-col flex-1">
      <AccountBalanceChart 
        strategy={strategy} 
        className="flex-1" 
        showHeaders={false}  // Hide headers to avoid 3-level header issue
        compact={false}
      />
    </div>
  );

  // If hideHeader is true, render content without StrategyLayout wrapper
  if (hideHeader) {
    return (
      <div className="flex flex-1">
        {/* Left Sidebar - Matches StrategyLayout structure but without header */}
        <SidebarPanel 
          strategy={strategy}
          activeTimeframe="1D"
          sataScore={8.2}
          hideHeader={false}
        />
        
        {/* Right Side Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-1">
            <div className="flex-1 flex flex-col">
              <div className="p-4 pb-0">
                <ResizableChartContainer
                  defaultHeight={400}
                  minHeight={200}
                  maxHeight={600}
                >
                  {renderChartContent()}
                </ResizableChartContainer>
              </div>
              
              {/* Bottom Panel */}
              <div className="px-4">
                <BottomPanel 
                  strategy={strategy}
                  variant="integrated"
                />
              </div>
            </div>

            {/* Right Analytics Panel - Only in separate mode */}
            {layoutMode === 'separate' && (
              <AnalyticsPanel 
                strategy={strategy}
                variant="single"
                activeTimeframe="1D"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <StrategyLayout
      title={`Strategy Analysis - ${strategy.name}`}
      onBack={onBack}
      onLibraryClick={onLibraryClick}
      onCompareClick={onCompareClick}
      onStrategyClose={onStrategyClose}
      strategy={strategy}
      variant="single"
      showBottomPanel={true}
    >
      {renderChartContent()}
    </StrategyLayout>
  );
};

export default StrategyViewScreen;
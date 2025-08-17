import React from 'react';
import { RecentRun } from './RecentRunsCarousel';
import StrategyLayout from './StrategyLayout';
import AccountBalanceChart from './AccountBalanceChart';

interface StrategyViewScreenProps {
  strategy: RecentRun;
  onBack: () => void;
  onLibraryClick?: () => void;
  onCompareClick?: () => void;
}

const StrategyViewScreen: React.FC<StrategyViewScreenProps> = ({ strategy, onBack, onLibraryClick, onCompareClick }) => {
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

  return (
    <StrategyLayout
      title={`Strategy Analysis - ${strategy.name}`}
      onBack={onBack}
      onLibraryClick={onLibraryClick}
      onCompareClick={onCompareClick}
      strategy={strategy}
      variant="single"
      showBottomPanel={true}
    >
      {renderChartContent()}
    </StrategyLayout>
  );
};

export default StrategyViewScreen;
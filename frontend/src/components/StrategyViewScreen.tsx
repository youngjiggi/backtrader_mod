import React from 'react';
import { RecentRun } from './RecentRunsCarousel';
import StrategyLayout from './StrategyLayout';
import AccountBalanceChart from './AccountBalanceChart';

interface StrategyViewScreenProps {
  strategy: RecentRun;
  onBack: () => void;
}

const StrategyViewScreen: React.FC<StrategyViewScreenProps> = ({ strategy, onBack }) => {
  const renderChartContent = () => (
    <div className="flex flex-col flex-1">
      <AccountBalanceChart strategy={strategy} className="flex-1" />
    </div>
  );

  return (
    <StrategyLayout
      title={`Strategy Analysis - ${strategy.name}`}
      onBack={onBack}
      strategy={strategy}
      variant="single"
      showBottomPanel={true}
    >
      {renderChartContent()}
    </StrategyLayout>
  );
};

export default StrategyViewScreen;
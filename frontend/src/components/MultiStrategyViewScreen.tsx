import React, { useState } from 'react';
import { RecentRun } from './RecentRunsCarousel';
import StrategyLayout from './StrategyLayout';
import StrategyChartGrid, { ChartGridLayout } from './StrategyChartGrid';

interface MultiStrategyViewScreenProps {
  strategies: RecentRun[];
  onBack: () => void;
}

const MultiStrategyViewScreen: React.FC<MultiStrategyViewScreenProps> = ({ strategies, onBack }) => {
  const [activeStrategy, setActiveStrategy] = useState<RecentRun>(strategies[0]);
  const [gridLayout, setGridLayout] = useState<ChartGridLayout>('2x1');

  const handleStrategySelect = (strategy: RecentRun) => {
    setActiveStrategy(strategy);
  };

  const renderChartContent = () => (
    <StrategyChartGrid
      strategies={strategies}
      activeStrategy={activeStrategy}
      onStrategySelect={handleStrategySelect}
      gridLayout={gridLayout}
      onLayoutChange={setGridLayout}
    />
  );

  return (
    <StrategyLayout
      title="Multi-Strategy Comparison"
      onBack={onBack}
      strategy={activeStrategy}
      strategies={strategies}
      variant="multi"
      showBottomPanel={true}
    >
      {renderChartContent()}
    </StrategyLayout>
  );
};

export default MultiStrategyViewScreen;
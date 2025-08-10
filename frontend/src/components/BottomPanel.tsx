import React from 'react';
import ResizablePanel from './ResizablePanel';
import TradeJournal from './TradeJournal';
import { usePanelManager } from './PanelManager';

interface BottomPanelProps {
  strategy?: any; // Replace with proper strategy type
  variant?: 'standalone' | 'integrated';
  className?: string;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
  strategy,
  variant = 'standalone',
  className = ''
}) => {
  const { bottomPanelHeight, bottomPanelVisible, setBottomPanelHeight } = usePanelManager();

  if (variant === 'integrated') {
    // For integrated variant, return TradeJournal directly without panel wrapper
    return (
      <div className={`border-t pt-4 ${className}`} style={{ borderColor: 'var(--border)' }}>
        <div className="h-full">
          <TradeJournal 
            strategy={strategy} 
            className="h-full"
          />
        </div>
      </div>
    );
  }

  // Standalone variant with full ResizablePanel
  return (
    <ResizablePanel
      position="bottom"
      size={bottomPanelHeight}
      visible={bottomPanelVisible}
      onResize={setBottomPanelHeight}
      maxSize={Math.floor(window.innerHeight * 0.8)}
      className={`p-4 ${className}`}
    >
      <div className="h-full">
        <TradeJournal 
          strategy={strategy} 
          className="h-full"
        />
      </div>
    </ResizablePanel>
  );
};

export default BottomPanel;
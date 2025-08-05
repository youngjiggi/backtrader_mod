import React, { useState } from 'react';
import { Users, PieChart, LineChart, Zap, Target, TrendingUp, Settings, Calendar } from 'lucide-react';
import ResizablePanel from './ResizablePanel';
import TabNavigation, { TabItem } from './TabNavigation';
import { usePanelManager } from './PanelManager';

interface SidebarPanelProps {
  strategy?: any; // Replace with proper strategy type
  renderTabContent?: (tabId: string, strategy?: any) => React.ReactNode;
  className?: string;
}

const defaultTabs: TabItem[] = [
  { id: 'portfolio', label: 'Portfolio', icon: Users },
  { id: 'stage', label: 'Stage & SATA', icon: PieChart },
  { id: 'indicators', label: 'Indicators', icon: LineChart },
  { id: 'signalhierarchy', label: 'Signal Hierarchy', icon: Zap },
  { id: 'rules', label: 'Rules', icon: Target },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'history', label: 'History', icon: Calendar }
];

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  strategy,
  renderTabContent,
  className = ''
}) => {
  const { leftPanelWidth, leftPanelVisible, setLeftPanelWidth } = usePanelManager();
  const [activeTab, setActiveTab] = useState('portfolio');

  const defaultTabContent = (tabId: string, strategy?: any) => {
    switch (tabId) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Portfolio Configuration{strategy ? ` - ${strategy.name}` : ''}
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Define the assets you want to trade and manage your portfolio allocation.
              </p>
            </div>
            {strategy && (
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                  <Target size={16} />
                  <span>Strategy Details</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{strategy.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Symbol:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{strategy.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Timeframe:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{strategy.timeframe}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'stage':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Stage & SATA Analysis{strategy ? ` - ${strategy.name}` : ''}
            </h3>
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Current Stage</h4>
              <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                <div>
                  <div className="font-medium text-green-700">Stage 2: Advancing</div>
                  <div className="text-xs text-green-600">Strong uptrend confirmed</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'indicators':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Active Indicators{strategy ? ` - ${strategy.name}` : ''}
            </h3>
            <div className="space-y-2">
              {['RSI (14)', 'VWAP', 'ATR (14)', 'Volume Profile'].map((indicator, index) => (
                <div key={indicator} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{indicator}</span>
                  <span className={`px-2 py-1 text-xs rounded ${index < 2 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {index < 2 ? 'Active' : 'Monitoring'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {defaultTabs.find(tab => tab.id === tabId)?.label || 'Tab Content'}{strategy ? ` - ${strategy.name}` : ''}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Content for {tabId} tab would go here.
            </p>
          </div>
        );
    }
  };

  return (
    <ResizablePanel
      position="left"
      size={leftPanelWidth}
      visible={leftPanelVisible}
      onResize={setLeftPanelWidth}
      className={className}
    >
      {/* Sidebar Tabs */}
      <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <TabNavigation
          tabs={defaultTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orientation="vertical"
        />
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent ? renderTabContent(activeTab, strategy) : defaultTabContent(activeTab, strategy)}
      </div>
    </ResizablePanel>
  );
};

export default SidebarPanel;
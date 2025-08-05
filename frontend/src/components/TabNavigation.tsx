import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  orientation = 'vertical',
  className = ''
}) => {
  const containerClass = orientation === 'horizontal' 
    ? 'flex space-x-1' 
    : 'space-y-1';

  const buttonClass = orientation === 'horizontal'
    ? 'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors'
    : 'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors';

  return (
    <div className={`${containerClass} ${className}`}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${buttonClass} ${isActive ? 'ring-2' : ''}`}
            style={{
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
              '--tw-ring-color': 'var(--accent)'
            }}
          >
            <IconComponent size={16} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
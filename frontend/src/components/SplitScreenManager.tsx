import React, { useState, useRef, useCallback } from 'react';
import { Maximize2, Minimize2, X, MoreVertical, Layout, Grid, Split, Square } from 'lucide-react';

export type LayoutMode = 'single' | 'vertical' | 'horizontal' | 'quad' | 'triple-left' | 'triple-right' | 'triple-top' | 'triple-bottom';

export interface SplitPane {
  id: string;
  tabs: Tab[];
  activeTabId: string;
  width?: number; // percentage for vertical splits
  height?: number; // percentage for horizontal splits
}

export interface Tab {
  id: string;
  type: 'library' | 'strategy';
  title: string;
  data?: any;
  component: React.ReactNode;
}

interface SplitScreenManagerProps {
  initialTabs: Tab[];
  onTabClose: (tabId: string) => void;
  onTabMove: (tabId: string, fromPaneId: string, toPaneId: string) => void;
  className?: string;
}

const SplitScreenManager: React.FC<SplitScreenManagerProps> = ({
  initialTabs,
  onTabClose,
  onTabMove,
  className = ''
}) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single');
  const [panes, setPanes] = useState<SplitPane[]>([
    {
      id: 'pane-1',
      tabs: initialTabs,
      activeTabId: initialTabs[0]?.id || '',
      width: 100,
      height: 100
    }
  ]);
  const [draggedTab, setDraggedTab] = useState<{ tabId: string; paneId: string } | null>(null);
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const resizeRef = useRef<{ paneId: string; direction: 'horizontal' | 'vertical' } | null>(null);

  const layoutConfigs: Record<LayoutMode, { panes: number; arrangement: string; defaultSizes: number[][] }> = {
    single: { panes: 1, arrangement: 'Single pane', defaultSizes: [[100, 100]] },
    vertical: { panes: 2, arrangement: 'Side by side', defaultSizes: [[50, 100], [50, 100]] },
    horizontal: { panes: 2, arrangement: 'Top and bottom', defaultSizes: [[100, 50], [100, 50]] },
    quad: { panes: 4, arrangement: '2x2 grid', defaultSizes: [[50, 50], [50, 50], [50, 50], [50, 50]] },
    'triple-left': { panes: 3, arrangement: 'Main left, two right', defaultSizes: [[60, 100], [40, 50], [40, 50]] },
    'triple-right': { panes: 3, arrangement: 'Two left, main right', defaultSizes: [[40, 50], [40, 50], [60, 100]] },
    'triple-top': { panes: 3, arrangement: 'Main top, two bottom', defaultSizes: [[100, 60], [50, 40], [50, 40]] },
    'triple-bottom': { panes: 3, arrangement: 'Two top, main bottom', defaultSizes: [[50, 40], [50, 40], [100, 60]] }
  };

  const handleLayoutChange = useCallback((newLayout: LayoutMode) => {
    const config = layoutConfigs[newLayout];
    const newPanes: SplitPane[] = [];
    
    // Collect all tabs from current panes
    const allTabs = panes.flatMap(pane => pane.tabs);
    
    // Distribute tabs across new panes
    for (let i = 0; i < config.panes; i++) {
      const paneId = `pane-${i + 1}`;
      const [width, height] = config.defaultSizes[i];
      
      // Assign tabs round-robin style
      const paneTabs = allTabs.filter((_, index) => index % config.panes === i);
      
      newPanes.push({
        id: paneId,
        tabs: paneTabs,
        activeTabId: paneTabs[0]?.id || '',
        width,
        height
      });
    }
    
    // If we have leftover tabs, distribute them to the first panes
    const assignedTabs = newPanes.flatMap(pane => pane.tabs);
    const leftoverTabs = allTabs.filter(tab => !assignedTabs.includes(tab));
    leftoverTabs.forEach((tab, index) => {
      const targetPane = newPanes[index % newPanes.length];
      targetPane.tabs.push(tab);
      if (!targetPane.activeTabId) {
        targetPane.activeTabId = tab.id;
      }
    });
    
    setPanes(newPanes);
    setLayoutMode(newLayout);
    setShowLayoutSelector(false);
  }, [panes]);

  const handleTabDragStart = useCallback((tabId: string, paneId: string) => {
    setDraggedTab({ tabId, paneId });
  }, []);

  const handleTabDrop = useCallback((targetPaneId: string) => {
    if (!draggedTab) return;
    
    if (draggedTab.paneId !== targetPaneId) {
      onTabMove(draggedTab.tabId, draggedTab.paneId, targetPaneId);
      
      // Update panes state
      setPanes(prev => {
        const newPanes = [...prev];
        const sourcePane = newPanes.find(p => p.id === draggedTab.paneId);
        const targetPane = newPanes.find(p => p.id === targetPaneId);
        
        if (sourcePane && targetPane) {
          const tabIndex = sourcePane.tabs.findIndex(t => t.id === draggedTab.tabId);
          if (tabIndex !== -1) {
            const [tab] = sourcePane.tabs.splice(tabIndex, 1);
            targetPane.tabs.push(tab);
            
            // Update active tab if source pane is now empty
            if (sourcePane.tabs.length === 0) {
              sourcePane.activeTabId = '';
            } else if (sourcePane.activeTabId === draggedTab.tabId) {
              sourcePane.activeTabId = sourcePane.tabs[0].id;
            }
            
            // Set as active in target pane
            targetPane.activeTabId = draggedTab.tabId;
          }
        }
        
        return newPanes;
      });
    }
    
    setDraggedTab(null);
  }, [draggedTab, onTabMove]);

  const handlePaneResize = useCallback((paneId: string, newWidth?: number, newHeight?: number) => {
    setPanes(prev => prev.map(pane => 
      pane.id === paneId 
        ? { ...pane, width: newWidth ?? pane.width, height: newHeight ?? pane.height }
        : pane
    ));
  }, []);

  const renderLayoutSelector = () => (
    <div className="absolute top-12 right-0 z-50 border rounded-lg shadow-lg p-4 min-w-64"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Layout Options
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(layoutConfigs).map(([layout, config]) => (
          <button
            key={layout}
            onClick={() => handleLayoutChange(layout as LayoutMode)}
            className={`p-3 border rounded-lg transition-all hover:bg-opacity-50 ${
              layoutMode === layout ? 'ring-2' : ''
            }`}
            style={{
              borderColor: layoutMode === layout ? 'var(--accent)' : 'var(--border)',
              ringColor: 'var(--accent)',
              backgroundColor: layoutMode === layout ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
            }}
          >
            <div className="flex items-center justify-center mb-2">
              {layout === 'single' && <Square size={20} style={{ color: 'var(--text-primary)' }} />}
              {layout === 'vertical' && <Split size={20} style={{ color: 'var(--text-primary)' }} />}
              {layout === 'horizontal' && <Layout size={20} style={{ color: 'var(--text-primary)' }} />}
              {layout === 'quad' && <Grid size={20} style={{ color: 'var(--text-primary)' }} />}
              {layout.startsWith('triple') && <Grid size={20} style={{ color: 'var(--text-primary)' }} />}
            </div>
            <div className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              {config.arrangement}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPane = (pane: SplitPane, index: number) => {
    const activeTab = pane.tabs.find(tab => tab.id === pane.activeTabId);
    
    return (
      <div
        key={pane.id}
        className="border rounded-lg overflow-hidden flex flex-col"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          width: layoutMode === 'vertical' || layoutMode.includes('left') || layoutMode.includes('right') ? `${pane.width}%` : '100%',
          height: layoutMode === 'horizontal' || layoutMode.includes('top') || layoutMode.includes('bottom') ? `${pane.height}%` : '100%'
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleTabDrop(pane.id)}
      >
        {/* Tab Header */}
        {pane.tabs.length > 0 && (
          <div className="flex items-center border-b px-2 py-1" style={{ borderColor: 'var(--border)' }}>
            <div className="flex-1 flex items-center space-x-1 overflow-x-auto">
              {pane.tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPanes(prev => prev.map(p => 
                    p.id === pane.id ? { ...p, activeTabId: tab.id } : p
                  ))}
                  draggable
                  onDragStart={() => handleTabDragStart(tab.id, pane.id)}
                  className={`px-3 py-1 text-xs border rounded transition-all hover:bg-opacity-50 whitespace-nowrap ${
                    tab.id === pane.activeTabId ? 'border-b-2' : ''
                  }`}
                  style={{
                    borderColor: tab.id === pane.activeTabId ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: tab.id === pane.activeTabId ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: tab.id === pane.activeTabId ? 'var(--accent)' : 'var(--text-primary)'
                  }}
                >
                  <span className="mr-1">{tab.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                    className="hover:bg-red-100 dark:hover:bg-red-900/20 p-0.5 rounded"
                  >
                    <X size={10} />
                  </button>
                </button>
              ))}
            </div>
            
            {/* Pane Controls */}
            <div className="flex items-center space-x-1 ml-2">
              <button
                onClick={() => setShowLayoutSelector(!showLayoutSelector)}
                className="p-1 rounded hover:bg-opacity-50 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="Change layout"
              >
                <Layout size={14} />
              </button>
            </div>
          </div>
        )}
        
        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab ? (
            <div className="h-full">
              {activeTab.component}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  No Active Tab
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Drag tabs here or select a layout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getLayoutClasses = () => {
    switch (layoutMode) {
      case 'single':
        return 'grid grid-cols-1';
      case 'vertical':
        return 'grid grid-cols-2 gap-2';
      case 'horizontal':
        return 'grid grid-rows-2 gap-2';
      case 'quad':
        return 'grid grid-cols-2 grid-rows-2 gap-2';
      case 'triple-left':
      case 'triple-right':
        return 'grid grid-cols-2 gap-2';
      case 'triple-top':
      case 'triple-bottom':
        return 'grid grid-rows-2 gap-2';
      default:
        return 'grid grid-cols-1';
    }
  };

  return (
    <div className={`relative h-full ${className}`}>
      {/* Layout Selector */}
      {showLayoutSelector && renderLayoutSelector()}
      
      {/* Split Screen Layout */}
      <div className={`h-full ${getLayoutClasses()}`}>
        {panes.map((pane, index) => renderPane(pane, index))}
      </div>
    </div>
  );
};

export default SplitScreenManager;
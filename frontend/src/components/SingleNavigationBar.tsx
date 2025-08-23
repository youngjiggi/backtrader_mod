import React, { useState } from 'react';
import { Menu, Library, Layers, MoreVertical, X } from 'lucide-react';
import HamburgerMenu from './HamburgerMenu';
import MoreMenu from './MoreMenu';
import { usePanelManager } from './PanelManager';

interface StrategyTab {
  id: string;
  name: string;
  isActive: boolean;
}

interface SingleNavigationBarProps {
  onBack: () => void;
  currentStrategy?: string;
  strategies?: StrategyTab[];
  activeStrategyId?: string;
  onStrategySelect?: (strategyId: string) => void;
  onStrategyClose?: (strategyId: string) => void;
  onLibraryClick?: () => void;
  onCompareClick?: () => void;
  onCloneStrategy?: () => void;
  onCloseAllStrategies?: () => void;
  className?: string;
}

const SingleNavigationBar: React.FC<SingleNavigationBarProps> = ({
  onBack,
  currentStrategy = "ATR Breakout",
  strategies = [
    { id: '1', name: 'ATR Breakout', isActive: true },
    { id: '2', name: 'Strategy 2', isActive: false },
    { id: '3', name: 'Strategy 3', isActive: false }
  ],
  activeStrategyId,
  onStrategySelect,
  onStrategyClose,
  onLibraryClick,
  onCompareClick,
  onCloneStrategy,
  onCloseAllStrategies,
  className = ''
}) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  
  // Use PanelManager for layout mode control
  const { layoutMode, setLayoutMode } = usePanelManager();

  return (
    <>
      <div 
        className={`flex items-center justify-between px-4 py-3 border-b ${className}`}
        style={{ 
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Left Side: Hamburger + Library + Strategy Tabs */}
        <div className="flex items-center space-x-2">
          {/* Hamburger Menu */}
          <button
            onClick={() => setHamburgerOpen(true)}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid var(--border)`,
              color: 'var(--text-primary)'
            }}
            title="Main Menu"
          >
            <Menu size={18} />
          </button>

          {/* Library Button */}
          <button
            onClick={onLibraryClick}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid var(--border)`,
              color: 'var(--text-primary)'
            }}
          >
            <Library size={16} />
            <span className="text-sm font-medium">Library</span>
          </button>

          {/* Strategy Tabs */}
          <div className="flex space-x-1">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className="flex items-center rounded-lg border transition-colors hover:bg-opacity-80"
                style={{
                  backgroundColor: strategy.isActive ? 'var(--accent)' : 'var(--bg-primary)',
                  borderColor: strategy.isActive ? 'var(--accent)' : 'var(--border)'
                }}
              >
                {/* Strategy Tab Button */}
                <button
                  onClick={() => onStrategySelect?.(strategy.id)}
                  className="px-3 py-2 text-sm font-medium transition-colors rounded-l-lg"
                  style={{
                    color: strategy.isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                    backgroundColor: 'transparent'
                  }}
                >
                  {strategy.name}
                </button>
                
                {/* Close Button - Only show if there are multiple strategies */}
                {strategies.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStrategyClose?.(strategy.id);
                    }}
                    className="px-2 py-2 text-sm transition-colors hover:bg-opacity-20 rounded-r-lg"
                    style={{
                      color: strategy.isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      backgroundColor: 'transparent'
                    }}
                    title={`Close ${strategy.name}`}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Compare + More Menu */}
        <div className="flex items-center space-x-2">
          {/* Compare Button */}
          <button
            onClick={onCompareClick}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--bg-primary)',
              border: `1px solid var(--border)`,
              color: 'var(--text-primary)'
            }}
          >
            <Layers size={16} />
            <span className="text-sm font-medium">Compare</span>
          </button>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: moreMenuOpen ? 'var(--accent)' : 'var(--bg-primary)',
                border: `1px solid ${moreMenuOpen ? 'var(--accent)' : 'var(--border)'}`,
                color: moreMenuOpen ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              title="More Options"
            >
              <MoreVertical size={18} />
            </button>

            {/* More Menu Dropdown */}
            {moreMenuOpen && (
              <MoreMenu 
                onClose={() => setMoreMenuOpen(false)}
                currentStrategy={currentStrategy}
              />
            )}
          </div>
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      {hamburgerOpen && (
        <HamburgerMenu
          onClose={() => setHamburgerOpen(false)}
          onBack={onBack}
          onLibraryClick={() => {
            onLibraryClick?.();
            setHamburgerOpen(false);
          }}
          onCompareClick={() => {
            onCompareClick?.();
            setHamburgerOpen(false);
          }}
          onCloneStrategy={() => {
            onCloneStrategy?.();
            setHamburgerOpen(false);
          }}
          onCloseAllStrategies={() => {
            onCloseAllStrategies?.();
            setHamburgerOpen(false);
          }}
          layoutMode={layoutMode}
          onLayoutModeChange={setLayoutMode}
        />
      )}
    </>
  );
};

export default SingleNavigationBar;
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import DashboardHamburgerMenu from './DashboardHamburgerMenu';

interface MinimalDashboardHeaderProps {
  onProfileClick?: () => void;
  onAccountSettingsClick?: () => void;
  onTradingPreferencesClick?: () => void;
  onNotificationSettingsClick?: () => void;
  onDataSettingsClick?: () => void;
  onDisplaySettingsClick?: () => void;
  onSignOut?: () => void;
  onFavoriteClick?: (favoritePath: string) => void;
  className?: string;
}

const MinimalDashboardHeader: React.FC<MinimalDashboardHeaderProps> = ({
  onProfileClick,
  onAccountSettingsClick,
  onTradingPreferencesClick,
  onNotificationSettingsClick,
  onDataSettingsClick,
  onDisplaySettingsClick,
  onSignOut,
  onFavoriteClick,
  className = ''
}) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  return (
    <>
      <div 
        className={`flex items-center justify-between px-6 py-4 border-b ${className}`}
        style={{ 
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Left Side: Hamburger + Brand */}
        <div className="flex items-center space-x-4">
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

          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <h1 
              className="text-2xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              Backstreet Betas
            </h1>
            <span 
              className="text-sm px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--highlight)', 
                color: 'var(--bg-primary)' 
              }}
            >
              Beta
            </span>
          </div>
        </div>

        {/* Right Side: Empty for now, but space reserved for future additions */}
        <div className="flex items-center space-x-2">
          {/* Future: Could add search, notifications, or other quick actions */}
        </div>
      </div>

      {/* Hamburger Menu Overlay */}
      <DashboardHamburgerMenu
        isOpen={hamburgerOpen}
        onClose={() => setHamburgerOpen(false)}
        onNavigateToProfile={() => {
          onProfileClick?.();
          setHamburgerOpen(false);
        }}
        onNavigateToSettings={() => {
          onAccountSettingsClick?.();
          setHamburgerOpen(false);
        }}
      />
    </>
  );
};

export default MinimalDashboardHeader;
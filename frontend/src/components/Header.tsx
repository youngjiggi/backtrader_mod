import React from 'react';
import { User, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onSignInClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, onSettingsClick }) => {
  return (
    <header 
      className="border-b px-6 py-4"
      style={{ 
        backgroundColor: 'var(--surface)', 
        borderColor: 'var(--border)' 
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <h1 
            className="text-2xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            BackstreetBoys
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


        {/* Controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button 
            onClick={onSettingsClick}
            className="p-2 rounded-lg border transition-colors duration-200 hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            title="Settings"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={onSignInClick}
            className="p-2 rounded-lg border transition-colors duration-200 hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
            title="Sign In"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
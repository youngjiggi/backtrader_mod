import React from 'react';
import { Search, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onSignInClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick }) => {
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

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              size={20} 
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search runs, strategies..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
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
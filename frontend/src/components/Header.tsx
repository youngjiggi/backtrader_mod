import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, ChevronDown, UserCircle, LogOut, Cog } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  onSignInClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignInClick, onSettingsClick, onProfileClick }) => {
  const { user, signOut } = useUser();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const handleSignOut = () => {
    signOut();
    setIsProfileDropdownOpen(false);
    if (onSignInClick) onSignInClick(); // Navigate to sign in screen
  };

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

          {/* User Profile Section */}
          {user && user.isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg border transition-colors duration-200 hover:bg-opacity-80"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
                title={`Profile: ${user.displayName}`}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    {getUserInitials(user.displayName)}
                  </div>
                )}
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-lg border shadow-lg z-50"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  {/* User Info Header */}
                  <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                          style={{
                            backgroundColor: 'var(--accent)',
                            color: 'var(--bg-primary)'
                          }}
                        >
                          {getUserInitials(user.displayName)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                          {user.displayName}
                        </p>
                        <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                          {user.email}
                        </p>
                        <span 
                          className="inline-block text-xs px-2 py-0.5 rounded mt-1"
                          style={{
                            backgroundColor: 'var(--highlight)',
                            color: 'var(--bg-primary)'
                          }}
                        >
                          {user.accountType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (onProfileClick) onProfileClick();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors hover:bg-opacity-50"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <UserCircle size={16} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        if (onSettingsClick) onSettingsClick();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors hover:bg-opacity-50"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Cog size={16} />
                      <span>Settings</span>
                    </button>
                    <div className="border-t my-2" style={{ borderColor: 'var(--border)' }}></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors hover:bg-opacity-50"
                      style={{ color: '#ef4444' }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
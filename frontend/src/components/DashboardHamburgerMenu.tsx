import React, { useState } from 'react';
import { X, User, Heart, Settings, BarChart3, Monitor, Save, Upload, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface DashboardHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile: () => void;
  onNavigateToSettings: () => void;
}

type TabType = 'profile' | 'favorites' | 'account' | 'trading' | 'display';

const DashboardHamburgerMenu: React.FC<DashboardHamburgerMenuProps> = ({
  isOpen,
  onClose,
  onNavigateToProfile,
  onNavigateToSettings,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser, updatePreferences } = useUser();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { fontSize, setFontSize } = useFontSize();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showVolume, setShowVolume] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  // Trading preferences state
  const [tradingForm, setTradingForm] = useState({
    portfolioSize: user?.preferences?.trading?.defaultPortfolioSize || 100000,
    riskLevel: (user?.preferences?.trading?.defaultRiskLevel || 0.02) * 100, // Convert to percentage
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'trading', label: 'Trading', icon: BarChart3 },
    { id: 'display', label: 'Display', icon: Monitor },
  ] as const;

  const handleSave = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const renderMiddlePanel = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Edit Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--accent-secondary)', color: 'var(--text-primary)' }}
              >
                <Upload size={16} />
                <span>Change Avatar</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: saveStatus === 'saved' ? '#22c55e' : 'var(--accent)',
                  color: 'var(--text-on-accent)'
                }}
              >
                {saveStatus === 'saving' ? (
                  <span>Saving...</span>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check size={16} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Manage Favorites
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Search & Add
                </label>
                <input
                  type="text"
                  placeholder="Search strategies, reports..."
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Category Filter
                </label>
                <select 
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option>All Categories</option>
                  <option>Strategies</option>
                  <option>Reports</option>
                  <option>Portfolios</option>
                  <option>Screens</option>
                </select>
              </div>

              <button
                className="w-full p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
              >
                Add to Favorites
              </button>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Account Security
            </h2>
            
            <div className="space-y-4">
              <button
                className="w-full p-3 rounded-lg text-left transition-colors"
                style={{ backgroundColor: 'var(--accent-secondary)', color: 'var(--text-primary)' }}
              >
                Change Password
              </button>

              <button
                className="w-full p-3 rounded-lg text-left transition-colors"
                style={{ backgroundColor: 'var(--accent-secondary)', color: 'var(--text-primary)' }}
              >
                Verify Email
              </button>

              <div className="flex items-center justify-between p-3 rounded-lg"
                   style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</span>
                <button
                  className="w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <div 
                    className="w-5 h-5 bg-white rounded-full transform translate-x-6 transition-transform"
                    style={{ border: theme === 'light' ? '1px solid #000' : 'none' }}
                  ></div>
                </button>
              </div>

              <button
                onClick={() => {
                  onNavigateToSettings();
                  onClose();
                }}
                className="w-full p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
              >
                View All Settings
              </button>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Trading Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Default Portfolio Size: ${tradingForm.portfolioSize.toLocaleString()}
                </label>
                
                {/* Preset Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[10000, 25000, 50000, 100000, 250000, 500000].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTradingForm(prev => ({ ...prev, portfolioSize: amount }))}
                      className="p-3 rounded-lg text-center transition-colors font-medium"
                      style={{
                        minHeight: '48px',
                        backgroundColor: tradingForm.portfolioSize === amount ? 'var(--accent)' : 'var(--accent-secondary)',
                        color: tradingForm.portfolioSize === amount ? 'var(--text-on-accent)' : 'var(--text-primary)',
                        border: `1px solid ${tradingForm.portfolioSize === amount ? 'var(--accent)' : 'var(--border-primary)'}`
                      }}
                    >
                      ${amount >= 1000000 ? `${amount/1000000}M` : `${amount/1000}K`}
                    </button>
                  ))}
                </div>

                {/* Step Controls for Fine Tuning */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setTradingForm(prev => ({ ...prev, portfolioSize: Math.max(1000, prev.portfolioSize - 5000) }))}
                    className="flex-1 p-3 rounded-lg transition-colors font-medium"
                    style={{
                      minHeight: '48px',
                      backgroundColor: 'var(--accent-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    -$5K
                  </button>
                  <button
                    onClick={() => setTradingForm(prev => ({ ...prev, portfolioSize: prev.portfolioSize + 5000 }))}
                    className="flex-1 p-3 rounded-lg transition-colors font-medium"
                    style={{
                      minHeight: '48px',
                      backgroundColor: 'var(--accent-secondary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    +$5K
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Risk Level: {tradingForm.riskLevel}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tradingForm.riskLevel}
                  onChange={(e) => setTradingForm(prev => ({ ...prev, riskLevel: Number(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Default Benchmark
                </label>
                <select 
                  className="w-full p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option>SPY</option>
                  <option>QQQ</option>
                  <option>IWM</option>
                  <option>VTI</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                className="w-full p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Display Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg"
                   style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Dark Mode</span>
                <button
                  onClick={toggleTheme}
                  className="w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: theme === 'dark' ? 'var(--accent)' : '#d1d5db' }}
                >
                  <div 
                    className="w-5 h-5 bg-white rounded-full transition-transform"
                    style={{ 
                      transform: theme === 'dark' ? 'translateX(24px)' : 'translateX(2px)',
                      border: theme === 'light' ? '1px solid #000' : 'none'
                    }}
                  ></div>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Font Size: {fontSize}
                </label>
                <div className="flex space-x-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size as 'small' | 'medium' | 'large')}
                      className="flex-1 p-2 rounded-lg transition-colors capitalize"
                      style={{
                        backgroundColor: fontSize === size ? 'var(--accent)' : 'var(--accent-secondary)',
                        color: fontSize === size ? 'var(--text-on-accent)' : 'var(--text-primary)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg"
                   style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Show Volume</span>
                <button
                  onClick={() => setShowVolume(!showVolume)}
                  className="w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: showVolume ? 'var(--accent)' : '#d1d5db' }}
                >
                  <div 
                    className="w-5 h-5 bg-white rounded-full transition-transform"
                    style={{ 
                      transform: showVolume ? 'translateX(24px)' : 'translateX(2px)',
                      border: theme === 'light' ? '1px solid #000' : 'none'
                    }}
                  ></div>
                </button>
              </div>

              <button
                className="w-full p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRightPanel = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center"
                   style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <User size={60} style={{ color: 'var(--text-primary)' }} />
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
              <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
                Member since {user ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Logged in today at 10:30 AM</p>
                  <p>• Created new strategy "ATR Breakout v2.1"</p>
                  <p>• Ran backtest on AAPL</p>
                  <p>• Updated trading preferences</p>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Account Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p style={{ color: 'var(--text-secondary)' }}>Strategies Created</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>12</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)' }}>Backtests Run</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>247</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Your Favorites ({favorites.length})
            </h3>
            
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart size={48} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-4" />
                <p style={{ color: 'var(--text-secondary)' }}>No favorites yet</p>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Add strategies, reports, or screens for quick access
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'var(--accent-secondary)' }}
                  >
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {favorite.title}
                    </div>
                    <div className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                      {favorite.type} • Added {new Date(favorite.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Usage Statistics</h4>
              <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <p>• Most accessed: Strategy templates</p>
                <p>• Average daily favorites usage: 5.2 items</p>
                <p>• Favorite category: Trading strategies</p>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Account Overview
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Security Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Password</span>
                    <span style={{ color: '#22c55e' }}>✓ Strong</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Email Verified</span>
                    <span style={{ color: '#22c55e' }}>✓ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Two-Factor Auth</span>
                    <span style={{ color: '#22c55e' }}>✓ Enabled</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Plan Details</h4>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>Beta Access</p>
                  <p>Unlimited strategies and backtests</p>
                  <p>Premium features included</p>
                  <p className="mt-2 text-xs">Valid until public release</p>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Recent Security Events</h4>
                <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Login from Chrome (today)</p>
                  <p>• Password changed (3 days ago)</p>
                  <p>• 2FA enabled (1 week ago)</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Trading Overview
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Current Portfolio</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p style={{ color: 'var(--text-secondary)' }}>Total Value</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ${tradingForm.portfolioSize.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-secondary)' }}>Active Positions</p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>7</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Strategy Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>ATR Breakout v2.1</span>
                    <span style={{ color: '#22c55e' }}>+12.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>RSI Divergence</span>
                    <span style={{ color: '#22c55e' }}>+8.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>Moving Average Cross</span>
                    <span style={{ color: '#ef4444' }}>-3.2%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Risk Metrics</h4>
                <div className="space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <p>• Current risk level: {tradingForm.riskLevel}%</p>
                  <p>• Maximum drawdown: -5.3%</p>
                  <p>• Sharpe ratio: 1.84</p>
                  <p>• Win rate: 68.4%</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'display':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Display Preview
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Current Theme</h4>
                <div className="flex items-center space-x-3 text-sm">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                  ></div>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Font Size Preview</h4>
                <div className="space-y-2">
                  <p 
                    className={`${fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base'}`}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Sample text with current font size ({fontSize})
                  </p>
                  <p 
                    className={`${fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'} text-xs`}
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    This is how smaller text will appear in the interface
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--accent-secondary)' }}>
                <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Color Scheme</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div className="w-full h-6 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Accent</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-6 rounded" style={{ backgroundColor: 'var(--highlight)' }}></div>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Highlight</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-6 rounded" style={{ backgroundColor: 'var(--success)' }}></div>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Success</p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full h-6 rounded" style={{ backgroundColor: 'var(--danger)' }}></div>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Danger</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* 3-Panel Grid Layout */}
      <div className="h-full grid grid-cols-[15%_35%_50%]">
        {/* Left Panel - Navigation Tabs */}
        <div 
          className="flex flex-col border-r"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          {/* Close Button */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--accent-secondary)' }}
            >
              <X size={20} style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="w-full flex flex-col items-center space-y-2 p-4 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'var(--text-on-accent)' : 'var(--text-primary)'
                  }}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle Panel - Interactive Controls */}
        <div 
          className="p-6 border-r overflow-y-auto"
          style={{ 
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          {renderMiddlePanel()}
        </div>

        {/* Right Panel - Content Display */}
        <div 
          className="p-6 overflow-y-auto"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
};

export default DashboardHamburgerMenu;
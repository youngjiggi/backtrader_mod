import React, { useState } from 'react';
import { ArrowLeft, User, Settings, TrendingUp, BarChart3, List, Edit, Camera, Mail, Calendar, Crown } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ProfileSection from './ProfileSection';

interface UserProfileScreenProps {
  onBack: () => void;
  onAccountSettingsClick?: () => void;
  onTradingPreferencesClick?: () => void;
  onSettingsClick?: () => void;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ 
  onBack, 
  onAccountSettingsClick,
  onTradingPreferencesClick,
  onSettingsClick 
}) => {
  const { user, updateUser } = useUser();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState(user?.displayName || '');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading user profile...</p>
      </div>
    );
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const handleSaveName = () => {
    if (tempDisplayName.trim()) {
      updateUser({ displayName: tempDisplayName.trim() });
      setIsEditingName(false);
    }
  };

  const handleCancelEdit = () => {
    setTempDisplayName(user.displayName);
    setIsEditingName(false);
  };

  // Mock recent activity data
  const recentActivity = [
    {
      type: 'strategy',
      action: 'Created new strategy',
      name: 'Moving Average Crossover v2',
      timestamp: '2 hours ago',
      icon: <TrendingUp size={16} />
    },
    {
      type: 'backtest',
      action: 'Completed backtest',
      name: 'AAPL - 5 Year Analysis',
      timestamp: '1 day ago',
      icon: <BarChart3 size={16} />
    },
    {
      type: 'portfolio',
      action: 'Updated portfolio',
      name: 'Tech Growth Portfolio',
      timestamp: '3 days ago',
      icon: <List size={16} />
    }
  ];

  // Mock stats
  const userStats = {
    strategiesCreated: 12,
    backtestsRun: 47,
    portfoliosManaged: 5,
    totalReturn: 23.4
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="border-b px-6 py-4"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <User size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Profile
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Profile Overview */}
        <ProfileSection title="Profile Overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar and Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4"
                      style={{ borderColor: 'var(--accent)' }}
                    />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold border-4"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'var(--bg-primary)',
                        borderColor: 'var(--accent)'
                      }}
                    >
                      {getUserInitials(user.displayName)}
                    </div>
                  )}
                  <button
                    className="absolute bottom-0 right-0 p-2 rounded-full border-2 transition-colors hover:bg-opacity-80"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                    title="Change avatar"
                  >
                    <Camera size={16} />
                  </button>
                </div>

                {/* Name Editing */}
                {isEditingName ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-center focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                        '--tw-ring-color': 'var(--accent)'
                      }}
                      autoFocus
                    />
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={handleSaveName}
                        className="px-3 py-1 text-sm rounded transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: 'var(--accent)',
                          color: 'var(--bg-primary)'
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-sm border rounded transition-colors hover:bg-opacity-80"
                        style={{
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold flex items-center justify-center space-x-2">
                      <span style={{ color: 'var(--text-primary)' }}>{user.displayName}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 rounded transition-colors hover:bg-opacity-50"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Edit name"
                      >
                        <Edit size={14} />
                      </button>
                    </h2>
                    <p className="flex items-center justify-center space-x-1" style={{ color: 'var(--text-secondary)' }}>
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                      <Crown size={14} style={{ color: 'var(--highlight)' }} />
                      <span 
                        className="px-2 py-1 rounded text-sm font-medium"
                        style={{
                          backgroundColor: 'var(--highlight)',
                          color: 'var(--bg-primary)'
                        }}
                      >
                        {user.accountType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm flex items-center justify-center space-x-1" style={{ color: 'var(--text-secondary)' }}>
                      <Calendar size={14} />
                      <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* User Stats */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                Your Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {userStats.strategiesCreated}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Strategies
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {userStats.backtestsRun}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Backtests
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                    {userStats.portfoliosManaged}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Portfolios
                  </div>
                </div>
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <div className="text-2xl font-bold text-green-600">
                    +{userStats.totalReturn}%
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Avg Return
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Recent Activity */}
        <ProfileSection title="Recent Activity" description="Your latest actions in the platform">
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-3 rounded-lg border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
              >
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {activity.action}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {activity.name}
                  </p>
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        </ProfileSection>

        {/* Quick Actions */}
        <ProfileSection title="Quick Actions" description="Manage your account and preferences">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onAccountSettingsClick}
              className="p-4 rounded-lg border text-left transition-colors hover:bg-opacity-50 hover:border-opacity-80"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <User size={20} style={{ color: 'var(--accent)' }} />
                <h4 className="font-medium">Account Settings</h4>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Manage your personal information and security
              </p>
            </button>

            <button
              onClick={onTradingPreferencesClick}
              className="p-4 rounded-lg border text-left transition-colors hover:bg-opacity-50 hover:border-opacity-80"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp size={20} style={{ color: 'var(--accent)' }} />
                <h4 className="font-medium">Trading Preferences</h4>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Set your default backtesting parameters
              </p>
            </button>

            <button
              onClick={onSettingsClick}
              className="p-4 rounded-lg border text-left transition-colors hover:bg-opacity-50 hover:border-opacity-80"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Settings size={20} style={{ color: 'var(--accent)' }} />
                <h4 className="font-medium">App Settings</h4>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Customize your application experience
              </p>
            </button>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default UserProfileScreen;
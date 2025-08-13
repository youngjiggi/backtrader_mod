import React from 'react';
import { ArrowLeft, Settings, User, TrendingUp, Bell, Database, Palette, Monitor } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  onAccountSettingsClick?: () => void;
  onTradingPreferencesClick?: () => void;
  onProfileClick?: () => void;
  onNotificationSettingsClick?: () => void;
  onDataSettingsClick?: () => void;
  onDisplaySettingsClick?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onBack, 
  onAccountSettingsClick,
  onTradingPreferencesClick,
  onProfileClick,
  onNotificationSettingsClick,
  onDataSettingsClick,
  onDisplaySettingsClick
}) => {

  // Settings categories
  const settingsCategories = [
    {
      title: 'Account & Profile',
      description: 'Manage your personal information and account settings',
      icon: <User size={20} />,
      items: [
        {
          title: 'Profile',
          description: 'View and edit your profile information',
          icon: <User size={16} />,
          onClick: onProfileClick
        },
        {
          title: 'Account Settings',
          description: 'Manage personal info, password, and security',
          icon: <Settings size={16} />,
          onClick: onAccountSettingsClick
        }
      ]
    },
    {
      title: 'Trading & Preferences',
      description: 'Configure your trading and backtesting preferences',
      icon: <TrendingUp size={20} />,
      items: [
        {
          title: 'Trading Preferences',
          description: 'Set default portfolio parameters and chart settings',
          icon: <TrendingUp size={16} />,
          onClick: onTradingPreferencesClick
        },
        {
          title: 'Notification Settings',
          description: 'Manage email and system notifications',
          icon: <Bell size={16} />,
          onClick: onNotificationSettingsClick
        }
      ]
    },
    {
      title: 'Application',
      description: 'Customize your application experience',
      icon: <Monitor size={20} />,
      items: [
        {
          title: 'Display Settings',
          description: 'Font size, theme, and visual preferences',
          icon: <Palette size={16} />,
          onClick: onDisplaySettingsClick
        },
        {
          title: 'Data Management',
          description: 'Export, backup, and data preferences',
          icon: <Database size={16} />,
          onClick: onDataSettingsClick
        }
      ]
    }
  ];

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
              <Settings size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Settings
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Settings Navigation */}
        <div className="space-y-6">
  {settingsCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="border rounded-lg p-6"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div style={{ color: 'var(--accent)' }}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {category.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {category.description}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="p-4 rounded-lg border text-left transition-colors hover:bg-opacity-50 hover:border-opacity-80"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div style={{ color: 'var(--accent)' }}>
                        {item.icon}
                      </div>
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
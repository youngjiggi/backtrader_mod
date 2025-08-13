import React, { useState } from 'react';
import { ArrowLeft, Bell, Save, Check, Mail, Smartphone, TrendingUp, AlertTriangle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ProfileSection from './ProfileSection';
import PreferenceToggle from './PreferenceToggle';

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ onBack }) => {
  const { user, updatePreferences } = useUser();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading notification settings...</p>
      </div>
    );
  }

  const notifications = user.preferences.notifications;

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    updatePreferences('notifications', { [key]: value });
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
              <Bell size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Notification Settings
              </h1>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Email Notifications */}
        <ProfileSection 
          title="Email Notifications" 
          description="Choose what email notifications you'd like to receive"
        >
          <div className="space-y-4">
            <PreferenceToggle
              label="Master Email Notifications"
              description="Enable or disable all email notifications"
              value={notifications.emailNotifications}
              onChange={(value) => handleNotificationChange('emailNotifications', value)}
              icon={<Mail size={16} />}
              showIcon={true}
            />

            <div className="ml-6 space-y-4" style={{ opacity: notifications.emailNotifications ? 1 : 0.5 }}>
              <PreferenceToggle
                label="Backtest Completion"
                description="Get notified when your backtests finish running"
                value={notifications.backtestCompletion}
                onChange={(value) => handleNotificationChange('backtestCompletion', value)}
                disabled={!notifications.emailNotifications}
              />

              <PreferenceToggle
                label="Portfolio Performance Alerts"
                description="Receive alerts for significant portfolio changes"
                value={notifications.portfolioAlerts}
                onChange={(value) => handleNotificationChange('portfolioAlerts', value)}
                disabled={!notifications.emailNotifications}
              />

              <PreferenceToggle
                label="Market Condition Alerts"
                description="Get notified about important market events"
                value={notifications.marketAlerts}
                onChange={(value) => handleNotificationChange('marketAlerts', value)}
                disabled={!notifications.emailNotifications}
              />

              <PreferenceToggle
                label="System Updates"
                description="Receive notifications about system maintenance and updates"
                value={notifications.systemUpdates}
                onChange={(value) => handleNotificationChange('systemUpdates', value)}
                disabled={!notifications.emailNotifications}
              />

              <PreferenceToggle
                label="Weekly Performance Reports"
                description="Get weekly summaries of your portfolio performance"
                value={notifications.weeklyReports}
                onChange={(value) => handleNotificationChange('weeklyReports', value)}
                disabled={!notifications.emailNotifications}
              />
            </div>
          </div>
        </ProfileSection>

        {/* Push Notifications (Future Feature) */}
        <ProfileSection 
          title="Push Notifications" 
          description="Real-time notifications sent to your browser (Coming Soon)"
        >
          <div className="p-6 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <Smartphone size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Push Notifications Coming Soon
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Real-time browser notifications for instant alerts about your backtests and portfolio performance.
            </p>
          </div>
        </ProfileSection>

        {/* Alert Thresholds */}
        <ProfileSection 
          title="Alert Thresholds" 
          description="Set performance thresholds that trigger notifications"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Portfolio Gain Alert (%)
                </label>
                <div className="relative">
                  <TrendingUp size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="number"
                    defaultValue={5}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                    placeholder="5.0"
                    min="0.1"
                    max="100"
                    step="0.1"
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Get notified when portfolio gains exceed this percentage
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Portfolio Loss Alert (%)
                </label>
                <div className="relative">
                  <AlertTriangle size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    type="number"
                    defaultValue={3}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                    placeholder="3.0"
                    min="0.1"
                    max="50"
                    step="0.1"
                  />
                </div>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Get notified when portfolio losses exceed this percentage
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Notification Frequency
              </label>
              <select
                defaultValue="immediate"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly Summary</option>
                <option value="daily">Daily Summary</option>
                <option value="weekly">Weekly Summary</option>
              </select>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                How often you want to receive threshold alerts
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Marketing Communications */}
        <ProfileSection 
          title="Marketing Communications" 
          description="Choose what marketing emails you'd like to receive"
        >
          <div className="space-y-4">
            <PreferenceToggle
              label="Product Updates"
              description="Learn about new features and improvements"
              value={true}
              onChange={() => {}}
              disabled={true}
            />

            <PreferenceToggle
              label="Educational Content"
              description="Trading tips, strategies, and educational materials"
              value={true}
              onChange={() => {}}
              disabled={true}
            />

            <PreferenceToggle
              label="Community Events"
              description="Information about webinars, meetups, and community events"
              value={false}
              onChange={() => {}}
              disabled={true}
            />

            <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
              <p className="text-sm">
                Marketing communication preferences will be available once you create an account and verify your email address.
              </p>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default NotificationSettingsScreen;
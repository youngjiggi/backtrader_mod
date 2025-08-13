import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Save, AlertTriangle, Check } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ProfileSection from './ProfileSection';

interface AccountSettingsScreenProps {
  onBack: () => void;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ onBack }) => {
  const { user, updateUser, updatePreferences } = useUser();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading account settings...</p>
      </div>
    );
  }

  const validatePersonalInfo = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    } else if (formData.displayName.trim().length > 50) {
      newErrors.displayName = 'Display name must not exceed 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const validatePassword = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSavePersonalInfo = async () => {
    const validationErrors = validatePersonalInfo();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSaveStatus('saving');
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        updateUser({
          displayName: formData.displayName.trim(),
          email: formData.email.trim()
        });
        
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  };

  const handleChangePassword = async () => {
    const validationErrors = validatePassword();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSaveStatus('saving');
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would make an API call to change the password
        // For now, just clear the form and show success
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  };

  const handleNotificationChange = (key: keyof typeof user.preferences.notifications, value: boolean) => {
    updatePreferences('notifications', { [key]: value });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    alert('Account deletion would be processed. This is a demo.');
    setShowDeleteConfirmation(false);
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
                Account Settings
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Personal Information */}
        <ProfileSection 
          title="Personal Information" 
          description="Update your display name and email address"
          actionButton={
            <button
              onClick={handleSavePersonalInfo}
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
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => {
                  setFormData({ ...formData, displayName: e.target.value });
                  setErrors({ ...errors, displayName: '' });
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: errors.displayName ? '#ef4444' : 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
                placeholder="Enter your display name"
              />
              {errors.displayName && (
                <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                  {errors.displayName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setErrors({ ...errors, email: '' });
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: errors.email ? '#ef4444' : 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </ProfileSection>

        {/* Password Change */}
        <ProfileSection 
          title="Change Password" 
          description="Update your password to keep your account secure"
          actionButton={
            <button
              onClick={handleChangePassword}
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
                  <span>Updating...</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check size={16} />
                  <span>Updated!</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, currentPassword: e.target.value });
                    setErrors({ ...errors, currentPassword: '' });
                  }}
                  className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: errors.currentPassword ? '#ef4444' : 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      setErrors({ ...errors, newPassword: '' });
                    }}
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: errors.newPassword ? '#ef4444' : 'var(--border)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: errors.confirmPassword ? '#ef4444' : 'var(--border)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Notification Preferences */}
        <ProfileSection 
          title="Notification Preferences" 
          description="Choose what email notifications you'd like to receive"
        >
          <div className="space-y-4">
            {Object.entries(user.preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {key === 'emailNotifications' && 'Enable all email notifications'}
                    {key === 'backtestCompletion' && 'Get notified when backtests finish'}
                    {key === 'portfolioAlerts' && 'Receive portfolio performance alerts'}
                    {key === 'marketAlerts' && 'Get market condition notifications'}
                    {key === 'systemUpdates' && 'Receive system maintenance updates'}
                    {key === 'weeklyReports' && 'Get weekly performance reports'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key as keyof typeof user.preferences.notifications, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </ProfileSection>

        {/* Danger Zone */}
        <ProfileSection 
          title="Danger Zone" 
          description="Irreversible and destructive actions"
        >
          <div className="border border-red-300 rounded-lg p-4" style={{ backgroundColor: '#fef2f2' }}>
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Delete Account</h4>
                <p className="text-sm text-red-700 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                {showDeleteConfirmation ? (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm font-medium text-red-800">
                      Are you absolutely sure? This will permanently delete your account and cannot be undone.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDeleteAccount}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Yes, delete my account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmation(false)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="mt-3 px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default AccountSettingsScreen;
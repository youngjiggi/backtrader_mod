import React, { useState } from 'react';
import { ArrowLeft, Database, Save, Check, Download, Upload, Trash2, Shield, Cloud, FileText, Settings, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ProfileSection from './ProfileSection';
import PreferenceToggle from './PreferenceToggle';

interface DataSettingsScreenProps {
  onBack: () => void;
}

const DataSettingsScreen: React.FC<DataSettingsScreenProps> = ({ onBack }) => {
  const { user } = useUser();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [exportFormat, setExportFormat] = useState('csv');
  const [retentionPeriod, setRetentionPeriod] = useState('1year');
  const [autoBackup, setAutoBackup] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading data settings...</p>
      </div>
    );
  }

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

  const handleExportData = (type: 'strategies' | 'backtests' | 'portfolio' | 'all') => {
    // Simulate data export
    const filename = `backstreet_${type}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    alert(`Exporting ${type} data as ${filename}. This is a demo - no actual file will be downloaded.`);
  };

  const handleDeleteData = (type: 'cache' | 'preferences' | 'all') => {
    if (confirm(`Are you sure you want to delete ${type} data? This action cannot be undone.`)) {
      alert(`${type} data would be deleted. This is a demo.`);
    }
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
              <Database size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Data Management
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
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Data Export */}
        <ProfileSection 
          title="Data Export" 
          description="Download your data in various formats"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Default Export Format
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                <option value="csv">CSV (Comma Separated Values)</option>
                <option value="json">JSON (JavaScript Object Notation)</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="pdf">PDF Report</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleExportData('strategies')}
                className="flex items-center space-x-3 p-4 border rounded-lg transition-colors hover:bg-opacity-50"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <Settings size={20} style={{ color: 'var(--accent)' }} />
                <div className="text-left">
                  <h4 className="font-medium">Export Strategies</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Download all your trading strategies
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleExportData('backtests')}
                className="flex items-center space-x-3 p-4 border rounded-lg transition-colors hover:bg-opacity-50"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <FileText size={20} style={{ color: 'var(--accent)' }} />
                <div className="text-left">
                  <h4 className="font-medium">Export Backtests</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Download backtest results and reports
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleExportData('portfolio')}
                className="flex items-center space-x-3 p-4 border rounded-lg transition-colors hover:bg-opacity-50"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <Download size={20} style={{ color: 'var(--accent)' }} />
                <div className="text-left">
                  <h4 className="font-medium">Export Portfolio Data</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Download portfolio performance data
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleExportData('all')}
                className="flex items-center space-x-3 p-4 border rounded-lg transition-colors hover:bg-opacity-50"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                <Database size={20} style={{ color: 'var(--accent)' }} />
                <div className="text-left">
                  <h4 className="font-medium">Export All Data</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Complete data archive download
                  </p>
                </div>
              </button>
            </div>
          </div>
        </ProfileSection>

        {/* Data Retention */}
        <ProfileSection 
          title="Data Retention" 
          description="Control how long your data is stored"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Data Retention Period
              </label>
              <select
                value={retentionPeriod}
                onChange={(e) => setRetentionPeriod(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
                <option value="2years">2 Years</option>
                <option value="indefinite">Keep Indefinitely</option>
              </select>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                How long to keep your backtest results and performance data
              </p>
            </div>
          </div>
        </ProfileSection>

        {/* Backup & Sync */}
        <ProfileSection 
          title="Backup & Sync" 
          description="Automatic backup and synchronization settings"
        >
          <div className="space-y-4">
            <PreferenceToggle
              label="Automatic Backups"
              description="Automatically backup your data daily"
              value={autoBackup}
              onChange={setAutoBackup}
              icon={<Cloud size={16} />}
              showIcon={true}
            />

            <div className="ml-6 space-y-4" style={{ opacity: autoBackup ? 1 : 0.5 }}>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Backup Frequency
                </label>
                <select
                  disabled={!autoBackup}
                  defaultValue="daily"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="flex items-start space-x-3">
                <Cloud size={20} style={{ color: 'var(--accent)' }} />
                <div>
                  <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Cloud Sync Status
                  </h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Last backup: Today at 3:24 PM<br />
                    Next backup: Tomorrow at 3:24 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* API Integration (Future) */}
        <ProfileSection 
          title="API Integration" 
          description="Connect with external services and data providers"
        >
          <div className="p-6 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
            <Settings size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              API Integration Coming Soon
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Connect your account with third-party data providers, brokers, and portfolio management tools.
            </p>
          </div>
        </ProfileSection>

        {/* Data Deletion */}
        <ProfileSection 
          title="Data Deletion" 
          description="Permanently delete your data"
        >
          <div 
            className="border border-red-300 rounded-lg p-4"
            style={{ backgroundColor: '#fef2f2' }}
          >
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-red-800">Dangerous Actions</h4>
                <p className="text-sm text-red-700 mt-1 mb-4">
                  These actions cannot be undone. Please be careful.
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleDeleteData('cache')}
                    className="flex items-center space-x-2 px-3 py-2 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Clear Cache & Temporary Data</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteData('preferences')}
                    className="flex items-center space-x-2 px-3 py-2 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Reset All Preferences</span>
                  </button>
                  
                  <button
                    onClick={() => handleDeleteData('all')}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Delete All Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Privacy Notice */}
        <ProfileSection 
          title="Privacy & Security" 
          description="How your data is protected"
        >
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <Shield size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Data Security
                </h4>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Your data is encrypted in transit and at rest. We use industry-standard security measures to protect your information.
                </p>
              </div>
            </div>
            
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                By using Backstreet Betas, you agree to our data handling practices as outlined in our{' '}
                <button className="underline hover:no-underline" style={{ color: 'var(--accent)' }}>
                  Privacy Policy
                </button>{' '}
                and{' '}
                <button className="underline hover:no-underline" style={{ color: 'var(--accent)' }}>
                  Terms of Service
                </button>.
              </p>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default DataSettingsScreen;
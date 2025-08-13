import React, { useState } from 'react';
import { ArrowLeft, Palette, Save, Check, Monitor, Sun, Moon, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { useUser } from '../contexts/UserContext';
import ProfileSection from './ProfileSection';
import PreferenceToggle from './PreferenceToggle';

interface DisplaySettingsScreenProps {
  onBack: () => void;
}

const DisplaySettingsScreen: React.FC<DisplaySettingsScreenProps> = ({ onBack }) => {
  const { theme, toggleTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const { user, updatePreferences } = useUser();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading display settings...</p>
      </div>
    );
  }

  const fontSizeOptions = [
    { value: 'small', label: 'Small', description: 'Compact text for more information' },
    { value: 'medium', label: 'Medium', description: 'Standard text size' },
    { value: 'large', label: 'Large', description: 'Larger text for better readability' }
  ] as const;

  const displayPrefs = user.preferences.display;

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

  const handleResetToDefaults = () => {
    if (confirm('Reset all display settings to defaults? This will change your theme, font size, and preferences.')) {
      setFontSize('medium');
      updatePreferences('display', {
        theme: 'auto',
        fontSize: 'medium',
        compactMode: false,
        showTooltips: true,
        animationsEnabled: true
      });
      if (theme !== 'dark') {
        toggleTheme(); // Reset to dark theme (default)
      }
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
              <Palette size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Display Settings
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <RotateCcw size={16} />
              <span>Reset to Defaults</span>
            </button>
            
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
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Settings */}
            <ProfileSection 
              title="Theme & Appearance" 
              description="Choose your preferred color scheme"
            >
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <h4 className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                    Color Theme
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Light Theme Card */}
                    <button
                      onClick={theme === 'dark' ? toggleTheme : undefined}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        theme === 'light' ? 'ring-2 ring-blue-500' : 'hover:border-opacity-80'
                      }`}
                      style={{
                        backgroundColor: theme === 'light' ? 'var(--accent)' : 'var(--surface)',
                        borderColor: theme === 'light' ? 'var(--accent)' : 'var(--border)',
                        color: theme === 'light' ? 'var(--bg-primary)' : 'var(--text-primary)'
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Sun size={20} />
                        <span className="font-medium">Light Theme</span>
                      </div>
                      <div className="text-sm text-left opacity-90">
                        Clean, bright interface perfect for daytime use
                      </div>
                      {/* Mini Preview */}
                      <div className="mt-3 flex space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm opacity-90"></div>
                        <div className="w-4 h-2 bg-gray-100 rounded-sm opacity-90"></div>
                        <div className="w-4 h-2 bg-blue-500 rounded-sm opacity-90"></div>
                      </div>
                    </button>

                    {/* Dark Theme Card */}
                    <button
                      onClick={theme === 'light' ? toggleTheme : undefined}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        theme === 'dark' ? 'ring-2 ring-blue-500' : 'hover:border-opacity-80'
                      }`}
                      style={{
                        backgroundColor: theme === 'dark' ? 'var(--accent)' : 'var(--surface)',
                        borderColor: theme === 'dark' ? 'var(--accent)' : 'var(--border)',
                        color: theme === 'dark' ? 'var(--bg-primary)' : 'var(--text-primary)'
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <Moon size={20} />
                        <span className="font-medium">Dark Theme</span>
                      </div>
                      <div className="text-sm text-left opacity-90">
                        Easy on the eyes for extended usage
                      </div>
                      {/* Mini Preview */}
                      <div className="mt-3 flex space-x-1">
                        <div className="w-4 h-2 bg-gray-800 rounded-sm opacity-90"></div>
                        <div className="w-4 h-2 bg-gray-700 rounded-sm opacity-90"></div>
                        <div className="w-4 h-2 bg-cyan-400 rounded-sm opacity-90"></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Typography Settings */}
            <ProfileSection 
              title="Typography" 
              description="Adjust text size and readability"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Font Size
                  </h4>
                  <div className="space-y-3">
                    {fontSizeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg border transition-colors hover:bg-opacity-50"
                        style={{
                          backgroundColor: fontSize === option.value ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-primary)',
                          borderColor: fontSize === option.value ? 'var(--accent)' : 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <input
                          type="radio"
                          name="fontSize"
                          value={option.value}
                          checked={fontSize === option.value}
                          onChange={(e) => setFontSize(e.target.value as typeof fontSize)}
                          style={{ accentColor: 'var(--accent)' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.label}</span>
                            <span className={`text-${option.value === 'small' ? 'sm' : option.value === 'large' ? 'lg' : 'base'}`}>
                              Sample Text
                            </span>
                          </div>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Interface Preferences */}
            <ProfileSection 
              title="Interface Preferences" 
              description="Customize your interface behavior"
            >
              <div className="space-y-4">
                <PreferenceToggle
                  label="Compact Mode"
                  description="Reduce spacing and padding for more content density"
                  value={displayPrefs.compactMode}
                  onChange={(value) => updatePreferences('display', { compactMode: value })}
                  icon={<Monitor size={16} />}
                  showIcon={true}
                />

                <PreferenceToggle
                  label="Show Tooltips"
                  description="Display helpful tooltips when hovering over elements"
                  value={displayPrefs.showTooltips}
                  onChange={(value) => updatePreferences('display', { showTooltips: value })}
                  icon={<Eye size={16} />}
                  showIcon={true}
                />

                <PreferenceToggle
                  label="Enable Animations"
                  description="Smooth transitions and animations throughout the interface"
                  value={displayPrefs.animationsEnabled}
                  onChange={(value) => updatePreferences('display', { animationsEnabled: value })}
                />
              </div>
            </ProfileSection>

            {/* Accessibility */}
            <ProfileSection 
              title="Accessibility" 
              description="Settings to improve usability for all users"
            >
              <div className="space-y-4">
                <PreferenceToggle
                  label="High Contrast Mode"
                  description="Increase contrast between text and background"
                  value={false}
                  onChange={() => {}}
                  disabled={true}
                />

                <PreferenceToggle
                  label="Reduce Motion"
                  description="Minimize animations for users sensitive to motion"
                  value={false}
                  onChange={() => {}}
                  disabled={true}
                />

                <div className="mt-4 p-3 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
                  <p className="text-sm">
                    Additional accessibility options will be available in future updates.
                  </p>
                </div>
              </div>
            </ProfileSection>
          </div>

          {/* Live Preview Panel */}
          <div className="space-y-6">
            <ProfileSection title="Live Preview" description="See your changes in real-time">
              <div className="space-y-4">
                {/* Theme Preview */}
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Current Theme: {theme === 'light' ? 'Light' : 'Dark'}
                  </h4>
                  <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Font Size: {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
                  </div>
                  
                  {/* Color Swatches */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded mx-auto mb-1"
                        style={{ backgroundColor: 'var(--bg-primary)' }}
                      ></div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Background</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded mx-auto mb-1"
                        style={{ backgroundColor: 'var(--surface)' }}
                      ></div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Surface</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-8 h-8 rounded mx-auto mb-1"
                        style={{ backgroundColor: 'var(--accent)' }}
                      ></div>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Accent</span>
                    </div>
                  </div>

                  {/* Sample Content */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>Total Return</span>
                      <span className="font-medium text-green-500">+15.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                      <span className="font-medium" style={{ color: 'var(--highlight)' }}>68.4%</span>
                    </div>
                  </div>
                </div>

                {/* Settings Summary */}
                <div 
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Current Settings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Compact Mode</span>
                      <span style={{ color: displayPrefs.compactMode ? '#10b981' : '#ef4444' }}>
                        {displayPrefs.compactMode ? 'On' : 'Off'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Tooltips</span>
                      <span style={{ color: displayPrefs.showTooltips ? '#10b981' : '#ef4444' }}>
                        {displayPrefs.showTooltips ? 'On' : 'Off'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Animations</span>
                      <span style={{ color: displayPrefs.animationsEnabled ? '#10b981' : '#ef4444' }}>
                        {displayPrefs.animationsEnabled ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Quick Actions */}
            <ProfileSection title="Quick Actions">
              <div className="space-y-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors hover:bg-opacity-50"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                  <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme</span>
                </button>
                
                <button
                  onClick={() => setFontSize(fontSize === 'large' ? 'small' : 'large')}
                  className="w-full flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors hover:bg-opacity-50"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>Toggle Font Size</span>
                </button>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettingsScreen;
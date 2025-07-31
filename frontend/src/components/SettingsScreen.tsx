import React from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { useFontSize } from '../contexts/FontSizeContext';

interface SettingsScreenProps {
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { fontSize, setFontSize } = useFontSize();

  const fontSizeOptions = [
    { value: 'small', label: 'Small', description: 'Compact text for more information' },
    { value: 'medium', label: 'Medium', description: 'Standard text size' },
    { value: 'large', label: 'Large', description: 'Larger text for better readability' }
  ] as const;

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

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Display Settings */}
          <div
            className="border rounded-lg p-6"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Display Settings
            </h2>
            
            {/* Font Size Setting */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Font Size
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Choose your preferred text size for better readability
                </p>
              </div>
              
              <div className="space-y-3">
                {fontSizeOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg border transition-colors hover:bg-opacity-80"
                    style={{
                      backgroundColor: fontSize === option.value ? 'var(--accent)' : 'var(--bg-primary)',
                      borderColor: fontSize === option.value ? 'var(--accent)' : 'var(--border)',
                      color: fontSize === option.value ? 'var(--bg-primary)' : 'var(--text-primary)'
                    }}
                  >
                    <input
                      type="radio"
                      name="fontSize"
                      value={option.value}
                      checked={fontSize === option.value}
                      onChange={(e) => setFontSize(e.target.value as typeof fontSize)}
                      className="mt-1"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                      <div 
                        className="text-sm"
                        style={{ 
                          color: fontSize === option.value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                          opacity: fontSize === option.value ? 0.9 : 1
                        }}
                      >
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className="border rounded-lg p-6"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Preview
            </h2>
            <div
              className="border rounded p-4"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)'
              }}
            >
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Sample Backtest Report
              </h3>
              <p className="mb-3" style={{ color: 'var(--text-secondary)' }}>
                AAPL • 1D • 2024-01-01 to 2024-12-31
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Total Return</span>
                  <span className="font-medium" style={{ color: '#10b981' }}>+15.2%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Win Rate</span>
                  <span className="font-medium" style={{ color: 'var(--highlight)' }}>68.4%</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Sharpe Ratio</span>
                  <span className="font-medium" style={{ color: 'var(--highlight)' }}>1.23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
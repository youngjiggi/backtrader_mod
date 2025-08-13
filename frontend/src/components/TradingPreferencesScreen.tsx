import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Save, Check, DollarSign, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import ProfileSection from './ProfileSection';

interface TradingPreferencesScreenProps {
  onBack: () => void;
}

const TradingPreferencesScreen: React.FC<TradingPreferencesScreenProps> = ({ onBack }) => {
  const { user, updatePreferences } = useUser();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-primary)' }}>Loading trading preferences...</p>
      </div>
    );
  }

  const tradingPrefs = user.preferences.trading;

  const [formData, setFormData] = useState({
    defaultPortfolioSize: tradingPrefs.defaultPortfolioSize,
    defaultRiskLevel: tradingPrefs.defaultRiskLevel * 100, // Convert to percentage for display
    preferredTimeframes: tradingPrefs.preferredTimeframes,
    defaultBenchmark: tradingPrefs.defaultBenchmark,
    autoSaveInterval: tradingPrefs.autoSaveInterval / 1000, // Convert to seconds for display
    defaultChartType: tradingPrefs.defaultChartType,
    showVolume: tradingPrefs.showVolume,
    defaultIndicators: tradingPrefs.defaultIndicators
  });

  const timeframeOptions = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'];
  const benchmarkOptions = ['SPY', 'QQQ', 'IWM', 'VTI', 'DIA'];
  const chartTypeOptions = [
    { value: 'candlestick', label: 'Candlestick' },
    { value: 'line', label: 'Line Chart' },
    { value: 'area', label: 'Area Chart' }
  ];
  const indicatorOptions = ['SMA_20', 'SMA_50', 'SMA_200', 'EMA_12', 'EMA_26', 'RSI', 'MACD', 'Bollinger_Bands'];

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updatePreferences('trading', {
        defaultPortfolioSize: formData.defaultPortfolioSize,
        defaultRiskLevel: formData.defaultRiskLevel / 100, // Convert back to decimal
        preferredTimeframes: formData.preferredTimeframes,
        defaultBenchmark: formData.defaultBenchmark,
        autoSaveInterval: formData.autoSaveInterval * 1000, // Convert back to milliseconds
        defaultChartType: formData.defaultChartType as 'candlestick' | 'line' | 'area',
        showVolume: formData.showVolume,
        defaultIndicators: formData.defaultIndicators
      });
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleTimeframeToggle = (timeframe: string) => {
    const updated = formData.preferredTimeframes.includes(timeframe)
      ? formData.preferredTimeframes.filter(tf => tf !== timeframe)
      : [...formData.preferredTimeframes, timeframe];
    setFormData({ ...formData, preferredTimeframes: updated });
  };

  const handleIndicatorToggle = (indicator: string) => {
    const updated = formData.defaultIndicators.includes(indicator)
      ? formData.defaultIndicators.filter(ind => ind !== indicator)
      : [...formData.defaultIndicators, indicator];
    setFormData({ ...formData, defaultIndicators: updated });
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
              <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Trading Preferences
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
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Portfolio Defaults */}
        <ProfileSection 
          title="Portfolio Defaults" 
          description="Set your default portfolio parameters for new backtests"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Default Portfolio Size
              </label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  value={formData.defaultPortfolioSize}
                  onChange={(e) => setFormData({ ...formData, defaultPortfolioSize: parseInt(e.target.value) || 0 })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="100000"
                  min="1000"
                  max="10000000"
                  step="1000"
                />
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Starting capital for new backtests
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Default Risk Level (%)
              </label>
              <div className="relative">
                <AlertTriangle size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="number"
                  value={formData.defaultRiskLevel}
                  onChange={(e) => setFormData({ ...formData, defaultRiskLevel: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="2.0"
                  min="0.1"
                  max="10"
                  step="0.1"
                />
              </div>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Maximum risk per trade
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Default Benchmark
            </label>
            <select
              value={formData.defaultBenchmark}
              onChange={(e) => setFormData({ ...formData, defaultBenchmark: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            >
              {benchmarkOptions.map(benchmark => (
                <option key={benchmark} value={benchmark}>{benchmark}</option>
              ))}
            </select>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Benchmark for performance comparison
            </p>
          </div>
        </ProfileSection>

        {/* Chart Preferences */}
        <ProfileSection 
          title="Chart Preferences" 
          description="Customize your default chart settings"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Default Chart Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {chartTypeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, defaultChartType: option.value as any })}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      formData.defaultChartType === option.value ? 'border-blue-500' : ''
                    }`}
                    style={{
                      backgroundColor: formData.defaultChartType === option.value ? 'var(--accent)' : 'var(--bg-primary)',
                      borderColor: formData.defaultChartType === option.value ? 'var(--accent)' : 'var(--border)',
                      color: formData.defaultChartType === option.value ? 'var(--bg-primary)' : 'var(--text-primary)'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  Show Volume
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Display volume bars below price chart
                </p>
              </div>
              <button
                onClick={() => setFormData({ ...formData, showVolume: !formData.showVolume })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.showVolume ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.showVolume ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </ProfileSection>

        {/* Timeframe Preferences */}
        <ProfileSection 
          title="Preferred Timeframes" 
          description="Select your default timeframes for analysis"
        >
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {timeframeOptions.map(timeframe => (
              <button
                key={timeframe}
                onClick={() => handleTimeframeToggle(timeframe)}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  formData.preferredTimeframes.includes(timeframe) ? 'border-blue-500' : ''
                }`}
                style={{
                  backgroundColor: formData.preferredTimeframes.includes(timeframe) ? 'var(--accent)' : 'var(--bg-primary)',
                  borderColor: formData.preferredTimeframes.includes(timeframe) ? 'var(--accent)' : 'var(--border)',
                  color: formData.preferredTimeframes.includes(timeframe) ? 'var(--bg-primary)' : 'var(--text-primary)'
                }}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </ProfileSection>

        {/* Technical Indicators */}
        <ProfileSection 
          title="Default Technical Indicators" 
          description="Choose which indicators to show by default"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {indicatorOptions.map(indicator => (
              <button
                key={indicator}
                onClick={() => handleIndicatorToggle(indicator)}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  formData.defaultIndicators.includes(indicator) ? 'border-blue-500' : ''
                }`}
                style={{
                  backgroundColor: formData.defaultIndicators.includes(indicator) ? 'var(--accent)' : 'var(--bg-primary)',
                  borderColor: formData.defaultIndicators.includes(indicator) ? 'var(--accent)' : 'var(--border)',
                  color: formData.defaultIndicators.includes(indicator) ? 'var(--bg-primary)' : 'var(--text-primary)'
                }}
              >
                {indicator.replace('_', ' ')}
              </button>
            ))}
          </div>
        </ProfileSection>

        {/* Auto-save Settings */}
        <ProfileSection 
          title="Auto-save Settings" 
          description="Configure automatic saving of your work"
        >
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Auto-save Interval (seconds)
            </label>
            <div className="relative">
              <Settings size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="number"
                value={formData.autoSaveInterval}
                onChange={(e) => setFormData({ ...formData, autoSaveInterval: parseInt(e.target.value) || 30 })}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
                placeholder="30"
                min="10"
                max="300"
                step="10"
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              How often to automatically save your work (10-300 seconds)
            </p>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default TradingPreferencesScreen;
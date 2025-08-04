import React, { useState } from 'react';
import { TrendingUp, Activity, BarChart3, AlertTriangle, Brain, Settings, ChevronDown, ChevronUp, Info } from 'lucide-react';

export interface IndicatorConfig {
  id: string;
  name: string;
  category: 'trend' | 'momentum' | 'volume' | 'volatility' | 'advanced';
  description: string;
  enabled: boolean;
  isAdvanced?: boolean;
  settings?: {
    [key: string]: number | string | boolean;
  };
  defaultSettings: {
    [key: string]: number | string | boolean;
  };
}

interface SimplifiedIndicatorSelectorProps {
  selectedIndicators: IndicatorConfig[];
  onIndicatorsUpdate: (indicators: IndicatorConfig[]) => void;
  scenario: 'new-position' | 'existing-plus-new' | 'edge-case-study';
  showAdvanced: boolean;
  onToggleAdvanced: (show: boolean) => void;
  className?: string;
}

const SimplifiedIndicatorSelector: React.FC<SimplifiedIndicatorSelectorProps> = ({
  selectedIndicators,
  onIndicatorsUpdate,
  scenario,
  showAdvanced,
  onToggleAdvanced,
  className = ''
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('trend');

  const allIndicators: IndicatorConfig[] = [
    // Trend Indicators
    {
      id: 'sma',
      name: 'Simple Moving Averages',
      category: 'trend',
      description: 'Track price trends with multiple timeframes (50, 150, 200 day)',
      enabled: true,
      settings: {
        periods: [50, 150, 200],
        showAll: true
      },
      defaultSettings: {
        periods: [50, 150, 200],
        showAll: true
      }
    },
    {
      id: 'vwap',
      name: 'VWAP (Volume Weighted Average Price)',
      category: 'trend',
      description: 'Institutional benchmark for fair value pricing',
      enabled: true,
      settings: {
        periods: ['daily', 'weekly'],
        showBands: false
      },
      defaultSettings: {
        periods: ['daily'],
        showBands: false
      }
    },
    
    // Momentum Indicators
    {
      id: 'rsi',
      name: 'RSI (Relative Strength Index)',
      category: 'momentum',
      description: 'Identify overbought/oversold conditions',
      enabled: true,
      settings: {
        period: 14,
        overbought: 70,
        oversold: 30
      },
      defaultSettings: {
        period: 14,
        overbought: 70,
        oversold: 30
      }
    },
    {
      id: 'macd',
      name: 'MACD',
      category: 'momentum',
      description: 'Trend following momentum oscillator',
      enabled: false,
      settings: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
      },
      defaultSettings: {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9
      }
    },
    
    // Volume Indicators
    {
      id: 'volume-profile',
      name: 'Volume Profile',
      category: 'volume',
      description: 'Point of Control and high volume price levels',
      enabled: true,
      settings: {
        pocLevels: 5,
        lookback: 50
      },
      defaultSettings: {
        pocLevels: 5,
        lookback: 50
      }
    },
    {
      id: 'cvd',
      name: 'CVD (Cumulative Volume Delta)',
      category: 'volume',
      description: 'Track buying vs selling pressure',
      enabled: true,
      settings: {
        threshold: 0.5
      },
      defaultSettings: {
        threshold: 0.5
      }
    },
    {
      id: 'turnover-ratio',
      name: 'Turnover Ratio',
      category: 'volume',
      description: 'Volume relative to shares outstanding',
      enabled: false,
      settings: {
        highThreshold: 5,
        lowThreshold: 0.5
      },
      defaultSettings: {
        highThreshold: 5,
        lowThreshold: 0.5
      }
    },
    {
      id: 'simple-volume',
      name: 'Simple Volume',
      category: 'volume',
      description: 'Volume with moving average comparison',
      enabled: false,
      settings: {
        maPeriod: 20,
        spikeMultiplier: 2
      },
      defaultSettings: {
        maPeriod: 20,
        spikeMultiplier: 2
      }
    },
    {
      id: 'obv',
      name: 'OBV (On-Balance Volume)',
      category: 'volume',
      description: 'Cumulative volume indicator for trend confirmation',
      enabled: false,
      isAdvanced: false,
      settings: {
        smoothing: 0
      },
      defaultSettings: {
        smoothing: 0
      }
    },
    
    // Volatility Indicators
    {
      id: 'atr',
      name: 'ATR (Average True Range)',
      category: 'volatility',
      description: 'Measure market volatility for position sizing',
      enabled: true,
      settings: {
        period: 14,
        multiplier: 2.0
      },
      defaultSettings: {
        period: 14,
        multiplier: 2.0
      }
    },
    {
      id: 'bollinger-bands',
      name: 'Bollinger Bands',
      category: 'volatility',
      description: 'Volatility bands around moving average',
      enabled: false,
      settings: {
        period: 20,
        stdDev: 2
      },
      defaultSettings: {
        period: 20,
        stdDev: 2
      }
    },
    
    // Advanced/Edge Case Indicators
    {
      id: 'relative-volume',
      name: 'Relative Volume',
      category: 'advanced',
      description: 'Volume compared to average for unusual activity detection',
      enabled: scenario === 'edge-case-study',
      isAdvanced: true,
      settings: {
        lookbackPeriod: 50,
        alertThreshold: 2.0
      },
      defaultSettings: {
        lookbackPeriod: 50,
        alertThreshold: 2.0
      }
    },
    {
      id: 'obv-breakout',
      name: 'OBV Breakout Detection',
      category: 'advanced',
      description: 'Detect significant OBV trend changes',
      enabled: scenario === 'edge-case-study',
      isAdvanced: true,
      settings: {
        lookbackPeriod: 20,
        breakoutThreshold: 0.05
      },
      defaultSettings: {
        lookbackPeriod: 20,
        breakoutThreshold: 0.05
      }
    },
    {
      id: 'weinstein-stages',
      name: 'Weinstein Stage Analysis',
      category: 'advanced',
      description: 'Four-stage market cycle analysis',
      enabled: true,
      settings: {
        maPeriod: 30,
        stageConfirmation: 5
      },
      defaultSettings: {
        maPeriod: 30,
        stageConfirmation: 5
      }
    }
  ];

  // Apply scenario-based defaults
  const getScenarioDefaults = () => {
    const defaults = [...allIndicators];
    
    switch (scenario) {
      case 'new-position':
        return defaults.map(ind => ({
          ...ind,
          enabled: ['sma', 'vwap', 'rsi', 'volume-profile', 'cvd', 'obv', 'atr', 'weinstein-stages'].includes(ind.id)
        }));
      
      case 'existing-plus-new':
        return defaults.map(ind => ({
          ...ind,
          enabled: ['sma', 'vwap', 'rsi', 'macd', 'volume-profile', 'cvd', 'obv', 'atr', 'bollinger-bands', 'weinstein-stages'].includes(ind.id)
        }));
      
      case 'edge-case-study':
        return defaults.map(ind => ({
          ...ind,
          enabled: !ind.isAdvanced ? ['sma', 'vwap', 'rsi', 'volume-profile', 'cvd', 'obv', 'atr', 'weinstein-stages'].includes(ind.id) : ind.enabled
        }));
      
      default:
        return defaults;
    }
  };

  // Initialize with scenario defaults if selectedIndicators is empty
  React.useEffect(() => {
    if (selectedIndicators.length === 0) {
      onIndicatorsUpdate(getScenarioDefaults());
    }
  }, [scenario]);

  const toggleIndicator = (id: string) => {
    const updated = selectedIndicators.map(ind => 
      ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
    );
    onIndicatorsUpdate(updated);
  };

  const updateIndicatorSetting = (id: string, settingKey: string, value: any) => {
    const updated = selectedIndicators.map(ind => 
      ind.id === id ? { 
        ...ind, 
        settings: { ...ind.settings, [settingKey]: value }
      } : ind
    );
    onIndicatorsUpdate(updated);
  };

  const categories = [
    { id: 'trend', name: 'Trend Analysis', icon: <TrendingUp size={16} />, color: '#10B981' },
    { id: 'momentum', name: 'Momentum', icon: <Activity size={16} />, color: '#3B82F6' },
    { id: 'volume', name: 'Volume', icon: <BarChart3 size={16} />, color: '#8B5CF6' },
    { id: 'volatility', name: 'Volatility', icon: <AlertTriangle size={16} />, color: '#F59E0B' },
    { id: 'advanced', name: 'Advanced/Edge Cases', icon: <Brain size={16} />, color: '#EF4444' }
  ];

  const getEnabledCount = (category: string) => {
    return selectedIndicators.filter(ind => ind.category === category && ind.enabled).length;
  };

  const getTotalCount = (category: string) => {
    const total = selectedIndicators.filter(ind => ind.category === category).length;
    const advanced = selectedIndicators.filter(ind => ind.category === category && ind.isAdvanced).length;
    return showAdvanced ? total : total - advanced;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Select Indicators
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Choose which technical indicators to include in your analysis
          </p>
        </div>
        
        <button
          onClick={() => onToggleAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 px-3 py-2 text-sm border rounded-lg transition-colors"
          style={{
            backgroundColor: showAdvanced ? 'var(--accent)' : 'var(--surface)',
            borderColor: showAdvanced ? 'var(--accent)' : 'var(--border)',
            color: showAdvanced ? 'var(--bg-primary)' : 'var(--text-primary)'
          }}
        >
          <Settings size={14} />
          <span>Advanced Settings</span>
        </button>
      </div>

      {/* Scenario Info */}
      <div 
        className="p-3 rounded-lg border-l-4"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderLeftColor: 'var(--accent)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-start space-x-2">
          <Info size={16} className="mt-0.5" style={{ color: 'var(--accent)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {scenario === 'new-position' && 'New Position Template'}
              {scenario === 'existing-plus-new' && 'Portfolio Optimization Template'}  
              {scenario === 'edge-case-study' && 'Edge Case Analysis Template'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {scenario === 'new-position' && 'Pre-selected indicators focus on entry optimization and trend analysis'}
              {scenario === 'existing-plus-new' && 'Balanced indicator set for analyzing existing positions and new opportunities'}
              {scenario === 'edge-case-study' && 'Advanced indicators added for detecting unusual market conditions and edge cases'}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryIndicators = selectedIndicators.filter(ind => 
            ind.category === category.id && (!ind.isAdvanced || showAdvanced)
          );
          
          if (categoryIndicators.length === 0) return null;
          
          const isExpanded = expandedCategory === category.id;
          const enabledCount = getEnabledCount(category.id);
          const totalCount = getTotalCount(category.id);
          
          return (
            <div
              key={category.id}
              className="border rounded-lg"
              style={{ borderColor: 'var(--border)' }}
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors rounded-t-lg"
                style={{ backgroundColor: 'var(--surface)' }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {category.name}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {enabledCount} of {totalCount} selected
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: enabledCount > 0 ? `${category.color}20` : 'var(--bg-primary)',
                      color: enabledCount > 0 ? category.color : 'var(--text-secondary)'
                    }}
                  >
                    {enabledCount}/{totalCount}
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="space-y-3">
                    {categoryIndicators.map((indicator) => (
                      <div
                        key={indicator.id}
                        className="p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                        onClick={() => toggleIndicator(indicator.id)}
                        style={{ 
                          backgroundColor: indicator.enabled ? `${category.color}08` : 'var(--bg-primary)', 
                          borderColor: indicator.enabled ? category.color : 'var(--border)',
                          borderWidth: indicator.enabled ? '2px' : '1px'
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={indicator.enabled}
                                  onChange={() => {}} // Controlled by parent click
                                  onClick={(e) => e.stopPropagation()} // Prevent double toggle
                                  className="rounded pointer-events-none"
                                  style={{ accentColor: category.color }}
                                />
                                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                  {indicator.name}
                                </span>
                              </div>
                              {indicator.isAdvanced && (
                                <span 
                                  className="px-1.5 py-0.5 text-xs rounded"
                                  style={{ backgroundColor: '#EF444420', color: '#EF4444' }}
                                >
                                  ADVANCED
                                </span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {indicator.description}
                            </p>
                          </div>
                        </div>

                        {/* Advanced Settings */}
                        {indicator.enabled && showAdvanced && indicator.settings && (
                          <div 
                            className="mt-3 pt-3 border-t" 
                            style={{ borderColor: 'var(--border)' }}
                            onClick={(e) => e.stopPropagation()} // Prevent card toggle when interacting with settings
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {Object.entries(indicator.settings).map(([key, value]) => (
                                <div key={key}>
                                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                  </label>
                                  {typeof value === 'boolean' ? (
                                    <div className="mt-1">
                                      <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => updateIndicatorSetting(indicator.id, key, e.target.checked)}
                                        className="rounded"
                                        style={{ accentColor: category.color }}
                                      />
                                    </div>
                                  ) : typeof value === 'number' ? (
                                    <input
                                      type="number"
                                      value={value}
                                      onChange={(e) => updateIndicatorSetting(indicator.id, key, Number(e.target.value))}
                                      className="w-full mt-1 px-2 py-1 text-sm border rounded"
                                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                      step={key.includes('multiplier') || key.includes('threshold') ? '0.1' : '1'}
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={String(value)}
                                      onChange={(e) => updateIndicatorSetting(indicator.id, key, e.target.value)}
                                      className="w-full mt-1 px-2 py-1 text-sm border rounded"
                                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Selected Indicators Summary
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {selectedIndicators.filter(ind => ind.enabled).length} indicators selected across {categories.filter(cat => getEnabledCount(cat.id) > 0).length} categories
            </p>
          </div>
          
          <div className="flex space-x-2">
            {categories.map((category) => {
              const count = getEnabledCount(category.id);
              if (count === 0) return null;
              
              return (
                <div
                  key={category.id}
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.name}: {count}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedIndicatorSelector;
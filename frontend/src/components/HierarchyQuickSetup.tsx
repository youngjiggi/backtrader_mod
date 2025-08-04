import React, { useState } from 'react';
import { Zap, Target, ArrowUp, ArrowDown, Settings, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';

export interface SignalRule {
  id: string;
  name: string;
  type: 'entry' | 'exit' | 'filter';
  priority: number;
  enabled: boolean;
  conditions: {
    indicator: string;
    operator: string;
    value: number | string;
    timeframe?: string;
  }[];
  actions: {
    type: 'buy' | 'sell' | 'trim' | 'stop' | 'alert';
    amount?: number;
    description: string;
  }[];
}

export interface HierarchyConfig {
  primarySignal: string;
  secondarySignal: string;
  filterSignal: string;
  rules: SignalRule[];
  conflictResolution: 'primary-wins' | 'majority-wins' | 'most-recent';
}

interface HierarchyQuickSetupProps {
  config: HierarchyConfig;
  onConfigUpdate: (config: HierarchyConfig) => void;
  availableIndicators: string[];
  scenario: 'new-position' | 'existing-plus-new' | 'edge-case-study';
  className?: string;
}

const HierarchyQuickSetup: React.FC<HierarchyQuickSetupProps> = ({
  config,
  onConfigUpdate,
  availableIndicators,
  scenario,
  className = ''
}) => {
  const [expandedSection, setExpandedSection] = useState<string>('hierarchy');
  const [showAdvancedRules, setShowAdvancedRules] = useState(false);

  const indicatorOptions = [
    { id: 'weinstein-stages', name: 'Weinstein Stage' },
    { id: 'sma', name: 'Moving Averages' },
    { id: 'rsi', name: 'RSI' },
    { id: 'vwap', name: 'VWAP' },
    { id: 'volume-profile', name: 'Volume Profile' },
    { id: 'cvd', name: 'CVD' },
    { id: 'obv', name: 'OBV' },
    { id: 'atr', name: 'ATR' },
    { id: 'macd', name: 'MACD' },
    { id: 'bollinger-bands', name: 'Bollinger Bands' },
    { id: 'relative-volume', name: 'Relative Volume' }
  ].filter(opt => availableIndicators.includes(opt.id));

  const getScenarioDefaults = (): HierarchyConfig => {
    const baseRules: SignalRule[] = [
      {
        id: 'gap-down-rule',
        name: 'Gap Down Protection',
        type: 'filter',
        priority: 1,
        enabled: true,
        conditions: [
          {
            indicator: 'price',
            operator: 'gap_down',
            value: 2, // 2% gap down
            timeframe: 'daily'
          }
        ],
        actions: [
          {
            type: 'trim',
            amount: 25,
            description: 'Trim 25% of position on 2%+ gap down'
          }
        ]
      },
      {
        id: 'ma-sell-rule',
        name: 'Moving Average Exit',
        type: 'exit',
        priority: 2,
        enabled: true,
        conditions: [
          {
            indicator: 'sma',
            operator: 'below_by_percent',
            value: 3, // 3% below SMA
            timeframe: 'daily'
          }
        ],
        actions: [
          {
            type: 'sell',
            amount: 100,
            description: 'Full exit if price drops 3% below 50 SMA'
          }
        ]
      },
      {
        id: 'stop-loss-rule',
        name: 'Hard Stop Loss',
        type: 'exit',
        priority: 1,
        enabled: true,
        conditions: [
          {
            indicator: 'price',
            operator: 'below_entry_by_percent',
            value: 8, // 8% loss from entry
            timeframe: 'daily'
          }
        ],
        actions: [
          {
            type: 'stop',
            amount: 100,
            description: 'Emergency exit at 8% loss'
          }
        ]
      },
      {
        id: 'take-profit-rule',
        name: 'Profit Taking',
        type: 'exit',
        priority: 3,
        enabled: false,
        conditions: [
          {
            indicator: 'price',
            operator: 'above_entry_by_percent',
            value: 25, // 25% gain from entry
            timeframe: 'daily'
          }
        ],
        actions: [
          {
            type: 'trim',
            amount: 50,
            description: 'Take 50% profit at 25% gain'
          }
        ]
      }
    ];

    switch (scenario) {
      case 'new-position':
        return {
          primarySignal: 'weinstein-stages',
          secondarySignal: 'rsi',
          filterSignal: 'volume-profile',
          rules: [
            ...baseRules,
            {
              id: 'entry-timing-rule',
              name: 'RSI Entry Timing',
              type: 'entry',
              priority: 2,
              enabled: true,
              conditions: [
                {
                  indicator: 'rsi',
                  operator: 'between',
                  value: 45, // RSI between 45-55
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'buy',
                  amount: 100,
                  description: 'Enter position when RSI is neutral (45-55)'
                }
              ]
            },
            {
              id: 'volume-confirmation-rule',
              name: 'Volume Confirmation',
              type: 'filter',
              priority: 4,
              enabled: true,
              conditions: [
                {
                  indicator: 'volume-profile',
                  operator: 'above_average',
                  value: 1.2, // 20% above average volume
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'alert',
                  description: 'Require above-average volume for entries'
                }
              ]
            }
          ],
          conflictResolution: 'primary-wins'
        };
      
      case 'existing-plus-new':
        return {
          primarySignal: 'sma',
          secondarySignal: 'vwap',  
          filterSignal: 'cvd',
          rules: [
            ...baseRules,
            {
              id: 'portfolio-rebalance',
              name: 'Portfolio Rebalancing',
              type: 'filter',
              priority: 3,
              enabled: true,
              conditions: [
                {
                  indicator: 'position_size',
                  operator: 'exceeds_allocation',
                  value: 10, // 10% over target allocation
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'trim',
                  amount: 50,
                  description: 'Rebalance when position exceeds 10% of target allocation'
                }
              ]
            },
            {
              id: 'correlation-check',
              name: 'Position Correlation Check',
              type: 'filter',
              priority: 5,
              enabled: true,
              conditions: [
                {
                  indicator: 'correlation',
                  operator: 'exceeds',
                  value: 0.7, // 70% correlation threshold
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'alert',
                  description: 'Alert if new position has high correlation with existing'
                }
              ]
            },
            {
              id: 'vwap-entry-rule',
              name: 'VWAP Entry Filter',
              type: 'entry',
              priority: 1,
              enabled: true,
              conditions: [
                {
                  indicator: 'vwap',
                  operator: 'above',
                  value: 0, // Above VWAP
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'buy',
                  amount: 100,
                  description: 'Only enter new positions above VWAP'
                }
              ]
            }
          ],
          conflictResolution: 'majority-wins'
        };
      
      case 'edge-case-study':
        return {
          primarySignal: 'relative-volume',
          secondarySignal: 'obv',
          filterSignal: 'atr',
          rules: [
            ...baseRules,
            {
              id: 'volume-spike-rule',
              name: 'Volume Spike Response',
              type: 'entry',
              priority: 1,
              enabled: true,
              conditions: [
                {
                  indicator: 'relative-volume',
                  operator: 'exceeds',
                  value: 3, // 3x average volume
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'alert',
                  description: 'Alert on 3x volume spike for edge case analysis'
                }
              ]
            },
            {
              id: 'obv-breakout-rule',
              name: 'OBV Breakout Detection',
              type: 'entry',
              priority: 2,
              enabled: true,
              conditions: [
                {
                  indicator: 'obv',
                  operator: 'breakout',
                  value: 5, // 5% breakout threshold
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'buy',
                  amount: 25,
                  description: 'Small position on OBV breakout confirmation'
                }
              ]
            },
            {
              id: 'volatility-filter',
              name: 'High Volatility Filter',
              type: 'filter',
              priority: 1,
              enabled: true,
              conditions: [
                {
                  indicator: 'atr',
                  operator: 'exceeds_percentile',
                  value: 80, // 80th percentile of ATR
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'trim',
                  amount: 30,
                  description: 'Reduce position size in high volatility'
                }
              ]
            },
            {
              id: 'momentum-divergence',
              name: 'Momentum Divergence Detection',
              type: 'exit',
              priority: 4,
              enabled: true,
              conditions: [
                {
                  indicator: 'obv',
                  operator: 'divergence_negative',
                  value: 5, // 5-day divergence period
                  timeframe: 'daily'
                }
              ],
              actions: [
                {
                  type: 'alert',
                  description: 'Alert on negative momentum divergence'
                }
              ]
            }
          ],
          conflictResolution: 'most-recent'
        };
      
      default:
        return {
          primarySignal: 'weinstein-stages',
          secondarySignal: 'rsi',
          filterSignal: 'atr',
          rules: baseRules,
          conflictResolution: 'primary-wins'
        };
    }
  };

  // Initialize with scenario defaults if config is empty
  React.useEffect(() => {
    if (!config.primarySignal) {
      onConfigUpdate(getScenarioDefaults());
    }
  }, [scenario]);

  const updateHierarchy = (field: keyof HierarchyConfig, value: string) => {
    onConfigUpdate({
      ...config,
      [field]: value
    });
  };

  const toggleRule = (ruleId: string) => {
    const updatedRules = config.rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    );
    onConfigUpdate({
      ...config,
      rules: updatedRules
    });
  };

  const updateRuleValue = (ruleId: string, conditionIndex: number, value: number) => {
    const updatedRules = config.rules.map(rule => {
      if (rule.id === ruleId) {
        const updatedConditions = rule.conditions.map((condition, index) => 
          index === conditionIndex ? { ...condition, value } : condition
        );
        return { ...rule, conditions: updatedConditions };
      }
      return rule;
    });
    onConfigUpdate({
      ...config,
      rules: updatedRules
    });
  };

  const getIndicatorName = (id: string) => {
    return indicatorOptions.find(opt => opt.id === id)?.name || id;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Signal Hierarchy & Rules
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Configure how indicators work together and set up conditional rules
        </p>
      </div>

      {/* Scenario Context */}
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
              {scenario === 'new-position' && 'Entry-Focused Rules'}
              {scenario === 'existing-plus-new' && 'Portfolio Management Rules'}  
              {scenario === 'edge-case-study' && 'Edge Case Detection Rules'}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {scenario === 'new-position' && 'Rules optimized for new position entries with risk management'}
              {scenario === 'existing-plus-new' && 'Balanced rules for managing existing positions and new opportunities'}
              {scenario === 'edge-case-study' && 'Advanced rules for detecting and responding to unusual market conditions'}
            </p>
          </div>
        </div>
      </div>

      {/* Signal Hierarchy */}
      <div 
        className="border rounded-lg"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => setExpandedSection(expandedSection === 'hierarchy' ? '' : 'hierarchy')}
          className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}
            >
              <Zap size={16} />
            </div>
            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Signal Priority Hierarchy
            </h4>
          </div>
          {expandedSection === 'hierarchy' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSection === 'hierarchy' && (
          <div className="p-4 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Primary Signal
                </label>
                <select
                  value={config.primarySignal}
                  onChange={(e) => updateHierarchy('primarySignal', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  {indicatorOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Highest priority for trade decisions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Secondary Signal
                </label>
                <select
                  value={config.secondarySignal}
                  onChange={(e) => updateHierarchy('secondarySignal', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  {indicatorOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Confirmation signal for entries
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Filter Signal
                </label>
                <select
                  value={config.filterSignal}
                  onChange={(e) => updateHierarchy('filterSignal', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  {indicatorOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Additional filter to reduce false signals
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Conflict Resolution
              </label>
              <select
                value={config.conflictResolution}
                onChange={(e) => updateHierarchy('conflictResolution', e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="primary-wins">Primary Signal Wins</option>
                <option value="majority-wins">Majority Wins</option>
                <option value="most-recent">Most Recent Signal</option>
              </select>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                How to handle conflicting signals between indicators
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Conditional Rules */}
      <div 
        className="border rounded-lg"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => setExpandedSection(expandedSection === 'rules' ? '' : 'rules')}
          className="w-full p-4 flex items-center justify-between hover:bg-opacity-50 transition-colors"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
            >
              <Target size={16} />
            </div>
            <div className="text-left">
              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Conditional Rules
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {config.rules.filter(r => r.enabled).length} of {config.rules.length} rules active
              </p>
            </div>
          </div>
          {expandedSection === 'rules' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {expandedSection === 'rules' && (
          <div className="p-4 border-t space-y-4" style={{ borderColor: 'var(--border)' }}>
            {config.rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 border rounded-lg"
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  borderColor: rule.enabled ? 'var(--accent)' : 'var(--border)',
                  borderWidth: rule.enabled ? '2px' : '1px'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      className="rounded"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div>
                      <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {rule.name}
                      </h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <span 
                          className="px-2 py-0.5 text-xs rounded"
                          style={{ 
                            backgroundColor: rule.type === 'entry' ? '#10B98120' : rule.type === 'exit' ? '#EF444420' : '#3B82F620',
                            color: rule.type === 'entry' ? '#10B981' : rule.type === 'exit' ? '#EF4444' : '#3B82F6'
                          }}
                        >
                          {rule.type.toUpperCase()}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Priority: {rule.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {rule.enabled && (
                  <div className="space-y-3">
                    {/* Conditions */}
                    <div>
                      <h6 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Conditions:
                      </h6>
                      {rule.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {getIndicatorName(condition.indicator)} {condition.operator.replace(/_/g, ' ')}
                          </span>
                          {typeof condition.value === 'number' && (
                            <input
                              type="number"
                              value={condition.value}
                              onChange={(e) => updateRuleValue(rule.id, index, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-xs border rounded"
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                              step={condition.indicator.includes('percent') ? '0.1' : '1'}
                            />
                          )}
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {condition.indicator.includes('percent') ? '%' : ''}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div>
                      <h6 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                        Actions:
                      </h6>
                      {rule.actions.map((action, index) => (
                        <div key={index} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          • {action.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          Configuration Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Signal Hierarchy:</span>
            <div className="mt-1 space-y-1">
              <div className="flex items-center space-x-2">
                <ArrowUp size={12} className="text-green-500" />
                <span style={{ color: 'var(--text-primary)' }}>
                  Primary: {getIndicatorName(config.primarySignal)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowDown size={12} className="text-blue-500" />
                <span style={{ color: 'var(--text-primary)' }}>
                  Secondary: {getIndicatorName(config.secondarySignal)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings size={12} className="text-gray-500" />
                <span style={{ color: 'var(--text-primary)' }}>
                  Filter: {getIndicatorName(config.filterSignal)}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Active Rules:</span>
            <div className="mt-1">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="font-medium text-green-600">
                    {config.rules.filter(r => r.enabled && r.type === 'entry').length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Entry</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-red-600">
                    {config.rules.filter(r => r.enabled && r.type === 'exit').length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Exit</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-600">
                    {config.rules.filter(r => r.enabled && r.type === 'filter').length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Filter</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HierarchyQuickSetup;
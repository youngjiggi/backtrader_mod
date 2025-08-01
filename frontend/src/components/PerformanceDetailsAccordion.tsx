import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Settings, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface PerformanceDetailsAccordionProps {
  baseStrategy: RecentRun | null;
  comparisonStrategies: RecentRun[];
}

interface SettingComparison {
  setting: string;
  label: string;
  unit: string;
  baseValue: number | string;
  values: { strategyId: string; strategyName: string; value: number | string; isDifferent: boolean }[];
}

const PerformanceDetailsAccordion: React.FC<PerformanceDetailsAccordionProps> = ({
  baseStrategy,
  comparisonStrategies
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortField, setSortField] = useState<string>('setting');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const allStrategies = [...(baseStrategy ? [baseStrategy] : []), ...comparisonStrategies];
  
  if (allStrategies.length <= 1) {
    return null;
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Create comparison data
  const settingsComparison: SettingComparison[] = [
    {
      setting: 'atrPeriod',
      label: 'ATR Period',
      unit: 'periods',
      baseValue: baseStrategy?.strategySettings?.atrPeriod || 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.atrPeriod || 'N/A',
        isDifferent: strategy.strategySettings?.atrPeriod !== baseStrategy?.strategySettings?.atrPeriod
      }))
    },
    {
      setting: 'atrMultiplier',
      label: 'ATR Multiplier',
      unit: 'x',
      baseValue: baseStrategy?.strategySettings?.atrMultiplier || 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.atrMultiplier || 'N/A',
        isDifferent: strategy.strategySettings?.atrMultiplier !== baseStrategy?.strategySettings?.atrMultiplier
      }))
    },
    {
      setting: 'cvdThreshold',
      label: 'CVD Threshold',
      unit: '',
      baseValue: baseStrategy?.strategySettings?.cvdThreshold || 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.cvdThreshold || 'N/A',
        isDifferent: strategy.strategySettings?.cvdThreshold !== baseStrategy?.strategySettings?.cvdThreshold
      }))
    },
    {
      setting: 'rsiPeriod',
      label: 'RSI Period',
      unit: 'periods',
      baseValue: baseStrategy?.strategySettings?.rsiPeriod || 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.rsiPeriod || 'N/A',
        isDifferent: strategy.strategySettings?.rsiPeriod !== baseStrategy?.strategySettings?.rsiPeriod
      }))
    },
    {
      setting: 'stopLoss',
      label: 'Stop Loss',
      unit: '%',
      baseValue: baseStrategy?.strategySettings?.stopLoss ? (baseStrategy.strategySettings.stopLoss * 100).toFixed(1) : 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.stopLoss ? (strategy.strategySettings.stopLoss * 100).toFixed(1) : 'N/A',
        isDifferent: strategy.strategySettings?.stopLoss !== baseStrategy?.strategySettings?.stopLoss
      }))
    },
    {
      setting: 'takeProfit',
      label: 'Take Profit',
      unit: '%',
      baseValue: baseStrategy?.strategySettings?.takeProfit ? (baseStrategy.strategySettings.takeProfit * 100).toFixed(1) : 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.takeProfit ? (strategy.strategySettings.takeProfit * 100).toFixed(1) : 'N/A',
        isDifferent: strategy.strategySettings?.takeProfit !== baseStrategy?.strategySettings?.takeProfit
      }))
    },
    {
      setting: 'positionSize',
      label: 'Position Size',
      unit: '%',
      baseValue: baseStrategy?.strategySettings?.positionSize ? (baseStrategy.strategySettings.positionSize * 100).toFixed(0) : 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.positionSize ? (strategy.strategySettings.positionSize * 100).toFixed(0) : 'N/A',
        isDifferent: strategy.strategySettings?.positionSize !== baseStrategy?.strategySettings?.positionSize
      }))
    },
    {
      setting: 'maxPositions',
      label: 'Max Positions',
      unit: 'positions',
      baseValue: baseStrategy?.strategySettings?.maxPositions || 'N/A',
      values: allStrategies.map(strategy => ({
        strategyId: strategy.id,
        strategyName: `${strategy.name} ${strategy.version}`,
        value: strategy.strategySettings?.maxPositions || 'N/A',
        isDifferent: strategy.strategySettings?.maxPositions !== baseStrategy?.strategySettings?.maxPositions
      }))
    }
  ];

  // Sort the data
  const sortedSettings = [...settingsComparison].sort((a, b) => {
    if (sortField === 'setting') {
      const comparison = a.label.localeCompare(b.label);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    // Could add more sort fields here
    return 0;
  });

  const getDifferenceCount = () => {
    return settingsComparison.filter(setting => 
      setting.values.some(value => value.isDifferent)
    ).length;
  };

  return (
    <div className="mb-8">
      <div
        className="border rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        {/* Header */}
        <div className="px-6 py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center space-x-3">
              <Settings size={18} style={{ color: 'var(--highlight)' }} />
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Performance Details
              </h3>
              <span className="text-xs px-2 py-1 rounded" style={{ 
                backgroundColor: 'var(--highlight)', 
                color: 'var(--bg-primary)' 
              }}>
                Strategy Settings Comparison
              </span>
              {getDifferenceCount() > 0 && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle size={14} className="text-yellow-500" />
                  <span className="text-xs text-yellow-500">
                    {getDifferenceCount()} differences
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {allStrategies.length} strategies
              </span>
              {isExpanded ? (
                <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
          </button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="p-6">
              {/* Settings Comparison Table */}
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                        <th className="px-4 py-3 text-left">
                          <button
                            onClick={() => handleSort('setting')}
                            className="flex items-center space-x-1 text-sm font-medium hover:opacity-80"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            <span>Setting</span>
                            <ArrowUpDown size={12} />
                          </button>
                        </th>
                        {allStrategies.map((strategy, index) => (
                          <th key={strategy.id} className="px-4 py-3 text-center">
                            <div className="flex flex-col items-center space-y-1">
                              <div 
                                className="w-3 h-0.5 rounded"
                                style={{ 
                                  backgroundColor: strategy.id === baseStrategy?.id ? '#eab308' : '#3b82f6'
                                }}
                              />
                              <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                {strategy.name}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {strategy.version}
                              </span>
                              {strategy.id === baseStrategy?.id && (
                                <span className="text-xs px-1 py-0.5 rounded" style={{ 
                                  backgroundColor: '#eab308', 
                                  color: 'white' 
                                }}>
                                  BASE
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSettings.map((setting, index) => (
                        <tr
                          key={setting.setting}
                          className={index % 2 === 0 ? '' : 'bg-opacity-50'}
                          style={{
                            backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-primary)'
                          }}
                        >
                          <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                            <div>
                              <span>{setting.label}</span>
                              {setting.unit && (
                                <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
                                  ({setting.unit})
                                </span>
                              )}
                            </div>
                          </td>
                          {setting.values.map((value) => (
                            <td key={value.strategyId} className="px-4 py-3 text-center">
                              <div className={`inline-flex items-center space-x-1 ${
                                value.isDifferent ? 'px-2 py-1 rounded' : ''
                              }`} style={{
                                backgroundColor: value.isDifferent ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                borderColor: value.isDifferent ? '#f59e0b' : 'transparent',
                                borderWidth: value.isDifferent ? '1px' : '0'
                              }}>
                                <span className="text-sm font-medium" style={{ 
                                  color: value.isDifferent ? '#f59e0b' : 'var(--text-primary)' 
                                }}>
                                  {value.value}
                                </span>
                                {value.isDifferent && (
                                  <AlertTriangle size={12} className="text-yellow-500" />
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 rounded-lg border" style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)'
              }}>
                <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>
                  Settings Analysis
                </h4>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Comparing {allStrategies.length} strategies with {getDifferenceCount()} different parameter settings. 
                  Highlighted values show deviations from the base strategy configuration. 
                  These differences may explain performance variations between strategies.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDetailsAccordion;
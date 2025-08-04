import React, { useMemo, useState } from 'react';
import { Play, Clock, DollarSign, Target, TrendingUp, BarChart3, AlertTriangle, Settings, Zap, Info, CheckCircle, AlertCircle, Edit2, Save, Upload, Download } from 'lucide-react';
import { BacktestScenario } from './TemplateSelector';
import { PortfolioPosition } from './ExistingPortfolioImporter';
import { IndicatorConfig } from './SimplifiedIndicatorSelector';
import { HierarchyConfig } from './HierarchyQuickSetup';

interface ReviewData {
  scenario: BacktestScenario;
  symbols: string[];
  timeframes: string[];
  existingPortfolio: PortfolioPosition[];
  indicators: IndicatorConfig[];
  hierarchy: HierarchyConfig;
  executionSettings: {
    initialCapital: number;
    commission: number;
    slippage: number;
  };
  runName: string;
  notes?: string;
}

interface EnhancedReviewScreenProps {
  data: ReviewData;
  onDataUpdate: (updates: Partial<ReviewData>) => void;
  isExecuting: boolean;
  executionProgress?: number;
  className?: string;
}

const EnhancedReviewScreen: React.FC<EnhancedReviewScreenProps> = ({
  data,
  onDataUpdate,
  isExecuting,
  executionProgress = 0,
  className = ''
}) => {
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [editableExecutionSettings, setEditableExecutionSettings] = useState(data.executionSettings);

  // Save portfolio allocation settings
  const savePortfolioSettings = () => {
    const settings = {
      executionSettings: editableExecutionSettings,
      timestamp: new Date().toISOString(),
      scenarioId: data.scenario.id
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-settings-${data.scenario.id}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Load portfolio allocation settings
  const loadPortfolioSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          if (settings.executionSettings) {
            setEditableExecutionSettings(settings.executionSettings);
            onDataUpdate({ executionSettings: settings.executionSettings });
          }
        } catch (error) {
          alert('Error loading portfolio settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Save changes to execution settings
  const handleSavePortfolioChanges = () => {
    onDataUpdate({ executionSettings: editableExecutionSettings });
    setIsEditingPortfolio(false);
  };

  // Cancel editing
  const handleCancelPortfolioEdit = () => {
    setEditableExecutionSettings(data.executionSettings);
    setIsEditingPortfolio(false);
  };
  // Calculate estimated execution time and resource usage
  const executionEstimate = useMemo(() => {
    const baseTime = 30; // 30 seconds base
    const symbolMultiplier = data.symbols.length * 15; // 15 sec per symbol
    const timeframeMultiplier = data.timeframes.length * 10; // 10 sec per timeframe
    const indicatorMultiplier = data.indicators.filter(i => i.enabled).length * 5; // 5 sec per indicator
    const portfolioMultiplier = data.existingPortfolio.length * 8; // 8 sec per existing position
    
    const totalSeconds = baseTime + symbolMultiplier + timeframeMultiplier + indicatorMultiplier + portfolioMultiplier;
    
    return {
      estimatedTime: Math.ceil(totalSeconds / 60), // minutes
      complexity: totalSeconds > 300 ? 'High' : totalSeconds > 120 ? 'Medium' : 'Low',
      resourceUsage: Math.min(100, Math.ceil((totalSeconds / 600) * 100)) // percentage
    };
  }, [data]);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    const existingValue = data.existingPortfolio.reduce((sum, pos) => sum + (pos.marketValue || 0), 0);
    const newSymbolsValue = Math.max(0, data.executionSettings.initialCapital - existingValue);
    const totalValue = existingValue + newSymbolsValue;
    
    return {
      existingValue,
      newSymbolsValue,
      totalValue,
      existingCount: data.existingPortfolio.length,
      newCount: data.symbols.filter(s => !data.existingPortfolio.some(p => p.symbol === s)).length
    };
  }, [data.existingPortfolio, data.symbols, data.executionSettings.initialCapital]);

  // Risk warnings based on configuration
  const riskWarnings = useMemo(() => {
    const warnings: Array<{type: 'warning' | 'info' | 'error', message: string}> = [];
    
    if (data.symbols.length > 20) {
      warnings.push({
        type: 'warning',
        message: `Large number of symbols (${data.symbols.length}) may increase execution time and complexity`
      });
    }
    
    if (data.timeframes.length > 4) {
      warnings.push({
        type: 'warning',
        message: `Multiple timeframes (${data.timeframes.length}) will significantly increase computation time`
      });
    }
    
    if (portfolioMetrics.existingValue > data.executionSettings.initialCapital * 0.8) {
      warnings.push({
        type: 'info',
        message: 'Existing portfolio represents majority of capital - limited room for new positions'
      });
    }
    
    if (data.indicators.filter(i => i.enabled).length < 3) {
      warnings.push({
        type: 'warning',
        message: 'Few indicators selected - consider adding more for robust analysis'
      });
    }
    
    if (data.scenario.id === 'edge-case-study' && !data.indicators.some(i => i.isAdvanced && i.enabled)) {
      warnings.push({
        type: 'warning',
        message: 'Edge case scenario with no advanced indicators - may miss unusual patterns'
      });
    }
    
    return warnings;
  }, [data, portfolioMetrics]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Review & Execute
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Review your configuration and run the backtest
        </p>
      </div>

      {/* Execution Summary */}
      <div 
        className="p-6 rounded-xl border"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Execution Summary
          </h3>
          <div className="flex items-center space-x-2">
            <Clock size={16} style={{ color: 'var(--highlight)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ~{executionEstimate.estimatedTime} minutes
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {data.symbols.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Symbols</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {data.indicators.filter(i => i.enabled).length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Indicators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {data.hierarchy.rules.filter(r => r.enabled).length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Rules</div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: getComplexityColor(executionEstimate.complexity) }}
            >
              {executionEstimate.complexity}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Complexity</div>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} style={{ color: 'var(--highlight)' }} />
            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Portfolio Allocation
            </h4>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Save/Load Buttons */}
            <input
              type="file"
              accept=".json"
              onChange={loadPortfolioSettings}
              className="hidden"
              id="load-portfolio-settings"
            />
            <label
              htmlFor="load-portfolio-settings"
              className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: `1px solid var(--border)` }}
            >
              <Upload size={12} />
              <span>Load</span>
            </label>
            
            <button
              onClick={savePortfolioSettings}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors hover:bg-opacity-80"
              style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: `1px solid var(--border)` }}
            >
              <Download size={12} />
              <span>Save</span>
            </button>
            
            {!isEditingPortfolio ? (
              <button
                onClick={() => setIsEditingPortfolio(true)}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                <Edit2 size={12} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-1">
                <button
                  onClick={handleSavePortfolioChanges}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                >
                  <Save size={12} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelPortfolioEdit}
                  className="px-3 py-1.5 text-xs rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: `1px solid var(--border)` }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            {isEditingPortfolio ? (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span style={{ color: 'var(--text-secondary)' }}>Initial Capital:</span>
                  <input
                    type="number"
                    value={editableExecutionSettings.initialCapital}
                    onChange={(e) => setEditableExecutionSettings({
                      ...editableExecutionSettings,
                      initialCapital: Number(e.target.value)
                    })}
                    className="w-24 px-2 py-1 text-xs border rounded text-right"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    min="1000"
                    step="1000"
                  />
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span style={{ color: 'var(--text-secondary)' }}>Commission per Trade:</span>
                  <input
                    type="number"
                    value={editableExecutionSettings.commission}
                    onChange={(e) => setEditableExecutionSettings({
                      ...editableExecutionSettings,
                      commission: Number(e.target.value)
                    })}
                    className="w-20 px-2 py-1 text-xs border rounded text-right"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Slippage (%):</span>
                  <input
                    type="number"
                    value={editableExecutionSettings.slippage}
                    onChange={(e) => setEditableExecutionSettings({
                      ...editableExecutionSettings,
                      slippage: Number(e.target.value)
                    })}
                    className="w-16 px-2 py-1 text-xs border rounded text-right"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    min="0"
                    max="5"
                    step="0.01"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>Initial Capital:</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(data.executionSettings.initialCapital)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>Commission per Trade:</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    ${data.executionSettings.commission.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Slippage:</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {data.executionSettings.slippage}%
                  </span>
                </div>
              </>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>Existing Positions:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {portfolioMetrics.existingCount} ({formatCurrency(portfolioMetrics.existingValue)})
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>New Symbols:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {portfolioMetrics.newCount} ({formatCurrency(portfolioMetrics.newSymbolsValue)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--text-secondary)' }}>Total Portfolio:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(portfolioMetrics.totalValue)}
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>Timeframes:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {data.timeframes.join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>Resource Usage:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {executionEstimate.resourceUsage}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--text-secondary)' }}>Est. Completion:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {executionEstimate.estimatedTime}min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario & Symbols */}
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <Target size={16} style={{ color: 'var(--highlight)' }} />
            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {data.scenario.title}
            </h4>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Focus:</span>
              <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                {data.scenario.defaultSettings.focusArea.replace(/-/g, ' ')}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Symbols ({data.symbols.length}):</span>
              <div className="mt-1 max-h-20 overflow-y-auto">
                <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                  {data.symbols.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 size={16} style={{ color: 'var(--highlight)' }} />
            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Active Indicators
            </h4>
          </div>
          
          <div className="space-y-1 text-sm max-h-24 overflow-y-auto">
            {data.indicators.filter(i => i.enabled).map((indicator) => (
              <div key={indicator.id} className="flex items-center justify-between">
                <span style={{ color: 'var(--text-primary)' }}>{indicator.name}</span>
                <span 
                  className="px-1.5 py-0.5 text-xs rounded"
                  style={{ 
                    backgroundColor: indicator.category === 'trend' ? '#10B98120' : 
                                   indicator.category === 'momentum' ? '#3B82F620' :
                                   indicator.category === 'volume' ? '#8B5CF620' :
                                   indicator.category === 'volatility' ? '#F59E0B20' : '#EF444420',
                    color: indicator.category === 'trend' ? '#10B981' : 
                          indicator.category === 'momentum' ? '#3B82F6' :
                          indicator.category === 'volume' ? '#8B5CF6' :
                          indicator.category === 'volatility' ? '#F59E0B' : '#EF4444'
                  }}
                >
                  {indicator.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signal Hierarchy */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Zap size={16} style={{ color: 'var(--highlight)' }} />
          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Signal Hierarchy & Rules
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Primary Signal:</span>
                <span style={{ color: 'var(--text-primary)' }}>{data.hierarchy.primarySignal}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Secondary Signal:</span>
                <span style={{ color: 'var(--text-primary)' }}>{data.hierarchy.secondarySignal}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Filter Signal:</span>
                <span style={{ color: 'var(--text-primary)' }}>{data.hierarchy.filterSignal}</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--text-secondary)' }}>Active Rules:</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {data.hierarchy.rules.filter(r => r.enabled).length} of {data.hierarchy.rules.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--text-secondary)' }}>Conflict Resolution:</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {data.hierarchy.conflictResolution.replace(/-/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Warnings */}
      {riskWarnings.length > 0 && (
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
            <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Considerations & Warnings
            </h4>
          </div>
          
          <div className="space-y-2">
            {riskWarnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-2">
                {warning.type === 'error' ? (
                  <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                ) : warning.type === 'warning' ? (
                  <AlertTriangle size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {warning.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run Configuration */}
      <div 
        className="p-4 rounded-lg border"
        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Settings size={16} style={{ color: 'var(--highlight)' }} />
          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Run Configuration
          </h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              Run Name:
            </label>
            <input
              type="text"
              value={data.runName}
              onChange={(e) => onDataUpdate({ runName: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-lg"
              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              placeholder="Enter a name for this backtest run"
            />
          </div>
          
          {data.notes !== undefined && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                Notes (Optional):
              </label>
              <textarea
                value={data.notes}
                onChange={(e) => onDataUpdate({ notes: e.target.value })}
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                rows={2}
                placeholder="Add any notes about this configuration..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Execution Progress */}
      {isExecuting && (
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="animate-spin">
              <Settings size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                Running Backtest...
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Progress: {executionProgress}% - Analyzing {data.symbols.length} symbols with {data.indicators.filter(i => i.enabled).length} indicators
              </p>
            </div>
          </div>
          
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--bg-primary)' }}
          >
            <div 
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                backgroundColor: 'var(--accent)',
                width: `${executionProgress}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Final Check */}
      {!isExecuting && (
        <div 
          className="p-4 rounded-lg border text-center"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <CheckCircle size={32} className="mx-auto mb-3 text-green-500" />
          <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Ready to Execute
          </h4>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your backtest configuration has been reviewed and is ready to run. 
            Estimated completion time: {executionEstimate.estimatedTime} minutes.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            You can still go back to make changes if needed, or proceed with execution.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedReviewScreen;
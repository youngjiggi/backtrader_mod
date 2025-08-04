import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, Loader2, CheckCircle, XCircle, Save, X } from 'lucide-react';
import Modal from './Modal';
import { useStrategy } from '../contexts/StrategyContext';
import WatchlistSelector from './WatchlistSelector';
import TemplateSelector, { BacktestScenario } from './TemplateSelector';
import ExistingPortfolioImporter, { PortfolioPosition } from './ExistingPortfolioImporter';
import SimplifiedIndicatorSelector, { IndicatorConfig } from './SimplifiedIndicatorSelector';
import HierarchyQuickSetup, { HierarchyConfig } from './HierarchyQuickSetup';
import EnhancedReviewScreen from './EnhancedReviewScreen';

interface NewBacktestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBacktestStarted?: (backtestId: string) => void;
  onManageWatchlists?: () => void;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const NewBacktestModal: React.FC<NewBacktestModalProps> = ({ isOpen, onClose, onBacktestStarted, onManageWatchlists }) => {
  const { addStrategy } = useStrategy();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [executionProgress, setExecutionProgress] = useState(0);
  const [backtestId, setBacktestId] = useState<string>('');
  
  // Template-based state
  const [selectedScenario, setSelectedScenario] = useState<BacktestScenario | null>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [timeframes, setTimeframes] = useState<string[]>(['1d']);
  const [existingPortfolio, setExistingPortfolio] = useState<PortfolioPosition[]>([]);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>([]);
  const [hierarchy, setHierarchy] = useState<HierarchyConfig>({
    primarySignal: 'weinstein-stages',
    secondarySignal: 'rsi',
    filterSignal: 'atr',
    rules: [],
    conflictResolution: 'primary-wins'
  });
  const [executionSettings, setExecutionSettings] = useState({
    initialCapital: 100000,
    commission: 5.00,
    slippage: 0.05
  });
  const [runName, setRunName] = useState('');
  const [notes, setNotes] = useState('');
  const [showAdvancedIndicators, setShowAdvancedIndicators] = useState(false);
  const [symbolInput, setSymbolInput] = useState('');

  const steps = [
    { number: 1, title: 'Choose Scenario' },
    { number: 2, title: 'Data Selection' },
    { number: 3, title: 'Indicators' },
    { number: 4, title: 'Rules & Hierarchy' },
    { number: 5, title: 'Review & Execute' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmissionState('submitting');
    
    try {
      // Simulate API call
      const newBacktestId = `bt_${Date.now()}`;
      setBacktestId(newBacktestId);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmissionState('success');
      
      // Call the callback if provided
      if (onBacktestStarted) {
        onBacktestStarted(newBacktestId);
      }
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
      
    } catch (error) {
      setSubmissionState('error');
    }
  };

  const handleSaveStrategy = () => {
    const strategyName = prompt('Enter strategy name:');
    const strategyDescription = prompt('Enter strategy description (optional):') || '';
    
    if (strategyName) {
      addStrategy({
        name: strategyName,
        description: strategyDescription,
        symbol: symbols[0] || '',
        timeframe: timeframes[0] || '1d',
        atrPeriod: 14,
        atrMultiplier: 2,
        cvdThreshold: 1000,
        profileBins: [50],
        relativeVolume: false,
        atrTrim: false,
        phaseId: false,
        tags: []
      });
      
      alert(`Strategy "${strategyName}" saved successfully!`);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSubmissionState('idle');
    setBacktestId('');
    setSymbolInput('');
    setSelectedScenario(null);
    setSymbols([]);
    setTimeframes(['1d']);
    setExistingPortfolio([]);
    setIndicators([]);
    setHierarchy({
      primarySignal: 'weinstein-stages',
      secondarySignal: 'rsi',
      filterSignal: 'atr',
      rules: [],
      conflictResolution: 'primary-wins'
    });
    setRunName('');
    setNotes('');
    setShowAdvancedIndicators(false);
  };

  const addSymbol = () => {
    if (symbolInput.trim() && !symbols.includes(symbolInput.trim().toUpperCase())) {
      setSymbols([...symbols, symbolInput.trim().toUpperCase()]);
      setSymbolInput('');
    }
  };

  const removeSymbol = (symbolToRemove: string) => {
    setSymbols(symbols.filter(symbol => symbol !== symbolToRemove));
  };

  const toggleTimeframe = (timeframe: string) => {
    const isSelected = timeframes.includes(timeframe);
    if (isSelected) {
      // Don't allow removing all timeframes
      if (timeframes.length > 1) {
        setTimeframes(timeframes.filter(tf => tf !== timeframe));
      }
    } else {
      setTimeframes([...timeframes, timeframe]);
    }
  };

  const handleWatchlistLoad = (newSymbols: string[]) => {
    setSymbols([...new Set([...symbols, ...newSymbols])]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSymbol();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateSelector
            selectedScenario={selectedScenario}
            onScenarioSelect={setSelectedScenario}
            onNextStep={handleNext}
          />
        );
      
      case 2:
        return (
          <div className="space-y-6">
            {/* Symbols Section */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Symbols
              </label>
              
              <div className="space-y-3">
                {/* Symbol Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={symbolInput}
                    onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter symbol (e.g., AAPL) and press Enter"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      '--tw-ring-color': 'var(--accent)'
                    }}
                  />
                  <button
                    onClick={addSymbol}
                    disabled={!symbolInput.trim()}
                    className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* Watchlist Loader */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    or
                  </span>
                  <WatchlistSelector 
                    onSymbolsSelected={handleWatchlistLoad}
                    onManageWatchlists={onManageWatchlists}
                  />
                </div>

                {/* Selected Symbols */}
                {symbols.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Selected Symbols ({symbols.length})
                      </span>
                      <button
                        onClick={() => setSymbols([])}
                        className="text-xs px-2 py-1 rounded transition-colors"
                        style={{
                          color: 'var(--text-secondary)',
                          backgroundColor: 'var(--surface)',
                          border: `1px solid var(--border)`
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                      {symbols.map((symbol) => (
                        <span
                          key={symbol}
                          className="flex items-center space-x-1 px-2 py-1 rounded text-sm"
                          style={{
                            backgroundColor: 'var(--highlight)',
                            color: 'var(--bg-primary)'
                          }}
                        >
                          <span>{symbol}</span>
                          <button
                            onClick={() => removeSymbol(symbol)}
                            className="hover:bg-white hover:bg-opacity-20 rounded p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Timeframes Section */}
            <div>
              <label
                className="block text-sm font-medium mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Timeframes
              </label>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '1m', label: '1 Minute' },
                  { value: '5m', label: '5 Minutes' },
                  { value: '15m', label: '15 Minutes' },
                  { value: '1h', label: '1 Hour' },
                  { value: '4h', label: '4 Hours' },
                  { value: '1d', label: '1 Day' },
                  { value: '1w', label: '1 Week' },
                  { value: '1M', label: '1 Month' }
                ].map((timeframe) => (
                  <label
                    key={timeframe.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={timeframes.includes(timeframe.value)}
                      onChange={() => toggleTimeframe(timeframe.value)}
                      className="rounded"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>
                      {timeframe.label}
                    </span>
                  </label>
                ))}
              </div>

              {timeframes.length > 0 && (
                <div className="mt-3 p-2 rounded" style={{ backgroundColor: 'var(--surface)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Selected: {timeframes.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Existing Portfolio Section */}
            {selectedScenario && ['existing-plus-new', 'edge-case-study'].includes(selectedScenario.id) && (
              <ExistingPortfolioImporter
                positions={existingPortfolio}
                onPositionsUpdate={setExistingPortfolio}
              />
            )}
          </div>
        );
      
      case 3:
        return (
          <SimplifiedIndicatorSelector
            selectedIndicators={indicators}
            onIndicatorsUpdate={setIndicators}
            scenario={selectedScenario?.id as 'new-position' | 'existing-plus-new' | 'edge-case-study' || 'new-position'}
            showAdvanced={showAdvancedIndicators}
            onToggleAdvanced={setShowAdvancedIndicators}
          />
        );

      case 4:
        return (
          <HierarchyQuickSetup
            config={hierarchy}
            onConfigUpdate={setHierarchy}
            availableIndicators={indicators.filter(i => i.enabled).map(i => i.id)}
            scenario={selectedScenario?.id as 'new-position' | 'existing-plus-new' | 'edge-case-study' || 'new-position'}
          />
        );

      case 5:
        return (
          <div className="space-y-6">
            <EnhancedReviewScreen
              data={{
                scenario: selectedScenario!,
                symbols,
                timeframes,
                existingPortfolio,
                indicators,
                hierarchy,
                executionSettings,
                runName,
                notes
              }}
              onDataUpdate={(updates) => {
                if (updates.runName !== undefined) setRunName(updates.runName);
                if (updates.notes !== undefined) setNotes(updates.notes);
                if (updates.executionSettings) setExecutionSettings(updates.executionSettings);
              }}
              isExecuting={submissionState === 'submitting'}
              executionProgress={executionProgress}
            />

            {/* Submission Status */}
            {submissionState !== 'idle' && (
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                {submissionState === 'submitting' && (
                  <div className="flex items-center space-x-3">
                    <Loader2 className="animate-spin" size={20} style={{ color: 'var(--accent)' }} />
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Running Backtest...
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Analyzing {symbols.length} symbol{symbols.length !== 1 ? 's' : ''} across {timeframes.length} timeframe{timeframes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}

                {submissionState === 'success' && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle size={20} className="text-green-500" />
                    <div>
                      <h4 className="font-medium text-green-600">
                        Backtest Started Successfully!
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        ID: {backtestId} - Check "Runs in Progress" for status updates
                      </p>
                    </div>
                  </div>
                )}

                {submissionState === 'error' && (
                  <div className="flex items-center space-x-3">
                    <XCircle size={20} className="text-red-500" />
                    <div>
                      <h4 className="font-medium text-red-600">
                        Failed to Start Backtest
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Please check your configuration and try again
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save as Strategy Option */}
            {submissionState === 'idle' && (
              <div
                className="p-4 rounded-lg border border-dashed"
                style={{ borderColor: 'var(--border)' }}
              >
                <button
                  onClick={handleSaveStrategy}
                  className="flex items-center space-x-2 text-sm transition-colors"
                  style={{ color: 'var(--highlight)' }}
                >
                  <Save size={16} />
                  <span>Save this configuration as a strategy template</span>
                </button>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Backtest" size="xlarge">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number ? 'text-white' : ''
                  }`}
                  style={{
                    backgroundColor: currentStep >= step.number ? 'var(--accent)' : 'var(--surface)',
                    color: currentStep >= step.number ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: `1px solid ${currentStep >= step.number ? 'var(--accent)' : 'var(--border)'}`
                  }}
                >
                  {step.number}
                </div>
                <span
                  className="ml-2 text-sm font-medium"
                  style={{
                    color: currentStep >= step.number ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className="flex-1 h-px mx-4"
                  style={{
                    backgroundColor: currentStep > step.number ? 'var(--accent)' : 'var(--border)'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg border font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            <ChevronLeft className="inline mr-1" size={16} />
            Previous
          </button>
          
          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedScenario) ||
                (currentStep === 2 && symbols.length === 0)
              }
              className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              Next
              <ChevronRight className="inline ml-1" size={16} />
            </button>
          ) : (
            <div className="flex space-x-3">
              {submissionState === 'error' && (
                <button
                  onClick={() => setSubmissionState('idle')}
                  className="px-4 py-2 rounded-lg border font-medium transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  Try Again
                </button>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={symbols.length === 0 || !selectedScenario || submissionState === 'submitting' || submissionState === 'success'}
                className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                {submissionState === 'submitting' ? (
                  <>
                    <Loader2 className="inline mr-1 animate-spin" size={16} />
                    Running...
                  </>
                ) : submissionState === 'success' ? (
                  <>
                    <CheckCircle className="inline mr-1" size={16} />
                    Started!
                  </>
                ) : (
                  <>
                    <Play className="inline mr-1" size={16} />
                    Run Backtest
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NewBacktestModal;
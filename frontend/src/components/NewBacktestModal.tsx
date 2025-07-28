import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, Loader2, CheckCircle, XCircle, Save, X } from 'lucide-react';
import Modal from './Modal';
import { useStrategy } from '../contexts/StrategyContext';
import WatchlistSelector from './WatchlistSelector';

interface NewBacktestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBacktestStarted?: (backtestId: string) => void;
}

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const NewBacktestModal: React.FC<NewBacktestModalProps> = ({ isOpen, onClose, onBacktestStarted }) => {
  const { addStrategy } = useStrategy();
  const [currentStep, setCurrentStep] = useState(1);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [backtestId, setBacktestId] = useState<string>('');
  const [formData, setFormData] = useState({
    symbols: [] as string[],
    timeframes: ['1d'] as string[],
    atrPeriod: 14,
    atrMultiplier: 2,
    cvdThreshold: 1000,
    profileBins: [50],
    relativeVolume: false,
    atrTrim: false,
    phaseId: false
  });

  const [symbolInput, setSymbolInput] = useState('');

  const steps = [
    { number: 1, title: 'Data Selection' },
    { number: 2, title: 'Strategy Parameters' },
    { number: 3, title: 'Review & Run' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
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
        symbol: formData.symbols[0] || '',
        timeframe: formData.timeframes[0] || '1d',
        atrPeriod: formData.atrPeriod,
        atrMultiplier: formData.atrMultiplier,
        cvdThreshold: formData.cvdThreshold,
        profileBins: formData.profileBins,
        relativeVolume: formData.relativeVolume,
        atrTrim: formData.atrTrim,
        phaseId: formData.phaseId
      });
      
      alert(`Strategy "${strategyName}" saved successfully!`);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSubmissionState('idle');
    setBacktestId('');
    setSymbolInput('');
    setFormData({
      symbols: [],
      timeframes: ['1d'],
      atrPeriod: 14,
      atrMultiplier: 2,
      cvdThreshold: 1000,
      profileBins: [50],
      relativeVolume: false,
      atrTrim: false,
      phaseId: false
    });
  };

  const addSymbol = () => {
    if (symbolInput.trim() && !formData.symbols.includes(symbolInput.trim().toUpperCase())) {
      setFormData({
        ...formData,
        symbols: [...formData.symbols, symbolInput.trim().toUpperCase()]
      });
      setSymbolInput('');
    }
  };

  const removeSymbol = (symbolToRemove: string) => {
    setFormData({
      ...formData,
      symbols: formData.symbols.filter(symbol => symbol !== symbolToRemove)
    });
  };

  const toggleTimeframe = (timeframe: string) => {
    const isSelected = formData.timeframes.includes(timeframe);
    if (isSelected) {
      // Don't allow removing all timeframes
      if (formData.timeframes.length > 1) {
        setFormData({
          ...formData,
          timeframes: formData.timeframes.filter(tf => tf !== timeframe)
        });
      }
    } else {
      setFormData({
        ...formData,
        timeframes: [...formData.timeframes, timeframe]
      });
    }
  };

  const handleWatchlistLoad = (symbols: string[]) => {
    setFormData({
      ...formData,
      symbols: [...new Set([...formData.symbols, ...symbols])] // Remove duplicates
    });
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
                  <WatchlistSelector onSymbolsSelected={handleWatchlistLoad} />
                </div>

                {/* Selected Symbols */}
                {formData.symbols.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Selected Symbols ({formData.symbols.length})
                      </span>
                      <button
                        onClick={() => setFormData({ ...formData, symbols: [] })}
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
                      {formData.symbols.map((symbol) => (
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
                      checked={formData.timeframes.includes(timeframe.value)}
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

              {formData.timeframes.length > 0 && (
                <div className="mt-3 p-2 rounded" style={{ backgroundColor: 'var(--surface)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Selected: {formData.timeframes.join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ATR Period
                </label>
                <input
                  type="number"
                  value={formData.atrPeriod}
                  onChange={(e) => setFormData({ ...formData, atrPeriod: Number(e.target.value) })}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                />
              </div>
              
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  ATR Multiplier
                </label>
                <input
                  type="number"
                  value={formData.atrMultiplier}
                  onChange={(e) => setFormData({ ...formData, atrMultiplier: Number(e.target.value) })}
                  min="0.5"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                CVD Threshold
              </label>
              <input
                type="number"
                value={formData.cvdThreshold}
                onChange={(e) => setFormData({ ...formData, cvdThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
            </div>
            
            <div className="space-y-4">
              <h4
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                Additional Options
              </h4>
              
              {[
                { key: 'relativeVolume', label: 'Relative Volume Filter' },
                { key: 'atrTrim', label: 'ATR Trim Logic' },
                { key: 'phaseId', label: 'Phase Identification' }
              ].map((option) => (
                <label key={option.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData({ ...formData, [option.key]: e.target.checked })}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span style={{ color: 'var(--text-primary)' }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h4
              className="font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Review Configuration
            </h4>
            
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="space-y-3 text-sm">
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Symbols ({formData.symbols.length}):</span>
                  <div className="mt-1">
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                      {formData.symbols.length > 0 ? formData.symbols.join(', ') : 'No symbols selected'}
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Timeframes ({formData.timeframes.length}):</span>
                  <div className="mt-1">
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                      {formData.timeframes.join(', ')}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>ATR Period:</span>
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                      {formData.atrPeriod}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>ATR Multiplier:</span>
                    <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                      {formData.atrMultiplier}
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>CVD Threshold:</span>
                  <span className="ml-2" style={{ color: 'var(--text-primary)' }}>
                    {formData.cvdThreshold}
                  </span>
                </div>
              </div>
            </div>

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
                        Analyzing {formData.symbols.length} symbol{formData.symbols.length !== 1 ? 's' : ''} across {formData.timeframes.length} timeframe{formData.timeframes.length !== 1 ? 's' : ''}
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
    <Modal isOpen={isOpen} onClose={onClose} title="New Backtest">
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
          
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && formData.symbols.length === 0}
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
                disabled={formData.symbols.length === 0 || submissionState === 'submitting' || submissionState === 'success'}
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
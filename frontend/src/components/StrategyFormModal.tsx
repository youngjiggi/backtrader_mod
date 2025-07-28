import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useStrategy, StrategyTemplate } from '../contexts/StrategyContext';
import Modal from './Modal';

interface StrategyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingStrategy?: StrategyTemplate | null;
}

const StrategyFormModal: React.FC<StrategyFormModalProps> = ({
  isOpen,
  onClose,
  editingStrategy = null
}) => {
  const { addStrategy, updateStrategy } = useStrategy();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symbol: '',
    timeframe: '1d',
    atrPeriod: 14,
    atrMultiplier: 2,
    cvdThreshold: 1000,
    profileBins: [50] as number[],
    relativeVolume: false,
    atrTrim: false,
    phaseId: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize form when editing
  useEffect(() => {
    if (editingStrategy) {
      setFormData({
        name: editingStrategy.name,
        description: editingStrategy.description,
        symbol: editingStrategy.symbol,
        timeframe: editingStrategy.timeframe,
        atrPeriod: editingStrategy.atrPeriod,
        atrMultiplier: editingStrategy.atrMultiplier,
        cvdThreshold: editingStrategy.cvdThreshold,
        profileBins: [...editingStrategy.profileBins],
        relativeVolume: editingStrategy.relativeVolume,
        atrTrim: editingStrategy.atrTrim,
        phaseId: editingStrategy.phaseId
      });
    } else {
      setFormData({
        name: '',
        description: '',
        symbol: '',
        timeframe: '1d',
        atrPeriod: 14,
        atrMultiplier: 2,
        cvdThreshold: 1000,
        profileBins: [50],
        relativeVolume: false,
        atrTrim: false,
        phaseId: false
      });
    }
    setErrors({});
  }, [editingStrategy, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Strategy name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must not exceed 200 characters';
    }

    if (formData.atrPeriod < 1 || formData.atrPeriod > 50) {
      newErrors.atrPeriod = 'ATR Period must be between 1 and 50';
    }

    if (formData.atrMultiplier < 0.5 || formData.atrMultiplier > 5) {
      newErrors.atrMultiplier = 'ATR Multiplier must be between 0.5 and 5';
    }

    if (formData.cvdThreshold < 0) {
      newErrors.cvdThreshold = 'CVD Threshold must be positive';
    }

    if (formData.profileBins.length === 0) {
      newErrors.profileBins = 'At least one profile bin must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const strategyData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      symbol: formData.symbol.trim().toUpperCase(),
      timeframe: formData.timeframe,
      atrPeriod: formData.atrPeriod,
      atrMultiplier: formData.atrMultiplier,
      cvdThreshold: formData.cvdThreshold,
      profileBins: formData.profileBins,
      relativeVolume: formData.relativeVolume,
      atrTrim: formData.atrTrim,
      phaseId: formData.phaseId
    };

    if (editingStrategy) {
      updateStrategy(editingStrategy.id, strategyData);
    } else {
      addStrategy(strategyData);
    }

    onClose();
  };

  const handleProfileBinToggle = (bin: number) => {
    setFormData(prev => ({
      ...prev,
      profileBins: prev.profileBins.includes(bin)
        ? prev.profileBins.filter(b => b !== bin)
        : [...prev.profileBins, bin].sort((a, b) => a - b)
    }));
    setErrors(prev => ({ ...prev, profileBins: '' }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingStrategy ? `Edit ${editingStrategy.name}` : 'Create New Strategy'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Strategy Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: errors.name ? '#ef4444' : 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="e.g., ATR Breakout v2"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="symbol"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Default Symbol
            </label>
            <input
              id="symbol"
              type="text"
              value={formData.symbol}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }));
              }}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="e.g., AAPL (optional)"
              maxLength={10}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              setErrors(prev => ({ ...prev, description: '' }));
            }}
            className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none transition-colors"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: errors.description ? '#ef4444' : 'var(--border)',
              color: 'var(--text-primary)',
              '--tw-ring-color': 'var(--accent)'
            }}
            placeholder="Brief description of the strategy and its approach"
            rows={3}
            maxLength={200}
          />
          {errors.description && (
            <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
              {errors.description}
            </p>
          )}
        </div>

        {/* Strategy Parameters */}
        <div>
          <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
            Strategy Parameters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="timeframe"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Timeframe
              </label>
              <select
                id="timeframe"
                value={formData.timeframe}
                onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="4h">4 Hours</option>
                <option value="1d">1 Day</option>
                <option value="1w">1 Week</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="atrPeriod"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ATR Period
              </label>
              <input
                id="atrPeriod"
                type="number"
                value={formData.atrPeriod}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, atrPeriod: Number(e.target.value) }));
                  setErrors(prev => ({ ...prev, atrPeriod: '' }));
                }}
                min="1"
                max="50"
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: errors.atrPeriod ? '#ef4444' : 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
              {errors.atrPeriod && (
                <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                  {errors.atrPeriod}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="atrMultiplier"
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                ATR Multiplier
              </label>
              <input
                id="atrMultiplier"
                type="number"
                value={formData.atrMultiplier}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, atrMultiplier: Number(e.target.value) }));
                  setErrors(prev => ({ ...prev, atrMultiplier: '' }));
                }}
                min="0.5"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: errors.atrMultiplier ? '#ef4444' : 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
              {errors.atrMultiplier && (
                <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                  {errors.atrMultiplier}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="cvdThreshold"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              CVD Threshold
            </label>
            <input
              id="cvdThreshold"
              type="number"
              value={formData.cvdThreshold}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, cvdThreshold: Number(e.target.value) }));
                setErrors(prev => ({ ...prev, cvdThreshold: '' }));
              }}
              min="0"
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: errors.cvdThreshold ? '#ef4444' : 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            />
            {errors.cvdThreshold && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.cvdThreshold}
              </p>
            )}
          </div>

          {/* Profile Bins */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Profile Bins
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[50, 100, 150, 200].map((bin) => (
                <label
                  key={bin}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.profileBins.includes(bin)}
                    onChange={() => handleProfileBinToggle(bin)}
                    className="rounded"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span style={{ color: 'var(--text-primary)' }}>
                    {bin} days
                  </span>
                </label>
              ))}
            </div>
            {errors.profileBins && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.profileBins}
              </p>
            )}
          </div>

          {/* Advanced Options */}
          <div>
            <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Advanced Options
            </h4>
            <div className="space-y-3">
              {[
                { key: 'relativeVolume', label: 'Relative Volume Filter', description: 'Use volume spikes for entry confirmation' },
                { key: 'atrTrim', label: 'ATR Trim Logic', description: 'Reduce position size when ATR increases' },
                { key: 'phaseId', label: 'Phase Identification', description: 'Detect market phases (reversal, consolidation, exhaustion)' }
              ].map((option) => (
                <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof typeof formData] as boolean}
                    onChange={(e) => setFormData(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="mt-1 rounded"
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <div>
                    <div style={{ color: 'var(--text-primary)' }}>
                      {option.label}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg font-medium transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
          >
            <Save size={16} />
            <span>{editingStrategy ? 'Update Strategy' : 'Create Strategy'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StrategyFormModal;
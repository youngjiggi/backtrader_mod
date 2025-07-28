import React, { useState } from 'react';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import Modal from './Modal';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  winRateMin: number;
  sharpeMin: number;
  returnMin: number;
  symbols: string[];
  timeframes: string[];
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      dateRange: { start: '', end: '' },
      winRateMin: 0,
      sharpeMin: 0,
      returnMin: -100,
      symbols: [],
      timeframes: []
    };
    setFilters(resetFilters);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Advanced Filters">
      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <label className="flex items-center space-x-2 mb-3">
            <Calendar size={16} style={{ color: 'var(--highlight)' }} />
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              Date Range
            </span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Start Date
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                End Date
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Filters */}
        <div>
          <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Performance Thresholds
          </h4>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 mb-2">
                <Target size={14} style={{ color: 'var(--highlight)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Minimum Win Rate: {filters.winRateMin}%
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.winRateMin}
                onChange={(e) => setFilters({
                  ...filters,
                  winRateMin: Number(e.target.value)
                })}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-2">
                <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Minimum Sharpe Ratio: {filters.sharpeMin.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={filters.sharpeMin}
                onChange={(e) => setFilters({
                  ...filters,
                  sharpeMin: Number(e.target.value)
                })}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-2">
                <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Minimum Return: {filters.returnMin}%
                </span>
              </label>
              <input
                type="range"
                min="-50"
                max="100"
                value={filters.returnMin}
                onChange={(e) => setFilters({
                  ...filters,
                  returnMin: Number(e.target.value)
                })}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          </div>
        </div>

        {/* Timeframes */}
        <div>
          <label className="block font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Timeframes
          </label>
          <div className="flex flex-wrap gap-2">
            {['15m', '1h', '4h', '1d', '1w'].map((timeframe) => (
              <label key={timeframe} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.timeframes.includes(timeframe)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({
                        ...filters,
                        timeframes: [...filters.timeframes, timeframe]
                      });
                    } else {
                      setFilters({
                        ...filters,
                        timeframes: filters.timeframes.filter(tf => tf !== timeframe)
                      });
                    }
                  }}
                  className="rounded"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {timeframe}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            Reset
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
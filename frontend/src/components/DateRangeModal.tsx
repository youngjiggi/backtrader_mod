import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import Modal from './Modal';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
  currentStartDate?: string;
  currentEndDate?: string;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onDateRangeSelect,
  currentStartDate = '',
  currentEndDate = ''
}) => {
  const [startDate, setStartDate] = useState(currentStartDate);
  const [endDate, setEndDate] = useState(currentEndDate);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 5 years ago as default min date
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  const minDate = fiveYearsAgo.toISOString().split('T')[0];

  const validateDates = () => {
    const newErrors: { [key: string]: string } = {};

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        newErrors.dateRange = 'End date must be after start date';
      }

      if (end > new Date()) {
        newErrors.endDate = 'End date cannot be in the future';
      }

      // Check if the date range is too short (less than 1 week)
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        newErrors.dateRange = 'Date range must be at least 1 week';
      }

      // Check if the date range is too long (more than 10 years)
      if (diffDays > 3650) {
        newErrors.dateRange = 'Date range cannot exceed 10 years';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateDates()) {
      onDateRangeSelect(startDate, endDate);
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setErrors({});
  };

  // Quick preset options
  const presets = [
    {
      label: 'Last 30 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last 90 Days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 90);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last 6 Months',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 6);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    },
    {
      label: 'Last 2 Years',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setFullYear(start.getFullYear() - 2);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0]
        };
      }
    }
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const { start, end } = preset.getValue();
    setStartDate(start);
    setEndDate(end);
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Date Range">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Presets */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200 hover:bg-opacity-80"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Start Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={16}
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setErrors(prev => ({ ...prev, startDate: '', dateRange: '' }));
                }}
                min={minDate}
                max={today}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: errors.startDate ? '#ef4444' : 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.startDate}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              End Date
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={16}
                style={{ color: 'var(--text-secondary)' }}
              />
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setErrors(prev => ({ ...prev, endDate: '', dateRange: '' }));
                }}
                min={startDate || minDate}
                max={today}
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: errors.endDate ? '#ef4444' : 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.endDate}
              </p>
            )}
          </div>
        </div>

        {/* Date Range Error */}
        {errors.dateRange && (
          <div
            className="p-3 rounded-lg border text-sm"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#ef4444',
              color: '#ef4444'
            }}
          >
            {errors.dateRange}
          </div>
        )}

        {/* Date Range Info */}
        {startDate && endDate && !errors.dateRange && (
          <div
            className="p-3 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            }}
          >
            Selected range: {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200 hover:bg-opacity-80"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            Reset
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200 hover:bg-opacity-80"
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
              className="px-6 py-2 rounded-lg font-medium transition-colors duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              Apply Date Range
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default DateRangeModal;
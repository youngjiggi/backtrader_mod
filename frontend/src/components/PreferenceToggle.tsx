import React from 'react';

interface PreferenceToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'blue' | 'green' | 'purple' | 'accent';
  layout?: 'horizontal' | 'vertical';
  showIcon?: boolean;
  icon?: React.ReactNode;
}

const PreferenceToggle: React.FC<PreferenceToggleProps> = ({
  label,
  description,
  value,
  onChange,
  disabled = false,
  size = 'medium',
  color = 'accent',
  layout = 'horizontal',
  showIcon = false,
  icon
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      switch: 'h-4 w-7',
      thumb: 'h-3 w-3',
      thumbActive: 'translate-x-3',
      thumbInactive: 'translate-x-0.5',
      label: 'text-sm',
      description: 'text-xs'
    },
    medium: {
      switch: 'h-6 w-11',
      thumb: 'h-4 w-4',
      thumbActive: 'translate-x-6',
      thumbInactive: 'translate-x-1',
      label: 'text-base',
      description: 'text-sm'
    },
    large: {
      switch: 'h-8 w-14',
      thumb: 'h-6 w-6',
      thumbActive: 'translate-x-7',
      thumbInactive: 'translate-x-1',
      label: 'text-lg',
      description: 'text-base'
    }
  };

  // Color configurations
  const colorConfig = {
    blue: value ? 'bg-blue-600' : 'bg-gray-300',
    green: value ? 'bg-green-600' : 'bg-gray-300',
    purple: value ? 'bg-purple-600' : 'bg-gray-300',
    accent: value ? 'bg-blue-600' : 'bg-gray-300' // Will be overridden by inline styles
  };

  const config = sizeConfig[size];
  const switchColor = color === 'accent' 
    ? (value ? 'var(--accent)' : '#d1d5db')
    : undefined;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  const containerClass = layout === 'vertical' 
    ? 'flex flex-col space-y-2'
    : 'flex items-center justify-between';

  const textContainerClass = layout === 'vertical'
    ? 'mb-2'
    : 'flex-1 mr-4';

  return (
    <div className={`${containerClass} ${disabled ? 'opacity-50' : ''}`}>
      {/* Text Content */}
      <div className={textContainerClass}>
        <div className="flex items-center space-x-2">
          {showIcon && icon && (
            <div style={{ color: 'var(--text-secondary)' }}>
              {icon}
            </div>
          )}
          <label 
            className={`${config.label} font-medium cursor-pointer`}
            style={{ color: 'var(--text-primary)' }}
            onClick={handleToggle}
          >
            {label}
          </label>
        </div>
        {description && (
          <p 
            className={`${config.description} mt-1`}
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Toggle Switch */}
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative inline-flex ${config.switch} items-center rounded-full transition-colors duration-200 ease-in-out
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${color !== 'accent' ? colorConfig[color] : ''}
          focus:outline-none focus:ring-2 focus:ring-offset-2
        `}
        style={color === 'accent' ? { 
          backgroundColor: switchColor,
          '--tw-ring-color': 'var(--accent)'
        } : {}}
        role="switch"
        aria-checked={value}
        aria-labelledby={`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {/* Thumb */}
        <span
          className={`
            inline-block ${config.thumb} transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${value ? config.thumbActive : config.thumbInactive}
            shadow-sm
          `}
        />
        
        {/* Screen reader text */}
        <span className="sr-only">
          {value ? `Disable ${label}` : `Enable ${label}`}
        </span>
      </button>
    </div>
  );
};

export default PreferenceToggle;
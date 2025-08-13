import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProfileSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  actionButton?: React.ReactNode;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  description,
  children,
  collapsible = false,
  defaultExpanded = true,
  actionButton,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className={`rounded-lg border ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Section Header */}
      <div 
        className={`flex items-center justify-between p-4 ${collapsible ? 'cursor-pointer' : ''} ${
          collapsible && !isExpanded ? 'border-b-0' : 'border-b'
        }`}
        style={{ borderColor: 'var(--border)' }}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
            {collapsible && (
              <button
                className="p-1 rounded transition-colors hover:bg-opacity-50"
                style={{ color: 'var(--text-secondary)' }}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
          {description && (
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>
        
        {actionButton && (
          <div className="ml-4">
            {actionButton}
          </div>
        )}
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
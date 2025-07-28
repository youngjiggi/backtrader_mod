import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className="border rounded-lg overflow-hidden"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-80 transition-colors"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <div className="flex items-center space-x-3">
          {icon && <span style={{ color: 'var(--highlight)' }}>{icon}</span>}
          <h2 
            className="text-lg font-semibold text-left"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
        </div>
        {isExpanded ? (
          <ChevronDown size={20} style={{ color: 'var(--text-secondary)' }} />
        ) : (
          <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>
      
      {isExpanded && (
        <div 
          className="px-6 py-4"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
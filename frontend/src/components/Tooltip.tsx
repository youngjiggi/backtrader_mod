import React, { useState } from 'react';
import { ExternalLink, HelpCircle } from 'lucide-react';

interface TooltipProps {
  title: string;
  definition: string;
  formula?: string;
  learnMoreUrl?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  title, 
  definition, 
  formula, 
  learnMoreUrl, 
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 rounded-lg border shadow-xl transition-opacity duration-200"
             style={{
               backgroundColor: 'var(--bg-primary)',
               borderColor: 'var(--border)',
               left: '50%',
               transform: 'translateX(-50%)',
               bottom: '100%',
               marginBottom: '8px'
             }}>
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
               style={{
                 borderLeft: '8px solid transparent',
                 borderRight: '8px solid transparent',
                 borderTop: '8px solid var(--border)'
               }}>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
               style={{
                 borderLeft: '7px solid transparent',
                 borderRight: '7px solid transparent',
                 borderTop: '7px solid var(--bg-primary)',
                 marginTop: '-1px'
               }}>
          </div>
          
          {/* Content */}
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center space-x-2">
              <HelpCircle size={16} style={{ color: 'var(--highlight)' }} />
              <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {title}
              </h4>
            </div>
            
            {/* Definition */}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {definition}
            </p>
            
            {/* Formula (if provided) */}
            {formula && (
              <div className="p-2 rounded text-xs font-mono" 
                   style={{ 
                     backgroundColor: 'var(--surface)', 
                     color: 'var(--text-primary)' 
                   }}>
                <span className="text-xs font-sans" style={{ color: 'var(--text-secondary)' }}>
                  Formula: 
                </span>
                <br />
                {formula}
              </div>
            )}
            
            {/* Learn More Link */}
            {learnMoreUrl && (
              <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs transition-colors hover:opacity-80"
                  style={{ color: 'var(--highlight)' }}
                >
                  <ExternalLink size={12} />
                  <span>Learn more about {title}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
import React, { useEffect } from 'react';
import { ArrowLeft, Library, Layers, X, Copy, Trash2 } from 'lucide-react';

interface HamburgerMenuProps {
  onClose: () => void;
  onBack: () => void;
  onLibraryClick?: () => void;
  onCompareClick?: () => void;
  onCloneStrategy?: () => void;
  onCloseAllStrategies?: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onClose,
  onBack,
  onLibraryClick,
  onCompareClick,
  onCloneStrategy,
  onCloseAllStrategies
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const menuSections = [
    {
      title: 'Navigation',
      items: [
        {
          icon: <ArrowLeft size={18} />,
          label: 'Back to Main',
          onClick: () => {
            onBack();
            onClose();
          },
          description: 'Return to dashboard'
        },
        {
          icon: <Library size={18} />,
          label: 'Library',
          onClick: () => {
            onLibraryClick?.();
            onClose();
          },
          description: 'Browse strategy library'
        },
        {
          icon: <Layers size={18} />,
          label: 'Compare View',
          onClick: () => {
            onCompareClick?.();
            onClose();
          },
          description: 'Compare multiple strategies'
        }
      ]
    },
    {
      title: 'Strategy Management',
      items: [
        {
          icon: <Copy size={18} />,
          label: 'Clone Strategy',
          onClick: () => {
            onCloneStrategy?.();
            onClose();
          },
          description: 'Create a copy of current strategy'
        },
        {
          icon: <Trash2 size={18} />,
          label: 'Close All Strategies',
          onClick: () => {
            onCloseAllStrategies?.();
            onClose();
          },
          description: 'Close all open strategy tabs'
        }
      ]
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div 
        className="fixed top-0 left-0 h-full w-80 z-50 shadow-xl"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 
            className="text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="p-4 space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 
                className="text-sm font-medium mb-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {section.title}
              </h3>
              
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-opacity-80 text-left"
                    style={{
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ color: 'var(--accent)' }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div 
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {item.label}
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
import React, { useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Copy, 
  Edit3, 
  Download, 
  FileText, 
  Save, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Volume2, 
  Grid, 
  Share2, 
  Link,
  FileCode,
  Columns,
  SquareStack
} from 'lucide-react';
import { usePanelManager } from './PanelManager';

interface MoreMenuProps {
  onClose: () => void;
  currentStrategy?: string;
}

const MoreMenu: React.FC<MoreMenuProps> = ({ onClose, currentStrategy = "ATR Breakout" }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { 
    layoutMode, 
    toggleLayoutMode,
    leftPanelVisible,
    rightPanelVisible,
    bottomPanelVisible,
    toggleLeftPanel,
    toggleRightPanel,
    toggleBottomPanel
  } = usePanelManager();

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

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
      title: 'Layout & View Controls',
      items: [
        {
          icon: layoutMode === 'combined' ? <SquareStack size={16} /> : <Columns size={16} />,
          label: layoutMode === 'combined' ? 'Combined Mode' : 'Separate Mode',
          onClick: () => {
            toggleLayoutMode();
            onClose();
          }
        },
        {
          icon: <Maximize2 size={16} />,
          label: 'Full Screen Mode',
          onClick: () => {
            // TODO: Implement fullscreen
            console.log('Toggle fullscreen');
            onClose();
          }
        },
        {
          icon: leftPanelVisible ? <EyeOff size={16} /> : <Eye size={16} />,
          label: `${leftPanelVisible ? 'Hide' : 'Show'} Left Panel`,
          onClick: () => {
            toggleLeftPanel();
            onClose();
          }
        },
        {
          icon: rightPanelVisible ? <EyeOff size={16} /> : <Eye size={16} />,
          label: `${rightPanelVisible ? 'Hide' : 'Show'} Right Panel`,
          onClick: () => {
            toggleRightPanel();
            onClose();
          }
        },
        {
          icon: bottomPanelVisible ? <EyeOff size={16} /> : <Eye size={16} />,
          label: `${bottomPanelVisible ? 'Hide' : 'Show'} Bottom Panel`,
          onClick: () => {
            toggleBottomPanel();
            onClose();
          }
        },
        {
          icon: <ZoomIn size={16} />,
          label: 'Zoom In',
          onClick: () => {
            // TODO: Implement chart zoom
            console.log('Zoom in');
            onClose();
          }
        },
        {
          icon: <ZoomOut size={16} />,
          label: 'Reset Zoom',
          onClick: () => {
            // TODO: Implement zoom reset
            console.log('Reset zoom');
            onClose();
          }
        }
      ]
    },
    {
      title: 'Strategy Management',
      items: [
        {
          icon: <X size={16} />,
          label: 'Close Current Strategy',
          onClick: () => {
            // TODO: Implement close current
            console.log('Close current strategy');
            onClose();
          }
        },
        {
          icon: <X size={16} />,
          label: 'Close All Strategies',
          onClick: () => {
            // TODO: Implement close all
            console.log('Close all strategies');
            onClose();
          }
        },
        {
          icon: <Copy size={16} />,
          label: 'Duplicate Strategy',
          onClick: () => {
            // TODO: Implement duplicate
            console.log('Duplicate strategy');
            onClose();
          }
        },
        {
          icon: <Edit3 size={16} />,
          label: 'Rename Strategy',
          onClick: () => {
            // TODO: Implement rename
            console.log('Rename strategy');
            onClose();
          }
        }
      ]
    },
    {
      title: 'Data & Export',
      items: [
        {
          icon: <Download size={16} />,
          label: 'Export Chart',
          onClick: () => {
            // TODO: Implement chart export
            console.log('Export chart');
            onClose();
          }
        },
        {
          icon: <FileText size={16} />,
          label: 'Export Trade Journal',
          onClick: () => {
            // TODO: Implement trade journal export
            console.log('Export trade journal');
            onClose();
          }
        },
        {
          icon: <FileText size={16} />,
          label: 'Export Strategy Report',
          onClick: () => {
            // TODO: Implement report export
            console.log('Export strategy report');
            onClose();
          }
        },
        {
          icon: <Save size={16} />,
          label: 'Save Strategy Template',
          onClick: () => {
            // TODO: Implement save template
            console.log('Save strategy template');
            onClose();
          }
        }
      ]
    },
    {
      title: 'Chart Settings',
      items: [
        {
          icon: <TrendingUp size={16} />,
          label: 'Technical Indicators',
          onClick: () => {
            // TODO: Implement indicators menu
            console.log('Open indicators menu');
            onClose();
          }
        },
        {
          icon: <Clock size={16} />,
          label: 'Timeframe Selection',
          onClick: () => {
            // TODO: Implement timeframe menu
            console.log('Open timeframe menu');
            onClose();
          }
        },
        {
          icon: <BarChart3 size={16} />,
          label: 'Chart Type',
          onClick: () => {
            // TODO: Implement chart type menu
            console.log('Open chart type menu');
            onClose();
          }
        },
        {
          icon: <Volume2 size={16} />,
          label: 'Volume Display',
          onClick: () => {
            // TODO: Implement volume toggle
            console.log('Toggle volume display');
            onClose();
          }
        },
        {
          icon: <Grid size={16} />,
          label: 'Grid & Axes',
          onClick: () => {
            // TODO: Implement grid settings
            console.log('Open grid settings');
            onClose();
          }
        }
      ]
    },
    {
      title: 'Share Strategy',
      items: [
        {
          icon: <Share2 size={16} />,
          label: 'Generate Share Link',
          onClick: () => {
            // TODO: Implement share link
            console.log('Generate share link');
            onClose();
          }
        },
        {
          icon: <Link size={16} />,
          label: 'Copy Strategy Config',
          onClick: () => {
            // TODO: Implement copy config
            console.log('Copy strategy config');
            onClose();
          }
        },
        {
          icon: <FileCode size={16} />,
          label: 'Export Strategy Code',
          onClick: () => {
            // TODO: Implement export code
            console.log('Export strategy code');
            onClose();
          }
        }
      ]
    }
  ];

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 mt-2 w-64 rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <h3 
          className="font-medium text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          {currentStrategy} Options
        </h3>
      </div>

      {/* Menu Sections */}
      <div className="py-2">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {sectionIndex > 0 && (
              <hr 
                className="my-2 mx-4"
                style={{ borderColor: 'var(--border)' }}
              />
            )}
            
            <div className="px-4 py-1">
              <h4 
                className="text-xs font-medium mb-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {section.title}
              </h4>
              
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className="w-full flex items-center space-x-3 px-2 py-2 rounded text-sm transition-colors hover:bg-opacity-80"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)'
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
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoreMenu;
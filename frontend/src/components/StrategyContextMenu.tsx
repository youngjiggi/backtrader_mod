import React, { useEffect, useRef } from 'react';
import { Star, Plus, X, Target, Edit } from 'lucide-react';

interface StrategyContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  strategyId: string;
  strategyName: string;
  isBaseStrategy: boolean;
  isInComparison: boolean;
  onSetBaseStrategy: (strategyId: string) => void;
  onAddToComparison: (strategyId: string) => void;
  onRemoveFromComparison: (strategyId: string) => void;
  onEditStrategy: (strategyId: string) => void;
  onClose: () => void;
}

const StrategyContextMenu: React.FC<StrategyContextMenuProps> = ({
  isOpen,
  position,
  strategyId,
  strategyName,
  isBaseStrategy,
  isInComparison,
  onSetBaseStrategy,
  onAddToComparison,
  onRemoveFromComparison,
  onEditStrategy,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSetBaseStrategy = () => {
    onSetBaseStrategy(strategyId);
    onClose();
  };

  const handleAddToComparison = () => {
    onAddToComparison(strategyId);
    onClose();
  };

  const handleRemoveFromComparison = () => {
    onRemoveFromComparison(strategyId);
    onClose();
  };

  const handleEditStrategy = () => {
    onEditStrategy(strategyId);
    onClose();
  };

  if (!isOpen) return null;

  // Adjust position to prevent menu from going off-screen
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 220),
    y: Math.min(position.y, window.innerHeight - 150)
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-48 rounded-lg border shadow-xl"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {strategyName}
        </p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {/* Edit Strategy */}
        <button
          onClick={handleEditStrategy}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors hover:bg-opacity-80"
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
          <Edit size={16} style={{ color: 'var(--accent)' }} />
          <span>Edit Strategy</span>
        </button>
        {!isBaseStrategy && (
          <button
            onClick={handleSetBaseStrategy}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors hover:bg-opacity-80"
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
            <Star size={16} style={{ color: 'var(--highlight)' }} />
            <span>Set as Base Strategy</span>
          </button>
        )}

        {!isInComparison && !isBaseStrategy && (
          <button
            onClick={handleAddToComparison}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors hover:bg-opacity-80"
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
            <Plus size={16} style={{ color: 'var(--accent)' }} />
            <span>Add to Comparison</span>
          </button>
        )}

        {isInComparison && (
          <button
            onClick={handleRemoveFromComparison}
            className="w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors hover:bg-opacity-80"
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
            <X size={16} className="text-red-500" />
            <span>Remove from Comparison</span>
          </button>
        )}

        {isBaseStrategy && (
          <div className="px-3 py-2 text-sm flex items-center space-x-3" style={{ color: 'var(--text-secondary)' }}>
            <Target size={16} style={{ color: 'var(--highlight)' }} />
            <span>Current Portfolio Strategy</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyContextMenu;
import React, { useRef, useCallback } from 'react';
import { GripVertical } from 'lucide-react';

export type PanelPosition = 'left' | 'right' | 'bottom';

interface ResizablePanelProps {
  children: React.ReactNode;
  position: PanelPosition;
  size: number;
  visible: boolean;
  onResize: (size: number) => void;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  position,
  size,
  visible,
  onResize,
  minSize = 200,
  maxSize = 600,
  className = ''
}) => {
  const isResizing = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;

      let newSize: number;
      if (position === 'left') {
        newSize = Math.max(minSize, Math.min(maxSize, e.clientX));
      } else if (position === 'right') {
        newSize = Math.max(minSize, Math.min(maxSize, window.innerWidth - e.clientX));
      } else { // bottom
        newSize = Math.max(minSize, Math.min(maxSize, window.innerHeight - e.clientY));
      }
      onResize(newSize);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = position === 'bottom' ? 'row-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, [position, minSize, maxSize, onResize]);

  if (!visible) return null;

  const isVertical = position === 'left' || position === 'right';
  const sizeStyle = isVertical ? { width: `${size}px` } : { height: `${size}px` };
  
  const resizeHandleClass = `
    ${isVertical ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
    hover:bg-blue-500 transition-colors group relative
  `;

  const borderClass = {
    left: 'border-r',
    right: 'border-l', 
    bottom: 'border-t'
  }[position];

  return (
    <div className={`relative ${position === 'bottom' ? 'w-full' : 'flex'}`}>
      {/* Panel Content */}
      <div
        className={`${borderClass} flex flex-col ${position === 'bottom' ? 'w-full' : ''} ${className}`}
        style={{
          ...sizeStyle,
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {position === 'right' && (
        <div
          className={resizeHandleClass}
          onMouseDown={handleMouseDown}
          style={{ backgroundColor: 'var(--border)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>
        </div>
      )}

      {position === 'left' && (
        <div
          className={resizeHandleClass}
          onMouseDown={handleMouseDown}
          style={{ backgroundColor: 'var(--border)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} />
          </div>
        </div>
      )}

      {position === 'bottom' && (
        <div
          className={`${resizeHandleClass} w-full`}
          onMouseDown={handleMouseDown}
          style={{ backgroundColor: 'var(--border)' }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical size={16} style={{ color: 'var(--text-secondary)' }} className="rotate-90" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizablePanel;
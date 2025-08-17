import React, { useState, useCallback, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';

interface ChartResizeHandleProps {
  onResize: (newHeight: number) => void;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

const ChartResizeHandle: React.FC<ChartResizeHandleProps> = ({
  onResize,
  minHeight = 200,
  maxHeight = 800,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    
    // Get current chart height from the parent container
    const chartContainer = (e.target as HTMLElement).closest('.chart-container-wrapper')?.querySelector('.chart-container') as HTMLElement;
    if (chartContainer) {
      setStartHeight(chartContainer.offsetHeight);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    const deltaY = e.clientY - startY;
    const newHeight = Math.min(Math.max(startHeight + deltaY, minHeight), maxHeight);
    
    onResize(newHeight);
  }, [isDragging, startY, startHeight, minHeight, maxHeight, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events for mobile/Tesla
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    
    const chartContainer = (e.target as HTMLElement).closest('.chart-container-wrapper')?.querySelector('.chart-container') as HTMLElement;
    if (chartContainer) {
      setStartHeight(chartContainer.offsetHeight);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    const deltaY = e.touches[0].clientY - startY;
    const newHeight = Math.min(Math.max(startHeight + deltaY, minHeight), maxHeight);
    
    onResize(newHeight);
  }, [isDragging, startY, startHeight, minHeight, maxHeight, onResize]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse/touch event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ns-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      className={`flex items-center justify-center cursor-ns-resize select-none ${className}`}
      style={{
        height: '8px',
        backgroundColor: isDragging ? 'var(--accent)' : 'var(--border)',
        borderTop: `1px solid var(--border)`,
        borderBottom: `1px solid var(--border)`,
        transition: isDragging ? 'none' : 'background-color 0.2s ease'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      title="Drag to resize chart height"
    >
      {/* Visual grip indicator */}
      <div
        className="flex items-center justify-center rounded px-2 py-1"
        style={{
          backgroundColor: isDragging ? 'var(--bg-primary)' : 'transparent',
          color: isDragging ? 'var(--accent)' : 'var(--text-secondary)',
          transition: 'all 0.2s ease'
        }}
      >
        <GripHorizontal size={16} />
      </div>
      
      {/* Touch-friendly invisible area for better mobile interaction */}
      <div
        className="absolute inset-0"
        style={{
          height: '20px', // Larger touch target
          marginTop: '-6px', // Center the larger touch area
          cursor: 'ns-resize'
        }}
      />
    </div>
  );
};

export default ChartResizeHandle;
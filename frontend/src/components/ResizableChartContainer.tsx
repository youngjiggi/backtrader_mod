import React, { useState, useEffect } from 'react';
import ChartResizeHandle from './ChartResizeHandle';

interface ResizableChartContainerProps {
  children: React.ReactNode;
  defaultHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

const ResizableChartContainer: React.FC<ResizableChartContainerProps> = ({
  children,
  defaultHeight = 400,
  minHeight = 200,
  maxHeight = 800,
  className = ''
}) => {
  const [chartHeight, setChartHeight] = useState(defaultHeight);

  // Load saved chart height from localStorage
  useEffect(() => {
    try {
      const savedHeight = localStorage.getItem('chartHeight');
      if (savedHeight) {
        const height = parseInt(savedHeight, 10);
        if (height >= minHeight && height <= maxHeight) {
          setChartHeight(height);
        }
      }
    } catch (error) {
      console.warn('Failed to load chart height from localStorage:', error);
    }
  }, [minHeight, maxHeight]);

  // Save chart height to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('chartHeight', chartHeight.toString());
    } catch (error) {
      console.warn('Failed to save chart height to localStorage:', error);
    }
  }, [chartHeight]);

  const handleHeightChange = (newHeight: number) => {
    // Ensure height is within bounds
    const constrainedHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
    setChartHeight(constrainedHeight);
  };

  // Calculate responsive constraints based on screen size
  useEffect(() => {
    const updateConstraints = () => {
      const screenHeight = window.innerHeight;
      const maxAllowedHeight = Math.floor(screenHeight * 0.7); // Max 70% of screen height
      
      if (chartHeight > maxAllowedHeight) {
        setChartHeight(maxAllowedHeight);
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    
    return () => window.removeEventListener('resize', updateConstraints);
  }, [chartHeight]);

  return (
    <div className={`chart-container-wrapper ${className}`}>
      {/* Chart Container with Fixed Height */}
      <div 
        className="chart-container relative"
        style={{ 
          height: `${chartHeight}px`,
          minHeight: `${minHeight}px`,
          maxHeight: `${maxHeight}px`,
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
      
      {/* Resize Handle */}
      <ChartResizeHandle
        onResize={handleHeightChange}
        minHeight={minHeight}
        maxHeight={maxHeight}
        className="relative z-10"
      />
    </div>
  );
};

export default ResizableChartContainer;
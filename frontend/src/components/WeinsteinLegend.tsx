import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface WeinsteinLegendProps {
  isVisible: boolean;
  onToggle: () => void;
}

const WeinsteinLegend: React.FC<WeinsteinLegendProps> = ({ isVisible, onToggle }) => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  const stages = [
    {
      number: 1,
      name: 'Basing',
      color: '#9CA3AF', // Gray
      description: 'Accumulation phase - End of downtrend, sideways consolidation',
      keyIndicators: [
        'Price below but MA flattening',
        'Low/decreasing volume',
        'RS starting to turn up',
        'SATA score: 2-8'
      ]
    },
    {
      number: 2, 
      name: 'Advancing',
      color: '#10B981', // Green
      description: 'Markup phase - Bullish uptrend with momentum',
      keyIndicators: [
        'Price breaks above MA on volume',
        'Higher highs and higher lows',
        'RS crosses above zero',
        'SATA score: 6-10'
      ]
    },
    {
      number: 3,
      name: 'Topping',
      color: '#F59E0B', // Orange
      description: 'Distribution phase - Uptrend losing steam, distribution phase',
      keyIndicators: [
        'Price above MA but MA flattening',
        'Failed rallies, lower highs',
        'RS declining toward zero',
        'SATA score: 8-2'
      ]
    },
    {
      number: 4,
      name: 'Declining',
      color: '#EF4444', // Red
      description: 'Markdown phase - Bearish downtrend with selling pressure',
      keyIndicators: [
        'Price breaks below MA on volume',
        'Lower highs and lower lows', 
        'RS well below zero',
        'SATA score: 0-5'
      ]
    }
  ];

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
      >
        <Info size={16} />
        <span>Show Stage Legend</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Weinstein's Four Stages
        </h3>
        <button
          onClick={onToggle}
          className="text-sm px-3 py-1 rounded border transition-colors"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--surface)'
          }}
        >
          Hide Legend
        </button>
      </div>

      {/* Simple Legend */}
      <div className="space-y-2">
        {stages.map((stage) => (
          <div key={stage.number} className="relative">
            <div
              className="flex items-center space-x-3 p-2 rounded cursor-help transition-colors hover:bg-opacity-50"
              style={{ backgroundColor: hoveredStage === stage.number ? 'var(--bg-primary)' : 'transparent' }}
              onMouseEnter={() => setHoveredStage(stage.number)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Stage {stage.number}: {stage.name}
              </span>
            </div>

            {/* Hover Tooltip */}
            {hoveredStage === stage.number && (
              <div
                className="absolute left-0 top-full mt-2 p-3 rounded-lg border shadow-lg z-10 w-72"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {stage.description}
                  </h4>
                  <div>
                    <h5 className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      Key Indicators:
                    </h5>
                    <ul className="space-y-1">
                      {stage.keyIndicators.map((indicator, index) => (
                        <li
                          key={index}
                          className="text-xs flex items-start"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <span className="mr-2">•</span>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compact Technical Notes */}
      <div
        className="border rounded-lg p-3 text-xs"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)'
        }}
      >
        <div className="flex items-start space-x-1">
          <Info size={12} className="mt-0.5 flex-shrink-0" />
          <span>
            <strong>30W MA:</strong> Primary trend indicator • <strong>SATA:</strong> 0-10 scale • <strong>RS:</strong> vs. market index
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeinsteinLegend;
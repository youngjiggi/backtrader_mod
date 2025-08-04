import React from 'react';
import { Target, TrendingUp, Brain, ChevronRight } from 'lucide-react';

export interface BacktestScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  defaultSettings: {
    indicators: string[];
    timeframe: string;
    portfolio: 'new' | 'existing' | 'mixed';
    focusArea: string;
  };
}

interface TemplateSelectorProps {
  selectedScenario: BacktestScenario | null;
  onScenarioSelect: (scenario: BacktestScenario) => void;
  onNextStep?: () => void;
  className?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedScenario,
  onScenarioSelect,
  onNextStep,
  className = ''
}) => {
  const scenarios: BacktestScenario[] = [
    {
      id: 'new-position',
      title: 'New Position(s)',
      subtitle: 'Entry optimization and position management',
      description: 'What does an ideal entry look like? If I get in, how should I manage it?',
      icon: <Target size={24} />,
      features: [
        'Fresh start with clean watchlist',
        'Entry optimization focus',
        'Position management rules',
        'Risk-based sizing',
        'Multiple timeframe analysis'
      ],
      complexity: 'Beginner',
      estimatedTime: '3-5 minutes',
      defaultSettings: {
        indicators: ['trend', 'momentum', 'volume'],
        timeframe: '1d',
        portfolio: 'new',
        focusArea: 'entry-optimization'
      }
    },
    {
      id: 'existing-plus-new',
      title: 'Existing Position(s) + New',
      subtitle: 'Portfolio optimization and enhancement',
      description: 'I want to know if I can do better.',
      icon: <TrendingUp size={24} />,
      features: [
        'Load existing strategy from library',
        'Modify current holdings',
        'Add/remove tickers with allocation adjustments',
        'Buy watchlist for new opportunities',
        'Portfolio optimization analysis'
      ],
      complexity: 'Intermediate',
      estimatedTime: '5-8 minutes',
      defaultSettings: {
        indicators: ['trend', 'momentum', 'volume', 'volatility'],
        timeframe: '1d',
        portfolio: 'mixed',
        focusArea: 'portfolio-optimization'
      }
    },
    {
      id: 'edge-case-study',
      title: 'Proactive Study / Edge Case',
      subtitle: 'Stress testing and unusual scenarios',
      description: 'Can my strategy handle bad overreactions, macro dips, or sudden moves?',
      icon: <Brain size={24} />,
      features: [
        'Load existing strategy as baseline',
        'Add specialized edge-case indicators',
        'OBV breakout analysis',
        'Relative volume detection',
        'Stress testing scenarios',
        'Out-of-sample validation'
      ],
      complexity: 'Advanced',
      estimatedTime: '8-12 minutes',
      defaultSettings: {
        indicators: ['trend', 'momentum', 'volume', 'volatility', 'obv', 'relative-volume'],
        timeframe: '1d',
        portfolio: 'existing',
        focusArea: 'edge-case-handling'
      }
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return '#10B981';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#EF4444';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          What do you want to test?
        </h2>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          Choose a scenario to get started with a pre-configured template
        </p>
      </div>

      <div className="space-y-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
              selectedScenario?.id === scenario.id ? 'ring-4 ring-opacity-30 shadow-xl' : 'hover:shadow-md'
            }`}
            onClick={() => onScenarioSelect(scenario)}
            style={{
              backgroundColor: selectedScenario?.id === scenario.id ? 'rgba(59, 130, 246, 0.08)' : 'var(--surface)',
              borderColor: selectedScenario?.id === scenario.id ? 'var(--accent)' : 'var(--border)',
              ringColor: selectedScenario?.id === scenario.id ? 'var(--accent)' : 'transparent',
              boxShadow: selectedScenario?.id === scenario.id ? '0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)' : undefined
            }}
          >
            {/* Header with Icon and Arrow */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-3 rounded-lg flex-shrink-0"
                  style={{ 
                    backgroundColor: selectedScenario?.id === scenario.id ? 'var(--accent)' : 'rgba(59, 130, 246, 0.1)',
                    color: selectedScenario?.id === scenario.id ? 'var(--bg-primary)' : 'var(--accent)'
                  }}
                >
                  {scenario.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {scenario.title}
                  </h3>
                  <p className="text-base font-medium" style={{ color: 'var(--highlight)' }}>
                    {scenario.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScenarioSelect(scenario);
                  if (onNextStep) {
                    setTimeout(() => onNextStep(), 150);
                  }
                }}
                className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                  selectedScenario?.id === scenario.id ? 'bg-accent text-white shadow-lg' : 'hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedScenario?.id === scenario.id ? 'var(--accent)' : 'var(--surface)',
                  color: selectedScenario?.id === scenario.id ? 'var(--bg-primary)' : 'var(--text-secondary)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">

              <p className="text-base mb-4" style={{ color: 'var(--text-secondary)' }}>
                {scenario.description}
              </p>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-base font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                  What's included:
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {scenario.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-500 mt-0.5 font-bold">•</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <span style={{ color: 'var(--text-secondary)' }}>Complexity:</span>
                  <span 
                    className="px-2 py-0.5 rounded font-medium"
                    style={{ 
                      backgroundColor: `${getComplexityColor(scenario.complexity)}20`,
                      color: getComplexityColor(scenario.complexity)
                    }}
                  >
                    {scenario.complexity}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span style={{ color: 'var(--text-secondary)' }}>Setup:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{scenario.estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div 
        className="p-4 rounded-lg border text-center mt-6"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border)' 
        }}
      >
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          💡 Don't worry - you can customize everything in the next steps. These templates just give you a head start!
        </p>
        {selectedScenario && (
          <p className="text-sm mt-2" style={{ color: 'var(--accent)' }}>
            ✓ {selectedScenario.title} selected - Click the arrow (→) or Next to continue
          </p>
        )}
      </div>
    </div>
  );
};

export default TemplateSelector;
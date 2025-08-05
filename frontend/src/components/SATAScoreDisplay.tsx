import React from 'react';

interface SATAScoreDisplayProps {
  score: number;
  variant?: 'gauge' | 'dots' | 'simple';
  size?: 'small' | 'medium' | 'large';
  showBreakdown?: boolean;
  className?: string;
}

const SATAScoreDisplay: React.FC<SATAScoreDisplayProps> = ({
  score,
  variant = 'simple',
  size = 'medium',
  showBreakdown = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return { container: 'p-3', score: 'text-2xl', label: 'text-xs' };
      case 'large':
        return { container: 'p-6', score: 'text-5xl', label: 'text-base' };
      default:
        return { container: 'p-4', score: 'text-3xl', label: 'text-sm' };
    }
  };

  const classes = getSizeClasses();

  const renderGaugeVariant = () => (
    <div className={`text-center ${classes.container} ${className}`}>
      <div className="relative">
        <div 
          className="mx-auto rounded-full border-8 flex items-center justify-center"
          style={{
            width: size === 'large' ? '270px' : size === 'small' ? '120px' : '180px',
            height: size === 'large' ? '270px' : size === 'small' ? '120px' : '180px',
            borderColor: 'var(--highlight)',
            backgroundColor: 'var(--bg-primary)',
            background: `conic-gradient(from 0deg, var(--highlight) 0deg, var(--highlight) ${(score/10) * 360}deg, var(--border) ${(score/10) * 360}deg, var(--border) 360deg)`
          }}
        >
          <div className="text-center">
            <div className={classes.score} style={{ color: 'var(--text-primary)' }}>{score.toFixed(1)}</div>
            <div className={classes.label} style={{ color: 'var(--text-secondary)' }}>SATA</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDotsVariant = () => (
    <div className={`text-center ${classes.container} rounded-lg border ${className}`} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      {/* Dots grid filling top area - 4 rows of 10 dots each */}
      <div className="mb-4">
        <div className="grid grid-cols-10 grid-rows-4 gap-1 w-40 h-12 mx-auto">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300`}
              style={{
                backgroundColor: i < (score * 4) ? 'var(--highlight)' : 'var(--border)',
                opacity: i < (score * 4) ? 1 : 0.2,
                animationDelay: `${i * 30}ms`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Score and label at bottom */}
      <div>
        <div className={classes.score} style={{ color: 'var(--highlight)' }}>{score.toFixed(1)}</div>
        <div className={classes.label} style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
      </div>
    </div>
  );

  const renderSimpleVariant = () => (
    <div className={`text-center ${classes.container} rounded-lg border ${className}`} style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      <div className={classes.score} style={{ color: 'var(--highlight)' }}>{score.toFixed(1)}</div>
      <div className={classes.label} style={{ color: 'var(--text-secondary)' }}>SATA Score</div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
        {score >= 8 ? 'High Probability Setup' : score >= 6 ? 'Medium Probability' : 'Low Probability'}
      </div>
    </div>
  );

  const renderBreakdown = () => (
    <div className="mt-4 space-y-2">
      <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>SATA Score Components</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Stage Analysis:</span>
          <span style={{ color: 'var(--text-primary)' }}>{(score * 0.4).toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Technical Setup:</span>
          <span style={{ color: 'var(--text-primary)' }}>{(score * 0.3).toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Volume Analysis:</span>
          <span style={{ color: 'var(--text-primary)' }}>{(score * 0.2).toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--text-secondary)' }}>Risk Assessment:</span>
          <span style={{ color: 'var(--text-primary)' }}>{(score * 0.1).toFixed(1)}</span>
        </div>
      </div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'gauge':
        return renderGaugeVariant();
      case 'dots':
        return renderDotsVariant();
      default:
        return renderSimpleVariant();
    }
  };

  return (
    <div>
      {renderVariant()}
      {showBreakdown && renderBreakdown()}
    </div>
  );
};

export default SATAScoreDisplay;
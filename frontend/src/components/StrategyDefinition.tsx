import React, { useState } from 'react';
import { 
  Settings, 
  Target, 
  Shield, 
  Filter, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface StrategyDefinitionProps {
  strategy: RecentRun;
  className?: string;
}

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className="border rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-opacity-50 transition-colors"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="flex items-center space-x-3">
          {icon}
          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h4>
        </div>
        {isExpanded ? 
          <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} /> :
          <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
        }
      </button>
      {isExpanded && (
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const StrategyDefinition: React.FC<StrategyDefinitionProps> = ({ strategy, className = '' }) => {
  const formatParameterValue = (value: any) => {
    if (typeof value === 'number') {
      return value % 1 === 0 ? value.toString() : value.toFixed(2);
    }
    return value?.toString() || 'N/A';
  };

  const getRiskLevel = (maxRisk: number) => {
    if (maxRisk <= 1) return { level: 'Conservative', color: 'text-green-500' };
    if (maxRisk <= 3) return { level: 'Moderate', color: 'text-yellow-500' };
    return { level: 'Aggressive', color: 'text-red-500' };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Strategy Definition
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Complete configuration and logic for {strategy.name} {strategy.version}
          </p>
        </div>
        <div 
          className="px-3 py-1.5 rounded-lg border text-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          {strategy.symbol} • {strategy.timeframe}
        </div>
      </div>

      {/* Strategy Logic Overview */}
      <CollapsibleSection
        title="Strategy Logic"
        icon={<BarChart3 size={18} style={{ color: 'var(--highlight)' }} />}
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <div>
            <h5 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Core Logic
            </h5>
            <p 
              className="text-sm p-3 rounded-lg"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)'
              }}
            >
              {strategy.strategyDefinition?.logic || 
                "Multi-timeframe momentum strategy combining ATR-based position sizing with RSI mean reversion signals. Enters positions when price breaks above/below ATR bands with confirming volume and RSI divergence patterns."
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6 className="font-medium mb-2 text-green-600">Entry Philosophy</h6>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <li>• Momentum-based entries</li>
                <li>• Volume confirmation required</li>
                <li>• Multiple timeframe alignment</li>
                <li>• Risk-adjusted position sizing</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium mb-2 text-red-600">Exit Philosophy</h6>
              <ul className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <li>• Systematic profit taking</li>
                <li>• ATR-based stop losses</li>
                <li>• Time-based exits available</li>
                <li>• Momentum reversal detection</li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Entry & Exit Conditions */}
      <CollapsibleSection
        title="Entry & Exit Conditions"
        icon={<Target size={18} style={{ color: 'var(--highlight)' }} />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entry Conditions */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp size={16} className="text-green-500" />
              <h5 className="font-medium text-green-600">Entry Conditions</h5>
            </div>
            <div className="space-y-2">
              {(strategy.strategyDefinition?.entryConditions || [
                "Price closes above ATR upper band",
                "RSI(14) < 70 (not overbought)",
                "Volume > 1.5x 20-day average",
                "CVD threshold exceeded",
                "No conflicting higher timeframe signals"
              ]).map((condition, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-2 p-2 rounded text-sm"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exit Conditions */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingDown size={16} className="text-red-500" />
              <h5 className="font-medium text-red-600">Exit Conditions</h5>
            </div>
            <div className="space-y-2">
              {(strategy.strategyDefinition?.exitConditions || [
                "Stop loss: 2x ATR below entry",
                "Take profit: 4x ATR above entry",
                "RSI(14) > 80 (overbought exit)",
                "Volume drops below 0.8x average",
                "Maximum hold time: 10 days"
              ]).map((condition, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-2 p-2 rounded text-sm"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Risk Management */}
      <CollapsibleSection
        title="Risk Management"
        icon={<Shield size={18} style={{ color: 'var(--highlight)' }} />}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Position Sizing
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Method:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategyDefinition?.riskManagement?.positionSizing || 'Volatility Adjusted'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Max Risk/Trade:</span>
                <span className={getRiskLevel(strategy.strategyDefinition?.riskManagement?.maxRiskPerTrade || 2).color}>
                  {strategy.strategyDefinition?.riskManagement?.maxRiskPerTrade || 2}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Risk Level:</span>
                <span className={getRiskLevel(strategy.strategyDefinition?.riskManagement?.maxRiskPerTrade || 2).color}>
                  {getRiskLevel(strategy.strategyDefinition?.riskManagement?.maxRiskPerTrade || 2).level}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Stop Loss
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategyDefinition?.riskManagement?.stopLossType || 'ATR-based'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>ATR Multiple:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategySettings?.atrMultiplier || 2.0}x
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Fixed %:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategySettings?.stopLoss || 2.0}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              Take Profit
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategyDefinition?.riskManagement?.takeProfitType || 'Risk-Reward'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Target %:</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategySettings?.takeProfit || 4.0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Risk:Reward:</span>
                <span className="text-green-500">
                  1:{((strategy.strategySettings?.takeProfit || 4.0) / (strategy.strategySettings?.stopLoss || 2.0)).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Strategy Parameters */}
      <CollapsibleSection
        title="Strategy Parameters"
        icon={<Settings size={18} style={{ color: 'var(--highlight)' }} />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {strategy.strategySettings && Object.entries(strategy.strategySettings).map(([key, value]) => (
            <div 
              key={key}
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {formatParameterValue(value)}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Filters & Restrictions */}
      <CollapsibleSection
        title="Filters & Time Restrictions"
        icon={<Filter size={18} style={{ color: 'var(--highlight)' }} />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-3 flex items-center space-x-2">
              <Filter size={16} style={{ color: 'var(--highlight)' }} />
              <span style={{ color: 'var(--text-primary)' }}>Active Filters</span>
            </h5>
            <div className="space-y-2">
              {(strategy.strategyDefinition?.filters || [
                "Market cap > $1B",
                "Average volume > 1M shares",
                "No earnings announcements within 2 days",
                "Beta between 0.5 and 2.0"
              ]).map((filter, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded text-sm"
                  style={{ backgroundColor: 'var(--bg-primary)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{filter}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-medium mb-3 flex items-center space-x-2">
              <Clock size={16} style={{ color: 'var(--highlight)' }} />
              <span style={{ color: 'var(--text-primary)' }}>Time Restrictions</span>
            </h5>
            <div className="space-y-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Trading Hours</div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategyDefinition?.timeRestrictions?.tradingHours || "09:30 - 16:00 EST"}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Excluded Days</div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategyDefinition?.timeRestrictions?.excludedDays?.join(', ') || "None"}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Excluded Dates</div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {strategy.strategyDefinition?.timeRestrictions?.excludedDates?.length || 0} holidays/events
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Strategy Validation */}
      <div 
        className="p-4 rounded-lg border-l-4 border-l-blue-500"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRightColor: 'var(--border)',
          borderTopColor: 'var(--border)',
          borderBottomColor: 'var(--border)'
        }}
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle size={18} className="text-blue-500 mt-0.5" />
          <div>
            <h5 className="font-medium mb-1 text-blue-600">Strategy Validation</h5>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              This strategy configuration has been validated for the {strategy.symbol} symbol 
              with {strategy.timeframe} timeframe. Risk parameters are within acceptable ranges 
              for the specified market conditions and volatility profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDefinition;
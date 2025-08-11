import React, { useState, useEffect } from 'react';
import { Users, PieChart, LineChart, Zap, Target, TrendingUp, Settings, Calendar, TrendingDown, Pin, Star, Copy, Download, AlertTriangle, CheckCircle, Clock, Cog, BarChart2, Sliders, Info, Edit, Plus, X, ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import ResizablePanel from './ResizablePanel';
import TabNavigation, { TabItem } from './TabNavigation';
import { usePanelManager } from './PanelManager';
import { AnalyticsContent } from './AnalyticsPanel';

interface SidebarPanelProps {
  strategy?: any; // Replace with proper strategy type
  renderTabContent?: (tabId: string, strategy?: any) => React.ReactNode;
  className?: string;
  activeTimeframe?: string;
  sataScore?: number;
}

const defaultTabs: TabItem[] = [
  { id: 'portfolio', label: 'Portfolio', icon: Users },
  { id: 'stage', label: 'Stage & SATA', icon: PieChart },
  { id: 'indicators', label: 'Indicators', icon: LineChart },
  { id: 'signals', label: 'Signals', icon: TrendingUp },
  { id: 'signalhierarchy', label: 'Signal Hierarchy', icon: Zap },
  { id: 'rules', label: 'Rules', icon: Target },
  { id: 'performance', label: 'Performance', icon: TrendingDown },
  { id: 'dashboard-settings', label: 'Dashboard Settings', icon: Sliders },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'history', label: 'History', icon: Calendar }
];

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  strategy,
  renderTabContent,
  className = '',
  activeTimeframe = '1D',
  sataScore = 8.2
}) => {
  const { leftPanelWidth, leftPanelVisible, setLeftPanelWidth, layoutMode, dashboardSettings, updateDashboardSetting } = usePanelManager();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [combinedMode, setCombinedMode] = useState<'configuration' | 'dashboard'>('configuration');
  
  // Portfolio state management
  const [watchlistInput, setWatchlistInput] = useState('');
  const [watchlistItems, setWatchlistItems] = useState([
    { symbol: strategy?.symbol || 'AAPL', isPrimary: true, allocationPercentage: 10 },
    { symbol: 'TSLA', isPrimary: false, allocationPercentage: 8 },
    { symbol: 'NVDA', isPrimary: true, allocationPercentage: 12 },
    { symbol: 'MSFT', isPrimary: false, allocationPercentage: 9 }
  ]);
  const [portfolioPositions, setPortfolioPositions] = useState([
    { symbol: 'AAPL', shares: 100, avgCost: 145.23, entryDate: '2024-01-15', currentPrice: 158.42, editing: false, allocationPercentage: 15 },
    { symbol: 'TSLA', shares: 50, avgCost: 187.65, entryDate: '2024-02-03', currentPrice: 195.18, editing: false, allocationPercentage: 12 },
    { symbol: 'NVDA', shares: 25, avgCost: 425.80, entryDate: '2024-01-28', currentPrice: 448.92, editing: false, allocationPercentage: 18 }
  ]);
  const [newPortfolioInput, setNewPortfolioInput] = useState({ symbol: '', shares: '', avgCost: '', entryDate: '', allocationPercentage: '' });
  
  const [portfolioSettings, setPortfolioSettings] = useState({
    availableCash: 50000,
    maxPositions: 5,
    positionSizeLimit: 20
  });
  
  // SATA score component states
  const [sataComponents, setSataComponents] = useState({
    stageAnalysis: 2.0,
    atrContext: 2.0,
    trendStrength: 2.5,
    adPressure: 1.7
  });

  // Load saved accordion state from localStorage
  const getSavedAccordionState = () => {
    try {
      const saved = localStorage.getItem('sidebarAccordionState');
      if (saved) {
        return { ...getDefaultAccordionState(), ...JSON.parse(saved) };
      }
    } catch {
      // Ignore localStorage errors
    }
    return getDefaultAccordionState();
  };

  const getDefaultAccordionState = () => ({
    // Indicators tab accordions
    trendIndicators: true,
    volumeIndicators: false,
    volatilityIndicators: false,
    momentumIndicators: false,
    // Performance tab accordions
    returnMetrics: true,
    riskMetrics: false
  });

  // Accordion state management
  const [accordionState, setAccordionState] = useState(getSavedAccordionState());

  // Save accordion state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('sidebarAccordionState', JSON.stringify(accordionState));
    } catch {
      // Ignore localStorage errors
    }
  }, [accordionState]);

  const toggleAccordion = (key: keyof typeof accordionState) => {
    setAccordionState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Technical indicators state
  const [indicators, setIndicators] = useState({
    sma50: true,
    sma150: true,
    sma200: true,
    vwapPeriod: 'intraday',
    vwapDeviation: 1.0,
    volumeProfile: true,
    pocLevels: 5,
    vpLookback: '20',
    cvdThreshold: 0.5,
    atrPeriod: 14,
    atrMultiplier: 2.0,
    bollingerBands: false,
    bollingerPeriod: 20,
    bollingerStdDev: 2,
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    macdEnabled: true,
    macdFast: 12,
    macdSlow: 26,
    macdSignal: 9
  });

  // Performance metrics state
  const [performanceMetrics, setPerformanceMetrics] = useState({
    totalReturn: true,
    annualizedReturn: true,
    sharpeRatio: true,
    maxDrawdown: true,
    winRate: true
  });

  // Settings state
  const [backtestSettings, setBacktestSettings] = useState({
    initialCapital: 100000,
    commission: 5.00,
    slippage: 0.05
  });

  // Helper functions for portfolio management
  const addToWatchlist = () => {
    if (watchlistInput.trim() && !watchlistItems.some(item => item.symbol === watchlistInput.trim().toUpperCase())) {
      setWatchlistItems([...watchlistItems, { 
        symbol: watchlistInput.trim().toUpperCase(), 
        isPrimary: false, 
        allocationPercentage: portfolioSettings.positionSizeLimit 
      }]);
      setWatchlistInput('');
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlistItems(watchlistItems.filter(item => item.symbol !== symbol));
  };

  const togglePrimaryStock = (symbol: string) => {
    setWatchlistItems(watchlistItems.map(item => 
      item.symbol === symbol ? { ...item, isPrimary: !item.isPrimary } : item
    ));
  };

  const updateWatchlistAllocation = (symbol: string, percentage: number) => {
    setWatchlistItems(watchlistItems.map(item => 
      item.symbol === symbol ? { ...item, allocationPercentage: percentage } : item
    ));
  };

  const addNewPortfolioPosition = () => {
    if (newPortfolioInput.symbol.trim() && newPortfolioInput.shares && newPortfolioInput.avgCost && newPortfolioInput.entryDate && newPortfolioInput.allocationPercentage) {
      const newPosition = {
        symbol: newPortfolioInput.symbol.trim().toUpperCase(),
        shares: parseInt(newPortfolioInput.shares) || 0,
        avgCost: parseFloat(newPortfolioInput.avgCost) || 0,
        entryDate: newPortfolioInput.entryDate,
        currentPrice: parseFloat(newPortfolioInput.avgCost) || 0, // Use avg cost as placeholder
        editing: false,
        allocationPercentage: parseFloat(newPortfolioInput.allocationPercentage) || 0
      };
      setPortfolioPositions([...portfolioPositions, newPosition]);
      setNewPortfolioInput({ symbol: '', shares: '', avgCost: '', entryDate: '', allocationPercentage: '' });
    }
  };

  const deletePortfolioPosition = (symbol: string) => {
    setPortfolioPositions(portfolioPositions.filter(pos => pos.symbol !== symbol));
  };


  const calculateCurrentInvestment = (position: any) => {
    return position.shares * position.avgCost;
  };

  const calculateMaxAllocationAmount = (percentage: number) => {
    return (portfolioSettings.availableCash * percentage) / 100;
  };

  const getAllocationStatus = (currentInvestment: number, allocationPercentage: number) => {
    const maxAllocation = calculateMaxAllocationAmount(allocationPercentage);
    const percentage = (currentInvestment / maxAllocation) * 100;
    if (percentage <= 80) return { color: 'text-green-600', status: 'Under Limit', percentage, maxAllocation };
    if (percentage <= 95) return { color: 'text-yellow-600', status: 'Near Limit', percentage, maxAllocation };
    return { color: 'text-red-600', status: 'Over Limit', percentage, maxAllocation };
  };

  const getTotalAllocationPercentage = () => {
    const watchlistTotal = watchlistItems.reduce((sum, item) => sum + item.allocationPercentage, 0);
    const portfolioTotal = portfolioPositions.reduce((sum, pos) => sum + pos.allocationPercentage, 0);
    return watchlistTotal + portfolioTotal;
  };

  const toggleEditPosition = (symbol: string) => {
    setPortfolioPositions(positions => 
      positions.map(pos => 
        pos.symbol === symbol ? { ...pos, editing: !pos.editing } : pos
      )
    );
  };

  const updatePosition = (symbol: string, field: string, value: any) => {
    setPortfolioPositions(positions => 
      positions.map(pos => 
        pos.symbol === symbol ? { ...pos, [field]: value } : pos
      )
    );
  };

  const InfoTooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative inline-block">
      <Info size={12} className="text-gray-400 hover:text-gray-600 cursor-help" />
      <div className="invisible group-hover:visible absolute z-10 w-64 p-2 text-xs rounded-lg shadow-lg -top-2 left-6 transform -translate-y-full"
           style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', border: '1px solid' }}>
        <div style={{ color: 'var(--text-primary)' }}>{text}</div>
      </div>
    </div>
  );

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label?: string }> = ({ checked, onChange, label }) => (
    <div className="flex items-center space-x-3 toggle-switch">
      {label && <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>}
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  const AccordionSection: React.FC<{
    title: string;
    icon?: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }> = ({ title, icon, isExpanded, onToggle, children }) => (
    <div className="border rounded-lg" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-opacity-5 transition-colors min-h-[48px]"
        style={{ backgroundColor: isExpanded ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }}
      >
        <div className="flex items-center space-x-2">
          {icon}
          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{title}</span>
        </div>
        {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
          {children}
        </div>
      )}
    </div>
  );

  const NumberInput: React.FC<{
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    placeholder?: string;
    prefix?: string;
    suffix?: string;
  }> = ({ value, onChange, min = 0, max, step = 1, className = '', placeholder, prefix, suffix }) => {
    const handleIncrement = () => {
      const newValue = Math.min(max ?? Infinity, value + step);
      onChange(newValue);
    };
    
    const handleDecrement = () => {
      const newValue = Math.max(min, value - step);
      onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
      if (!isNaN(inputValue)) {
        const constrainedValue = Math.max(min, Math.min(max ?? Infinity, inputValue));
        onChange(constrainedValue);
      }
    };

    return (
      <div className={`flex items-center ${className}`}>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-opacity-20 hover:bg-blue-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed mr-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronDown size={14} />
        </button>
        <div className="flex items-center border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          {prefix && <span className="px-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            className="text-center border-0 outline-none bg-transparent text-xs px-1 py-1"
            style={{ color: 'var(--text-primary)', width: '40px' }}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
          />
          {suffix && <span className="px-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{suffix}</span>}
        </div>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
          className="flex items-center justify-center w-8 h-8 rounded hover:bg-opacity-20 hover:bg-blue-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ml-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ChevronUp size={14} />
        </button>
      </div>
    );
  };

  const defaultTabContent = (tabId: string, strategy?: any) => {
    switch (tabId) {
      case 'portfolio':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Portfolio Configuration
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Define the assets you want to trade and manage your portfolio allocation.
              </p>
            </div>

            {/* Buy Watchlist */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Target size={16} />
                <span>Buy Watchlist</span>
              </h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add ticker symbol..."
                    value={watchlistInput}
                    onChange={(e) => setWatchlistInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
                    className="flex-1 px-3 py-2 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    onClick={addToWatchlist}
                    className="px-4 py-3 text-sm rounded transition-colors hover:opacity-90 min-h-[44px]"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    Add
                  </button>
                </div>
                
                {/* Current Watchlist */}
                <div className="space-y-2">
                  {watchlistItems.map((item, index) => {
                    
                    return (
                      <div key={`watchlist-${item.symbol}`} className="border rounded" 
                        style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                        
                        {/* Main row */}
                        <div className="flex items-center justify-between p-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.symbol}</span>
                            <button
                              onClick={() => togglePrimaryStock(item.symbol)}
                              className={`text-xs px-2 py-1 rounded transition-colors hover:opacity-80 ${item.isPrimary ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                            >
                              {item.isPrimary ? 'Primary' : 'Watchlist'}
                            </button>
                            <NumberInput
                              value={item.allocationPercentage}
                              onChange={(value) => updateWatchlistAllocation(item.symbol, value)}
                              min={0}
                              max={100}
                              step={0.5}
                              suffix="%"
                              className="w-16 h-[36px]"
                            />
                          </div>
                          <button 
                            onClick={() => removeFromWatchlist(item.symbol)}
                            className="text-red-500 hover:text-red-700 p-2 min-h-[36px] min-w-[36px] rounded transition-colors hover:bg-red-50 flex items-center justify-center"
                            title="Remove from watchlist"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Existing Portfolio (Pro Feature) */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Users size={16} />
                <span>Existing Portfolio</span>
                <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">PRO</span>
              </h4>
              
              {/* Add New Position Form */}
              <div className="mb-4 p-3 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Add New Position</div>
                <div className="space-y-2 mb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Ticker"
                      value={newPortfolioInput.symbol}
                      onChange={(e) => setNewPortfolioInput({...newPortfolioInput, symbol: e.target.value})}
                      className="px-3 py-2 text-sm border rounded"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                    <NumberInput
                      value={parseInt(newPortfolioInput.shares) || 0}
                      onChange={(value) => setNewPortfolioInput({...newPortfolioInput, shares: value.toString()})}
                      min={0}
                      step={1}
                      placeholder="Shares"
                      className="h-[36px]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput
                      value={parseFloat(newPortfolioInput.avgCost) || 0}
                      onChange={(value) => setNewPortfolioInput({...newPortfolioInput, avgCost: value.toString()})}
                      min={0}
                      step={0.01}
                      prefix="$"
                      placeholder="Avg Cost"
                      className="h-[36px]"
                    />
                    <input
                      type="date"
                      value={newPortfolioInput.entryDate}
                      onChange={(e) => setNewPortfolioInput({...newPortfolioInput, entryDate: e.target.value})}
                      className="px-3 py-2 text-sm border rounded"
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <NumberInput
                    value={parseFloat(newPortfolioInput.allocationPercentage) || 0}
                    onChange={(value) => setNewPortfolioInput({...newPortfolioInput, allocationPercentage: value.toString()})}
                    min={0}
                    max={100}
                    step={0.5}
                    suffix="%"
                    placeholder="Allocation %"
                    className="h-[36px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={addNewPortfolioPosition}
                    className="flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors hover:opacity-90 min-h-[44px]"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                  >
                    <Plus size={14} />
                    <span>Add Position</span>
                  </button>
                  {newPortfolioInput.allocationPercentage && (
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      (${calculateMaxAllocationAmount(parseFloat(newPortfolioInput.allocationPercentage) || 0).toLocaleString()} max)
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {portfolioPositions.map((position, index) => {
                  const pnl = ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
                  return (
                    <div key={position.symbol} className="p-3 rounded border" 
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{position.symbol}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%
                          </span>
                          <button
                            onClick={() => toggleEditPosition(position.symbol)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                            title={position.editing ? 'Cancel edit' : 'Edit position'}
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deletePortfolioPosition(position.symbol)}
                            className="text-xs text-red-500 hover:text-red-700"
                            title="Delete position"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                      {position.editing ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block mb-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Shares:</label>
                              <NumberInput
                                value={position.shares}
                                onChange={(value) => updatePosition(position.symbol, 'shares', value)}
                                min={0}
                                step={1}
                                className="w-full h-[32px]"
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Cost:</label>
                              <NumberInput
                                value={position.avgCost}
                                onChange={(value) => updatePosition(position.symbol, 'avgCost', value)}
                                min={0}
                                step={0.01}
                                prefix="$"
                                className="w-full h-[32px]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block mb-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Entry Date:</label>
                              <input
                                type="date"
                                value={position.entryDate}
                                onChange={(e) => updatePosition(position.symbol, 'entryDate', e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Allocation %:</label>
                              <NumberInput
                                value={position.allocationPercentage}
                                onChange={(value) => updatePosition(position.symbol, 'allocationPercentage', value)}
                                min={0}
                                max={100}
                                step={0.5}
                                suffix="%"
                                className="w-full h-[32px]"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <div>Shares: {position.shares}</div>
                            <div>Avg: ${position.avgCost.toFixed(2)}</div>
                            <div>Entry: {position.entryDate}</div>
                          </div>
                          {(() => {
                            const currentInvestment = calculateCurrentInvestment(position);
                            const status = getAllocationStatus(currentInvestment, position.allocationPercentage);
                            return (
                              <div className="flex items-center justify-between text-xs">
                                <span style={{ color: 'var(--text-secondary)' }}>Allocation:</span>
                                <div className="flex items-center space-x-2">
                                  <span style={{ color: 'var(--text-secondary)' }}>
                                    ${currentInvestment.toLocaleString()} / ${status.maxAllocation.toLocaleString()} ({position.allocationPercentage}%)
                                  </span>
                                  <span className={`font-medium ${status.color}`}>
                                    ({status.percentage.toFixed(0)}% used)
                                  </span>
                                </div>
                              </div>
                            );
                          })()} 
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Allocation Summary */}
            <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h4 className="font-medium mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>Total Allocation</h4>
              {(() => {
                const totalPercentage = getTotalAllocationPercentage();
                const isOverAllocated = totalPercentage > 100;
                const remainingPercentage = 100 - totalPercentage;
                return (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Allocated:</span>
                      <span className={`font-medium ${isOverAllocated ? 'text-red-600' : 'text-green-600'}`}>
                        {totalPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Remaining:</span>
                      <span className={`font-medium ${remainingPercentage < 0 ? 'text-red-600' : 'var(--text-primary)'}`} style={{ color: remainingPercentage < 0 ? undefined : 'var(--text-primary)' }}>
                        {remainingPercentage.toFixed(1)}%
                      </span>
                    </div>
                    {isOverAllocated && (
                      <div className="text-red-600 text-xs mt-1">
                        ⚠️ Over-allocated by {(totalPercentage - 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                );
              })()} 
            </div>

            {/* Portfolio Settings */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Portfolio Settings</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Available Cash:</span>
                  <NumberInput 
                    value={portfolioSettings.availableCash} 
                    onChange={(value) => setPortfolioSettings({...portfolioSettings, availableCash: Math.round(value)})}
                    min={0}
                    step={1000}
                    prefix="$"
                    className="w-24"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Max Positions:</span>
                  <NumberInput 
                    value={portfolioSettings.maxPositions} 
                    onChange={(value) => setPortfolioSettings({...portfolioSettings, maxPositions: Math.round(value)})}
                    min={1}
                    max={50}
                    step={1}
                    className="w-16"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Default Position Size:</span>
                  <div className="flex items-center space-x-1">
                    <NumberInput 
                      value={portfolioSettings.positionSizeLimit} 
                      onChange={(value) => setPortfolioSettings({...portfolioSettings, positionSizeLimit: Math.round(value)})}
                      min={1}
                      max={100}
                      step={1}
                      className="w-16"
                    />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>% of portfolio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'stage':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Stage & SATA Configuration
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Configure Weinstein stage detection and SATA score calculation parameters.
              </p>
            </div>

            {/* Current SATA Score Display */}
            <div className="p-4 rounded-lg border text-center" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--highlight)' }}>8.2</div>
              <div className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current SATA Score</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>High Probability Setup</div>
            </div>

            {/* SATA Score Breakdown */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>SATA Score Components</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Stage Analysis</span>
                    <InfoTooltip text="Weinstein stage weighting - Stage 2 (advancing) gets highest score, Stage 4 (declining) gets lowest. Measures current market stage strength." />
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Current stage weighting</div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="4" 
                      step="0.1" 
                      value={sataComponents.stageAnalysis}
                      onChange={(e) => setSataComponents({...sataComponents, stageAnalysis: parseFloat(e.target.value)})}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${(sataComponents.stageAnalysis / 4) * 100}%, #e5e7eb ${(sataComponents.stageAnalysis / 4) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="font-semibold text-green-600 w-10 text-right">{sataComponents.stageAnalysis.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>ATR Context</span>
                    <InfoTooltip text="Average True Range context - measures price volatility adjustment. Higher ATR means more risk, lower score. Helps size positions appropriately." />
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Volatility consideration</div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="4" 
                      step="0.1" 
                      value={sataComponents.atrContext}
                      onChange={(e) => setSataComponents({...sataComponents, atrContext: parseFloat(e.target.value)})}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${(sataComponents.atrContext / 4) * 100}%, #e5e7eb ${(sataComponents.atrContext / 4) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="font-semibold text-orange-600 w-10 text-right">{sataComponents.atrContext.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Trend Strength</span>
                    <InfoTooltip text="Momentum and directional strength measurement. Combines price action, moving averages, and momentum indicators to gauge trend quality." />
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Momentum and direction</div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="4" 
                      step="0.1" 
                      value={sataComponents.trendStrength}
                      onChange={(e) => setSataComponents({...sataComponents, trendStrength: parseFloat(e.target.value)})}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
                      style={{
                        background: `linear-gradient(to right, #10b981 0%, #10b981 ${(sataComponents.trendStrength / 4) * 100}%, #e5e7eb ${(sataComponents.trendStrength / 4) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="font-semibold text-green-600 w-10 text-right">{sataComponents.trendStrength.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>A/D Pressure</span>
                    <InfoTooltip text="Accumulation/Distribution pressure - measures institutional buying vs selling flow. Higher values indicate stronger accumulation by smart money." />
                  </div>
                  <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Accumulation/Distribution</div>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="3" 
                      step="0.1" 
                      value={sataComponents.adPressure}
                      onChange={(e) => setSataComponents({...sataComponents, adPressure: parseFloat(e.target.value)})}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" 
                      style={{
                        background: `linear-gradient(to right, #eab308 0%, #eab308 ${(sataComponents.adPressure / 3) * 100}%, #e5e7eb ${(sataComponents.adPressure / 3) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="font-semibold text-yellow-600 w-10 text-right">{sataComponents.adPressure.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'dashboard-settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Dashboard Settings
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Configure which analytics appear in your dashboard
              </p>
            </div>

            {/* Strategy Analytics Section */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <BarChart2 size={16} />
                <span>Strategy Analytics</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Strategy Evolution</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Version comparison & improvements</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.strategyEvolution}
                      onChange={(e) => updateDashboardSetting('strategyEvolution', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>SATA Score Visualization</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Dots display & quick metrics</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.sataScore}
                      onChange={(e) => updateDashboardSetting('sataScore', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Performance Trend Chart</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Historical performance graph</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.performanceTrend}
                      onChange={(e) => updateDashboardSetting('performanceTrend', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Market Signals Section */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={16} />
                <span>Market Signals</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>RSI Momentum</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>RSI indicator signals</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.rsiSignal}
                      onChange={(e) => updateDashboardSetting('rsiSignal', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>VWAP Support</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Volume weighted price levels</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.vwapSignal}
                      onChange={(e) => updateDashboardSetting('vwapSignal', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>CVD Analysis</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Cumulative volume delta</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.cvdSignal}
                      onChange={(e) => updateDashboardSetting('cvdSignal', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Moving Averages</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>50 & 150 SMA signals</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.movingAverageSignal}
                      onChange={(e) => updateDashboardSetting('movingAverageSignal', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Target size={16} />
                <span>Recommendations</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Trading Recommendations</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>AI-powered trade suggestions</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={dashboardSettings.recommendations}
                      onChange={(e) => updateDashboardSetting('recommendations', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'signals':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Active Signals & Recommendations
            </h3>
            
            {/* Current Stage */}
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>Current Stage</h4>
              <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                <div>
                  <div className="font-medium text-green-700">Stage 2: Advancing</div>
                  <div className="text-xs text-green-600">Strong uptrend confirmed</div>
                </div>
              </div>
            </div>

            {/* Active Signals */}
            <div className="space-y-2 text-sm">
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Active Signals</h4>
              <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span style={{ color: 'var(--text-primary)' }}>RSI Momentum</span>
                </div>
                <span className="text-green-500 font-medium">BUY</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-500" />
                  <span style={{ color: 'var(--text-primary)' }}>VWAP Support</span>
                </div>
                <span className="text-green-500 font-medium">HOLD</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={14} className="text-yellow-500" />
                  <span style={{ color: 'var(--text-primary)' }}>CVD Divergence</span>
                </div>
                <span className="text-yellow-500 font-medium">WATCH</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 text-sm">
              <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Recommendations</h4>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Primary Action</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Add to position on VWAP pullback. Target: 5% above current levels.</p>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-2 mb-1">
                  <Clock size={14} style={{ color: 'var(--highlight)' }} />
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Risk Management</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Set stop-loss at 2.5x ATR below VWAP support level.</p>
              </div>
            </div>
          </div>
        );
      
      case 'indicators':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Technical Indicators Configuration
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Configure all technical indicators used in your trading strategy.
              </p>
            </div>

            {/* Trend Indicators */}
            <div className="space-y-3">
              <h4 className="flex items-center space-x-2 font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={16} />
                <span>Trend Indicators</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Simple Moving Averages</span>
                      <InfoTooltip text="Simple Moving Averages smooth price data to identify trend direction. 50 SMA for short-term, 150/200 SMA for long-term trends. Price above SMA indicates uptrend." />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <ToggleSwitch 
                      label="50 SMA" 
                      checked={indicators.sma50}
                      onChange={(checked) => setIndicators({...indicators, sma50: checked})}
                    />
                    <ToggleSwitch 
                      label="150 SMA" 
                      checked={indicators.sma150}
                      onChange={(checked) => setIndicators({...indicators, sma150: checked})}
                    />
                    <ToggleSwitch 
                      label="200 SMA" 
                      checked={indicators.sma200}
                      onChange={(checked) => setIndicators({...indicators, sma200: checked})}
                    />
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>VWAP</span>
                      <InfoTooltip text="Volume Weighted Average Price - institutional benchmark price level. Price above VWAP indicates institutional support. Used for entry/exit timing." />
                    </div>
                    <span className="text-sm font-medium text-blue-600">$158.34</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <select 
                        value={indicators.vwapPeriod}
                        onChange={(e) => setIndicators({...indicators, vwapPeriod: e.target.value})}
                        className="w-16 px-1 text-xs border rounded" 
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        <option value="intraday">Intraday</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Deviation:</span>
                      <NumberInput 
                        value={indicators.vwapDeviation} 
                        onChange={(value) => setIndicators({...indicators, vwapDeviation: value})}
                        min={0}
                        step={0.1}
                        className="w-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volume Indicators */}
            <div className="space-y-3">
              <h4 className="flex items-center space-x-2 font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <LineChart size={16} />
                <span>Volume Indicators</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Volume Profile</span>
                      <InfoTooltip text="Volume Profile shows where most volume was traded at specific price levels. POC (Point of Control) is highest volume price level - acts as support/resistance." />
                    </div>
                    <ToggleSwitch
                      checked={indicators.volumeProfile}
                      onChange={(checked) => setIndicators({...indicators, volumeProfile: checked})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>POC Levels:</span>
                      <NumberInput 
                        value={indicators.pocLevels} 
                        onChange={(value) => setIndicators({...indicators, pocLevels: Math.round(value)})}
                        min={1}
                        max={20}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Lookback:</span>
                      <select 
                        value={indicators.vpLookback}
                        onChange={(e) => setIndicators({...indicators, vpLookback: e.target.value})}
                        className="w-16 px-1 text-xs border rounded" 
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                      >
                        <option value="20">20d</option>
                        <option value="50">50d</option>
                        <option value="100">100d</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>CVD</span>
                      <InfoTooltip text="Cumulative Volume Delta - measures buying vs selling pressure. Positive CVD = more buying, negative = more selling. Divergences signal potential reversals." />
                    </div>
                    <span className="text-sm font-medium text-yellow-600">+1.2M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Threshold:</span>
                      <NumberInput 
                        value={indicators.cvdThreshold} 
                        onChange={(value) => setIndicators({...indicators, cvdThreshold: value})}
                        min={0}
                        step={0.1}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>OBV (On-Balance Volume)</span>
                    <span className="text-sm font-medium text-green-600">+85.2M</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center space-x-1">
                      <TrendingUp size={10} className="text-green-500" />
                      <span className="text-green-500">Trend Confirming</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Volatility Indicators */}
            <div className="space-y-3">
              <h4 className="flex items-center space-x-2 font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle size={16} />
                <span>Volatility Indicators</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>ATR</span>
                      <InfoTooltip text="Average True Range - measures price volatility over time. Used for position sizing and stop-loss placement. Higher ATR = more volatile stock." />
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--highlight)' }}>2.34</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <NumberInput 
                        value={indicators.atrPeriod} 
                        onChange={(value) => setIndicators({...indicators, atrPeriod: Math.round(value)})}
                        min={1}
                        max={100}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Multiplier:</span>
                      <NumberInput 
                        value={indicators.atrMultiplier} 
                        onChange={(value) => setIndicators({...indicators, atrMultiplier: value})}
                        min={0.1}
                        max={10}
                        step={0.1}
                        className="w-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Bollinger Bands</span>
                    <ToggleSwitch
                      checked={indicators.bollingerBands}
                      onChange={(checked) => setIndicators({...indicators, bollingerBands: checked})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <NumberInput 
                        value={indicators.bollingerPeriod}
                        onChange={(value) => setIndicators({...indicators, bollingerPeriod: Math.round(value)})}
                        min={2}
                        max={100}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Std Dev:</span>
                      <NumberInput 
                        value={indicators.bollingerStdDev}
                        onChange={(value) => setIndicators({...indicators, bollingerStdDev: value})}
                        min={0.1}
                        max={5}
                        step={0.1}
                        className="w-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Momentum Indicators */}
            <div className="space-y-3">
              <h4 className="flex items-center space-x-2 font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <Target size={16} />
                <span>Momentum Indicators</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>RSI</span>
                      <InfoTooltip text="Relative Strength Index - momentum oscillator (0-100). Values >70 indicate overbought, <30 oversold. Used for entry/exit timing and divergences." />
                    </div>
                    <span className="text-sm font-medium text-green-600">64.2</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Period:</span>
                      <NumberInput 
                        value={indicators.rsiPeriod} 
                        onChange={(value) => setIndicators({...indicators, rsiPeriod: Math.round(value)})}
                        min={2}
                        max={100}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Overbought:</span>
                      <NumberInput 
                        value={indicators.rsiOverbought} 
                        onChange={(value) => setIndicators({...indicators, rsiOverbought: Math.round(value)})}
                        min={50}
                        max={100}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Oversold:</span>
                      <NumberInput 
                        value={indicators.rsiOversold} 
                        onChange={(value) => setIndicators({...indicators, rsiOversold: Math.round(value)})}
                        min={0}
                        max={50}
                        step={1}
                        className="w-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>MACD</span>
                    <ToggleSwitch
                      checked={indicators.macdEnabled}
                      onChange={(checked) => setIndicators({...indicators, macdEnabled: checked})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Fast:</span>
                      <NumberInput 
                        value={indicators.macdFast}
                        onChange={(value) => setIndicators({...indicators, macdFast: Math.round(value)})}
                        min={1}
                        max={50}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Slow:</span>
                      <NumberInput 
                        value={indicators.macdSlow}
                        onChange={(value) => setIndicators({...indicators, macdSlow: Math.round(value)})}
                        min={1}
                        max={100}
                        step={1}
                        className="w-12"
                      />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Signal:</span>
                      <NumberInput 
                        value={indicators.macdSignal}
                        onChange={(value) => setIndicators({...indicators, macdSignal: Math.round(value)})}
                        min={1}
                        max={50}
                        step={1}
                        className="w-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'rules':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Trading Rules
            </h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Entry Conditions</div>
                <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Stage 2 confirmation</li>
                  <li>• SATA score &gt; 7.0</li>
                  <li>• Price above VWAP</li>
                  <li>• RSI 50-70 range</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Exit Conditions</div>
                <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• Stage transition to 3</li>
                  <li>• 2.5x ATR stop-loss</li>
                  <li>• RSI divergence</li>
                  <li>• CVD negative flow</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                <div className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Position Management</div>
                <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <li>• 2% max risk per trade</li>
                  <li>• ATR-based position sizing</li>
                  <li>• Add on VWAP pullbacks</li>
                  <li>• Trim at 20% extension</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'signalhierarchy':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Signal Hierarchy & Conditional Rules
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Configure indicator hierarchies and conditional rules for entry/exit signals.
              </p>
            </div>

            {/* Signal Priority Hierarchy */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Zap size={16} />
                <span>Signal Priority Hierarchy</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Primary Signal</span>
                    <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <option value="stage">Weinstein Stage</option>
                      <option value="sata">SATA Score</option>
                      <option value="momentum">Momentum</option>
                    </select>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Highest priority signal for trade decisions
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Secondary Signal</span>
                    <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <option value="rsi">RSI</option>
                      <option value="vwap">VWAP</option>
                      <option value="volume">Volume</option>
                    </select>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Confirmation signal for entries
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Filter Signal</span>
                    <select className="px-2 py-1 text-sm border rounded" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <option value="atr">ATR Context</option>
                      <option value="volume">Volume Profile</option>
                      <option value="trend">Trend Filter</option>
                    </select>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Additional filter for trade quality
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Performance Metrics Configuration
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Select which performance metrics to track and monitor during backtesting.
              </p>
            </div>

            {/* Return Metrics */}
            <div className="space-y-3">
              <h4 className="flex items-center space-x-2 font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={16} />
                <span>Return Metrics</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Total Return</span>
                        <InfoTooltip text="Total percentage return of the strategy from start to end date. Shows overall profitability before considering risk or time factors." />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Overall strategy performance</div>
                    </div>
                    <ToggleSwitch
                      checked={performanceMetrics.totalReturn}
                      onChange={(checked) => setPerformanceMetrics({...performanceMetrics, totalReturn: checked})}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Annualized Return</span>
                        <InfoTooltip text="Yearly compound return rate - shows how much the strategy would return if compounded annually. Better for comparing strategies over different time periods." />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yearly compound return rate</div>
                    </div>
                    <ToggleSwitch
                      checked={performanceMetrics.annualizedReturn}
                      onChange={(checked) => setPerformanceMetrics({...performanceMetrics, annualizedReturn: checked})}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Sharpe Ratio</span>
                        <InfoTooltip text="Risk-adjusted return metric. Values >1.0 are good, >1.5 excellent, >2.0 outstanding. Higher values mean better return per unit of risk taken." />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Risk-adjusted return measure</div>
                    </div>
                    <ToggleSwitch
                      checked={performanceMetrics.sharpeRatio}
                      onChange={(checked) => setPerformanceMetrics({...performanceMetrics, sharpeRatio: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div className="space-y-3">
              <h4 className="flex items-center space-x-2 font-medium text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                <TrendingDown size={16} />
                <span>Risk Analysis Metrics</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Maximum Drawdown</span>
                        <InfoTooltip text="Largest peak-to-trough decline in portfolio value. Lower is better. Shows worst-case scenario loss you must be prepared to handle." />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Largest peak-to-trough decline</div>
                    </div>
                    <ToggleSwitch
                      checked={performanceMetrics.maxDrawdown}
                      onChange={(checked) => setPerformanceMetrics({...performanceMetrics, maxDrawdown: checked})}
                    />
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Win Rate</span>
                        <InfoTooltip text="Percentage of profitable trades. Higher is generally better, but not as important as risk/reward ratio. 40-60% is typical for good strategies." />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Percentage of profitable trades</div>
                    </div>
                    <ToggleSwitch
                      checked={performanceMetrics.winRate}
                      onChange={(checked) => setPerformanceMetrics({...performanceMetrics, winRate: checked})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Backtest Run History
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Track different backtest runs when you change settings and rerun the strategy.
              </p>
            </div>

            {/* Pinned Runs */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Pin size={16} />
                <span>Pinned Runs</span>
              </h4>
              <div className="space-y-2">
                {[
                  { 
                    id: 'run-001', 
                    name: 'Optimized Settings v2.1', 
                    date: '2025-01-30', 
                    return: 24.3, 
                    sharpe: 1.85, 
                    maxDD: -8.2, 
                    settings: 'ATR: 2.5x, RSI: 14, CVD: 0.7',
                    isPinned: true,
                    isBaseline: true
                  },
                  { 
                    id: 'run-002', 
                    name: 'Conservative Settings', 
                    date: '2025-01-28', 
                    return: 18.7, 
                    sharpe: 2.12, 
                    maxDD: -5.4, 
                    settings: 'ATR: 2.0x, RSI: 14, CVD: 0.5',
                    isPinned: true,
                    isBaseline: false
                  }
                ].map((run) => (
                  <div 
                    key={run.id}
                    className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                    style={{ 
                      backgroundColor: run.isBaseline ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-primary)', 
                      borderColor: run.isBaseline ? 'var(--accent)' : 'var(--border)',
                      borderWidth: run.isBaseline ? '2px' : '1px'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                            {run.name}
                          </span>
                          {run.isBaseline && (
                            <span className="flex items-center space-x-1 text-xs px-1.5 py-0.5 rounded" 
                                  style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
                              <Star size={10} />
                              <span>BASELINE</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {run.date} • {run.settings}
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="text-center">
                            <div className={`font-medium ${run.return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {run.return >= 0 ? '+' : ''}{run.return}%
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>Return</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                              {run.sharpe}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-red-600">
                              {run.maxDD}%
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>Max DD</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        <button 
                          className="p-1 rounded hover:bg-opacity-50 transition-colors"
                          style={{ color: 'var(--accent)' }}
                          title="Unpin run"
                        >
                          <Pin size={12} />
                        </button>
                        <button 
                          className="p-1 rounded hover:bg-opacity-50 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Duplicate settings"
                        >
                          <Copy size={12} />
                        </button>
                        <button 
                          className="p-1 rounded hover:bg-opacity-50 transition-colors"
                          style={{ color: 'var(--text-secondary)' }}
                          title="Export run"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Backtest Execution Settings
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Configure final settings and execute the backtest with your current configuration.
              </p>
            </div>

            {/* Execution Parameters */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <Settings size={16} />
                <span>Execution Parameters</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Initial Capital:</span>
                      <InfoTooltip text="Starting cash amount for the backtest. Determines position sizes and maximum portfolio value. Should reflect your actual trading capital." />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">$</span>
                      <NumberInput 
                        value={backtestSettings.initialCapital} 
                        onChange={(value) => setBacktestSettings({...backtestSettings, initialCapital: Math.round(value)})}
                        min={1000}
                        step={1000}
                        prefix="$"
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Commission per Trade:</span>
                      <InfoTooltip text="Fixed cost per trade execution (buy or sell). Includes broker fees. Use $0 for commission-free brokers, or actual commission structure." />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">$</span>
                      <NumberInput 
                        value={backtestSettings.commission} 
                        onChange={(value) => setBacktestSettings({...backtestSettings, commission: value})}
                        min={0}
                        step={0.01}
                        prefix="$"
                        className="w-16" 
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Slippage:</span>
                      <InfoTooltip text="Price difference between expected and actual execution. Accounts for market impact and bid-ask spread. Higher for illiquid stocks." />
                    </div>
                    <div className="flex items-center space-x-1">
                      <NumberInput 
                        value={backtestSettings.slippage} 
                        onChange={(value) => setBacktestSettings({...backtestSettings, slippage: value})}
                        min={0}
                        max={1}
                        step={0.01}
                        suffix="%"
                        className="w-16" 
                      />
                      <span className="text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Backtest Button */}
            <div className="pt-4">
              <button
                className="w-full py-4 px-4 rounded-lg font-medium transition-colors min-h-[52px]"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                Run Backtest
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {defaultTabs.find(tab => tab.id === tabId)?.label || 'Tab Content'}{strategy ? ` - ${strategy.name}` : ''}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Content for {tabId} tab would go here.
            </p>
          </div>
        );
    }
  };

  const renderCombinedModeToggle = () => (
    <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => setCombinedMode('configuration')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1`}
          style={{
            backgroundColor: combinedMode === 'configuration' ? 'var(--accent)' : 'var(--surface)',
            color: combinedMode === 'configuration' ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: `1px solid ${combinedMode === 'configuration' ? 'var(--accent)' : 'var(--border)'}`
          }}
        >
          <Cog size={16} />
          <span>Configuration</span>
        </button>
        <button
          onClick={() => setCombinedMode('dashboard')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1`}
          style={{
            backgroundColor: combinedMode === 'dashboard' ? 'var(--accent)' : 'var(--surface)',
            color: combinedMode === 'dashboard' ? 'var(--bg-primary)' : 'var(--text-primary)',
            border: `1px solid ${combinedMode === 'dashboard' ? 'var(--accent)' : 'var(--border)'}`
          }}
        >
          <BarChart2 size={16} />
          <span>Dashboard</span>
        </button>
      </div>
      
      {combinedMode === 'configuration' && (
        <TabNavigation
          tabs={defaultTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orientation="vertical"
        />
      )}
    </div>
  );

  const renderSeparateModeHeader = () => (
    <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
      <TabNavigation
        tabs={defaultTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        orientation="vertical"
      />
    </div>
  );

  const renderContent = () => {
    if (layoutMode === 'combined') {
      if (combinedMode === 'dashboard') {
        return (
          <div className="flex-1 p-4">
            <AnalyticsContent 
              strategy={strategy}
              sataScore={sataScore}
              activeTimeframe={activeTimeframe}
              settings={dashboardSettings}
            />
          </div>
        );
      } else {
        return (
          <div className="flex-1 p-4">
            {renderTabContent ? renderTabContent(activeTab, strategy) : defaultTabContent(activeTab, strategy)}
          </div>
        );
      }
    } else {
      return (
        <div className="flex-1 p-4">
          {renderTabContent ? renderTabContent(activeTab, strategy) : defaultTabContent(activeTab, strategy)}
        </div>
      );
    }
  };

  return (
    <>
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
        .toggle-switch {
          min-height: 44px;
          min-width: 44px;
        }
      `}</style>
      <ResizablePanel
        position="left"
        size={leftPanelWidth}
        visible={leftPanelVisible}
        onResize={setLeftPanelWidth}
        className={`sidebar-panel ${className}`}
      >
      {/* Header: Combined mode toggle or regular tabs */}
      {layoutMode === 'combined' ? renderCombinedModeToggle() : renderSeparateModeHeader()}

      {/* Content */}
      {renderContent()}
      </ResizablePanel>
    </>
  );
};

export default SidebarPanel;
import React, { useState } from 'react';
import { Users, PieChart, LineChart, Zap, Target, TrendingUp, Settings, Calendar, TrendingDown, Pin, Star, Copy, Download } from 'lucide-react';
import ResizablePanel from './ResizablePanel';
import TabNavigation, { TabItem } from './TabNavigation';
import { usePanelManager } from './PanelManager';

interface SidebarPanelProps {
  strategy?: any; // Replace with proper strategy type
  renderTabContent?: (tabId: string, strategy?: any) => React.ReactNode;
  className?: string;
}

const defaultTabs: TabItem[] = [
  { id: 'portfolio', label: 'Portfolio', icon: Users },
  { id: 'stage', label: 'Stage & SATA', icon: PieChart },
  { id: 'indicators', label: 'Indicators', icon: LineChart },
  { id: 'signalhierarchy', label: 'Signal Hierarchy', icon: Zap },
  { id: 'rules', label: 'Rules', icon: Target },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'history', label: 'History', icon: Calendar }
];

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  strategy,
  renderTabContent,
  className = ''
}) => {
  const { leftPanelWidth, leftPanelVisible, setLeftPanelWidth } = usePanelManager();
  const [activeTab, setActiveTab] = useState('portfolio');

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
                    className="flex-1 px-3 py-2 text-sm border rounded"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    className="px-4 py-2 text-sm rounded transition-colors"
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
                  {[strategy?.symbol || 'AAPL', 'TSLA', 'NVDA', 'MSFT'].filter((symbol, index, arr) => arr.indexOf(symbol) === index).map((symbol, index) => (
                    <div key={`watchlist-${symbol}`} className="flex items-center justify-between p-2 rounded border" 
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{symbol}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${symbol === strategy?.symbol ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {symbol === strategy?.symbol ? 'Primary' : 'Watchlist'}
                        </span>
                      </div>
                      <button className="text-xs text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Settings */}
            <div>
              <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Portfolio Settings</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Available Cash:</span>
                  <input type="number" defaultValue="50000" className="w-24 px-2 py-1 text-sm border rounded" 
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Max Positions:</span>
                  <input type="number" defaultValue="5" className="w-16 px-2 py-1 text-sm border rounded" 
                    style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Position Size Limit:</span>
                  <div className="flex items-center space-x-1">
                    <input type="number" defaultValue="20" className="w-16 px-2 py-1 text-sm border rounded" 
                      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
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
                <div className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Stage Analysis</span>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current stage weighting</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600">2.0</span>
                    <input type="range" min="0" max="4" step="0.1" defaultValue="2.0" className="w-16" />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Technical Setup</span>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Indicator confluence</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600">1.8</span>
                    <input type="range" min="0" max="3" step="0.1" defaultValue="1.8" className="w-16" />
                  </div>
                </div>
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
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={16} />
                <span>Trend Indicators</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Simple Moving Averages</span>
                    <button className="text-xs px-2 py-1 rounded border hover:bg-opacity-50" 
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Configure</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>50 SMA:</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>150 SMA:</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>200 SMA:</span>
                      <input type="checkbox" defaultChecked className="rounded" />
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
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={16} />
                <span>Return Metrics</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Total Return</span>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Overall strategy performance</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Annualized Return</span>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yearly compound return rate</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Sharpe Ratio</span>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Risk-adjusted return measure</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                <TrendingDown size={16} />
                <span>Risk Analysis Metrics</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Maximum Drawdown</span>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Largest peak-to-trough decline</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>Win Rate</span>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Percentage of profitable trades</div>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
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
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Initial Capital:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">$</span>
                      <input type="number" defaultValue="100000" className="w-20 px-2 py-1 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Commission per Trade:</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs">$</span>
                      <input type="number" defaultValue="5.00" step="0.01" className="w-16 px-2 py-1 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Slippage:</span>
                    <div className="flex items-center space-x-1">
                      <input type="number" defaultValue="0.05" step="0.01" className="w-16 px-2 py-1 text-sm border rounded" 
                        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <span className="text-xs">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Backtest Button */}
            <div className="pt-4">
              <button
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
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

  return (
    <ResizablePanel
      position="left"
      size={leftPanelWidth}
      visible={leftPanelVisible}
      onResize={setLeftPanelWidth}
      className={className}
    >
      {/* Sidebar Tabs */}
      <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <TabNavigation
          tabs={defaultTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orientation="vertical"
        />
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent ? renderTabContent(activeTab, strategy) : defaultTabContent(activeTab, strategy)}
      </div>
    </ResizablePanel>
  );
};

export default SidebarPanel;
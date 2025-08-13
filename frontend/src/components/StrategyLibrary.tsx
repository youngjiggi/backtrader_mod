import React, { useState } from 'react';
import { ArrowLeft, Play, Edit, Trash2, Plus, Save, Settings, Grid, List, Search, TrendingUp, TrendingDown, Minus, Star, Heart, Circle, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useStrategy, StrategyTemplate } from '../contexts/StrategyContext';
import Modal from './Modal';
import StrategyFormModal from './StrategyFormModal';
import InlineEditableTitle from './InlineEditableTitle';
import TagEditor from './TagEditor';

interface StrategyLibraryProps {
  onBack: () => void;
  onRunStrategy?: (strategy: StrategyTemplate, symbol: string) => void;
}

type ViewMode = 'cards' | 'table';
type SortOption = 'name' | 'performance' | 'winRate' | 'created' | 'updated';
type SortDirection = 'asc' | 'desc';

const StrategyLibrary: React.FC<StrategyLibraryProps> = ({ onBack, onRunStrategy }) => {
  const { strategies, deleteStrategy, addStrategy, updateStrategy } = useStrategy();
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyTemplate | null>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runSymbol, setRunSymbol] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<StrategyTemplate | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframeFilter, setTimeframeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>([]);

  const handleRunStrategy = (strategy: StrategyTemplate) => {
    setSelectedStrategy(strategy);
    setIsRunModalOpen(true);
    setRunSymbol('');
  };

  const handleConfirmRun = () => {
    if (selectedStrategy && runSymbol && onRunStrategy) {
      onRunStrategy(selectedStrategy, runSymbol);
    }
    setIsRunModalOpen(false);
    setSelectedStrategy(null);
  };

  const handleDeleteStrategy = (id: string) => {
    if (confirm('Are you sure you want to delete this strategy?')) {
      deleteStrategy(id);
    }
  };

  const handleEditStrategy = (strategy: StrategyTemplate) => {
    setEditingStrategy(strategy);
    setIsEditModalOpen(true);
  };

  const handleCreateStrategy = () => {
    setEditingStrategy(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateStrategyName = (strategyId: string, newName: string) => {
    updateStrategy(strategyId, { name: newName, updatedAt: new Date().toISOString() });
  };

  const handleUpdateStrategyTags = (strategyId: string, newTags: string[]) => {
    updateStrategy(strategyId, { tags: newTags, updatedAt: new Date().toISOString() });
  };

  // Helper functions for performance display
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp size={14} className="text-green-500" />;
      case 'down': return <TrendingDown size={14} className="text-red-500" />;
      case 'stable': return <Minus size={14} className="text-yellow-500" />;
      default: return null;
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Healthy';
    if (score >= 60) return 'Warning';
    return 'Needs Attention';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return '#10b981';
    if (winRate >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'paused': return '#f59e0b';
      case 'archived': return '#6b7280';
      case 'draft': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  // Bulk operations handlers
  const handleSelectAll = () => {
    if (selectedStrategyIds.length === sortedStrategies.length) {
      setSelectedStrategyIds([]);
    } else {
      setSelectedStrategyIds(sortedStrategies.map(s => s.id));
    }
  };

  const handleSelectStrategy = (strategyId: string) => {
    setSelectedStrategyIds(prev => 
      prev.includes(strategyId) 
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedStrategyIds.length} strategies?`)) {
      selectedStrategyIds.forEach(id => deleteStrategy(id));
      setSelectedStrategyIds([]);
    }
  };

  const handleBulkDuplicate = () => {
    selectedStrategyIds.forEach(id => {
      const strategy = strategies.find(s => s.id === id);
      if (strategy) {
        handleDuplicateStrategy(strategy);
      }
    });
    setSelectedStrategyIds([]);
  };

  const handleDuplicateStrategy = (strategy: StrategyTemplate) => {
    const duplicate = {
      name: `${strategy.name} (Copy)`,
      description: strategy.description,
      symbol: strategy.symbol,
      timeframe: strategy.timeframe,
      atrPeriod: strategy.atrPeriod,
      atrMultiplier: strategy.atrMultiplier,
      cvdThreshold: strategy.cvdThreshold,
      profileBins: [...strategy.profileBins],
      relativeVolume: strategy.relativeVolume,
      atrTrim: strategy.atrTrim,
      phaseId: strategy.phaseId,
      tags: [...strategy.tags]
    };
    addStrategy(duplicate);
  };

  // Sort function
  const sortStrategies = (strategies: StrategyTemplate[]) => {
    return [...strategies].sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'performance':
          const aReturn = a.performance?.totalReturn || 0;
          const bReturn = b.performance?.totalReturn || 0;
          compareValue = aReturn - bReturn;
          break;
        case 'winRate':
          const aWinRate = a.performance?.winRate || 0;
          const bWinRate = b.performance?.winRate || 0;
          compareValue = aWinRate - bWinRate;
          break;
        case 'created':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
          compareValue = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          break;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  };

  // Filter and sort strategies
  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = !searchTerm || 
      strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTimeframe = timeframeFilter === 'all' || strategy.timeframe === timeframeFilter;
    
    return matchesSearch && matchesTimeframe;
  });

  const sortedStrategies = sortStrategies(filteredStrategies);

  // Group strategies for display
  const recentStrategies = sortedStrategies.filter(s => {
    const daysSinceUpdate = (Date.now() - new Date(s.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate <= 7;
  }).slice(0, 3);

  const favoriteStrategies = sortedStrategies.filter(s => s.isFavorite);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Modern Minimal Header */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="p-2 rounded-lg border transition-colors hover:bg-opacity-80"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-light tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Strategy Library
                </h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Manage and organize your trading strategies
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center border rounded-lg p-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded transition-colors ${viewMode === 'cards' ? 'shadow-sm' : ''}`}
                  style={{
                    backgroundColor: viewMode === 'cards' ? 'var(--accent)' : 'transparent',
                    color: viewMode === 'cards' ? 'var(--bg-primary)' : 'var(--text-primary)'
                  }}
                  title="Card View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'shadow-sm' : ''}`}
                  style={{
                    backgroundColor: viewMode === 'table' ? 'var(--accent)' : 'transparent',
                    color: viewMode === 'table' ? 'var(--bg-primary)' : 'var(--text-primary)'
                  }}
                  title="Table View"
                >
                  <List size={16} />
                </button>
              </div>
              
              <button
                onClick={handleCreateStrategy}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                <Plus size={16} />
                <span>New Strategy</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search strategies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              />
            </div>
            
            <select
              value={timeframeFilter}
              onChange={(e) => setTimeframeFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            >
              <option value="all">All Timeframes</option>
              <option value="1m">1 Minute</option>
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="4h">4 Hours</option>
              <option value="1d">Daily</option>
              <option value="1w">Weekly</option>
            </select>

            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                <option value="updated">Last Updated</option>
                <option value="name">Name</option>
                <option value="performance">Performance</option>
                <option value="winRate">Win Rate</option>
                <option value="created">Date Created</option>
              </select>
              
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-2 border rounded-lg transition-colors hover:bg-opacity-80"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)'
                }}
                title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown size={16} className={sortDirection === 'desc' ? 'transform rotate-180' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Recent Strategies Section */}
        {!searchTerm && timeframeFilter === 'all' && recentStrategies.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Recent Strategies
              </h2>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Updated within 7 days
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentStrategies.map((strategy) => (
                <div
                  key={`recent-${strategy.id}`}
                  className="group border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {strategy.name}
                    </h3>
                    {strategy.performance && getTrendIcon(strategy.performance.trend)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>{strategy.timeframe}</span>
                    {strategy.performance && (
                      <span style={{ color: getWinRateColor(strategy.performance.totalReturn) }}>
                        {strategy.performance.totalReturn > 0 ? '+' : ''}{strategy.performance.totalReturn.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {!searchTerm && timeframeFilter === 'all' && favoriteStrategies.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Star size={20} className="text-yellow-400" />
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Favorite Strategies
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {favoriteStrategies.map((strategy) => (
                <button
                  key={`favorite-${strategy.id}`}
                  onClick={() => handleRunStrategy(strategy)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span className="font-medium">{strategy.name}</span>
                  {strategy.performance && (
                    <span className="text-sm" style={{ color: getWinRateColor(strategy.performance.totalReturn) }}>
                      {strategy.performance.totalReturn > 0 ? '+' : ''}{strategy.performance.totalReturn.toFixed(1)}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {sortedStrategies.length} {sortedStrategies.length === 1 ? 'strategy' : 'strategies'}
              {(searchTerm || timeframeFilter !== 'all') && ' found'}
              {!searchTerm && timeframeFilter === 'all' && (
                <span> • Sorted by {sortBy.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
              )}
            </p>
          </div>
        </div>

        {viewMode === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className="group border rounded-xl p-6 hover:shadow-lg hover:border-opacity-60 transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)'
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <InlineEditableTitle
                        value={strategy.name}
                        onSave={(newName) => handleUpdateStrategyName(strategy.id, newName)}
                        className="font-semibold text-lg truncate"
                        titleStyle={{ color: 'var(--text-primary)' }}
                        placeholder="Strategy name..."
                      />
                      {strategy.isFavorite && (
                        <Star size={16} className="text-yellow-400 fill-current" />
                      )}
                      {strategy.status && (
                        <Circle
                          size={8}
                          className="fill-current"
                          style={{ color: getStatusColor(strategy.status) }}
                        />
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span>{strategy.timeframe}</span>
                      <span>•</span>
                      <span>ATR {strategy.atrPeriod}×{strategy.atrMultiplier}</span>
                      {strategy.performance && (
                        <>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(strategy.performance.trend)}
                            <span style={{ color: getWinRateColor(strategy.performance.winRate) }}>
                              {strategy.performance.winRate.toFixed(1)}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditStrategy(strategy)}
                      className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                      style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)' }}
                      title="Edit strategy"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDuplicateStrategy(strategy)}
                      className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                      style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)' }}
                      title="Duplicate strategy"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteStrategy(strategy.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
                      title="Delete strategy"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Performance Metrics */}
                {strategy.performance && (
                  <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-medium" style={{ color: getWinRateColor(strategy.performance.winRate) }}>
                          {strategy.performance.totalReturn > 0 ? '+' : ''}{strategy.performance.totalReturn.toFixed(1)}%
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Return</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {strategy.performance.sharpe.toFixed(2)}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sharpe</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Circle
                            size={8}
                            className="fill-current"
                            style={{ color: getHealthColor(strategy.performance.healthScore) }}
                          />
                          <span className="font-medium text-xs" style={{ color: getHealthColor(strategy.performance.healthScore) }}>
                            {getHealthLabel(strategy.performance.healthScore)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="mb-4">
                  <TagEditor
                    tags={strategy.tags}
                    onTagsChange={(newTags) => handleUpdateStrategyTags(strategy.id, newTags)}
                    className="mb-3"
                  />
                </div>

                {/* Features - Compact Pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {strategy.relativeVolume && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--accent)',
                        border: `1px solid var(--accent)`
                      }}
                    >
                      Volume
                    </span>
                  )}
                  {strategy.atrTrim && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: `1px solid #10b981`
                      }}
                    >
                      Trim
                    </span>
                  )}
                  {strategy.phaseId && (
                    <span
                      className="px-2 py-1 text-xs rounded-full"
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        color: '#f59e0b',
                        border: `1px solid #f59e0b`
                      }}
                    >
                      Phase ID
                    </span>
                  )}
                </div>

                {/* Footer with Run Button */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Updated {new Date(strategy.updatedAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleRunStrategy(strategy)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    <Play size={14} />
                    <span>Run</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="space-y-4">
            {/* Bulk Actions Toolbar */}
            {selectedStrategyIds.length > 0 && (
              <div 
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--accent)' }}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selectedStrategyIds.length} strategies selected
                  </span>
                  <button
                    onClick={() => setSelectedStrategyIds([])}
                    className="text-sm hover:underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkDuplicate}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Save size={14} />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="w-12 px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStrategyIds.length === sortedStrategies.length && sortedStrategies.length > 0}
                          onChange={handleSelectAll}
                          className="rounded"
                          style={{ accentColor: 'var(--accent)' }}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Performance</th>
                      <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Timeframe</th>
                      <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>ATR</th>
                      <th className="px-6 py-4 text-left text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
                      <th className="px-6 py-4 text-right text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                    </tr>
                  </thead>
                <tbody>
                  {sortedStrategies.map((strategy) => (
                    <tr 
                      key={strategy.id}
                      className="border-b hover:bg-opacity-50 transition-colors" 
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="w-12 px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStrategyIds.includes(strategy.id)}
                          onChange={() => handleSelectStrategy(strategy.id)}
                          className="rounded"
                          style={{ accentColor: 'var(--accent)' }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <InlineEditableTitle
                              value={strategy.name}
                              onSave={(newName) => handleUpdateStrategyName(strategy.id, newName)}
                              className="font-medium"
                              titleStyle={{ color: 'var(--text-primary)' }}
                              placeholder="Strategy name..."
                            />
                            {strategy.isFavorite && (
                              <Star size={14} className="text-yellow-400 fill-current" />
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {strategy.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs rounded"
                                style={{
                                  backgroundColor: 'var(--bg-primary)',
                                  color: 'var(--text-secondary)',
                                  border: `1px solid var(--border)`
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                            {strategy.tags.length > 2 && (
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                +{strategy.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {strategy.performance ? (
                          <div className="text-sm">
                            <div className="flex items-center space-x-2 mb-1">
                              {getTrendIcon(strategy.performance.trend)}
                              <span className="font-medium" style={{ color: getWinRateColor(strategy.performance.totalReturn) }}>
                                {strategy.performance.totalReturn > 0 ? '+' : ''}{strategy.performance.totalReturn.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <span>{strategy.performance.winRate.toFixed(1)}% WR</span>
                              <span>Sharpe: {strategy.performance.sharpe.toFixed(2)}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>No data</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {strategy.timeframe}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {strategy.atrPeriod}p × {strategy.atrMultiplier}x
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {strategy.status && (
                            <div className="flex items-center space-x-1">
                              <Circle
                                size={8}
                                className="fill-current"
                                style={{ color: getStatusColor(strategy.status) }}
                              />
                              <span className="text-sm capitalize" style={{ color: getStatusColor(strategy.status) }}>
                                {strategy.status}
                              </span>
                            </div>
                          )}
                          {strategy.performance && (
                            <span
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: `${getHealthColor(strategy.performance.healthScore)}20`,
                                color: getHealthColor(strategy.performance.healthScore)
                              }}
                            >
                              {getHealthLabel(strategy.performance.healthScore)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleRunStrategy(strategy)}
                            className="px-3 py-1 text-xs rounded-lg transition-colors"
                            style={{
                              backgroundColor: 'var(--accent)',
                              color: 'var(--bg-primary)'
                            }}
                            title="Run strategy"
                          >
                            <Play size={12} className="inline mr-1" />
                            Run
                          </button>
                          <button
                            onClick={() => handleEditStrategy(strategy)}
                            className="p-1 rounded hover:bg-opacity-80 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Edit strategy"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDuplicateStrategy(strategy)}
                            className="p-1 rounded hover:bg-opacity-80 transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                            title="Duplicate strategy"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteStrategy(strategy.id)}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
                            title="Delete strategy"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {sortedStrategies.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <div 
                className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--surface)', border: `2px solid var(--border)` }}
              >
                <Settings size={32} style={{ color: 'var(--text-secondary)' }} />
              </div>
            </div>
            <h3 className="text-2xl font-light mb-3" style={{ color: 'var(--text-primary)' }}>
              {searchTerm || timeframeFilter !== 'all' ? 'No strategies found' : 'No strategies yet'}
            </h3>
            <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {searchTerm || timeframeFilter !== 'all' 
                ? 'Try adjusting your search criteria or filters'
                : 'Create your first strategy template to get started with backtesting'
              }
            </p>
            {!searchTerm && timeframeFilter === 'all' && (
              <button
                onClick={handleCreateStrategy}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors hover:opacity-90 mx-auto"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                <Plus size={20} />
                <span>Create Your First Strategy</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Run Strategy Modal */}
      <Modal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        title="Run Strategy"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Strategy: {selectedStrategy?.name}
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              {selectedStrategy?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Symbol
            </label>
            <input
              type="text"
              value={runSymbol}
              onChange={(e) => setRunSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL, TSLA"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsRunModalOpen(false)}
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRun}
              disabled={!runSymbol}
              className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              <Play className="inline mr-1" size={16} />
              Run Backtest
            </button>
          </div>
        </div>
      </Modal>

      {/* Strategy Form Modal */}
      <StrategyFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStrategy(null);
        }}
        editingStrategy={editingStrategy}
      />
    </div>
  );
};

export default StrategyLibrary;
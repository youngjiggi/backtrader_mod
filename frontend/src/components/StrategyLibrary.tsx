import React, { useState } from 'react';
import { ArrowLeft, Play, Edit, Trash2, Plus, Save, Calendar, Settings } from 'lucide-react';
import { useStrategy, StrategyTemplate } from '../contexts/StrategyContext';
import Modal from './Modal';
import StrategyFormModal from './StrategyFormModal';

interface StrategyLibraryProps {
  onBack: () => void;
  onRunStrategy?: (strategy: StrategyTemplate, symbol: string) => void;
}

const StrategyLibrary: React.FC<StrategyLibraryProps> = ({ onBack, onRunStrategy }) => {
  const { strategies, deleteStrategy, addStrategy } = useStrategy();
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyTemplate | null>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [runSymbol, setRunSymbol] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<StrategyTemplate | null>(null);

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
      phaseId: strategy.phaseId
    };
    addStrategy(duplicate);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="border-b px-6 py-4"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Strategy Library
            </h1>
          </div>
          
          <button
            onClick={handleCreateStrategy}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-all"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    {strategy.name}
                  </h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {strategy.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditStrategy(strategy)}
                    className="p-1 rounded hover:bg-opacity-80 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Edit strategy"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStrategy(strategy.id)}
                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
                    title="Delete strategy"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Strategy Parameters */}
              <div className="space-y-3 mb-4">
                <div
                  className="p-3 rounded border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Timeframe:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>ATR Period:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.atrPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>ATR Mult:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.atrMultiplier}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>CVD Threshold:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{strategy.cvdThreshold}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {strategy.relativeVolume && (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: 'var(--highlight)',
                        color: 'var(--bg-primary)'
                      }}
                    >
                      Volume Filter
                    </span>
                  )}
                  {strategy.atrTrim && (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: 'var(--highlight)',
                        color: 'var(--bg-primary)'
                      }}
                    >
                      ATR Trim
                    </span>
                  )}
                  {strategy.phaseId && (
                    <span
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: 'var(--highlight)',
                        color: 'var(--bg-primary)'
                      }}
                    >
                      Phase ID
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 mb-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>Created {new Date(strategy.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Settings size={12} />
                  <span>Updated {new Date(strategy.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRunStrategy(strategy)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  <Play size={16} />
                  <span>Run</span>
                </button>
                <button
                  onClick={() => handleDuplicateStrategy(strategy)}
                  className="px-3 py-2 rounded-lg border transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)'
                  }}
                  title="Duplicate strategy"
                >
                  <Save size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {strategies.length === 0 && (
          <div className="text-center py-12">
            <Settings size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              No Strategies Yet
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Create your first strategy template to get started
            </p>
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
import React, { useState } from 'react';
import { Upload, Download, Plus, X, Edit2, Save, AlertCircle } from 'lucide-react';

export interface PortfolioPosition {
  id: string;
  symbol: string;
  shares: number;
  averagePrice: number;
  purchaseDate?: string;
  currentPrice?: number;
  marketValue?: number;
  unrealizedPnL?: number;
  unrealizedPnLPercent?: number;
}

interface ExistingPortfolioImporterProps {
  positions: PortfolioPosition[];
  onPositionsUpdate: (positions: PortfolioPosition[]) => void;
  onImportFromFile?: (file: File) => void;
  className?: string;
}

const ExistingPortfolioImporter: React.FC<ExistingPortfolioImporterProps> = ({
  positions,
  onPositionsUpdate,
  onImportFromFile,
  className = ''
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState<Partial<PortfolioPosition>>({
    symbol: '',
    shares: 0,
    averagePrice: 0,
    purchaseDate: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock current prices for demonstration
  const mockCurrentPrices: { [key: string]: number } = {
    'AAPL': 185.25,
    'TSLA': 248.50,
    'NVDA': 722.15,
    'MSFT': 378.85,
    'GOOGL': 138.45,
    'AMZN': 155.20,
    'META': 485.30
  };

  const calculateMetrics = (position: PortfolioPosition): PortfolioPosition => {
    const currentPrice = mockCurrentPrices[position.symbol] || position.averagePrice * 1.05;
    const marketValue = position.shares * currentPrice;
    const costBasis = position.shares * position.averagePrice;
    const unrealizedPnL = marketValue - costBasis;
    const unrealizedPnLPercent = (unrealizedPnL / costBasis) * 100;

    return {
      ...position,
      currentPrice,
      marketValue,
      unrealizedPnL,
      unrealizedPnLPercent
    };
  };

  const addPosition = () => {
    if (newPosition.symbol && newPosition.shares && newPosition.averagePrice) {
      const position: PortfolioPosition = {
        id: `pos_${Date.now()}`,
        symbol: newPosition.symbol.toUpperCase(),
        shares: newPosition.shares,
        averagePrice: newPosition.averagePrice,
        purchaseDate: newPosition.purchaseDate || new Date().toISOString().split('T')[0]
      };

      const updatedPosition = calculateMetrics(position);
      onPositionsUpdate([...positions, updatedPosition]);
      
      setNewPosition({
        symbol: '',
        shares: 0,
        averagePrice: 0,
        purchaseDate: ''
      });
      setShowAddForm(false);
    }
  };

  const removePosition = (id: string) => {
    onPositionsUpdate(positions.filter(p => p.id !== id));
  };

  const updatePosition = (id: string, updates: Partial<PortfolioPosition>) => {
    const updatedPositions = positions.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        return calculateMetrics(updated);
      }
      return p;
    });
    onPositionsUpdate(updatedPositions);
    setEditingId(null);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportFromFile) {
      onImportFromFile(file);
    }
  };

  const exportTemplate = () => {
    const csvContent = 'Symbol,Shares,Average Price,Purchase Date\nAAPL,100,150.00,2024-01-15\nTSLA,50,200.00,2024-01-20';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalValue = positions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0);
  const totalCostBasis = positions.reduce((sum, pos) => sum + (pos.shares * pos.averagePrice), 0);
  const totalUnrealizedPnL = totalValue - totalCostBasis;
  const totalUnrealizedPnLPercent = totalCostBasis > 0 ? (totalUnrealizedPnL / totalCostBasis) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Existing Portfolio
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Add your current positions to test optimization strategies
        </p>
      </div>

      {/* Import Options */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileImport}
            className="hidden"
          />
          <div 
            className="p-3 border-2 border-dashed rounded-lg text-center transition-colors hover:bg-opacity-50"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
          >
            <Upload size={20} className="mx-auto mb-1" style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Import from CSV/Excel
            </span>
          </div>
        </label>

        <button
          onClick={exportTemplate}
          className="flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg transition-colors hover:bg-opacity-50"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
        >
          <Download size={16} />
          <span className="text-sm">Download Template</span>
        </button>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          <Plus size={16} />
          <span className="text-sm">Add Position</span>
        </button>
      </div>

      {/* Add Position Form */}
      {showAddForm && (
        <div 
          className="p-4 border rounded-lg"
          style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
        >
          <h4 className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            Add New Position
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Symbol</label>
              <input
                type="text"
                value={newPosition.symbol || ''}
                onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value.toUpperCase()})}
                placeholder="AAPL"
                className="w-full mt-1 px-2 py-1 text-sm border rounded"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Shares</label>
              <input
                type="number"
                value={newPosition.shares || ''}
                onChange={(e) => setNewPosition({...newPosition, shares: Number(e.target.value)})}
                placeholder="100"
                className="w-full mt-1 px-2 py-1 text-sm border rounded"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Price</label>
              <input
                type="number"
                value={newPosition.averagePrice || ''}
                onChange={(e) => setNewPosition({...newPosition, averagePrice: Number(e.target.value)})}
                placeholder="150.00"
                step="0.01"
                className="w-full mt-1 px-2 py-1 text-sm border rounded"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>Date (Optional)</label>
              <input
                type="date"
                value={newPosition.purchaseDate || ''}
                onChange={(e) => setNewPosition({...newPosition, purchaseDate: e.target.value})}
                className="w-full mt-1 px-2 py-1 text-sm border rounded"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-sm border rounded transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={addPosition}
              disabled={!newPosition.symbol || !newPosition.shares || !newPosition.averagePrice}
              className="px-3 py-1 text-sm rounded transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              Add Position
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Summary */}
      {positions.length > 0 && (
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                ${totalValue.toFixed(2)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Market Value</div>
            </div>
            <div className="text-center">
              <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                ${totalCostBasis.toFixed(2)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Cost Basis</div>
            </div>
            <div className="text-center">
              <div className={`font-medium ${totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalUnrealizedPnL.toFixed(2)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Unrealized P&L</div>
            </div>
            <div className="text-center">
              <div className={`font-medium ${totalUnrealizedPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalUnrealizedPnLPercent >= 0 ? '+' : ''}{totalUnrealizedPnLPercent.toFixed(2)}%
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Return</div>
            </div>
          </div>
        </div>
      )}

      {/* Positions List */}
      {positions.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Positions ({positions.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {positions.map((position) => (
              <div
                key={position.id}
                className="p-3 border rounded-lg"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
              >
                {editingId === position.id ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={position.symbol}
                      onChange={(e) => updatePosition(position.id, { symbol: e.target.value.toUpperCase() })}
                      className="px-2 py-1 text-sm border rounded"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                    />
                    <input
                      type="number"
                      value={position.shares}
                      onChange={(e) => updatePosition(position.id, { shares: Number(e.target.value) })}
                      className="px-2 py-1 text-sm border rounded"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                    />
                    <input
                      type="number"
                      value={position.averagePrice}
                      onChange={(e) => updatePosition(position.id, { averagePrice: Number(e.target.value) })}
                      step="0.01"
                      className="px-2 py-1 text-sm border rounded"
                      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                    />
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 rounded hover:bg-opacity-50"
                        style={{ color: 'var(--accent)' }}
                      >
                        <Save size={14} />
                      </button>
                      <button
                        onClick={() => removePosition(position.id)}
                        className="p-1 rounded hover:bg-opacity-50"
                        style={{ color: '#EF4444' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {position.symbol}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {position.shares} shares
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          ${position.averagePrice.toFixed(2)}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Avg Price
                        </div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          ${position.currentPrice?.toFixed(2) || 'N/A'}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Current
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${(position.unrealizedPnL || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.unrealizedPnL !== undefined ? 
                            `${position.unrealizedPnL >= 0 ? '+' : ''}$${position.unrealizedPnL.toFixed(2)}` : 
                            'N/A'
                          }
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {position.unrealizedPnLPercent !== undefined ? 
                            `${position.unrealizedPnLPercent >= 0 ? '+' : ''}${position.unrealizedPnLPercent.toFixed(1)}%` : 
                            'P&L'
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 ml-4">
                      <button
                        onClick={() => setEditingId(position.id)}
                        className="p-1 rounded hover:bg-opacity-50"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removePosition(position.id)}
                        className="p-1 rounded hover:bg-opacity-50"
                        style={{ color: '#EF4444' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {positions.length === 0 && (
        <div 
          className="p-8 border-2 border-dashed rounded-lg text-center"
          style={{ borderColor: 'var(--border)' }}
        >
          <AlertCircle size={32} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
          <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            No positions added yet
          </h4>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Import from a file or manually add your current holdings
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            Add Your First Position
          </button>
        </div>
      )}
    </div>
  );
};

export default ExistingPortfolioImporter;
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Plus, X, FileSpreadsheet, FileText, User, Edit2, Save } from 'lucide-react';
import Modal from './Modal';
import { useWatchlist, PortfolioPosition, Watchlist } from '../contexts/WatchlistContext';

interface PortfolioFormPosition extends PortfolioPosition {
  id: string;
}

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPortfolio?: Watchlist | null;
}

const PortfolioFormModal: React.FC<PortfolioFormModalProps> = ({
  isOpen,
  onClose,
  editingPortfolio = null
}) => {
  const { addPortfolio, updateWatchlist } = useWatchlist();
  const [activeTab, setActiveTab] = useState<'import' | 'manual'>('import');
  const [positions, setPositions] = useState<PortfolioFormPosition[]>([]);
  const [newPosition, setNewPosition] = useState<Partial<PortfolioPosition>>({
    symbol: '',
    shares: 0,
    averagePrice: 0,
    purchaseDate: '',
    notes: ''
  });
  const [portfolioName, setPortfolioName] = useState('');
  const [importError, setImportError] = useState('');
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when editing
  useEffect(() => {
    if (editingPortfolio && editingPortfolio.type === 'portfolio') {
      setPortfolioName(editingPortfolio.name);
      if (editingPortfolio.portfolioPositions) {
        const formPositions: PortfolioFormPosition[] = editingPortfolio.portfolioPositions.map(pos => ({
          ...pos,
          id: `pos_${Date.now()}_${Math.random()}`
        }));
        setPositions(formPositions);
      }
      setActiveTab('manual');
    } else {
      setPortfolioName('');
      setPositions([]);
      setActiveTab('import');
    }
    setImportError('');
  }, [editingPortfolio, isOpen]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedPositions = parseFileContent(content, file.name);
        setPositions(parsedPositions);
        setActiveTab('manual'); // Switch to manual tab to show parsed results
        setImportError('');
      } catch (error) {
        setImportError(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      setImportError('Please upload a CSV or TXT file. Excel support coming soon.');
    }
  };

  const parseFileContent = (content: string, filename: string): PortfolioFormPosition[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const header = lines[0].toLowerCase().split(',').map(h => h.trim());
    const symbolIndex = header.findIndex(h => h.includes('symbol') || h.includes('ticker'));
    const sharesIndex = header.findIndex(h => h.includes('shares') || h.includes('quantity') || h.includes('qty'));
    const priceIndex = header.findIndex(h => h.includes('price') || h.includes('cost') || h.includes('avg'));
    const dateIndex = header.findIndex(h => h.includes('date') || h.includes('purchase'));

    if (symbolIndex === -1 || sharesIndex === -1 || priceIndex === -1) {
      throw new Error('Required columns not found. Please ensure your CSV has Symbol, Shares, and Price columns.');
    }

    const parsedPositions: PortfolioFormPosition[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim());
      if (row.length < 3) continue; // Skip incomplete rows

      const symbol = row[symbolIndex]?.replace(/"/g, '').toUpperCase();
      const shares = parseFloat(row[sharesIndex]) || 0;
      const averagePrice = parseFloat(row[priceIndex]) || 0;
      const purchaseDate = dateIndex >= 0 ? row[dateIndex]?.replace(/"/g, '') || '' : '';

      if (symbol && shares > 0 && averagePrice > 0) {
        parsedPositions.push({
          id: `pos_${Date.now()}_${i}`,
          symbol,
          shares,
          averagePrice,
          purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
          notes: ''
        });
      }
    }

    if (parsedPositions.length === 0) {
      throw new Error('No valid positions found in file');
    }

    return parsedPositions;
  };

  const addNewPosition = () => {
    if (!newPosition.symbol || !newPosition.shares || !newPosition.averagePrice) {
      return;
    }

    const position: PortfolioFormPosition = {
      id: `pos_${Date.now()}`,
      symbol: newPosition.symbol.toUpperCase(),
      shares: Number(newPosition.shares),
      averagePrice: Number(newPosition.averagePrice),
      purchaseDate: newPosition.purchaseDate || new Date().toISOString().split('T')[0],
      notes: newPosition.notes || ''
    };

    setPositions([...positions, position]);
    setNewPosition({
      symbol: '',
      shares: 0,
      averagePrice: 0,
      purchaseDate: '',
      notes: ''
    });
  };

  const removePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const handleEditPosition = (id: string) => {
    setEditingPositionId(id);
  };

  const handleCancelEdit = () => {
    setEditingPositionId(null);
  };

  const updatePosition = (id: string, updates: Partial<PortfolioFormPosition>) => {
    setPositions(prevPositions => 
      prevPositions.map(position => 
        position.id === id 
          ? { ...position, ...updates }
          : position
      )
    );
  };

  const handleSavePosition = () => {
    if (editingPositionId) {
      const position = positions.find(p => p.id === editingPositionId);
      if (position) {
        // Validate required fields
        if (!position.symbol || !position.shares || position.shares <= 0 || !position.averagePrice || position.averagePrice <= 0) {
          // Could add error handling here if needed
          return;
        }
      }
    }
    setEditingPositionId(null);
  };

  const handleSave = () => {
    if (positions.length === 0 || !portfolioName.trim()) {
      return;
    }
    
    // Convert PortfolioFormPosition to PortfolioPosition (remove id field)
    const portfolioPositions: PortfolioPosition[] = positions.map(pos => ({
      symbol: pos.symbol,
      shares: pos.shares,
      averagePrice: pos.averagePrice,
      purchaseDate: pos.purchaseDate,
      notes: pos.notes
    }));
    
    if (editingPortfolio && editingPortfolio.type === 'portfolio') {
      // Update existing portfolio
      const symbols = portfolioPositions.map(pos => pos.symbol);
      const description = `Portfolio with ${portfolioPositions.length} positions: ${symbols.join(', ')}`;
      
      updateWatchlist(editingPortfolio.id, {
        name: portfolioName.trim(),
        description,
        symbols,
        portfolioPositions
      });
    } else {
      // Create new portfolio
      addPortfolio(portfolioName.trim(), portfolioPositions);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setPositions([]);
    setNewPosition({
      symbol: '',
      shares: 0,
      averagePrice: 0,
      purchaseDate: '',
      notes: ''
    });
    setPortfolioName('');
    setImportError('');
    setEditingPositionId(null);
    setActiveTab('import');
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = `Symbol,Shares,Average Price,Purchase Date,Notes
AAPL,100,150.00,2024-01-15,Apple Inc
TSLA,50,250.00,2024-01-20,Tesla Inc
MSFT,75,300.00,2024-01-25,Microsoft Corp`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={editingPortfolio ? `Edit Portfolio: ${editingPortfolio.name}` : "Create New Portfolio"} 
      size="large"
    >
      <div className="space-y-6">
        {/* Portfolio Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Portfolio Name
          </label>
          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            placeholder="Enter portfolio name..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg border p-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'import'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-opacity-50 hover:bg-blue-500'
            }`}
            style={activeTab === 'import' ? {} : { color: 'var(--text-secondary)' }}
          >
            <Upload size={16} />
            <span>Import from File</span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'manual'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-opacity-50 hover:bg-blue-500'
            }`}
            style={activeTab === 'manual' ? {} : { color: 'var(--text-secondary)' }}
          >
            <User size={16} />
            <span>Manual Entry</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div className="text-center border-2 border-dashed rounded-lg p-8" style={{ borderColor: 'var(--border)' }}>
              <div className="mb-4">
                <div className="flex justify-center space-x-4 mb-4">
                  <FileSpreadsheet size={40} style={{ color: 'var(--accent)' }} />
                  <FileText size={40} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Upload Portfolio File
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Supports CSV and TXT files with Symbol, Shares, and Average Price columns
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div className="space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  <Upload size={16} />
                  <span>Choose File</span>
                </button>
                
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors hover:opacity-90"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  <Download size={16} />
                  <span>Download Template</span>
                </button>
              </div>
            </div>

            {importError && (
              <div className="p-3 rounded-lg border" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca', color: '#dc2626' }}>
                {importError}
              </div>
            )}
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="space-y-4">
            {/* Add New Position Form */}
            <div className="border rounded-lg p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
              <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                Add New Position
              </h4>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Symbol (e.g., AAPL)"
                  value={newPosition.symbol}
                  onChange={(e) => setNewPosition({...newPosition, symbol: e.target.value.toUpperCase()})}
                  className="px-3 py-2 border rounded text-sm"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <input
                  type="number"
                  placeholder="Shares"
                  value={newPosition.shares || ''}
                  onChange={(e) => setNewPosition({...newPosition, shares: parseFloat(e.target.value)})}
                  className="px-3 py-2 border rounded text-sm"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Average Price"
                  value={newPosition.averagePrice || ''}
                  onChange={(e) => setNewPosition({...newPosition, averagePrice: parseFloat(e.target.value)})}
                  className="px-3 py-2 border rounded text-sm"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <input
                  type="date"
                  value={newPosition.purchaseDate}
                  onChange={(e) => setNewPosition({...newPosition, purchaseDate: e.target.value})}
                  className="px-3 py-2 border rounded text-sm"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={newPosition.notes}
                  onChange={(e) => setNewPosition({...newPosition, notes: e.target.value})}
                  className="flex-1 mr-3 px-3 py-2 border rounded text-sm"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  onClick={addNewPosition}
                  disabled={!newPosition.symbol || !newPosition.shares || !newPosition.averagePrice}
                  className="flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Positions List */}
            {positions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Positions ({positions.length})
                </h4>
                
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="p-3 border rounded-lg"
                      style={{ 
                        backgroundColor: editingPositionId === position.id ? 'var(--accent-bg)' : 'var(--bg-primary)', 
                        borderColor: editingPositionId === position.id ? 'var(--accent)' : 'var(--border)' 
                      }}
                    >
                      {editingPositionId === position.id ? (
                        // Edit Mode
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                Symbol
                              </label>
                              <input
                                type="text"
                                value={position.symbol}
                                onChange={(e) => updatePosition(position.id, { symbol: e.target.value.toUpperCase() })}
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                Shares
                              </label>
                              <input
                                type="number"
                                value={position.shares}
                                onChange={(e) => updatePosition(position.id, { shares: Number(e.target.value) })}
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                Average Price
                              </label>
                              <input
                                type="number"
                                value={position.averagePrice}
                                onChange={(e) => updatePosition(position.id, { averagePrice: Number(e.target.value) })}
                                step="0.01"
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                Purchase Date
                              </label>
                              <input
                                type="date"
                                value={position.purchaseDate}
                                onChange={(e) => updatePosition(position.id, { purchaseDate: e.target.value })}
                                className="w-full px-2 py-1 text-sm border rounded"
                                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                              Notes (optional)
                            </label>
                            <input
                              type="text"
                              value={position.notes || ''}
                              onChange={(e) => updatePosition(position.id, { notes: e.target.value })}
                              className="w-full px-2 py-1 text-sm border rounded"
                              style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 text-sm border rounded transition-colors hover:bg-opacity-80"
                              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSavePosition}
                              className="flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors hover:opacity-90"
                              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
                            >
                              <Save size={12} />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display Mode
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                {position.symbol}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {position.shares} shares @ ${position.averagePrice.toFixed(2)}
                              </span>
                              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {position.purchaseDate}
                              </span>
                            </div>
                            {position.notes && (
                              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                {position.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditPosition(position.id)}
                              className="p-1 rounded transition-colors hover:bg-opacity-50"
                              style={{ color: 'var(--text-secondary)' }}
                              title="Edit position"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => removePosition(position.id)}
                              className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove position"
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
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {positions.length} positions ready to import
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border rounded-lg text-sm transition-colors hover:opacity-80"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={positions.length === 0}
              className="px-4 py-2 rounded-lg text-sm transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
{editingPortfolio ? 'Update Portfolio' : 'Create Portfolio'} ({positions.length} positions)
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PortfolioFormModal;
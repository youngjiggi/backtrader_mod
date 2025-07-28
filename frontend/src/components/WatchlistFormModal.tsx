import React, { useState, useEffect } from 'react';
import { X, Plus, Upload, Download } from 'lucide-react';
import { useWatchlist, Watchlist } from '../contexts/WatchlistContext';
import Modal from './Modal';

interface WatchlistFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWatchlist?: Watchlist | null;
}

const WatchlistFormModal: React.FC<WatchlistFormModalProps> = ({
  isOpen,
  onClose,
  editingWatchlist = null
}) => {
  const { addWatchlist, updateWatchlist } = useWatchlist();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    symbols: [] as string[]
  });
  const [symbolInput, setSymbolInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isImporting, setIsImporting] = useState(false);
  const [importText, setImportText] = useState('');

  // Popular symbols for suggestions
  const popularSymbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'BRK.B', 'UNH', 'XOM',
    'JNJ', 'JPM', 'V', 'PG', 'MA', 'LLY', 'HD', 'CVX', 'ABBV', 'PEP', 'KO', 'BAC',
    'TMO', 'COST', 'WMT', 'DIS', 'ABT', 'MRK', 'CSCO', 'CRM', 'ACN', 'ADBE', 'DHR',
    'VZ', 'LIN', 'NKE', 'TXN', 'QCOM', 'WFC', 'PM', 'NFLX', 'RTX', 'UPS', 'HON',
    'IBM', 'AMGN', 'T', 'SPGI', 'CAT', 'GS', 'LOW', 'MDT', 'UNP', 'BLK', 'AXP',
    'DE', 'PLD', 'SYK', 'GE', 'TGT', 'AMT', 'BKNG', 'GILD', 'MMM', 'SCHW', 'MU',
    'C', 'AMD', 'LRCX', 'ADI', 'INTC', 'MDLZ', 'CVS', 'TMUS', 'FIS', 'CME', 'USB',
    'ZTS', 'TJX', 'MO', 'SO', 'PNC', 'DUK', 'CL', 'ITW', 'AON', 'MMC', 'APD', 'CSX'
  ];

  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize form when editing
  useEffect(() => {
    if (editingWatchlist) {
      setFormData({
        name: editingWatchlist.name,
        description: editingWatchlist.description,
        symbols: [...editingWatchlist.symbols]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        symbols: []
      });
    }
    setErrors({});
    setSymbolInput('');
    setImportText('');
    setIsImporting(false);
  }, [editingWatchlist, isOpen]);

  // Handle symbol input suggestions
  useEffect(() => {
    if (symbolInput.length > 0) {
      const filtered = popularSymbols
        .filter(symbol => 
          symbol.toLowerCase().includes(symbolInput.toLowerCase()) &&
          !formData.symbols.includes(symbol)
        )
        .slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [symbolInput, formData.symbols]);

  const validateSymbol = (symbol: string): boolean => {
    // Basic symbol validation - alphanumeric, dots, hyphens
    const symbolRegex = /^[A-Za-z0-9.-]+$/;
    return symbolRegex.test(symbol) && symbol.length <= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Watchlist name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must not exceed 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      newErrors.description = 'Description must not exceed 200 characters';
    }

    if (formData.symbols.length === 0) {
      newErrors.symbols = 'At least one symbol is required';
    } else if (formData.symbols.length > 100) {
      newErrors.symbols = 'Maximum 100 symbols allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSymbol = (symbol?: string) => {
    const symbolToAdd = (symbol || symbolInput).trim().toUpperCase();
    
    if (!symbolToAdd) return;
    
    if (!validateSymbol(symbolToAdd)) {
      setErrors(prev => ({ ...prev, symbolInput: 'Invalid symbol format' }));
      return;
    }

    if (formData.symbols.includes(symbolToAdd)) {
      setErrors(prev => ({ ...prev, symbolInput: 'Symbol already exists' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      symbols: [...prev.symbols, symbolToAdd]
    }));
    
    setSymbolInput('');
    setShowSuggestions(false);
    setErrors(prev => ({ ...prev, symbolInput: '', symbols: '' }));
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      symbols: prev.symbols.filter(symbol => symbol !== symbolToRemove)
    }));
  };

  const handleImportSymbols = () => {
    if (!importText.trim()) return;

    // Parse symbols from various formats (comma-separated, line-separated, space-separated)
    const symbols = importText
      .split(/[,\n\s]+/)
      .map(s => s.trim().toUpperCase())
      .filter(s => s && validateSymbol(s))
      .filter((symbol, index, arr) => arr.indexOf(symbol) === index); // Remove duplicates

    // Remove symbols that already exist
    const newSymbols = symbols.filter(symbol => !formData.symbols.includes(symbol));

    if (newSymbols.length === 0) {
      setErrors(prev => ({ ...prev, import: 'No new valid symbols found' }));
      return;
    }

    // Check if adding would exceed limit
    if (formData.symbols.length + newSymbols.length > 100) {
      setErrors(prev => ({ 
        ...prev, 
        import: `Adding ${newSymbols.length} symbols would exceed the 100 symbol limit` 
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      symbols: [...prev.symbols, ...newSymbols]
    }));

    setImportText('');
    setIsImporting(false);
    setErrors(prev => ({ ...prev, import: '', symbols: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const watchlistData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      symbols: formData.symbols
    };

    if (editingWatchlist && !editingWatchlist.id.startsWith('temp_')) {
      updateWatchlist(editingWatchlist.id, watchlistData);
    } else {
      addWatchlist(watchlistData);
    }

    onClose();
  };

  const handleExportSymbols = () => {
    const symbolList = formData.symbols.join('\n');
    const blob = new Blob([symbolList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.name || 'watchlist'}_symbols.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editingWatchlist ? `Edit ${editingWatchlist.name}` : 'Create New Watchlist'}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Watchlist Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: errors.name ? '#ef4444' : 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="e.g., Tech Giants, S&P 500 Top 20"
              maxLength={50}
            />
            {errors.name && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Description *
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, description: e.target.value }));
                setErrors(prev => ({ ...prev, description: '' }));
              }}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: errors.description ? '#ef4444' : 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="Brief description of this watchlist"
              maxLength={200}
            />
            {errors.description && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Symbol Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Symbols * ({formData.symbols.length}/100)
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setIsImporting(true)}
                className="flex items-center space-x-1 px-3 py-1 text-xs rounded border transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <Upload size={12} />
                <span>Import</span>
              </button>
              {formData.symbols.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportSymbols}
                  className="flex items-center space-x-1 px-3 py-1 text-xs rounded border transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  <Download size={12} />
                  <span>Export</span>
                </button>
              )}
            </div>
          </div>

          {/* Add Symbol Input */}
          <div className="relative mb-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={symbolInput}
                  onChange={(e) => {
                    setSymbolInput(e.target.value.toUpperCase());
                    setErrors(prev => ({ ...prev, symbolInput: '' }));
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSymbol();
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: errors.symbolInput ? '#ef4444' : 'var(--border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent)'
                  }}
                  placeholder="Enter symbol (e.g., AAPL)"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div
                    className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    {filteredSuggestions.map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        onClick={() => handleAddSymbol(symbol)}
                        className="w-full px-3 py-2 text-left hover:bg-opacity-50 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleAddSymbol()}
                className="px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            {errors.symbolInput && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.symbolInput}
              </p>
            )}
          </div>

          {/* Symbol List */}
          {formData.symbols.length > 0 && (
            <div
              className="border rounded-lg p-4 max-h-60 overflow-y-auto"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex flex-wrap gap-2">
                {formData.symbols.map((symbol) => (
                  <div
                    key={symbol}
                    className="flex items-center space-x-2 px-3 py-1 rounded border"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                      {symbol}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSymbol(symbol)}
                      className="p-0.5 rounded transition-colors hover:bg-red-100 dark:hover:bg-red-900/20"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {errors.symbols && (
            <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
              {errors.symbols}
            </p>
          )}
        </div>

        {/* Import Modal */}
        {isImporting && (
          <div
            className="border rounded-lg p-4"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)'
            }}
          >
            <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Import Symbols
            </h4>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Paste symbols separated by commas, spaces, or new lines
            </p>
            <textarea
              value={importText}
              onChange={(e) => {
                setImportText(e.target.value);
                setErrors(prev => ({ ...prev, import: '' }));
              }}
              className="w-full h-24 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: errors.import ? '#ef4444' : 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
              placeholder="AAPL, MSFT, GOOGL&#10;AMZN TSLA&#10;NVDA"
            />
            {errors.import && (
              <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>
                {errors.import}
              </p>
            )}
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="button"
                onClick={() => {
                  setIsImporting(false);
                  setImportText('');
                  setErrors(prev => ({ ...prev, import: '' }));
                }}
                className="px-3 py-1.5 text-sm border rounded transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSymbols}
                className="px-3 py-1.5 text-sm rounded transition-colors"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                Import Symbols
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg font-medium transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface)'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)'
            }}
          >
            {editingWatchlist ? 'Update Watchlist' : 'Create Watchlist'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default WatchlistFormModal;
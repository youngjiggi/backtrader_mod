import React, { useState } from 'react';
import { List, ChevronDown, Plus } from 'lucide-react';
import { useWatchlist, Watchlist } from '../contexts/WatchlistContext';
import Modal from './Modal';

interface WatchlistSelectorProps {
  onSymbolsSelected: (symbols: string[]) => void;
}

const WatchlistSelector: React.FC<WatchlistSelectorProps> = ({ onSymbolsSelected }) => {
  const { watchlists } = useWatchlist();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);

  const handleWatchlistSelect = (watchlist: Watchlist) => {
    setSelectedWatchlist(watchlist);
  };

  const handleConfirm = () => {
    if (selectedWatchlist) {
      onSymbolsSelected(selectedWatchlist.symbols);
      setIsModalOpen(false);
      setSelectedWatchlist(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors hover:bg-opacity-80"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--surface)'
        }}
      >
        <List size={16} />
        <span>Load Watchlist</span>
        <ChevronDown size={14} />
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedWatchlist(null);
        }}
        title="Select Watchlist"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Choose a watchlist to load all symbols into the backtest:
          </p>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {watchlists.map((watchlist) => (
              <div
                key={watchlist.id}
                onClick={() => handleWatchlistSelect(watchlist)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedWatchlist?.id === watchlist.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-opacity-50'
                }`}
                style={{
                  backgroundColor: selectedWatchlist?.id === watchlist.id 
                    ? undefined 
                    : 'var(--surface)',
                  borderColor: selectedWatchlist?.id === watchlist.id 
                    ? 'var(--accent)' 
                    : 'var(--border)'
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {watchlist.name}
                  </h4>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--highlight)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    {watchlist.symbols.length} symbols
                  </span>
                </div>
                
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {watchlist.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {watchlist.symbols.slice(0, 8).map((symbol) => (
                    <span
                      key={symbol}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      {symbol}
                    </span>
                  ))}
                  {watchlist.symbols.length > 8 && (
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      +{watchlist.symbols.length - 8} more
                    </span>
                  )}
                </div>
                
                <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Updated {new Date(watchlist.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--surface)'
              }}
            >
              <Plus size={16} />
              <span>Create New</span>
            </button>
            
            <div className="space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedWatchlist}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                Load {selectedWatchlist?.symbols.length || 0} Symbols
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default WatchlistSelector;
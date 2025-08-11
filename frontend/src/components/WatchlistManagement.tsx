import React, { useState } from 'react';
import { ArrowLeft, Search, List, Plus, Edit, Trash2, Copy, User } from 'lucide-react';
import { useWatchlist, Watchlist } from '../contexts/WatchlistContext';
import ViewToggle from './ViewToggle';
import SortableHeader from './SortableHeader';
import WatchlistFormModal from './WatchlistFormModal';
import WatchlistDetailModal from './WatchlistDetailModal';
import PortfolioFormModal from './PortfolioFormModal';

interface WatchlistManagementProps {
  onBack: () => void;
}

const WatchlistManagement: React.FC<WatchlistManagementProps> = ({ onBack }) => {
  const { watchlists, deleteWatchlist } = useWatchlist();
  const [view, setView] = useState<'list' | 'thumbnail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc' | null;
  }>({ key: '', direction: null });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingWatchlist, setEditingWatchlist] = useState<Watchlist | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<Watchlist | null>(null);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Watchlist | null>(null);

  // Helper functions
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredWatchlists.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredWatchlists.map(item => item.id));
    }
  };

  const handleEdit = (watchlist: Watchlist) => {
    setEditingWatchlist(watchlist);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this watchlist? This action cannot be undone.')) {
      deleteWatchlist(id);
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} watchlists? This action cannot be undone.`)) {
      selectedItems.forEach(id => deleteWatchlist(id));
      setSelectedItems([]);
    }
  };

  const handleDuplicate = (watchlist: Watchlist) => {
    const duplicatedWatchlist = {
      name: `${watchlist.name} (Copy)`,
      description: watchlist.description,
      symbols: [...watchlist.symbols]
    };
    // Create a temporary watchlist object for editing
    setEditingWatchlist({
      ...duplicatedWatchlist,
      id: `temp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (watchlist: Watchlist) => {
    setSelectedWatchlist(watchlist);
    setIsDetailModalOpen(true);
  };

  const handleEditFromDetail = (watchlist: Watchlist) => {
    if (watchlist.type === 'portfolio') {
      // Route to Portfolio Editor
      setEditingPortfolio(watchlist);
      setIsDetailModalOpen(false);
      setIsPortfolioModalOpen(true);
    } else {
      // Route to Watchlist Editor (existing behavior)
      setEditingWatchlist(watchlist);
      setIsDetailModalOpen(false);
      setIsFormModalOpen(true);
    }
  };

  const handleDeleteFromDetail = (watchlistId: string) => {
    deleteWatchlist(watchlistId);
    setIsDetailModalOpen(false);
    setSelectedWatchlist(null);
    setSelectedItems(prev => prev.filter(item => item !== watchlistId));
  };

  const handleEditPortfolio = (portfolio: Watchlist) => {
    setEditingPortfolio(portfolio);
    setIsPortfolioModalOpen(true);
  };


  // Filter watchlists
  const filteredWatchlists = watchlists.filter(watchlist => {
    const matchesSearch = 
      watchlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watchlist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      watchlist.symbols.some(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Apply sorting
  const sortedWatchlists = [...filteredWatchlists].sort((a, b) => {
    if (!sortConfig.direction) return 0;
    
    let aValue: any = a[sortConfig.key as keyof Watchlist];
    let bValue: any = b[sortConfig.key as keyof Watchlist];
    
    // Handle different data types
    if (sortConfig.key === 'updatedAt' || sortConfig.key === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortConfig.key === 'symbols') {
      aValue = a.symbols.length;
      bValue = b.symbols.length;
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            <th className="w-12 py-3 px-4">
              <input
                type="checkbox"
                checked={selectedItems.length === sortedWatchlists.length && sortedWatchlists.length > 0}
                onChange={handleSelectAll}
                className="rounded"
                style={{ accentColor: 'var(--accent)' }}
              />
            </th>
            <SortableHeader
              sortKey="name"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Watchlist Name
            </SortableHeader>
            <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Description
            </th>
            <SortableHeader
              sortKey="symbols"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Symbol Count
            </SortableHeader>
            <SortableHeader
              sortKey="updatedAt"
              currentSort={sortConfig}
              onSort={handleSort}
            >
              Last Updated
            </SortableHeader>
            <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Symbols Preview
            </th>
            <th className="text-left py-3 px-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedWatchlists.map((watchlist) => (
            <tr
              key={watchlist.id}
              className={`border-b hover:bg-opacity-50 transition-colors cursor-pointer ${
                selectedItems.includes(watchlist.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
              style={{ borderColor: 'var(--border)' }}
              onClick={() => handleViewDetails(watchlist)}
            >
              <td className="py-4 px-4">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(watchlist.id)}
                  onChange={() => handleSelectItem(watchlist.id)}
                  className="rounded"
                  style={{ accentColor: 'var(--accent)' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {watchlist.name}
                  </div>
                  {watchlist.type === 'portfolio' && (
                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'var(--bg-primary)'
                      }}
                    >
                      Portfolio
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 max-w-xs">
                <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }} title={watchlist.description}>
                  {watchlist.description}
                </p>
              </td>
              <td className="py-4 px-4">
                <span
                  className="px-2 py-1 rounded text-sm font-medium"
                  style={{
                    backgroundColor: 'var(--highlight)',
                    color: 'var(--bg-primary)'
                  }}
                >
                  {watchlist.symbols.length}
                </span>
              </td>
              <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {new Date(watchlist.updatedAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {watchlist.symbols.slice(0, 4).map((symbol) => (
                    <span
                      key={symbol}
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      {symbol}
                    </span>
                  ))}
                  {watchlist.symbols.length > 4 && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      +{watchlist.symbols.length - 4}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(watchlist)}
                    className="p-1.5 rounded transition-colors hover:bg-opacity-80"
                    style={{
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-secondary)'
                    }}
                    title="Edit watchlist"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDuplicate(watchlist)}
                    className="p-1.5 rounded transition-colors hover:bg-opacity-80"
                    style={{
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-secondary)'
                    }}
                    title="Duplicate watchlist"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(watchlist.id)}
                    className="p-1.5 rounded transition-colors hover:bg-red-100 dark:hover:bg-red-900/20"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Delete watchlist"
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
  );

  const ThumbnailView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedWatchlists.map((watchlist) => (
        <div
          key={watchlist.id}
          className={`border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer ${
            selectedItems.includes(watchlist.id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
          }`}
          style={{
            backgroundColor: watchlist.type === 'portfolio' ? 'var(--accent-bg, #f0f9ff)' : 'var(--surface)',
            borderColor: watchlist.type === 'portfolio' ? 'var(--accent, #3b82f6)' : 'var(--border)',
            borderWidth: watchlist.type === 'portfolio' ? '2px' : '1px'
          }}
          onClick={() => handleViewDetails(watchlist)}
          onDoubleClick={() => watchlist.type === 'portfolio' ? handleEditPortfolio(watchlist) : null}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.includes(watchlist.id)}
                onChange={() => handleSelectItem(watchlist.id)}
                className="rounded"
                style={{ accentColor: 'var(--accent)' }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {watchlist.name}
                </h3>
                {watchlist.type === 'portfolio' && (
                  <span
                    className="text-xs px-2 py-1 rounded font-medium"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    Portfolio
                  </span>
                )}
              </div>
            </div>
            <span
              className="text-xs px-2 py-1 rounded font-medium"
              style={{
                backgroundColor: 'var(--highlight)',
                color: 'var(--bg-primary)'
              }}
            >
              {watchlist.symbols.length} symbols
            </span>
          </div>

          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {watchlist.description}
          </p>

          {/* Symbol Grid */}
          <div className="mb-4">
            <div className="grid grid-cols-4 gap-2 mb-2">
              {watchlist.symbols.slice(0, 8).map((symbol) => (
                <div
                  key={symbol}
                  className="text-xs px-2 py-1 rounded text-center font-mono"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-secondary)',
                    border: `1px solid var(--border)`
                  }}
                >
                  {symbol}
                </div>
              ))}
            </div>
            {watchlist.symbols.length > 8 && (
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                +{watchlist.symbols.length - 8} more symbols
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
            <span>Updated {new Date(watchlist.updatedAt).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(watchlist)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded text-sm transition-colors hover:bg-opacity-80"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--bg-primary)'
                }}
              >
                <Edit size={12} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDuplicate(watchlist)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded text-sm border transition-colors hover:bg-opacity-80"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>
            <button
              onClick={() => handleDelete(watchlist.id)}
              className="p-1.5 rounded transition-colors hover:bg-red-100 dark:hover:bg-red-900/20"
              style={{ color: 'var(--text-secondary)' }}
              title="Delete watchlist"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

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
            <ViewToggle view={view} onViewChange={setView} />
            <button
              onClick={() => {
                setEditingWatchlist(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              <Plus size={16} />
              <span>New Watchlist</span>
            </button>
            <button
              onClick={() => setIsPortfolioModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
            >
              <User size={16} />
              <span>New Portfolio</span>
            </button>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)'
              }}
              title="Back to Dashboard"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Main</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              List Management
            </h1>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              placeholder="Search watchlists, symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-colors"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                '--tw-ring-color': 'var(--accent)'
              }}
            />
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                style={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <Trash2 size={16} />
                <span>Delete Selected ({selectedItems.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Showing {sortedWatchlists.length} of {watchlists.length} watchlists
          </p>
        </div>

        {/* Content */}
        <div
          className="rounded-lg border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)'
          }}
        >
          <div className="p-6">
            {sortedWatchlists.length === 0 ? (
              <div className="text-center py-12">
                <List size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {searchTerm ? 'No watchlists found' : 'No watchlists yet'}
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first watchlist to get started'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => {
                      setEditingWatchlist(null);
                      setIsFormModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90 mx-auto"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg-primary)'
                    }}
                  >
                    <Plus size={16} />
                    <span>Create First Watchlist</span>
                  </button>
                )}
              </div>
            ) : (
              view === 'list' ? <ListView /> : <ThumbnailView />
            )}
          </div>
        </div>
      </div>

      {/* Watchlist Form Modal */}
      <WatchlistFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingWatchlist(null);
        }}
        editingWatchlist={editingWatchlist}
      />

      {/* Watchlist Detail Modal */}
      <WatchlistDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedWatchlist(null);
        }}
        watchlist={selectedWatchlist}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      {/* Portfolio Form Modal */}
      <PortfolioFormModal
        isOpen={isPortfolioModalOpen}
        onClose={() => {
          setIsPortfolioModalOpen(false);
          setEditingPortfolio(null);
        }}
        editingPortfolio={editingPortfolio}
      />
    </div>
  );
};

export default WatchlistManagement;
import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Download, TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { Watchlist } from '../contexts/WatchlistContext';
import Modal from './Modal';

interface StockInfo {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  peRatio?: number;
  lastUpdated: string;
}

interface WatchlistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Watchlist | null;
  onEdit?: (watchlist: Watchlist) => void;
  onDelete?: (watchlistId: string) => void;
}

// Mock stock data service
const generateStockInfo = (symbol: string): StockInfo => {
  const mockData: { [key: string]: Partial<StockInfo> } = {
    'AAPL': { companyName: 'Apple Inc.', currentPrice: 196.89, priceChange: 2.34, volume: 45234567, marketCap: 3020000000000, peRatio: 32.4 },
    'MSFT': { companyName: 'Microsoft Corporation', currentPrice: 420.55, priceChange: -1.23, volume: 23456789, marketCap: 3120000000000, peRatio: 34.2 },
    'GOOGL': { companyName: 'Alphabet Inc.', currentPrice: 142.65, priceChange: 3.21, volume: 18765432, marketCap: 1800000000000, peRatio: 26.8 },
    'AMZN': { companyName: 'Amazon.com Inc.', currentPrice: 155.89, priceChange: -2.45, volume: 34567890, marketCap: 1620000000000, peRatio: 52.1 },
    'TSLA': { companyName: 'Tesla Inc.', currentPrice: 248.42, priceChange: 12.34, volume: 89012345, marketCap: 789000000000, peRatio: 68.2 },
    'NVDA': { companyName: 'NVIDIA Corporation', currentPrice: 875.28, priceChange: 15.67, volume: 34567891, marketCap: 2160000000000, peRatio: 78.9 },
    'META': { companyName: 'Meta Platforms Inc.', currentPrice: 484.20, priceChange: -5.43, volume: 25678901, marketCap: 1230000000000, peRatio: 25.6 },
    'JPM': { companyName: 'JPMorgan Chase & Co.', currentPrice: 198.45, priceChange: 1.85, volume: 12345678, marketCap: 578000000000, peRatio: 12.8 },
    'V': { companyName: 'Visa Inc.', currentPrice: 287.66, priceChange: 2.11, volume: 8765432, marketCap: 612000000000, peRatio: 33.2 },
    'JNJ': { companyName: 'Johnson & Johnson', currentPrice: 162.33, priceChange: -0.78, volume: 9876543, marketCap: 427000000000, peRatio: 15.4 }
  };

  const base = mockData[symbol] || { companyName: `${symbol} Corp.` };
  const currentPrice = base.currentPrice || (Math.random() * 200 + 50);
  const priceChange = base.priceChange || (Math.random() * 10 - 5);
  const priceChangePercent = (priceChange / currentPrice) * 100;
  const volume = base.volume || Math.floor(Math.random() * 50000000 + 1000000);
  const marketCap = base.marketCap || Math.floor(Math.random() * 500000000000 + 10000000000);
  const fiftyTwoWeekHigh = currentPrice * (1 + Math.random() * 0.3);
  const fiftyTwoWeekLow = currentPrice * (1 - Math.random() * 0.3);

  return {
    symbol,
    companyName: base.companyName!,
    currentPrice,
    priceChange,
    priceChangePercent,
    volume,
    marketCap,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    peRatio: base.peRatio || (Math.random() * 50 + 10),
    lastUpdated: new Date().toISOString()
  };
};

const WatchlistDetailModal: React.FC<WatchlistDetailModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onEdit,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StockInfo;
    direction: 'asc' | 'desc';
  }>({
    key: 'symbol',
    direction: 'asc'
  });

  // Generate stock information for all symbols
  const stocksData = useMemo(() => {
    if (!watchlist) return [];
    return watchlist.symbols.map(symbol => generateStockInfo(symbol));
  }, [watchlist]);

  // Filter stocks based on search term
  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocksData;
    return stocksData.filter(stock =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stocksData, searchTerm]);

  // Sort stocks based on current sort configuration
  const sortedStocks = useMemo(() => {
    if (!sortConfig) return filteredStocks;

    return [...filteredStocks].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [filteredStocks, sortConfig]);

  const handleSort = (key: keyof StockInfo) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const handleExport = () => {
    const headers = ['Symbol', 'Company', 'Price', 'Change', 'Change %', 'Volume', 'Market Cap', '52W High', '52W Low', 'P/E'];
    const csvContent = [
      headers.join(','),
      ...sortedStocks.map(stock => [
        stock.symbol,
        `"${stock.companyName}"`,
        stock.currentPrice.toFixed(2),
        stock.priceChange.toFixed(2),
        stock.priceChangePercent.toFixed(2),
        stock.volume,
        stock.marketCap,
        stock.fiftyTwoWeekHigh.toFixed(2),
        stock.fiftyTwoWeekLow.toFixed(2),
        stock.peRatio?.toFixed(2) || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${watchlist?.name || 'watchlist'}_details.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!watchlist) return null;

  const SortableHeader: React.FC<{ 
    sortKey: keyof StockInfo; 
    children: React.ReactNode;
    align?: 'left' | 'right';
  }> = ({ sortKey, children, align = 'left' }) => (
    <th 
      className={`py-3 px-4 font-medium cursor-pointer hover:bg-opacity-50 transition-colors text-${align}`}
      style={{ color: 'var(--text-secondary)' }}
      onClick={() => handleSort(sortKey)}
    >
      <div className={`flex items-center ${align === 'right' ? 'justify-end' : 'justify-start'} space-x-1`}>
        <span>{children}</span>
        <ArrowUpDown size={14} className={sortConfig.key === sortKey ? 'opacity-100' : 'opacity-40'} />
      </div>
    </th>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={watchlist.name} size="large">
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {watchlist.symbols.length} Stocks
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {watchlist.description}
            </p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(watchlist)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors hover:bg-opacity-80"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--surface)'
              }}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${watchlist.name}"? This action cannot be undone.`)) {
                    onDelete(watchlist.id);
                    onClose();
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                style={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  backgroundColor: 'var(--surface)'
                }}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            size={20}
            style={{ color: 'var(--text-secondary)' }}
          />
          <input
            type="text"
            placeholder="Search stocks..."
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

        {/* Stocks Table */}
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0" style={{ backgroundColor: 'var(--surface)' }}>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <SortableHeader sortKey="symbol">Symbol</SortableHeader>
                  <SortableHeader sortKey="companyName">Company</SortableHeader>
                  <SortableHeader sortKey="currentPrice" align="right">Price</SortableHeader>
                  <SortableHeader sortKey="priceChange" align="right">Change</SortableHeader>
                  <SortableHeader sortKey="volume" align="right">Volume</SortableHeader>
                  <SortableHeader sortKey="marketCap" align="right">Market Cap</SortableHeader>
                  <SortableHeader sortKey="fiftyTwoWeekHigh" align="right">52W Range</SortableHeader>
                  <SortableHeader sortKey="peRatio" align="right">P/E</SortableHeader>
                </tr>
              </thead>
              <tbody>
                {sortedStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    className="border-b hover:bg-opacity-50 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {stock.symbol}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {stock.companyName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(stock.currentPrice)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex flex-col items-end">
                        <div
                          className={`flex items-center space-x-1 ${
                            stock.priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {stock.priceChange >= 0 ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          <span className="font-medium">
                            {stock.priceChange >= 0 ? '+' : ''}{formatCurrency(stock.priceChange)}
                          </span>
                        </div>
                        <div
                          className={`text-xs ${
                            stock.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          {stock.priceChangePercent >= 0 ? '+' : ''}{stock.priceChangePercent.toFixed(2)}%
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {formatVolume(stock.volume)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {formatNumber(stock.marketCap)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-xs space-y-1">
                        <div style={{ color: 'var(--text-secondary)' }}>
                          H: {formatCurrency(stock.fiftyTwoWeekHigh)}
                        </div>
                        <div style={{ color: 'var(--text-secondary)' }}>
                          L: {formatCurrency(stock.fiftyTwoWeekLow)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {stock.peRatio ? stock.peRatio.toFixed(1) : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {sortedStocks.length}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Total Stocks
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-lg font-semibold text-green-500">
              {sortedStocks.filter(s => s.priceChange >= 0).length}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Up Today
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-lg font-semibold text-red-500">
              {sortedStocks.filter(s => s.priceChange < 0).length}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Down Today
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formatNumber(sortedStocks.reduce((sum, stock) => sum + stock.marketCap, 0))}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Total Market Cap
            </div>
          </div>
        </div>

        {/* Empty State */}
        {sortedStocks.length === 0 && (
          <div className="text-center py-8">
            <Search size={48} className="mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              No stocks found
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'This watchlist appears to be empty'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WatchlistDetailModal;
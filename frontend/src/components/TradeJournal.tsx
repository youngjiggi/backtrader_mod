import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Filter, Search, Calendar, DollarSign, Clock, Target } from 'lucide-react';
import { RecentRun } from './RecentRunsCarousel';

interface TradeJournalProps {
  strategy: RecentRun;
  className?: string;
}

type TradeView = 'all' | 'entries' | 'exits' | 'open';
type SortField = 'date' | 'pnl' | 'price' | 'size' | 'holdTime';
type SortDirection = 'asc' | 'desc';

interface CombinedTrade {
  id: string;
  type: 'entry' | 'exit' | 'open';
  date: string;
  tradeType: 'long' | 'short';
  price: number;
  size: number;
  reason: string;
  signal: string;
  pnl?: number;
  pnlPercent?: number;
  holdTime?: string;
  confidence?: number;
  entryId?: string;
  unrealizedPnl?: number;
}

const TradeJournal: React.FC<TradeJournalProps> = ({ strategy, className = '' }) => {
  const [view, setView] = useState<TradeView>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Combine and process trade data
  const combinedTrades = useMemo(() => {
    if (!strategy.tradeJournal) return [];

    const trades: CombinedTrade[] = [];

    // Add entries
    strategy.tradeJournal.entries.forEach(entry => {
      trades.push({
        id: entry.id,
        type: 'entry',
        date: entry.date,
        tradeType: entry.type,
        price: entry.price,
        size: entry.size,
        reason: entry.reason,
        signal: entry.signal,
        confidence: entry.confidence
      });
    });

    // Add exits
    strategy.tradeJournal.exits.forEach(exit => {
      trades.push({
        id: exit.id,
        type: 'exit',
        date: exit.date,
        tradeType: 'long', // Will be determined by matching entry
        price: exit.price,
        size: exit.size,
        reason: exit.reason,
        signal: exit.signal,
        pnl: exit.pnl,
        pnlPercent: exit.pnlPercent,
        holdTime: exit.holdTime,
        entryId: exit.entryId
      });
    });

    // Add open positions
    strategy.tradeJournal.openPositions.forEach(position => {
      trades.push({
        id: position.id,
        type: 'open',
        date: position.entryDate,
        tradeType: position.type,
        price: position.entryPrice,
        size: position.size,
        reason: 'Open Position',
        signal: 'Active',
        unrealizedPnl: position.unrealizedPnl,
        holdTime: position.holdTime
      });
    });

    return trades;
  }, [strategy.tradeJournal]);

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    let filtered = combinedTrades;

    // Filter by view
    if (view !== 'all') {
      filtered = filtered.filter(trade => trade.type === view);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(trade =>
        trade.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.signal.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.tradeType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'holdTime') {
        // Convert hold time to hours for sorting
        aValue = parseFloat(aValue?.replace('d', '') || '0') * 24;
        bValue = parseFloat(bValue?.replace('d', '') || '0') * 24;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [combinedTrades, view, searchTerm, sortField, sortDirection]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const entries = combinedTrades.filter(t => t.type === 'entry');
    const exits = combinedTrades.filter(t => t.type === 'exit');
    const openPositions = combinedTrades.filter(t => t.type === 'open');
    
    const totalPnl = exits.reduce((sum, exit) => sum + (exit.pnl || 0), 0);
    const totalUnrealizedPnl = openPositions.reduce((sum, pos) => sum + (pos.unrealizedPnl || 0), 0);
    const winningTrades = exits.filter(exit => (exit.pnl || 0) > 0).length;
    const losingTrades = exits.filter(exit => (exit.pnl || 0) < 0).length;

    return {
      totalEntries: entries.length,
      totalExits: exits.length,
      openPositions: openPositions.length,
      totalPnl,
      totalUnrealizedPnl,
      winRate: exits.length > 0 ? (winningTrades / exits.length) * 100 : 0,
      winningTrades,
      losingTrades
    };
  }, [combinedTrades]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTradeIcon = (trade: CombinedTrade) => {
    if (trade.type === 'entry') {
      return trade.tradeType === 'long' ? 
        <ArrowUpRight size={16} className="text-green-500" /> : 
        <ArrowDownLeft size={16} className="text-red-500" />;
    } else if (trade.type === 'exit') {
      return trade.tradeType === 'long' ? 
        <ArrowDownLeft size={16} className="text-blue-500" /> : 
        <ArrowUpRight size={16} className="text-orange-500" />;
    } else {
      return <Target size={16} className="text-yellow-500" />;
    }
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Summary Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Trade Journal
          </h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign size={14} style={{ color: 'var(--highlight)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Realized P&L:</span>
              <span className={`font-medium ${getPnlColor(summaryStats.totalPnl)}`}>
                {formatCurrency(summaryStats.totalPnl)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={14} style={{ color: 'var(--highlight)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Unrealized:</span>
              <span className={`font-medium ${getPnlColor(summaryStats.totalUnrealizedPnl)}`}>
                {formatCurrency(summaryStats.totalUnrealizedPnl)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp size={14} style={{ color: 'var(--highlight)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Win Rate:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {summaryStats.winRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Entries:</span>
            <span className="font-medium text-green-600">{summaryStats.totalEntries}</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Exits:</span>
            <span className="font-medium text-blue-600">{summaryStats.totalExits}</span>
          </div>
          <div className="flex items-center space-x-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Open:</span>
            <span className="font-medium text-yellow-600">{summaryStats.openPositions}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-3">
          {/* View Filter */}
          <div className="flex space-x-1">
            {(['all', 'entries', 'exits', 'open'] as TradeView[]).map((viewOption) => (
              <button
                key={viewOption}
                onClick={() => setView(viewOption)}
                className={`px-3 py-1.5 text-sm rounded transition-colors capitalize ${
                  view === viewOption ? 'font-medium' : ''
                }`}
                style={{
                  backgroundColor: view === viewOption ? 'var(--accent)' : 'var(--surface)',
                  color: view === viewOption ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: `1px solid ${view === viewOption ? 'var(--accent)' : 'var(--border)'}`
                }}
              >
                {viewOption}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search trades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
              focusRingColor: 'var(--accent)'
            }}
          />
        </div>
      </div>

      {/* Trades Table */}
      <div
        className="border rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Type
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium cursor-pointer hover:bg-opacity-50"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>Date</span>
                    {sortField === 'date' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium cursor-pointer hover:bg-opacity-50"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center space-x-1">
                    <DollarSign size={14} />
                    <span>Price</span>
                    {sortField === 'price' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium cursor-pointer hover:bg-opacity-50"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => handleSort('size')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Size</span>
                    {sortField === 'size' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Signal
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium cursor-pointer hover:bg-opacity-50"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => handleSort('pnl')}
                >
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={14} />
                    <span>P&L</span>
                    {sortField === 'pnl' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="text-left px-4 py-3 text-sm font-medium cursor-pointer hover:bg-opacity-50"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => handleSort('holdTime')}
                >
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>Hold Time</span>
                    {sortField === 'holdTime' && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Reason
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade, index) => (
                <tr
                  key={trade.id}
                  className={`border-t transition-colors hover:bg-opacity-50 ${
                    index % 2 === 0 ? '' : 'bg-opacity-30'
                  }`}
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--bg-primary)'
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      {getTradeIcon(trade)}
                      <span className="text-sm font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                        {trade.type} {trade.tradeType}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {formatDate(trade.date)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(trade.price)}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {trade.size.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {trade.signal}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {trade.type === 'exit' && trade.pnl !== undefined ? (
                      <div className="flex flex-col">
                        <span className={`font-medium ${getPnlColor(trade.pnl)}`}>
                          {formatCurrency(trade.pnl)}
                        </span>
                        {trade.pnlPercent && (
                          <span className={`text-xs ${getPnlColor(trade.pnl)}`}>
                            ({trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%)
                          </span>
                        )}
                      </div>
                    ) : trade.type === 'open' && trade.unrealizedPnl !== undefined ? (
                      <span className={`font-medium ${getPnlColor(trade.unrealizedPnl)}`}>
                        {formatCurrency(trade.unrealizedPnl)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {trade.holdTime || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {trade.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTrades.length === 0 && (
            <div className="text-center py-8">
              <p style={{ color: 'var(--text-secondary)' }}>
                No trades found {searchTerm ? `matching "${searchTerm}"` : 'for the selected view'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeJournal;
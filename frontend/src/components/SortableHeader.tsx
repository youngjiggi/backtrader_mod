import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SortableHeaderProps {
  children: React.ReactNode;
  sortKey: string;
  currentSort: {
    key: string;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: string) => void;
  className?: string;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  children,
  sortKey,
  currentSort,
  onSort,
  className = ''
}) => {
  const getSortIcon = () => {
    if (currentSort.key !== sortKey) {
      return <ChevronsUpDown size={14} style={{ color: 'var(--text-secondary)' }} />;
    }
    
    if (currentSort.direction === 'asc') {
      return <ChevronUp size={14} style={{ color: 'var(--accent)' }} />;
    }
    
    if (currentSort.direction === 'desc') {
      return <ChevronDown size={14} style={{ color: 'var(--accent)' }} />;
    }
    
    return <ChevronsUpDown size={14} style={{ color: 'var(--text-secondary)' }} />;
  };

  return (
    <th 
      className={`text-left py-3 px-4 font-medium cursor-pointer hover:bg-opacity-50 transition-colors ${className}`}
      onClick={() => onSort(sortKey)}
      style={{ 
        color: currentSort.key === sortKey ? 'var(--accent)' : 'var(--text-secondary)',
        userSelect: 'none'
      }}
    >
      <div className="flex items-center justify-between">
        <span>{children}</span>
        {getSortIcon()}
      </div>
    </th>
  );
};

export default SortableHeader;
import React from 'react';
import { List, Grid } from 'lucide-react';

interface ViewToggleProps {
  view: 'list' | 'thumbnail';
  onViewChange: (view: 'list' | 'thumbnail') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onViewChange('list')}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-opacity-80 flex items-center justify-center ${view === 'list' ? 'text-white' : ''}`}
        style={{
          borderColor: view === 'list' ? 'var(--accent)' : 'var(--border)',
          backgroundColor: view === 'list' ? 'var(--accent)' : 'var(--surface)',
          color: view === 'list' ? 'var(--bg-primary)' : 'var(--text-primary)',
          minHeight: '36px',
          height: '36px'
        }}
        title="List View"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => onViewChange('thumbnail')}
        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-opacity-80 flex items-center justify-center ${view === 'thumbnail' ? 'text-white' : ''}`}
        style={{
          borderColor: view === 'thumbnail' ? 'var(--accent)' : 'var(--border)',
          backgroundColor: view === 'thumbnail' ? 'var(--accent)' : 'var(--surface)',
          color: view === 'thumbnail' ? 'var(--bg-primary)' : 'var(--text-primary)',
          minHeight: '36px',
          height: '36px'
        }}
        title="Thumbnail View"
      >
        <Grid size={16} />
      </button>
    </div>
  );
};

export default ViewToggle;
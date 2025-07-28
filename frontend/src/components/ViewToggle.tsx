import React from 'react';
import { List, Grid } from 'lucide-react';

interface ViewToggleProps {
  view: 'list' | 'thumbnail';
  onViewChange: (view: 'list' | 'thumbnail') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-1 border rounded-lg p-1" style={{ borderColor: 'var(--border)' }}>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded transition-colors ${view === 'list' ? 'text-white' : ''}`}
        style={{
          backgroundColor: view === 'list' ? 'var(--accent)' : 'transparent',
          color: view === 'list' ? 'var(--bg-primary)' : 'var(--text-secondary)'
        }}
        title="List View"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => onViewChange('thumbnail')}
        className={`p-2 rounded transition-colors ${view === 'thumbnail' ? 'text-white' : ''}`}
        style={{
          backgroundColor: view === 'thumbnail' ? 'var(--accent)' : 'transparent',
          color: view === 'thumbnail' ? 'var(--bg-primary)' : 'var(--text-secondary)'
        }}
        title="Thumbnail View"
      >
        <Grid size={16} />
      </button>
    </div>
  );
};

export default ViewToggle;
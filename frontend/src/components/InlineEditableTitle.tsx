import React, { useState, useRef, useEffect } from 'react';
import { Edit, Check, X } from 'lucide-react';

interface InlineEditableTitleProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  titleStyle?: React.CSSProperties;
  placeholder?: string;
}

const InlineEditableTitle: React.FC<InlineEditableTitleProps> = ({
  value,
  onSave,
  className = '',
  titleStyle = {},
  placeholder = 'Enter title...'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`bg-transparent border-b-2 outline-none ${className}`}
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--text-primary)',
            ...titleStyle
          }}
          placeholder={placeholder}
        />
        <button
          onClick={handleSave}
          className="p-1 rounded hover:bg-opacity-80 transition-colors"
          style={{ color: '#10b981' }}
          title="Save"
        >
          <Check size={16} />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 rounded hover:bg-opacity-80 transition-colors"
          style={{ color: '#ef4444' }}
          title="Cancel"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 group">
      <span className={className} style={titleStyle}>
        {value}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-opacity-80 transition-all"
        style={{ color: 'var(--text-secondary)' }}
        title="Edit title"
      >
        <Edit size={14} />
      </button>
    </div>
  );
};

export default InlineEditableTitle;
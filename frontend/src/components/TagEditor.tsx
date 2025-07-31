import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';

interface TagEditorProps {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  className?: string;
}

const TagEditor: React.FC<TagEditorProps> = ({
  tags,
  onTagsChange,
  placeholder = 'Add tag...',
  maxTags = 10,
  className = ''
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag]);
    }
    setNewTag('');
    setIsAdding(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setNewTag('');
      setIsAdding(false);
    }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors group"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)'
          }}
        >
          <Tag size={12} className="mr-1" />
          {tag}
          <button
            onClick={() => handleRemoveTag(tag)}
            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove tag"
          >
            <X size={12} />
          </button>
        </span>
      ))}
      
      {isAdding ? (
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            className="text-xs px-2 py-1 rounded border outline-none"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--accent)',
              color: 'var(--text-primary)',
              width: '80px'
            }}
            placeholder={placeholder}
            maxLength={20}
          />
        </div>
      ) : (
        tags.length < maxTags && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)'
            }}
            title="Add tag"
          >
            <Plus size={12} className="mr-1" />
            Add tag
          </button>
        )
      )}
    </div>
  );
};

export default TagEditor;
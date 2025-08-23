import React from 'react';
import { NotificationItem } from '../types/agent';
import { ChevronRight } from 'lucide-react';

export interface NotificationCardProps {
  item: NotificationItem;
  onTap?: (item: NotificationItem) => void;
  onSwipeLeft?: (item: NotificationItem) => void; // Chat mode
  onSwipeRight?: (item: NotificationItem) => void; // Observation mode
}

const confidenceColor = (value: number) => {
  if (value >= 80) return '#10b981'; // green
  if (value >= 60) return '#f59e0b'; // amber
  return '#ef4444'; // red
};

const NotificationCard: React.FC<NotificationCardProps> = ({ item, onTap, onSwipeLeft, onSwipeRight }) => {
  // Basic touch swipe handling (can be replaced with react-swipeable later)
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchEndX.current - touchStartX.current;
    const threshold = 50; // px
    if (deltaX <= -threshold) onSwipeLeft?.(item);
    if (deltaX >= threshold) onSwipeRight?.(item);
  };

  const handleClick = () => onTap?.(item);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onTap?.(item);
      }}
      className="rounded-xl border p-4 mb-3 cursor-pointer select-none"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {/* Mini chart placeholder */}
          <div
            className="w-16 h-12 rounded-md"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.symbol}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: confidenceColor(item.confidence), color: 'white' }}>
                {item.confidence}%
              </span>
              {item.unread && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--highlight)' }} />
              )}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Strategy: {item.strategyName} {item.strategyVersion} · {new Date(item.createdAt).toLocaleTimeString()}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {item.marketCapCategory ? item.marketCapCategory.toUpperCase() : '—'} · {item.timeframe.toUpperCase()}
            </div>
          </div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--text-secondary)' }} />
      </div>
    </div>
  );
};

export default NotificationCard;



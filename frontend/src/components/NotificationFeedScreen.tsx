import React from 'react';
import { generateMockNotifications } from '../utils/mockNotifications';
import NotificationCard from './NotificationCard';
import { Filter, Mic } from 'lucide-react';

interface NotificationFeedScreenProps {
  onBack?: () => void;
  onOpenObservation?: (notificationId: string) => void;
  onOpenObservationItem?: (item: ReturnType<typeof generateMockNotifications>[number]) => void;
  onOpenChat?: (notificationId: string) => void;
}

const NotificationFeedScreen: React.FC<NotificationFeedScreenProps> = ({ onBack, onOpenObservation, onOpenObservationItem, onOpenChat }) => {
  const [notifications, setNotifications] = React.useState(() => generateMockNotifications(16));
  const [search, setSearch] = React.useState('');
  const [voiceEnabled, setVoiceEnabled] = React.useState(false);

  const filtered = notifications.filter(n => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      n.symbol.toLowerCase().includes(q) ||
      n.title.toLowerCase().includes(q) ||
      n.strategyName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--surface)' }}
              >
                Back
              </button>
            )}
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Drone Notifications</h1>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>({filtered.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="pl-3 pr-10 py-2 rounded-lg border"
                style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              />
              <button
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded"
                title="Voice"
                onClick={() => setVoiceEnabled(v => !v)}
                style={{ color: voiceEnabled ? 'var(--highlight)' : 'var(--text-secondary)' }}
              >
                <Mic size={16} />
              </button>
            </div>
            <button className="px-3 py-2 rounded-lg border flex items-center space-x-2" style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Body: 30/70 layout */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
        {/* Left control panel */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Filters</div>
            <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div>Confidence: 80%+</div>
              <div>Timeframe: 1H / 4H</div>
              <div>Unread Only</div>
            </div>
          </div>
          <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Voice</div>
            <button className="w-full px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--highlight)', color: 'white' }}>
              {voiceEnabled ? 'Listening…' : 'Enable Voice'}
            </button>
            <div className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Say "Read next" to hear the next notification.</div>
          </div>
        </aside>

        {/* Right notification list */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9">
          {filtered.map((n) => (
            <NotificationCard
              key={n.id}
              item={n}
              onTap={() => {
                onOpenObservationItem?.(n);
                onOpenObservation?.(n.id);
              }}
              onSwipeLeft={() => onOpenChat?.(n.id)}
              onSwipeRight={() => onOpenObservation?.(n.id)}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default NotificationFeedScreen;



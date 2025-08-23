import React from 'react';
import Modal from './Modal';
import { NotificationItem } from '../types/agent';
import { TrendingUp, Save, X } from 'lucide-react';

interface DroneReviewModalProps {
  isOpen: boolean;
  item: NotificationItem | null;
  onClose: () => void; // Will be wired to swipe-to-close later
  onExecute?: (item: NotificationItem) => void;
  onDismiss?: (item: NotificationItem) => void;
  onSave?: (item: NotificationItem) => void;
}

const DroneReviewModal: React.FC<DroneReviewModalProps> = ({ isOpen, item, onClose, onExecute, onDismiss, onSave }) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{item.symbol} · {item.title}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {item.strategyName} {item.strategyVersion} · {item.timeframe.toUpperCase()}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg" title="Close" style={{ border: '1px solid var(--border)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Summary */}
        <div className="rounded-xl border p-4 mb-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Summary</div>
          <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {item.companyName || item.symbol} · {item.marketCapCategory?.toUpperCase() || '—'} · Confidence {item.confidence}%
          </div>
        </div>

        {/* Chart placeholder (reuse actual chart later) */}
        <div className="rounded-xl border h-64 mb-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }} />

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2">
          <button
            className="px-3 py-2 rounded-lg border"
            onClick={() => item && onSave?.(item)}
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--surface)' }}
          >
            <Save size={16} />
          </button>
          <button
            className="px-3 py-2 rounded-lg border"
            onClick={() => item && onDismiss?.(item)}
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--surface)' }}
          >
            Dismiss
          </button>
          <button
            className="px-3 py-2 rounded-lg"
            onClick={() => item && onExecute?.(item)}
            style={{ backgroundColor: 'var(--highlight)', color: 'white' }}
          >
            <TrendingUp size={16} />
            <span className="ml-2">Execute</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DroneReviewModal;



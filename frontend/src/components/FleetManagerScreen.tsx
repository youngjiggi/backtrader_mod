import React from 'react';
import { mockDrones } from '../utils/mockNotifications';
import { DroneConfig } from '../types/agent';
import { Plus, Pause, Play, Trash2 } from 'lucide-react';

interface FleetManagerScreenProps {
  onBack?: () => void;
  onDeployDrone?: (drone: DroneConfig) => void;
}

const statusDot = (status: DroneConfig['status']) => {
  const color = status === 'running' ? '#10b981' : status === 'paused' ? '#f59e0b' : '#ef4444';
  return <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />;
};

const FleetManagerScreen: React.FC<FleetManagerScreenProps> = ({ onBack, onDeployDrone }) => {
  const [drones, setDrones] = React.useState<DroneConfig[]>(mockDrones);

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
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Drone Fleet</h1>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Active: {drones.filter(d => d.status === 'running').length}</span>
          </div>
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--highlight)', color: 'white' }}
            onClick={() => {
              const draft: DroneConfig = {
                id: `drone_${Date.now()}`,
                name: 'New Drone',
                strategyName: 'ATR+CVD',
                strategyVersion: 'v1.0',
                symbols: ['AAPL'],
                schedule: '1h',
                minConfidence: 75,
                status: 'paused'
              };
              onDeployDrone?.(draft);
            }}
          >
            <Plus size={16} />
            <span>Deploy New Drone</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-12 text-sm font-medium px-4 py-3" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Strategy</div>
            <div className="col-span-3">Symbols</div>
            <div className="col-span-2">Last Scan</div>
            <div className="col-span-1">Setups</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {drones.map((drone) => (
            <div key={drone.id} className="grid grid-cols-12 items-center px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="col-span-2 flex items-center space-x-2" style={{ color: 'var(--text-primary)' }}>
                {statusDot(drone.status)}
                <span className="capitalize">{drone.status}</span>
              </div>
              <div className="col-span-3" style={{ color: 'var(--text-primary)' }}>
                {drone.name}
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{drone.strategyName} {drone.strategyVersion}</div>
              </div>
              <div className="col-span-3" style={{ color: 'var(--text-primary)' }}>{drone.symbols.join(', ')}</div>
              <div className="col-span-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {drone.lastScanAt ? new Date(drone.lastScanAt).toLocaleTimeString() : '—'}
              </div>
              <div className="col-span-1 text-sm" style={{ color: 'var(--text-primary)' }}>{drone.setupsFoundToday ?? 0}</div>
              <div className="col-span-1 flex items-center justify-end space-x-2">
                {drone.status === 'running' ? (
                  <button className="p-2 rounded-lg" title="Pause" style={{ border: '1px solid var(--border)' }}>
                    <Pause size={16} />
                  </button>
                ) : (
                  <button className="p-2 rounded-lg" title="Resume" style={{ border: '1px solid var(--border)' }}>
                    <Play size={16} />
                  </button>
                )}
                <button className="p-2 rounded-lg" title="Remove" style={{ border: '1px solid var(--border)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetManagerScreen;



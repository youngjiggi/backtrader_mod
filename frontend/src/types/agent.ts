/**
 * Shared types for the FSD-optimized notification system (frontend-only).
 * These types intentionally avoid backend coupling and are safe to use in UI components,
 * contexts, and mock utilities.
 */

export type ConfidenceLevel = number; // 0-100

export type MarketCapCategory = 'micro' | 'small' | 'mid' | 'large' | 'mega';

export type TimeframeKey = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export interface NotificationIndicators {
  atr?: {
    period?: number;
    value?: number;
  };
  cvd?: {
    threshold?: number;
    direction?: 'positive' | 'negative';
  };
  volume?: {
    multiple?: number; // relative volume multiple
  };
}

export interface NotificationMetrics {
  winRate?: number; // percentage 0-100
  sharpe?: number;
}

export interface NotificationItem {
  id: string;
  symbol: string;
  companyName?: string;
  marketCapCategory?: MarketCapCategory;
  timeframe: TimeframeKey;
  strategyName: string;
  strategyVersion: string;
  title: string; // e.g., "Stage 2 Breakout"
  confidence: ConfidenceLevel;
  createdAt: string; // ISO 8601
  unread?: boolean;
  indicators?: NotificationIndicators;
  metrics?: NotificationMetrics;
}

export type DroneStatus = 'running' | 'paused' | 'stopped';

export type DroneSchedule = '15m' | '1h' | '4h' | '1d';

export interface DroneConfig {
  id: string;
  name: string;
  strategyId?: string;
  strategyName: string;
  strategyVersion: string;
  symbols: string[];
  schedule: DroneSchedule;
  minConfidence: ConfidenceLevel;
  status: DroneStatus;
  lastScanAt?: string; // ISO 8601
  setupsFoundToday?: number;
}

export type VoiceAction =
  | 'read_next'
  | 'execute'
  | 'dismiss'
  | 'show_chart'
  | 'open_chat'
  | 'save'
  | 'filter_high_confidence';

export interface VoiceCommand {
  phrase: string;
  action: VoiceAction;
  description?: string;
}



import { NotificationItem, DroneConfig, VoiceCommand } from '../types/agent';

// Mock notifications for frontend-only development
export const generateMockNotifications = (count: number = 12): NotificationItem[] => {
  const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'META'];
  const strategies = [
    { name: 'ATR+CVD', version: 'v1.2' },
    { name: 'Momentum Reversal', version: 'v0.9' },
    { name: 'Stage 2 Breakout', version: 'v2.0' }
  ];

  const now = Date.now();
  return Array.from({ length: count }).map((_, i) => {
    const sym = symbols[i % symbols.length];
    const strat = strategies[i % strategies.length];
    const confidence = Math.min(98, Math.max(55, 60 + (i * 7) % 40));
    const marketCapCategory: NotificationItem['marketCapCategory'] =
      i % 5 === 0 ? 'mega' : i % 5 === 1 ? 'large' : i % 5 === 2 ? 'mid' : i % 5 === 3 ? 'small' : 'micro';

    return {
      id: `notif_${now}_${i}`,
      symbol: sym,
      companyName: sym === 'AAPL' ? 'Apple Inc.' : sym === 'TSLA' ? 'Tesla, Inc.' : undefined,
      marketCapCategory,
      timeframe: i % 2 === 0 ? '1h' : '4h',
      strategyName: strat.name,
      strategyVersion: strat.version,
      title: strat.name === 'Stage 2 Breakout' ? 'Stage 2 Breakout' : 'High-Confidence Setup',
      confidence,
      createdAt: new Date(now - i * 60_000).toISOString(),
      unread: i < 5,
      indicators: {
        atr: { period: 14, value: 2.1 + (i % 5) * 0.2 },
        cvd: { threshold: 0.5, direction: i % 2 === 0 ? 'positive' : 'negative' },
        volume: { multiple: 1.5 + (i % 3) * 0.4 }
      },
      metrics: {
        winRate: 60 + (i % 6) * 5,
        sharpe: 1.2 + (i % 4) * 0.2
      }
    };
  });
};

export const mockDrones: DroneConfig[] = [
  {
    id: 'drone_1',
    name: 'ATR+CVD Classic',
    strategyName: 'ATR+CVD',
    strategyVersion: 'v1.2',
    symbols: ['AAPL', 'TSLA', 'NVDA'],
    schedule: '1h',
    minConfidence: 75,
    status: 'running',
    lastScanAt: new Date(Date.now() - 2 * 60_000).toISOString(),
    setupsFoundToday: 3
  },
  {
    id: 'drone_2',
    name: 'Momentum Reversal Growth',
    strategyName: 'Momentum Reversal',
    strategyVersion: 'v0.9',
    symbols: ['QQQ', 'SOXL'],
    schedule: '4h',
    minConfidence: 70,
    status: 'paused',
    lastScanAt: new Date(Date.now() - 60 * 60_000).toISOString(),
    setupsFoundToday: 0
  }
];

export const voiceCommands: VoiceCommand[] = [
  { phrase: 'read next', action: 'read_next', description: 'Read the next notification' },
  { phrase: 'execute', action: 'execute', description: 'Execute the highlighted setup' },
  { phrase: 'dismiss', action: 'dismiss', description: 'Dismiss the highlighted notification' },
  { phrase: 'show chart', action: 'show_chart', description: 'Open observation mode (chart view)' },
  { phrase: 'open chat', action: 'open_chat', description: 'Enter chat mode with agent' },
  { phrase: 'save', action: 'save', description: 'Save notification for later' },
  { phrase: 'high confidence only', action: 'filter_high_confidence', description: 'Filter feed to 80%+ confidence' }
];



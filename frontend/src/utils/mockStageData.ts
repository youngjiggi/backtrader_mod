// Mock data generator for Weinstein Stage Analysis

export interface StageAnalysisData {
  priceData: { date: string; open: number; high: number; low: number; close: number; volume: number }[];
  movingAverage30W: { date: string; value: number }[];
  stageAnalysis: {
    stages: { date: string; stage: 1 | 2 | 3 | 4; sataScore: number }[];
    relativeStrength: { date: string; value: number }[];
    momentum: { date: string; value: number }[];
    stageTransitions: { date: string; fromStage: 1 | 2 | 3 | 4; toStage: 1 | 2 | 3 | 4; trigger: string }[];
  };
}

export const generateMockStageData = (
  _symbol: string,
  startDate: string,
  endDate: string,
  basePrice: number = 150
): StageAnalysisData => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate price data with stage-appropriate movements
  const priceData: { date: string; open: number; high: number; low: number; close: number; volume: number }[] = [];
  const movingAverage30W: { date: string; value: number }[] = [];
  const stages: { date: string; stage: 1 | 2 | 3 | 4; sataScore: number }[] = [];
  const relativeStrength: { date: string; value: number }[] = [];
  const momentum: { date: string; value: number }[] = [];
  const stageTransitions: { date: string; fromStage: 1 | 2 | 3 | 4; toStage: 1 | 2 | 3 | 4; trigger: string }[] = [];

  let currentPrice = basePrice;
  let currentStage: 1 | 2 | 3 | 4 = 1;
  let stageStartDay = 0;
  let ma30W = basePrice;
  // let _trendDirection = 1; // 1 for up, -1 for down
  
  // Define stage durations (in days)
  const stageDurations = {
    1: Math.floor(totalDays * 0.25), // 25% in Stage 1 (Basing)
    2: Math.floor(totalDays * 0.35), // 35% in Stage 2 (Advancing)
    3: Math.floor(totalDays * 0.2),  // 20% in Stage 3 (Topping)
    4: Math.floor(totalDays * 0.2)   // 20% in Stage 4 (Declining)
  };

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Determine current stage
    let newStage: 1 | 2 | 3 | 4 = 1;
    if (i < stageDurations[1]) {
      newStage = 1;
    } else if (i < stageDurations[1] + stageDurations[2]) {
      newStage = 2;
    } else if (i < stageDurations[1] + stageDurations[2] + stageDurations[3]) {
      newStage = 3;
    } else {
      newStage = 4;
    }

    // Record stage transitions
    if (newStage !== currentStage) {
      const triggers = {
        '1to2': 'Breakout above 30W MA on volume',
        '2to3': 'Failed rally, momentum divergence',
        '3to4': 'Breakdown below 30W MA on volume',
        '4to1': 'Base formation, volume drying up'
      };
      
      const transitionKey = `${currentStage}to${newStage}` as keyof typeof triggers;
      stageTransitions.push({
        date: dateStr,
        fromStage: currentStage,
        toStage: newStage,
        trigger: triggers[transitionKey] || 'Technical indicator threshold'
      });
      
      currentStage = newStage;
      stageStartDay = i;
    }

    // Generate price movement based on stage
    let volatility = 0.02;
    let drift = 0;
    let volume = 1000000;

    switch (currentStage) {
      case 1: // Basing - sideways with low volatility
        volatility = 0.015;
        drift = 0.0005; // Slight upward bias
        volume = 800000 + Math.random() * 400000;
        break;
      case 2: // Advancing - strong uptrend
        volatility = 0.025;
        drift = 0.003;
        volume = 1200000 + Math.random() * 800000;
        // _trendDirection = 1;
        break;
      case 3: // Topping - volatile sideways
        volatility = 0.03;
        drift = 0.0001; // Minimal drift
        volume = 1000000 + Math.random() * 1000000;
        break;
      case 4: // Declining - downtrend
        volatility = 0.025;
        drift = -0.002;
        volume = 1100000 + Math.random() * 700000;
        // _trendDirection = -1;
        break;
    }

    // Generate daily OHLC
    const change = (Math.random() - 0.5) * volatility + drift;
    const open = currentPrice * (1 + (Math.random() - 0.5) * 0.005);
    const close = open * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    currentPrice = close;

    priceData.push({
      date: dateStr,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(volume)
    });

    // Update 30-week MA (simplified to 30-day for daily data)
    if (i >= 30) {
      const last30Prices = priceData.slice(-30).map(p => p.close);
      ma30W = last30Prices.reduce((sum, price) => sum + price, 0) / 30;
    } else {
      ma30W = currentPrice; // Use current price for first 30 days
    }

    movingAverage30W.push({
      date: dateStr,
      value: Math.round(ma30W * 100) / 100
    });

    // Generate SATA scores based on stage and price/MA relationship
    let sataScore = 5; // Neutral
    const priceVsMA = (currentPrice - ma30W) / ma30W;
    
    switch (currentStage) {
      case 1:
        sataScore = 2 + Math.random() * 6; // 2-8 range
        break;
      case 2:
        sataScore = 6 + Math.random() * 4; // 6-10 range
        if (priceVsMA > 0.05) sataScore = Math.min(10, sataScore + 1);
        break;
      case 3:
        sataScore = 8 - (i - stageStartDay) / stageDurations[3] * 6; // 8 declining to 2
        sataScore = Math.max(2, sataScore);
        break;
      case 4:
        sataScore = Math.random() * 5; // 0-5 range
        break;
    }

    stages.push({
      date: dateStr,
      stage: currentStage,
      sataScore: Math.round(sataScore * 10) / 10
    });

    // Generate relative strength (simplified)
    const rsValue = priceVsMA * 100 + (Math.random() - 0.5) * 20;
    relativeStrength.push({
      date: dateStr,
      value: Math.round(rsValue * 10) / 10
    });

    // Generate momentum
    const momentumValue = change * 1000 + (Math.random() - 0.5) * 10;
    momentum.push({
      date: dateStr,
      value: Math.round(momentumValue * 10) / 10
    });
  }

  return {
    priceData,
    movingAverage30W,
    stageAnalysis: {
      stages,
      relativeStrength,
      momentum,
      stageTransitions
    }
  };
};
# Migration Plan: Backtrader to VectorBT

Based on research and analysis, here's a comprehensive plan to migrate from Backtrader to VectorBT for significantly improved performance and maintainability.

## Phase 1: Environment Setup & Installation (Priority: High)
- Install VectorBT with full dependencies: `pip install -U "vectorbt[full]"`
- Verify Python 3.10 compatibility (VectorBT limitation)
- Set up virtual environment to avoid dependency conflicts
- Install supporting packages: pandas, numpy, ta-lib, yfinance

## Phase 2: Backend Architecture Migration (Priority: High)
- Replace `backtest_test.py` Backtrader logic with VectorBT vectorized approach
- Create FastAPI endpoints for VectorBT backtesting:
  - `/api/backtest` - Run strategy backtests
  - `/api/strategies` - Manage strategy parameters  
  - `/api/data` - Handle OHLCV data uploads
- Implement VectorBT Portfolio class for strategy execution
- Add vectorized ATR-based trimming and CVD threshold logic

## Phase 3: Strategy Implementation (Priority: High)  
- Convert existing ATR strategy to vectorized operations using pandas/numpy
- Implement Weinstein stage analysis as vectorized calculations
- Create signal hierarchy system using VectorBT's multi-dimensional arrays
- Add volume profile and momentum indicators as vectorized functions

## Phase 4: Performance Optimization (Priority: Medium)
- Leverage VectorBT's Numba acceleration for <2s backtest requirement
- Implement parallel strategy testing across multiple symbols
- Add optimization loops for parameter tuning (ATR multipliers, etc.)
- Create caching system for repeated backtests

## Phase 5: Chart Data Integration (Priority: Medium)
- Replace mock chart data with VectorBT's built-in performance metrics
- Export portfolio statistics and trade data as JSON for React frontend
- Integrate VectorBT's Plotly charts with existing StageAnalysisChart component
- Add real-time chart updates via WebSocket or polling

## Expected Benefits:
- **10x faster** backtesting performance vs Backtrader
- **Sub-second** execution for 1k+ bars (meets <2s requirement)
- **Active maintenance** and community support
- **Seamless pandas integration** for data workflows
- **Vectorized operations** for complex multi-timeframe analysis

This migration will transform the backtesting engine from a slow, maintenance-heavy solution to a high-performance, future-proof system ideal for your MVP goals.

## Implementation Notes

### Key Differences from Backtrader
1. **Vectorized vs Event-driven**: VectorBT processes entire datasets at once vs Backtrader's bar-by-bar approach
2. **Performance**: VectorBT uses NumPy/Numba acceleration for 10x speed improvements
3. **Data Structure**: Multi-dimensional arrays allow testing thousands of parameter combinations simultaneously
4. **Maintenance**: Active development vs Backtrader's stagnant state since 2022

### Migration Strategy
- Keep existing frontend components intact during backend migration
- Maintain API compatibility to minimize frontend changes
- Phase rollout allows for testing and validation at each step
- Fallback plan: Keep Backtrader code until VectorBT fully validated

### Risk Mitigation
- Python 3.10 compatibility requirement may need environment management
- VectorBT learning curve offset by extensive documentation and community
- Dependency conflicts handled through virtual environment isolation
- Performance benchmarking to validate <2s backtest requirement
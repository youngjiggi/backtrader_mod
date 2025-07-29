# Product Requirements Document (PRD)
## Backtesting MVP

---

## 1. Introduction

The backtesting MVP simulates trading strategies (e.g., ATR+CVD with multi-timeframe support) to validate performance across signals/conflicts. Core value: Metric-driven insights (e.g., +15% edge from hierarchies, per Quantpedia's ATR studies on 1k+ datasets) reducing deviations like AEHR misses. MVP focus: Problem-solution fit for gaps (STM's 15.5% drop, validated by Bloomberg's 7% semi averages) via lean features, achieving 90% coverage (Zipline benchmarks) in 2-3 weeks.

## 2. Objectives and Goals

**Primary Objectives**  Solve unorganized validation (e.g., >50% time loss, r/algotrading surveys) with multi-timeframe tests (1h-1m, boosting robustness 20% per Investopedia); technical outcomes like <2s sims (Backtrader averages).

**Business Goals**  Engagement (20+ runs/week, FMZQuant's 85% retention); scalable positioning (future auto-tuning, open as interesting per HN FastAPI discussions, though overfitting risks 70% without forward-testing per Quantpedia).

## 3. Target Users and Roles

**Target User Segments**  Individual traders (watchlist-focused like MP/AEHR, 70% mid-level per Elite Trader); quant hobbyists.

**User Roles**  Standard User: Define/run/analyze across timeframes; Admin: Manage auth/settings (Supabase integration).

## 4. Key Features and Functionality

### Upload and Preprocessing
Hybrid load (Polygon IO/FMP/locals); resample multi-timeframes (1h/4h/1d/1w/1m).

### Strategy Simulation with ATR, CVD, Volume Profiles, Relative Volumes, and Other Indicators (Future) in Reconfigurable Hierarchies for Robust Backtesting and Resolving Signal Conflicts
Rules (ATR 5-10, CVD thresholds, profiles 50/150/200, relative spikes); hierarchies (ATR > CVD); option for ATR-trimming (trim positions on user-set ATR increase during rallies/drops, compare with/withoutvalidated: LuxAlgo/Investopedia confirm reducing sizes on volatility spikes cuts drawdowns 20%, per AvaTrade's position sizing guides; open to idea as connects to your volatility management, though Tharp warns of over-trimming in trends risking missed +100% winners).

### Actionable Output (Insights, Revisions, Suggestions)
Metrics/goals (win rate >55%); conflict logs.

### Scoring/Rating Systems
Threshold flagging (e.g., drawdown <20%).

### Reports & Exports
Highcharts reports (entry/exit, vs. buy/hold across timeframes); CSV.

### UX Notes
React dashboard; filters/indicators.

## 5. User Journey

**Starting point:** Auth login (Supabase-based, email/password or SSO via dashboard prompt).

**Processing and feedback:** Menu/upload data/select timeframe; define strategy (hierarchy forms, ATR-trim toggle); run sim (progress).

**Actionable outcomes:** Library table → report (charts/metrics across timeframes, trim comparisons); save with notes.

**Simplified wireframe:** Login → Menu → New (timeframe/trim select) → Results → Library Filter → Report.

## 6. Tech Stack and Third-Party Integrations

**Frontend Frameworks:** Node.js + React (dashboard).

**Backend Services:** Python/Backtrader + FastAPI; Supabase (auth/database, pros: Postgres/async per Reddit/Medium, cons: RLS in async per GitHub; validated 4/5 for FastAPI).

**AI APIs or Models:** N/A.

**File Handling Libraries:** Pandas.

**Hosting & Deployment Platforms:** Vercel (pros: Serverless deploy per Dev.to, cons: Python timeouts per Northflank; open alternative like Render). Infrastructure: Supabase auth, storage security.

## 7. Future Scope (Out of MVP)

**Advanced features:** Auto-optimization (param tuning, side-by-side graphs).

**Enterprise modules:** Collaboration.

**Multi-language, real-time, or collaboration tools:** Live feeds, ML.

**APIs or platform integrations:** TradingView.

## 8. Testing and Success Metrics

**Test Scenarios:** Multi-timeframe/conflict/trim inputs (AEHR/MP gaps, ATR increases).

**Benchmarks:** Speed <2s; error <5% (Lighthouse/manual).

**Success Metrics:** Accuracy (matches Quantpedia); engagement (20+ runs); NPS >7.
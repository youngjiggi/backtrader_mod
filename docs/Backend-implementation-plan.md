# Backtesting MVP -- Backend Implementation Checklist (MVP Phase 1)
=============================================================

* * * * *

## SECTION 1: Initial Setup (Supabase Environment and Project)
-----------------------------------------------------------

- [ ] Set up Supabase project and connect to the React frontend
- [ ] Configure Supabase secrets for:
  - [ ] POLYGON_API_KEY
  - [ ] FMP_API_KEY
  - [ ] STRIPE_SECRET_KEY
- [ ] Set up Supabase service role and permissions for Edge Functions
- [ ] Link Supabase project to GitHub (optional, for CI/CD)
- [ ] Set up Supabase Edge Functions directory with correct CLI structure

* * * * *

## SECTION 2: Database Schema Setup
--------------------------------

- [ ] Set up the entire database schema inside Supabase according to project specs
  - [ ] users table (id, email, full_name, is_pro, pro_expires_at, stripe_customer_id, created_at)
  - [ ] strategies table (id, user_id, name, version, date, keynote, params_json)
  - [ ] backtest_runs table (id, strategy_id, user_id, timestamp, metrics_json, logs_json, unread_flag)
  - [ ] stripe_customers table (id, user_id, stripe_id)
  - [ ] stripe_subscriptions table (id, customer_id, status, tier, expires_at)

* * * * *

## SECTION 3: Authentication and Access Control
--------------------------------------------

- [ ] Enable email/password authentication in Supabase Auth
- [ ] Extend the users table with custom fields as above
- [ ] Enable Row-Level Security (RLS) on all user-related tables
- [ ] Add auth.uid() = user_id policies to:
  - [ ] users
  - [ ] strategies
  - [ ] backtest_runs
  - [ ] stripe_customers
  - [ ] stripe_subscriptions

* * * * *

## SECTION 4: Data Ingestion and Preprocessing
-------------------------------------------

- [ ] Create Edge Function data_ingest.ts (or Python equiv):
  - [ ] Accepts symbol/timeframe or optional CSV/JSON upload
  - [ ] Fetches from Polygon IO/FMP APIs or parses local file
  - [ ] Resamples data to 1h/4h/1d/1w/1m
  - [ ] Computes initial indicators (e.g., volume profiles for 50/150/200 bins)
  - [ ] Stores processed data in Supabase for reuse
- [ ] Implement rate limit handling for APIs
- [ ] Handle errors with fallback to cached/local data

* * * * *

## SECTION 5: Strategy Simulation and Backtesting
----------------------------------------------

- [ ] Create Edge Function run_backtest.ts (or Python equiv with VectorBT):
  - [ ] Accepts params (ATR period/multiplier, CVD threshold, hierarchies, trim toggle, phase ID)
  - [ ] Generates signals modularly (ATR_alpha, CVD_alpha functions)
  - [ ] Resolves hierarchies/conflicts (e.g., ATR > CVD via logical ops)
  - [ ] Applies trimming on ATR spikes if enabled
  - [ ] Identifies phases (reversals/consolidations via MA/volume)
  - [ ] Tracks profile shifts (sliding windows/200-day basis)
  - [ ] Runs VectorBT Portfolio.from_signals for metrics (win rate, Sharpe, drawdown, vs. buy/hold)
  - [ ] Stores run in backtest_runs with JSON metrics/logs/unread flag
- [ ] Support multi-timeframe batch runs
- [ ] Handle VectorBT errors with retries/fallbacks

* * * * *

## SECTION 6: Reports and Exports
------------------------------

- [ ] Create Edge Function generate_report.ts (or Python equiv):
  - [ ] Accepts run_id
  - [ ] Fetches data/metrics from Supabase
  - [ ] Generates JSON for Highcharts (charts/phases/shifts)
  - [ ] Includes conflict logs, trim/phase summaries
  - [ ] Exports to CSV on request
- [ ] Mark run as read (update unread_flag)
- [ ] Handle goal flagging (e.g., win rate >55%)

* * * * *

## SECTION 7: Subscription and Stripe Integration
----------------------------------------------

- [ ] Create Stripe products: free_tier, pro_monthly, pro_yearly, enterprise_monthly with metadata
- [ ] Set up Stripe Hosted Checkout flow
  - [ ] Add /api/subscribe endpoint to create sessions
  - [ ] Handle webhooks for checkout.completed, invoice.succeeded, subscription.deleted
  - [ ] On success: Update users.is_pro and expires_at in Supabase
  - [ ] On cancel: Set is_pro = false
  - [ ] Insert/update stripe_subscriptions
- [ ] Enforce limits (e.g., Free: 10 runs/month via query checks)

* * * * *

## SECTION 8: Feature Gating and Access Logic
------------------------------------------

- [ ] In /api/backtest and /api/runs: Check users.is_pro to unlock unlimited/Pro features
- [ ] Restrict reports/library depth for Free users (e.g., no advanced phases)
- [ ] Return upgrade prompts on limits (JSON error with CTA)

* * * * *

## SECTION 9: Final QA and Validation
-----------------------------------

### Functional QA
- [ ] Test full data-to-sim-to-report flow for symbols/timeframes
- [ ] Verify VectorBT outputs stored/rendered correctly
- [ ] Confirm hierarchies resolve conflicts accurately
- [ ] Log and track phases/shifts properly

### Integration QA
- [ ] Validate Stripe checkout/webhook flow
- [ ] Test tier upgrades/downgrades
- [ ] Ensure API responses match UI components

### Security QA
- [ ] Ensure RLS blocks unauthorized data access
- [ ] Verify run limits enforced
- [ ] Confirm Pro features locked for Free

### Edge Case Handling
- [ ] Fallback if VectorBT response empty
- [ ] Retry on API failures (Polygon/FMP/Stripe)
- [ ] Handle large datasets without timeouts
- [ ] Prevent report generation on insufficient data
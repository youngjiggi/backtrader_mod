# Database Design Documentation

This database is structured using Supabase (PostgreSQL + Auth + Edge Functions). It is designed to support all finalized MVP features including user authentication, strategy definition and simulation, backtest run tracking with metrics/logs/unread flags, phase/shift analysis, and Stripe-based subscription logic for tiers (Free: limited runs; Pro: unlimited/advanced; Enterprise: API/teams access).

## 1. users Table (Built-in via Supabase Auth)
This table stores all user accounts. It extends the default Supabase auth.users with custom fields using custom structure.

**Fields:**
- `id (UUID)`: Primary Key (same as Supabase auth UID)
- `email (TEXT)`: Email address (auto-synced)
- `created_at (TIMESTAMP, default: now())`: User registration time
- `is_pro (BOOLEAN, default: false)`: Indicates Pro/Enterprise plan access
- `subscription_tier (TEXT, default: 'free')`: Subscription level ('free', 'pro', 'enterprise')
- `subscription_expires_at (TIMESTAMP, nullable)`: Subscription expiry date
- `stripe_customer_id (TEXT, nullable)`: For syncing Stripe customers

**Purpose:** To authenticate users, track their subscription status (integrated with Stripe for tier enforcement, e.g., limiting Free users to 10 runs/month), and personalize access to features like unlimited backtests and advanced reports.

## 2. strategies Table
Stores named strategies with versions and parameters for reusability across backtests.

**Fields:**
- `id (UUID)`: Primary Key
- `user_id (UUID)`: Foreign key referencing users.id
- `name (TEXT)`: Strategy name (e.g., "ATR+CVD v1.0")
- `version (TEXT)`: Version identifier (e.g., "1.0")
- `keynote (TEXT, nullable)`: User notes describing the strategy (e.g., "Test CVD in low-vol uptrends")
- `params_json (JSONB)`: JSON object for parameters (e.g., {"atr_period": 10, "cvd_threshold": 0.5, "trim_enabled": true, "phase_id": "reversal"})
- `created_at (TIMESTAMP, default: now())`: Creation time

**Purpose:** To capture reusable strategy configurations (including ATR periods, CVD thresholds, trimming toggles, phase IDs, and hierarchies), enabling versioned testing and easy retrieval for new runs in the UI flow.

## 3. backtest_runs Table
Stores results of each backtest run, including metrics, logs, and unread flags for UI display.

**Fields:**
- `id (UUID)`: Primary Key
- `user_id (UUID)`: Foreign key referencing users.id
- `strategy_id (UUID, nullable)`: Foreign key referencing strategies.id (links to parent strategy)
- `timestamp (TIMESTAMP, default: now())`: Run execution time
- `metrics_json (JSONB)`: JSON object for results (e.g., {"win_rate": 0.55, "sharpe": 1.2, "drawdown": 0.15, "return_vs_buyhold": 0.10})
- `logs_json (JSONB)`: JSON array for logs (e.g., [{"conflict": "CVD negative but ATR held", "net_impact": "+5%"}])
- `unread_flag (BOOLEAN, default: true)`: Indicates if the run/report is unread (for UI badges)
- `timeframe (TEXT)`: Run timeframe (e.g., '1d')
- `phase_data_json (JSONB, nullable)`: JSON for phases/shifts (e.g., {"reversal": {"ma_cross": true, "volume_spike": 1.5}, "shifts": [{"buyer_zone_move": "+10%"}]})
- `created_at (TIMESTAMP, default: now())`: Creation time

**Purpose:** To log each backtest execution (linked to strategies for versioning), store computed metrics/logs for reports, track unread status for UI notifications, and capture phase/shift data for visualizations, ensuring seamless integration with library and report screens.

## 4. stripe_customers Table
Stores Stripe customer metadata for subscription management.

**Fields:**
- `id (UUID)`: Primary Key
- `user_id (UUID)`: Foreign key referencing users.id
- `stripe_id (TEXT)`: Stripe customer ID
- `created_at (TIMESTAMP, default: now())`: Creation time

**Purpose:** To sync Stripe customers with users for billing (e.g., creating customers on signup/upgrade), supporting tier enforcement and webhook updates.

## 5. stripe_subscriptions Table
Tracks active subscriptions and their status from Stripe.

**Fields:**
- `id (UUID)`: Primary Key
- `customer_id (UUID)`: Foreign key referencing stripe_customers.id
- `stripe_subscription_id (TEXT)`: Stripe subscription ID
- `status (TEXT)`: Subscription status (e.g., 'active', 'canceled', 'past_due')
- `tier (TEXT)`: Tier level ('pro', 'enterprise')
- `billing_cycle (TEXT)`: 'monthly' or 'yearly'
- `current_period_end (TIMESTAMP)`: End of current billing period
- `created_at (TIMESTAMP, default: now())`: Creation time

**Purpose:** To monitor and enforce subscriptions (e.g., update users.is_pro on webhook events like payment succeeded/canceled), integrating with Stripe for monetization (Free limits, Pro unlimited at $9.99/month, Enterprise API at $49.99/month).

## 🔗 Relationships Overview

- `users.id` → `strategies.user_id` (one-to-many: users own multiple strategies)
- `users.id` → `backtest_runs.user_id` (one-to-many: users run multiple backtests)
- `strategies.id` → `backtest_runs.strategy_id` (one-to-many: strategies have multiple runs)
- `users.id` → `stripe_customers.user_id` (one-to-one: users link to Stripe customers)
- `stripe_customers.id` → `stripe_subscriptions.customer_id` (one-to-many: customers have subscription history)

## 🔐 RLS (Row-Level Security) Notes

For each table:

- Enforce `user_id = auth.uid()` to prevent unauthorized access (e.g., on strategies, backtest_runs).
- Lock down stripe_customers/subscriptions for reading only by admins or via webhooks (no direct user access).
- Use Supabase policies to limit Free users (e.g., count backtest_runs <10 per month before insert).

---

**Available Extensions:**
- RLS policy templates
- SQL migration file for these schemas  
- Entity Relationship Diagram (ERD) to visualize it
import pandas as pd
import numpy as np

# Sample data from tools (extend with full CSVs for 200 days)
mp_data = """Date,Open,High,Low,Close,Volume
Jul 22, 2025,58.55,60.30,56.70,60.21,12402012
Jul 21, 2025,63.72,65.05,58.80,59.01,25111700
Jul 18, 2025,60.30,64.51,58.80,63.22,29025600
Jul 17, 2025,55.50,61.67,54.80,60.26,42064900
Jul 16, 2025,61.08,61.13,56.73,58.55,37794200
Jul 15, 2025,54.00,62.87,52.89,58.22,74016900
Jul 14, 2025,45.86,48.99,45.66,48.52,23472400
Jul 11, 2025,45.53,50.98,44.62,45.11,37216600
Jul 10, 2025,48.10,48.12,42.86,45.23,86416200
Jul 9, 2025,31.55,31.67,29.58,30.03,10367400"""  # Truncated; add more rows

achr_data = """Date,Open,High,Low,Close,Volume
Jul 22, 2025,11.45,11.75,10.68,11.08,42552812
Jul 21, 2025,13.36,13.49,11.77,11.85,57457100
Jul 18, 2025,13.07,13.73,12.88,13.29,55090900
Jul 17, 2025,12.38,13.40,12.13,13.40,74876100
Jul 16, 2025,11.43,12.20,10.99,12.09,66657600"""  # Truncated

def load_data(csv_str):
    df = pd.read_csv(pd.compat.StringIO(csv_str), parse_dates=['Date'])
    df = df.sort_values('Date').reset_index(drop=True)
    return df

def compute_atr(df, period=14):
    high_low = df['High'] - df['Low']
    high_close = np.abs(df['High'] - df['Close'].shift())
    low_close = np.abs(df['Low'] - df['Close'].shift())
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)
    df['ATR'] = true_range.rolling(period).mean()
    return df

def backtest_strategy(df, atr_mult=2, pyramid=True):
    df = compute_atr(df)
    df['MA20'] = df['Close'].rolling(20).mean()
    in_trade = False
    entry_price = stop = adds = 0
    trades = []  # Track P/L, fails
    for i in range(20, len(df)):  # Skip initial for MA
        if not in_trade and df['Close'][i] > df['MA20'][i]:
            entry_price = df['Close'][i]
            stop = entry_price - atr_mult * df['ATR'][i]
            in_trade = True
            adds = 0
        if in_trade:
            # Trail stop
            new_stop = df['High'][i] - atr_mult * df['ATR'][i]
            stop = max(stop, new_stop)
            # Pyramid add on breakout above prev high
            if pyramid and df['Close'][i] > df['High'][i-1] and adds < 2:
                adds += 1
                # Simulate add at 0.5/0.25 size, adjust entry avg
                entry_price = (entry_price + df['Close'][i] * (0.5 if adds==1 else 0.25)) / (1 + adds * 0.5)
            if df['Low'][i] < stop:
                pl = (stop - entry_price) / entry_price  # % return
                trades.append(pl)
                in_trade = False
    # Metrics
    fails = sum(1 for pl in trades if pl < -0.20)
    total_loss = sum(min(pl, 0) for pl in trades) * 100  # % total losses
    return {'Fails (>20% loss)': fails, 'Total Losses (%)': total_loss, 'Trades': len(trades), 'Avg PL (%)': np.mean(trades)*100 if trades else 0}

# Run for MP
mp_df = load_data(mp_data)
mp_results = backtest_strategy(mp_df)
print("MP Results (Pure ATR):", mp_results)

# Add CVD simulation (e.g., filter entries on positive volume delta approx via increasing volume)
# For full: Layer if df['Volume'][i] > df['Volume'].rolling(10).mean()[i] * 1.5

# Extend to your 20 stocks by loading CSVs similarly; test intervals by slicing df.iloc[-50:], etc.

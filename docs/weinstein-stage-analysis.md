# Technical Indicators for Identifying Stan Weinstein's Four Stages

Stan Weinstein's Stage Analysis, as detailed in his book *Secrets for Profiting in Bull and Bear Markets*, relies on a combination of technical indicators to pinpoint each stage in a stock's cycle. The primary tools include:

- **30-Week Moving Average (MA)**: Often a weighted moving average (WMA) or simple moving average (SMA), used to gauge the long-term trend. Price position relative to this MA is crucial.
- **Volume Patterns**: Measures conviction behind price moves (e.g., increasing volume on breakouts confirms strength).
- **Price Action**: Patterns like sideways consolidation, breakouts (upward through resistance), breakdowns (downward through support), higher highs/lows (uptrends), or lower highs/lows (downtrends).
- **Relative Strength (RS)**: Often Mansfield Relative Strength, comparing the stock's performance to a market index (e.g., S&P 500). Above the zero line indicates outperformance.
- **Momentum Indicators**: Such as rate of change or oscillators to assess trend speed.
- **Overhead Resistance**: Identifies potential barriers from prior highs.
- **Breakouts/Breakdowns**: Significant price moves through key levels, often on high volume.

Advanced tools like the Stage Analysis Technical Attributes (SATA) indicator on TradingView integrate these into a scoring system (0-10), where higher scores suggest bullish stages and lower ones bearish. For example:
- Stage 2: Typically scores 6-10.
- Stage 1: Rising to 2-8.
- Stage 3: Dropping to 8-2.
- Stage 4: 0-5.

Below is a breakdown of each stage with the key technical indicators used to identify them, based on Weinstein's framework and implementations like those in ChartMill and SATA.

## 1. Stage 1: Basing (Accumulation Phase)
This stage signals the end of a downtrend and potential accumulation by institutions. It's identified when the stock stabilizes after a decline.
- **30-Week MA**: Price is below the MA, but the MA starts flattening (no longer declining sharply).
- **Price Action**: Sideways consolidation in a tight range, forming a base with no new lows; sub-stages like 1A (early base) show initial stabilization, while 1B (late base) hints at impending breakout.
- **Volume**: Low or decreasing, indicating reduced selling pressure; occasional spikes may signal accumulation.
- **Relative Strength**: Often below zero but starting to flatten or turn up, showing the stock is no longer underperforming the market.
- **Momentum**: Weak or neutral, with no strong downward push.
- **Other**: Overhead resistance from prior highs is distant; SATA score typically rises from low levels (e.g., 2-8) after a Stage 4 decline.

## 2. Stage 2: Advancing (Markup Phase)
This is the bullish uptrend where the stock gains momentum. Identification focuses on confirmation of a new trend.
- **30-Week MA**: Price breaks above the MA on increasing volume, and stays above it; the MA slopes upward.
- **Price Action**: Breakout above resistance from the Stage 1 base, forming higher highs and higher lows; sub-stages like 2A (early uptrend) are ideal for buying.
- **Volume**: Increases significantly on up days and during the breakout, confirming buyer conviction; pullbacks occur on lower volume.
- **Relative Strength**: Crosses above the zero line and rises, indicating outperformance vs. the market (e.g., Mansfield RS turning positive).
- **Momentum**: Strong and positive, with indicators showing acceleration.
- **Other**: Minimal overhead resistance; SATA score is high (6-10), often 9-10 at breakout.

## 3. Stage 3: Topping (Distribution Phase)
This stage indicates the uptrend is losing steam, with potential distribution by sellers. It's marked by hesitation at highs.
- **30-Week MA**: Price is still above the MA, but the MA flattens or starts to roll over; price may test the MA from above.
- **Price Action**: Sideways consolidation at elevated levels with increased volatility; failed rallies or lower highs form; sub-stages like 3A (early top) prompt protective stops.
- **Volume**: Spikes on down days or during failed breakouts, showing distribution; overall volume may decrease on advances.
- **Relative Strength**: Peaks and starts declining toward or below zero, signaling weakening vs. the market.
- **Momentum**: Slows or turns negative, with divergences (e.g., price highs but momentum lows).
- **Other**: Increasing overhead resistance from recent highs; SATA score drops (8-2), often 4-6 when entering from Stage 2.

## 4. Stage 4: Declining (Markdown Phase)
This is the bearish downtrend where prices fall sharply. Identification relies on breakdown confirmation.
- **30-Week MA**: Price breaks below the MA on high volume, and the MA slopes downward.
- **Price Action**: Breakdown below support from the Stage 3 top, forming lower highs and lower lows; sub-stages like 4A (early decline) signal to exit positions.
- **Volume**: Increases on down days, confirming seller dominance; rallies occur on low volume.
- **Relative Strength**: Well below zero and declining, showing underperformance.
- **Momentum**: Strongly negative, accelerating the decline.
- **Other**: No significant overhead resistance (as prices fall); SATA score is low (0-5), often 1-0 at breakdown.

These indicators should be used together for confirmation, as no single one is foolproof. For practical application, platforms like TradingView (with SATA) or ChartMill automate stage detection using rules like price-MA crossovers and volume thresholds. Always combine with broader market context, as stages can vary by timeframe or asset.
---
name: google-trends
description: Use when a task needs Google Trends data — relative search interest over time, regional interest, rising/related queries — since no Trends MCP server or official free API exists.
---

# Google Trends

No MCP server and no official free API for Google Trends. Use the unofficial
`pytrends` library, which replays the requests trends.google.com's own UI makes.
Free, no key, no signup.

```bash
pip install pytrends
```

```python
from pytrends.request import TrendReq

pytrends = TrendReq(hl="es-ES", tz=60)  # tz = offset from UTC in minutes
pytrends.build_payload(["ahrefs alternativa"], timeframe="today 12-m", geo="ES")

pytrends.interest_over_time()   # relative interest, 0-100 scale, over time
pytrends.related_queries()      # rising / top related queries per keyword
pytrends.interest_by_region()   # interest broken down by region or country
```

## Limits

- Unofficial: replays the same endpoints the trends.google.com UI calls; breaks
  whenever Google changes them, no SLA.
- Rate-limited: max 5 keywords per `build_payload` call, back off on HTTP 429.
- Output is relative interest (0-100 per query), never absolute search volume.
  For absolute volume, use Google Keyword Planner instead.

## When to reach for this vs the `seo` skill

Trends answers "is interest in X rising or falling, where, and what's related" —
market-level, no site attached. The `seo` skill (Search Console) answers "what is
*my* site already ranking for" — site-level, real position and click data. Combine
both: Trends to find and prioritize candidate keywords, Search Console to check
whether the site already ranks for them.

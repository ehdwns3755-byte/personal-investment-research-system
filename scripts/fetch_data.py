"""
Daily investment data fetcher.

Sources:
  - Yahoo Finance (unofficial) — AAPL, VOO stock prices
  - CoinGecko (free, no key)   — BTC price
  - Claude API                 — beginner-friendly analysis + tip

Saves result to data.json in the project root.
"""

import json
import os
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ROOT = Path(__file__).parent.parent


# ── Price fetchers ────────────────────────────────────────────────────────────

def fetch_stock(symbol: str) -> tuple[float, float]:
    """Yahoo Finance chart API — returns (price, change_pct)."""
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"
    headers = {"User-Agent": "Mozilla/5.0"}
    r = requests.get(url, headers=headers, timeout=10)
    r.raise_for_status()
    meta = r.json()["chart"]["result"][0]["meta"]
    price = meta["regularMarketPrice"]
    prev = meta["previousClose"]
    change_pct = (price - prev) / prev * 100
    return price, change_pct


def fetch_crypto(coin_id: str) -> tuple[float, float]:
    """CoinGecko simple price — returns (price_usd, change_24h_pct)."""
    url = (
        "https://api.coingecko.com/api/v3/simple/price"
        f"?ids={coin_id}&vs_currencies=usd&include_24hr_change=true"
    )
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()[coin_id]
    return data["usd"], data["usd_24h_change"]


# ── Claude analysis ───────────────────────────────────────────────────────────

def claude_analysis(assets: dict) -> dict:
    """Call Claude API and return {analyses: {...}, tip: str}."""
    import anthropic

    summary = "\n".join(
        f"- {sym}: ${info['price_raw']:,.2f} ({info['change_pct']:+.1f}%)"
        for sym, info in assets.items()
    )
    prompt = f"""다음은 오늘의 투자 상품 실시간 시세입니다:

{summary}

투자 초보자를 위해 각 상품에 대해 한 문장 분석과, 오늘의 시장 상황을 반영한 초보자 팁을 작성해주세요.

반드시 아래 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{{
  "analyses": {{
    "AAPL": "한 문장 분석",
    "BTC": "한 문장 분석",
    "VOO": "한 문장 분석"
  }},
  "tip": "오늘의 초보자 팁 (1-2문장)"
}}"""

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    msg = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    )
    text = msg.content[0].text.strip()
    # strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text)


# ── Main ──────────────────────────────────────────────────────────────────────

ASSET_DEFS = [
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "type": "주식",
        "fetch": lambda: fetch_stock("AAPL"),
        "description": "Apple은 iPhone, Mac 등을 만드는 세계 최대 기업 중 하나예요.",
        "risk": "중간 (기술주)",
    },
    {
        "symbol": "BTC",
        "name": "Bitcoin",
        "type": "암호화폐",
        "fetch": lambda: fetch_crypto("bitcoin"),
        "description": "디지털 화폐로, 은행 없이 거래해요. 수익은 높지만 매우 변동성이 크죠.",
        "risk": "높음 (초보자는 주의)",
    },
    {
        "symbol": "VOO",
        "name": "Vanguard S&P 500 ETF",
        "type": "ETF",
        "fetch": lambda: fetch_stock("VOO"),
        "description": "500개 회사에 자동으로 분산 투자하는 펀드예요. 가장 안전한 선택입니다.",
        "risk": "낮음",
    },
]


def main() -> None:
    kst = timezone(timedelta(hours=9))
    now_kst = datetime.now(kst)

    # 1. Fetch prices
    assets: dict[str, dict] = {}
    for defn in ASSET_DEFS:
        sym = defn["symbol"]
        try:
            price, change = defn["fetch"]()
            assets[sym] = {"price_raw": price, "change_pct": change}
            print(f"  OK {sym}: ${price:,.2f} ({change:+.1f}%)")
        except Exception as exc:
            assets[sym] = {"price_raw": None, "change_pct": None}
            print(f"  WARN {sym}: fetch failed -- {exc}", file=sys.stderr)

    # 2. Claude analysis
    analysis: dict = {}
    tip = "투자 초보자는 먼저 '배우기' 탭에서 기초를 배우세요. VOO 같은 ETF로 시작하면 가장 안전합니다."
    if ANTHROPIC_API_KEY:
        try:
            result = claude_analysis(assets)
            analysis = result.get("analyses", {})
            tip = result.get("tip", tip)
            print("  OK Claude analysis done")
        except Exception as exc:
            print(f"  WARN Claude API failed -- {exc}", file=sys.stderr)

    # 3. Build output
    def fmt_price(sym: str) -> str:
        raw = assets[sym]["price_raw"]
        if raw is None:
            return "N/A"
        if sym == "BTC":
            return f"${raw:,.0f}"
        return f"${raw:,.2f}"

    def fmt_change(sym: str) -> str:
        c = assets[sym]["change_pct"]
        return f"{c:+.1f}%" if c is not None else "N/A"

    trends = [
        {
            "symbol": defn["symbol"],
            "name": defn["name"],
            "type": defn["type"],
            "price": fmt_price(defn["symbol"]),
            "change": fmt_change(defn["symbol"]),
            "change_num": assets[defn["symbol"]]["change_pct"],
            "description": analysis.get(defn["symbol"]) or defn["description"],
            "risk": defn["risk"],
        }
        for defn in ASSET_DEFS
    ]

    output = {
        "updated_at": now_kst.strftime("%Y-%m-%d %H:%M KST"),
        "trends": trends,
        "guideTip": tip,
    }

    out_path = ROOT / "data.json"
    out_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nOK data.json saved -- {output['updated_at']}")


if __name__ == "__main__":
    main()

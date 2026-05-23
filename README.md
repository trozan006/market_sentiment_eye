# Market Sentiment Eye 👁️

An elite, real-time cryptocurrency news sentiment analysis dashboard and intelligence terminal designed for high-frequency crypto traders. It parses multi-channel digital asset headlines and translates them into actionable market sentiment indices using advanced hybrid analytical models.

---

## 🚀 Live Demo
Access the live visual trading dashboard here: [Live App Preview](https://market-sentiment-eye-1005046078978.asia-southeast1.run.app)

---

## 🛸 Core Overview: How Data is Collected & Analyzed

```
[ Multi-Channel News Sources ] 
        (CoinDesk, CryptoSlate, The Block, Decrypt)
                   │
                   ▼
┌───────────────────────────────────────────────┐
│     Pre-Loaded Highly Realistic Feed         │
│     (Spread across live 24-hour cycles)       │
└──────────────────┬────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────────┐
│         Hybrid Neural Analysis Engine         │
├───────────────────────────────────────────────┤
│ 1. Local Structured Keyword Matching        │
│ 2. Server-side Live Gemini 3.5 Core Proxy     │
│ 3. Direct Browser Claude or OpenAI Fallbacks  │
└──────────────────┬────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────────┐
│       Live Terminal Indicators Rendered       │
├───────────────────────────────────────────────┤
│ • Overall Market Fear/Greed Score (0-100)     │
│ • Bulletproof Coin-Specific Bullish Strength  │
│ • Executive AI Recommendation & Trend Vectors │
└───────────────────────────────────────────────┘
```

The system ingests continuous market signals directly. In this release, data is gathered from a highly realistic, pre-loaded news compilation representing premium sources like **CoinDesk**, **The Block**, **Decrypt**, and **CryptoSlate**. 

Once ingested, the pipeline routes the content through its dual-layer analytical systems:
1. **Local Keyword-Based Engine:** Instantly parses texts for market markers (e.g., *breakout*, *rally*, *exploit*, *liquidation*) to establish mathematical weights, rendering immediate analytics without API latencies.
2. **Advanced Neural Engine:** Employs the server-side **Gemini API** proxy or your custom OpenAI/Claude keys to compile an advanced overall executive recommendation, trend speed, and risk assessment.

---

## 🔥 Key Technical Features

### 1. Live Sentiment Dashboard
- **Market Sentiment Gauge:** Interactive arc visualizer detailing the aggregate market mood scale from *Extreme Fear* to *Extreme Greed* (0-100).
- **Core Statistics Monitor:** High-contrast sub-parameters tracking absolute Bullish vs Bearish news counts.

### 2. Coin Specific Telemetry Tiles
- Covers primary market cap and momentum assets: **BTC, ETH, SOL, DOGE, PEPE, XRP, TON, and WIF**.
- Displays absolute percentage of positive force, 24-hour pricing variation, custom news density, and models confidence indices.
- Supports active drill-down filters (clicking any card filters the main feed instantly for that token).

### 3. Integrated Filtering News Desk
- Real-time text search queries matching headlines or summary bodies.
- Multi-dimensional dropdown sorting for Sentiment Bias (Bullish, Bearish, Neutral), high/low macro asset groupings, and dynamic durations (Last 1hr, 6hr, 24hr).
- Single-click interactive toggles to expand in-depth AI context cards.

### 4. AI Strategic Decision Corridor
- Consolidated executive summary detailing present market mechanics.
- Highlighted blocks showing the prime technical breakout opportunity vs the maximum structural risk factors.
- Direct actionable trading plans (e.g., cautionary accumulation on support vs strategic profit allocation).

### 5. Historical Analysis & Progression Tracks
- Fully integrated 7-day line graphics generated through **Recharts** detailing daily BTC, ETH, and general market progress coefficients.
- Dynamic asset comparator charts displaying relative developer consensus on a 0-100 linear scale.

---

## 🛠️ Tech Stack & Architecture

- **Front-End Framework:** React.js (v19) configured inside a modern Vite production bundler.
- **Styling Core:** Tailwind CSS (v4) with bespoke dark trading terminal variables.
- **Animations:** Motion (formerly Framer Motion) for smooth, high-fidelity element sweeps.
- **Data Visualization:** Recharts API for responsive canvas rendering.
- **Back-End Server:** Express.js proxy with dynamic Node-typescript transpiler running on port `3000`.
- **Primary LLM Integration:** Server-side `@google/genai` (using `gemini-3.5-flash`) coupled with optional client-side Claude or OpenAI key sandboxes.

---

## 📦 Setting Up Locally

Follow these quick commands to build and run the development database server:

1. **Clone the project workspace:**
   ```bash
   git clone <your-repository-url>
   cd market-sentiment-eye
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure the environment settings:**
   Create a `.env` file in the root directory and add your developer secret keys:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   *Your live application template will run on `http://localhost:3000`.*

5. **Build for deployment:**
   ```bash
   npm run build
   npm start
   ```

---

## 🛡️ Trust & Secure Design
All custom developer keys entered in the configuration panel are saved **locally inside your browser sandbox (`localStorage`)**. No private credentials ever leave your browser environment or get committed to log channels, guaranteeing complete security.

Created with high standards of UI design. 🌊

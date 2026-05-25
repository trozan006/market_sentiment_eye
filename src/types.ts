export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  timestamp: string; // ISO string or relative reference
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  score: number; // sentiment score from -100 to +100 or 0 to 100
  summary: string;
  coins: string[]; // ['BTC', 'ETH', 'SOL'] etc.
}

export interface CoinSentiment {
  coin: string;
  fullName: string;
  emoji: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number; // 0-100% bullish
  priceChange24h: number; // price percentage e.g. +4.2
  newsCount: number;
  confidence: 'high' | 'medium' | 'low';
  isTrending?: boolean;
}

export interface MarketSummary {
  moodScore: number; // 0-100 scale
  label: string; // Extreme Fear, Fear, Neutral, Greed, Extreme Greed
  timestamp: string;
  marketSummaryText: string;
  topBullishSignal: string;
  topBearishWarning: string;
  aiTradingSuggestion: string;
  sentimentTrend: string; // Is the market getting more bullish or bearish?
}

export interface AppSettings {
  anthropicKey: string;
  openaiKey: string;
  useRealAI: boolean;
  refreshInterval: number; // in seconds or minutes
}

export interface SentimentHistoryItem {
  date: string;
  BTC: number;
  ETH: number;
  Market: number;
}

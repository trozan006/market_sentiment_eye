import { CoinSentiment, SentimentHistoryItem } from '../types';

export const initialCoinSentiments: CoinSentiment[] = [
  {
    coin: 'BTC',
    fullName: 'Bitcoin',
    emoji: '🪙',
    sentiment: 'bullish',
    score: 84,
    priceChange24h: 3.84,
    newsCount: 42,
    confidence: 'high'
  },
  {
    coin: 'ETH',
    fullName: 'Ethereum',
    emoji: '🔷',
    sentiment: 'bullish',
    score: 76,
    priceChange24h: 1.45,
    newsCount: 29,
    confidence: 'high'
  },
  {
    coin: 'SOL',
    fullName: 'Solana',
    emoji: '☀️',
    sentiment: 'bullish',
    score: 81,
    priceChange24h: 6.92,
    newsCount: 35,
    confidence: 'medium'
  },
  {
    coin: 'DOGE',
    fullName: 'Dogecoin',
    emoji: '🐕',
    sentiment: 'bullish',
    score: 72,
    priceChange24h: 4.10,
    newsCount: 18,
    confidence: 'medium'
  },
  {
    coin: 'PEPE',
    fullName: 'Pepe Coin',
    emoji: '🐸',
    sentiment: 'bearish',
    score: 38,
    priceChange24h: -5.14,
    newsCount: 24,
    confidence: 'medium'
  },
  {
    coin: 'XRP',
    fullName: 'Ripple',
    emoji: '💧',
    sentiment: 'bullish',
    score: 89,
    priceChange24h: 22.40,
    newsCount: 14,
    confidence: 'high'
  },
  {
    coin: 'TON',
    fullName: 'The Open Network',
    emoji: '💎',
    sentiment: 'bullish',
    score: 75,
    priceChange24h: 2.11,
    newsCount: 11,
    confidence: 'medium'
  },
  {
    coin: 'WIF',
    fullName: 'dogwithhat',
    emoji: '🎩',
    sentiment: 'bullish',
    score: 79,
    priceChange24h: 11.25,
    newsCount: 9,
    confidence: 'low'
  }
];

export const sentimentHistory: SentimentHistoryItem[] = [
  { date: 'May 17', BTC: 68, ETH: 62, Market: 64 },
  { date: 'May 18', BTC: 72, ETH: 65, Market: 68 },
  { date: 'May 19', BTC: 70, ETH: 60, Market: 66 },
  { date: 'May 20', BTC: 75, ETH: 64, Market: 70 },
  { date: 'May 21', BTC: 82, ETH: 71, Market: 78 },
  { date: 'May 22', BTC: 85, ETH: 74, Market: 81 },
  { date: 'May 23', BTC: 91, ETH: 78, Market: 85 }
];

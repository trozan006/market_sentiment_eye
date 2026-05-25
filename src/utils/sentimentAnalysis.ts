import { NewsItem } from '../types';

const BULLISH_KEYWORDS = [
  'rally', 'surge', 'breakout', 'adoption', 'partnership', 'upgrade', 'ath', 'high', 'highest',
  'approves', 'cut', 'settled', 'builders', 'build', 'all-time', 'gains', 'bullish', 'skyrockets', 'record',
  'momentum', 'victory', 'buying', 'launch', 'launches', 'green', 'success', 'benefit'
];

const BEARISH_KEYWORDS = [
  'crash', 'dump', 'hack', 'ban', 'regulation', 'sell-off', 'liquidation', 'warnings', 'warning',
  'bearish', 'fear', 'exploit', 'drop', 'lower', 'freeze', 'frozen', 'stolen', 'hacked', 'fears',
  'pullback', 'correction', 'outage', 'bug', 'risk', 'loss', 'decline', 'investigation'
];

export interface KeywordAnalysisResult {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Perform a keyword-based analysis of a given headline and body text.
 */
export function analyzeTextSentiment(headline: string, summary: string): KeywordAnalysisResult {
  const text = `${headline} ${summary}`.toLowerCase();
  
  let bullishCount = 0;
  let bearishCount = 0;

  BULLISH_KEYWORDS.forEach(keyword => {
    // Basic word search
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      bullishCount += matches.length;
    }
  });

  BEARISH_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      bearishCount += matches.length;
    }
  });

  let score = 50; // Neutral baseline
  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';

  if (bullishCount > bearishCount) {
    const margin = bullishCount - bearishCount;
    score = Math.min(100, 50 + (margin * 15));
    sentiment = 'bullish';
  } else if (bearishCount > bullishCount) {
    const margin = bearishCount - bullishCount;
    score = Math.max(0, 50 - (margin * 15));
    sentiment = 'bearish';
  } else {
    sentiment = 'neutral';
    score = 50;
  }

  // Determine impact level based on keyword frequency and certain high-impact words
  let impact: 'high' | 'medium' | 'low' = 'low';
  const totalKeywords = bullishCount + bearishCount;
  
  if (totalKeywords >= 4 || text.includes('hack') || text.includes('approval') || text.includes('rate cut') || text.includes('etf') || text.includes('$300m') || text.includes('settled') || text.includes('billion')) {
    impact = 'high';
  } else if (totalKeywords >= 2) {
    impact = 'medium';
  }

  return { sentiment, score, impact };
}

/**
 * Process a set of news items and re-calculate scores
 */
export function processNewsCollection(newsList: NewsItem[]): NewsItem[] {
  return newsList.map(item => {
    const result = analyzeTextSentiment(item.headline, item.summary);
    return {
      ...item,
      sentiment: result.sentiment,
      score: result.score,
      impact: result.impact
    };
  });
}

import { NewsItem, MarketSummary, AppSettings } from '../types';
import { analyzeTextSentiment } from './sentimentAnalysis';

/**
 * Perform a complete news sentiment classification.
 */
export async function analyzeNewsSentiment(
  newsData: NewsItem[], 
  settings: AppSettings
): Promise<MarketSummary> {
  // 1. Calculate stats
  let totalScore = 0;
  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;

  newsData.forEach(item => {
    totalScore += item.score;
    if (item.sentiment === 'bullish') bullishCount++;
    else if (item.sentiment === 'bearish') bearishCount++;
    else neutralCount++;
  });

  const averageScore = Math.round(totalScore / (newsData.length || 1));
  let label = 'Neutral';
  if (averageScore >= 80) label = 'Extreme Greed';
  else if (averageScore >= 60) label = 'Greed';
  else if (averageScore >= 40) label = 'Neutral';
  else if (averageScore >= 20) label = 'Fear';
  else label = 'Extreme Fear';

  // 2. Identify top signals
  const sortedByScoreDesc = [...newsData].sort((a, b) => b.score - a.score);
  const topBullish = sortedByScoreDesc.find(n => n.sentiment === 'bullish') || newsData[0];
  const topBearish = [...newsData].sort((a, b) => a.score - b.score).find(n => n.sentiment === 'bearish') || newsData[newsData.length - 1];

  // 3. Check if we should call custom OpenAI or Anthropic API
  if (settings.useRealAI) {
    if (settings.anthropicKey) {
      try {
        const summary = await callAnthropicAPI(newsData, settings.anthropicKey);
        if (summary) {
          return {
            marketSummaryText: summary.marketSummaryText || 'Market indices holding active ranges.',
            topBullishSignal: summary.topBullishSignal || 'None declared.',
            topBearishWarning: summary.topBearishWarning || 'None declared.',
            aiTradingSuggestion: summary.aiTradingSuggestion || 'Observe neutral limits.',
            sentimentTrend: summary.sentimentTrend || 'Consolidating.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
            moodScore: averageScore,
            label
          };
        }
      } catch (err) {
        console.error('Anthropic API Call failed, falling back to smart server/mock:', err);
      }
    }
    if (settings.openaiKey) {
      try {
        const summary = await callOpenaiAPI(newsData, settings.openaiKey);
        if (summary) {
          return {
            marketSummaryText: summary.marketSummaryText || 'Market indices holding active ranges.',
            topBullishSignal: summary.topBullishSignal || 'None declared.',
            topBearishWarning: summary.topBearishWarning || 'None declared.',
            aiTradingSuggestion: summary.aiTradingSuggestion || 'Observe neutral limits.',
            sentimentTrend: summary.sentimentTrend || 'Consolidating.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
            moodScore: averageScore,
            label
          };
        }
      } catch (err) {
        console.error('OpenAI API Call failed, falling back to smart server/mock:', err);
      }
    }

    // Default: Try to call our own Server-side Gemini proxy
    try {
      const serverSummary = await callServerGeminiAPI(newsData);
      if (serverSummary) {
        return {
          marketSummaryText: serverSummary.marketSummaryText || 'Market indices holding active ranges.',
          topBullishSignal: serverSummary.topBullishSignal || 'None declared.',
          topBearishWarning: serverSummary.topBearishWarning || 'None declared.',
          aiTradingSuggestion: serverSummary.aiTradingSuggestion || 'Observe neutral limits.',
          sentimentTrend: serverSummary.sentimentTrend || 'Consolidating.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
          moodScore: averageScore,
          label
        };
      }
    } catch (e) {
      console.warn('Server-side Gemini proxy failed or not provisioned yet, falling back to intelligent client-side generation:', e);
    }
  }

  // 4. Default Smart Mock Generation based on current news data
  return generateIntelligentMockSummary(averageScore, bullishCount, bearishCount, topBullish, topBearish);
}

/**
 * Call Server-Side Gemini API (to be hosted on /api/analyze-market)
 */
async function callServerGeminiAPI(newsData: NewsItem[]): Promise<Partial<MarketSummary> | null> {
  const response = await fetch('/api/analyze-market', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ news: newsData.map(n => ({ headline: n.headline, summary: n.summary, coins: n.coins })) })
  });
  if (!response.ok) {
    throw new Error('Server API failed');
  }
  const data = await response.json();
  return {
    marketSummaryText: data.marketSummaryText,
    topBullishSignal: data.topBullishSignal,
    topBearishWarning: data.topBearishWarning,
    aiTradingSuggestion: data.aiTradingSuggestion,
    sentimentTrend: data.sentimentTrend,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  };
}

/**
 * Directly calls the Anthropic Claude Messages API from the browser.
 * Relies on the user's provided API key.
 */
async function callAnthropicAPI(newsData: NewsItem[], apiKey: string): Promise<Partial<MarketSummary> | null> {
  const prompt = `Analyze these latest crypto news items and return a JSON object with strictly these keys:
"marketSummaryText" (2-3 sentences overall mood summary),
"topBullishSignal" (1 sentence describing prime bullish opportunity),
"topBearishWarning" (1 sentence describing major risk),
"aiTradingSuggestion" (advice for traders today),
"sentimentTrend" (whether getting more bullish or bearish over last 24h).

News item headlines:
${newsData.map((n, i) => `${i + 1}. [${n.coins.join(',')}] ${n.headline}`).join('\n')}

Format your output strictly as a valid JSON object. Do not wrap in markdown codeblocks.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'dangerously-allow-the-api-key-in-the-browser': 'true'
    } as any,
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic error: ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  return parseAIJSON(text);
}

/**
 * Directly calls OpenAI API from user's key.
 */
async function callOpenaiAPI(newsData: NewsItem[], apiKey: string): Promise<Partial<MarketSummary> | null> {
  const prompt = `Analyze these latest crypto headlines and return a JSON object containing keys:
"marketSummaryText", "topBullishSignal", "topBearishWarning", "aiTradingSuggestion", "sentimentTrend".

News headlines:
${newsData.map((n, i) => `${i + 1}. [${n.coins.join(',')}] ${n.headline}`).join('\n')}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are an advanced crypto analyst. Return output strictly as JSON.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('OpenAI fetch failed');
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  return parseAIJSON(text);
}

function parseAIJSON(rawText: string): Partial<MarketSummary> {
  try {
    // Strip markdown formatting if any exists
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '');
    }
    return JSON.parse(clean.trim());
  } catch (e) {
    console.error('Failed to parse AI JSON response:', e);
    return {};
  }
}

/**
 * Standard text generation based on the active news data feed metrics
 */
function generateIntelligentMockSummary(
  avgScore: number, 
  bulls: number, 
  bears: number,
  topBullish: NewsItem,
  topBearish: NewsItem
): MarketSummary {
  let summary = '';
  let suggestion = '';
  let trend = '';

  if (avgScore >= 70) {
    summary = `The digital asset market is experiencing high-volume upward momentum, driven by spot ETF inclusions, interest rate cuts, and record-high institutional capital placement in major liquidity venues. Strong spot buying has overshadowed macro inflation metrics, pushing active coins past multi-month resistance lines with elevated conviction levels.`;
    suggestion = `Market conditions suggest an aggressive accumulation strategy on major dips. High spot capital support establishes a strong structural floor. Traders should monitor volatility on high-leverage altcoin futures but favor momentum scalpings.`;
    trend = `Bullish momentum is accelerating rapidly. Support levels are climbing upwards, indicating a high-volume breakout pattern compared to yesterday's consolidating ranges.`;
  } else if (avgScore >= 45) {
    summary = `The cryptocurrency market is consolidating inside a tight trading channel as traders await macro indices. While institutional spot buyers maintain passive bids for Bitcoin, altcoins are experiencing neutral liquidations as momentum rotates to specific projects.`;
    suggestion = `Exercise cautionary range-bound trading. Ideal strategy consists of buying at key daily support levels and taking profit at immediate resistance boundaries. Avoid over-leveraged breakout chasing.`;
    trend = `Consolidating neutral. Market indexes have stabilized with minimal volatility bias, showing structural consolidation equal to yesterday's patterns.`;
  } else {
    summary = `The market is showing extreme caution, marked by localized profit sell-offs, whale movements into exchange reserves, and systemic hot wallet exploits. Liquidity has contracted significantly as buyers step back to wait for key technical levels.`;
    suggestion = `Highly defensive strategy recommended. Protect capital by increasing stablecoin reserves. Avoid catching falling knives on volatile altcoins until Bitcoin establishes a clear double-bottom support structure.`;
    trend = `Bearish pressure is intensifying. On-chain selling patterns and derivative hedging indicators suggest risk-off sentiment has widened over the 24-hour cycle.`;
  }

  const bullishSig = topBullish 
    ? `🏆 ${topBullish.headline} (${topBullish.source})` 
    : 'No major bullish signals detected in the current range.';

  const bearishWarning = topBearish 
    ? `⚠️ ${topBearish.headline} (${topBearish.source})` 
    : 'No severe risk alerts detected.';

  return {
    moodScore: avgScore,
    label: avgScore >= 80 ? 'Extreme Greed' : avgScore >= 60 ? 'Greed' : avgScore >= 40 ? 'Neutral' : avgScore >= 20 ? 'Fear' : 'Extreme Fear',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    marketSummaryText: summary,
    topBullishSignal: bullishSig,
    topBearishWarning: bearishWarning,
    aiTradingSuggestion: suggestion,
    sentimentTrend: trend
  };
}

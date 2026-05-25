import React from 'react';
import { motion } from 'motion/react';
import { Flame, Snowflake, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { CoinSentiment } from '../types';
import { CoinLogo } from './CoinLogo';

interface TrendingCoinsProps {
  coinsSentiment: CoinSentiment[];
  onSelectCoin?: (coinSymbol: string) => void;
}

export function TrendingCoins({ coinsSentiment, onSelectCoin }: TrendingCoinsProps) {
  // Sort by combination of news volume (how popular they are) and dynamic score
  const trendingList = [...coinsSentiment]
    .map(c => {
      // Logic for indicator: Hot if newsCount >= 15 AND score >= 60, or 24h gain >= 5%
      const isHot = c.newsCount >= 15 || c.score >= 75 || c.priceChange24h >= 5;
      return {
        ...c,
        isHot
      };
    })
    // Sort so Hot / highest volume are at top
    .sort((a, b) => (b.newsCount * b.score) - (a.newsCount * a.score))
    .slice(0, 5);

  return (
    <div id="trending-coins-feed" className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-md relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-center justify-between mb-4 border-b border-gray-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-purple-400" />
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">TRENDING RADAR</h3>
        </div>
        <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/20">
          5 ASSETS ON AIR
        </span>
      </div>

      <div className="space-y-3 font-mono">
        {trendingList.map((coin, index) => {
          return (
            <motion.div
              id={`trending-row-${coin.coin}`}
              key={coin.coin}
              onClick={() => onSelectCoin && onSelectCoin(coin.coin)}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0f0f0f]/60 hover:bg-[#151515]/80 border border-gray-950 hover:border-gray-850 cursor-pointer transition-all duration-200"
            >
              {/* Token descriptor with absolute hierarchy */}
              <div className="flex items-center gap-3">
                <span className="text-base text-gray-400 w-4 font-bold">#{index + 1}</span>
                <CoinLogo coin={coin.coin} fullName={coin.fullName} size="sm" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-200">{coin.coin}</span>
                    <span className="text-[9px] text-gray-500">v{coin.priceChange24h >= 0 ? 'UP' : 'DOWN'}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 block">{coin.newsCount} Articles Analyzed</span>
                </div>
              </div>

              {/* Status parameters & heat state */}
              <div className="flex items-center gap-3">
                {/* Score & Label badge */}
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-200">{coin.score}% Score</span>
                  <span className={`text-[9px] uppercase font-bold ${
                    coin.sentiment === 'bullish' ? 'text-emerald-400' : coin.sentiment === 'bearish' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {coin.sentiment}
                  </span>
                </div>

                {/* Hot or Cold Glow indicator */}
                <div>
                  {coin.isHot ? (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]" title="Hot Trading Focus">
                      <Flame className="h-4 w-4 animate-bounce" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400" title="Cold Consensus Consolidation">
                      <Snowflake className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

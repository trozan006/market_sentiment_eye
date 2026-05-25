import React from 'react';
import { motion } from 'motion/react';
import { CoinSentiment } from '../types';

interface CoinSentimentBarProps {
  coinsSentiment: CoinSentiment[];
}

export function CoinSentimentBar({ coinsSentiment }: CoinSentimentBarProps) {
  // Sort coins by score descending
  const sortedCoins = [...coinsSentiment].sort((a, b) => b.score - a.score);

  const getProgressColor = (score: number) => {
    if (score >= 75) return 'bg-gradient-to-r from-emerald-500 to-cyan-400';
    if (score >= 60) return 'bg-gradient-to-r from-cyan-500 to-blue-400';
    if (score >= 45) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-rose-500 to-orange-400';
  };

  return (
    <div id="coin-sentiment-bar-comparator" className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-md relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-400 uppercase">TICKER BULLISH POWER COMPARATOR</h3>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">Aggregated news support score (0 to 100%)</p>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded bg-cyan-500/5 uppercase">
          RELATIVE DISPERSION
        </span>
      </div>

      <div className="space-y-4 font-mono">
        {sortedCoins.map((coin, index) => {
          return (
            <div key={coin.coin} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 text-[10px] font-bold w-4">#{index + 1}</span>
                  <span className="text-gray-100 font-bold">{coin.coin}</span>
                  <span className="text-[10px] text-gray-500">({coin.fullName})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-medium">INDEX SCORE:</span>
                  <span className="font-extrabold text-white text-right w-8">{coin.score}%</span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="h-2 w-full rounded-full bg-gray-900 overflow-hidden border border-gray-800/40 relative">
                <motion.div
                  className={`h-full rounded-full ${getProgressColor(coin.score)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${coin.score}%` }}
                  transition={{ duration: 1.2, delay: index * 0.05, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

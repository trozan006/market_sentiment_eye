import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Link2, Clock, Globe, Zap, AlertTriangle } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsCardProps {
  key?: React.Key;
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sentiment color decoders
  const getSentimentDot = () => {
    switch (item.sentiment) {
      case 'bullish': return { text: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'BULLISH', dot: 'bg-emerald-400Shadow bg-emerald-400' };
      case 'bearish': return { text: 'text-rose-400 bg-rose-500/10 border-rose-500/30', label: 'BEARISH', dot: 'bg-rose-400Shadow bg-rose-400' };
      default: return { text: 'text-amber-400 bg-amber-500/10 border-amber-500/30', label: 'NEUTRAL', dot: 'bg-amber-400Shadow bg-amber-400' };
    }
  };

  const getImpactBadge = () => {
    switch (item.impact) {
      case 'high': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'medium': return 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
      default: return 'bg-gray-800/40 border-gray-800 text-gray-400';
    }
  };

  const sentiment = getSentimentDot();

  return (
    <div
      id={`news-${item.id}`}
      className={`border rounded-xl transition-all duration-300 ${
        isExpanded 
        ? 'bg-gradient-to-br from-[#1c1c1c] to-[#121212] border-gray-700 shadow-lg' 
        : 'bg-[#1a1a1a]/70 border-gray-800/80 hover:border-gray-700/60 hover:bg-[#1e1e1e] shadow-sm'
      }`}
    >
      {/* Outer row summary click target */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer flex items-start gap-4 justify-between"
      >
        <div className="space-y-2 flex-1">
          {/* Metadata banner */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            {/* Publisher source */}
            <span className="flex items-center gap-1 text-gray-400 bg-gray-900/50 px-2 py-0.5 rounded border border-gray-850">
              <Globe className="h-3 w-3 text-cyan-400/80" />
              {item.source}
            </span>

            {/* Timings */}
            <span className="flex items-center gap-1 text-gray-500">
              <Clock className="h-3 w-3" />
              {item.timeAgo}
            </span>

            {/* Affected tokens */}
            <div className="flex gap-1">
              {item.coins.map(coin => (
                <span 
                  key={coin} 
                  className="px-1.5 py-0.5 rounded bg-cyan-950/20 text-cyan-300 border border-cyan-400/20 font-bold"
                >
                  {coin}
                </span>
              ))}
            </div>

            {/* Impact indicator */}
            <span className={`px-1.5 py-0.5 rounded border font-bold uppercase ${getImpactBadge()}`}>
              {item.impact} IMPACT
            </span>
          </div>

          {/* Headline */}
          <h4 className="text-sm sm:text-base font-bold text-gray-100 tracking-tight leading-snug group-hover:text-cyan-300">
            {item.headline}
          </h4>
        </div>

        {/* Right tags indicators & fold controls */}
        <div className="flex flex-col items-end gap-2 text-right shrink-0">
          <div className={`px-2 py-0.5 rounded border text-[9px] font-extrabold font-mono tracking-wider ${sentiment.text}`}>
            {sentiment.label} ({item.score > 50 ? `+${item.score}` : item.score})
          </div>

          <div className="text-gray-500 hover:text-white transition-colors mt-1 p-1 rounded hover:bg-gray-800/40">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Expandable summary block */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-800/80 bg-black/30"
          >
            <div className="p-4 space-y-3">
              {/* Expandable Summary Text */}
              <div className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                <p className="font-semibold text-gray-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  AI DEEP SUMMARY & CONTEXT:
                </p>
                {item.summary}
              </div>

              {/* Extra technical trading highlights */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-900/60 font-mono text-[11px]">
                <div className="flex items-center gap-2 bg-[#121212] p-2 rounded border border-gray-850">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                  <div>
                    <span className="text-gray-500 block text-[9px]">SENTIMENT STRENGTH</span>
                    <span className="text-gray-200 font-bold">{item.score}% Bullish Load</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#121212] p-2 rounded border border-gray-850">
                  <AlertTriangle className="h-3.5 w-3.5 text-purple-400" />
                  <div>
                    <span className="text-gray-500 block text-[9px]">MARKET VOLATILITY IMPACT</span>
                    <span className="text-gray-200 font-bold uppercase">{item.impact === 'high' ? 'High Breakout' : item.impact === 'medium' ? 'Medium Variance' : 'Low Noise'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

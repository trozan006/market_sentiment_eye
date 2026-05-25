import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Award, MessageSquare } from 'lucide-react';
import { CoinSentiment } from '../types';
import { CoinLogo } from './CoinLogo';

interface SentimentCardProps {
  key?: React.Key;
  data: CoinSentiment;
  onSelectCoin?: (coinSymbol: string) => void;
  isSelected?: boolean;
}

export function SentimentCard({ data, onSelectCoin, isSelected }: SentimentCardProps) {
  const isUp = data.priceChange24h >= 0;

  // Sentiment colors and tags
  const getSentimentDetails = () => {
    switch (data.sentiment) {
      case 'bullish':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          label: '🐂 Bullish',
          dot: 'bg-emerald-400'
        };
      case 'bearish':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          label: '🐻 Bearish',
          dot: 'bg-rose-400'
        };
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
          label: '😐 Neutral',
          dot: 'bg-amber-400'
        };
    }
  };

  const getConfidenceBadge = () => {
    switch (data.confidence) {
      case 'high':
        return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5';
      case 'medium':
        return 'border-purple-500/30 text-purple-400 bg-purple-500/5';
      default:
        return 'border-gray-700 text-gray-400 bg-gray-800/20';
    }
  };

  const sentiment = getSentimentDetails();

  return (
    <motion.div
      id={`coin-card-${data.coin}`}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={() => onSelectCoin && onSelectCoin(data.coin)}
      className={`relative overflow-hidden cursor-pointer rounded-xl border p-4 transition-all duration-300 ${
        isSelected 
        ? 'bg-gradient-to-br from-[#1c2430]/90 to-[#121820]/95 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.15)] ring-1 ring-cyan-400/30' 
        : 'bg-[#1a1a1a]/85 border-gray-800/80 hover:border-gray-700/80 hover:bg-[#202020]/90 shadow-md'
      }`}
    >
      {/* Visual background ambient gradient if selected */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none" />
      )}

      {/* Card Header: Emoji, Name, Score */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CoinLogo coin={data.coin} fullName={data.fullName} size="md" />
          <div>
            <h3 className="font-mono font-bold text-sm text-gray-100">{data.coin}</h3>
            <span className="text-[10px] text-gray-500 block font-mono -mt-0.5">{data.fullName}</span>
          </div>
        </div>

        {/* Bullish score indicator circle */}
        <div className="flex flex-col items-end">
          <span className="text-sm font-extrabold font-mono text-gray-200">
            {data.score}%
          </span>
          <span className="text-[9px] text-gray-500 uppercase font-mono">BULLISH FORCE</span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 gap-2 my-3">
        {/* Sentiment Tag */}
        <div className={`rounded-lg border px-2 py-1 flex items-center justify-center text-xs font-mono font-bold ${sentiment.bg}`}>
          {sentiment.label}
        </div>

        {/* 24h Price Change */}
        <div className={`rounded-lg border px-2 py-1 flex items-center justify-center text-xs font-mono font-bold ${
          isUp 
          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
          : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
        }`}>
          {isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" /> : <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />}
          {isUp ? '+' : ''}{data.priceChange24h.toFixed(2)}%
        </div>
      </div>

      {/* Secondary Meta Row: Analytics & Confidence */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-800/65 text-[10px] font-mono text-gray-400">
        <div className="flex items-center gap-1.5" title="Analyzed News Volume last 24h">
          <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
          <span>{data.newsCount} Articles</span>
        </div>

        <div className="flex items-center gap-1">
          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getConfidenceBadge()}`}>
            {data.confidence} TRUST
          </span>
        </div>
      </div>

      {/* Subtle Bottom Accent Strip */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
        data.sentiment === 'bullish' ? 'bg-emerald-500/30' : data.sentiment === 'bearish' ? 'bg-rose-500/30' : 'bg-amber-500/30'
      }`} />
    </motion.div>
  );
}

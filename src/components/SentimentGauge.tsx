import React from 'react';
import { motion } from 'motion/react';
import { Compass, TrendingUp, HelpCircle } from 'lucide-react';

interface SentimentGaugeProps {
  score: number;
  label: string;
  timestamp: string;
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
}

export function SentimentGauge({
  score,
  label,
  timestamp,
  bullishCount,
  bearishCount,
  neutralCount
}: SentimentGaugeProps) {
  // SVG Arc computations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine dynamic highlight colors based on sentiment score
  const getColors = () => {
    if (score >= 80) return { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/10', stroke: 'stroke-emerald-400', needle: 'text-emerald-500' };
    if (score >= 60) return { text: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/10', stroke: 'stroke-cyan-400', needle: 'text-cyan-500' };
    if (score >= 40) return { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', glow: 'shadow-amber-500/10', stroke: 'stroke-amber-400', needle: 'text-amber-500' };
    if (score >= 20) return { text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/10', stroke: 'stroke-orange-400', needle: 'text-orange-500' };
    return { text: 'text-rose-500', border: 'border-rose-500/20', bg: 'bg-rose-500/10', glow: 'shadow-rose-500/10', stroke: 'stroke-rose-500', needle: 'text-rose-500' };
  };

  const colors = getColors();

  // Angle of gauge needle: 0% is -90deg, 100% is +90deg (or simple rotation)
  const needleRotation = (score / 100) * 180 - 90;

  return (
    <div id="sentiment-gauge-container" className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)] relative overflow-hidden group">
      {/* Decorative vector grid backing */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      {/* Header index label */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono font-medium tracking-wider text-gray-400">MARKET SENTIMENT EYE</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 bg-gray-900/40 px-2 py-0.5 rounded border border-gray-800/60">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          LIVE RADAR
        </div>
      </div>

      {/* Main Gauge Visualizer */}
      <div className="flex flex-col items-center justify-center relative z-10 py-4">
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Circular SVG Gauge Track */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              className="stroke-gray-800/60"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active Sentiment Fill */}
            <motion.circle
              cx="88"
              cy="88"
              r={radius}
              className={colors.stroke}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>

          {/* Central score and needle */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold font-mono tracking-tight text-white"
            >
              {score}
            </motion.span>
            <span className={`text-xs font-bold font-mono tracking-wide mt-1 uppercase ${colors.text}`}>
              {label}
            </span>
          </div>

          {/* Inner ticks or accents */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-10 text-[10px] font-mono font-semibold text-gray-600">
            <span>FEAR</span>
            <span>GREED</span>
          </div>
        </div>
      </div>

      {/* Grid distribution metrics */}
      <div className="mt-4 pt-4 border-t border-gray-800/60 grid grid-cols-3 gap-2 relative z-10 font-mono">
        <div className="text-center bg-[#0f0f0f]/55 p-2 rounded-lg border border-gray-900">
          <div className="text-[10px] text-emerald-400 font-bold">BULLISH</div>
          <div className="text-sm font-bold text-gray-100 mt-0.5">{bullishCount}</div>
        </div>
        <div className="text-center bg-[#0f0f0f]/55 p-2 rounded-lg border border-gray-900">
          <div className="text-[10px] text-gray-400 font-bold">NEUTRAL</div>
          <div className="text-sm font-bold text-gray-100 mt-0.5">{neutralCount}</div>
        </div>
        <div className="text-center bg-[#0f0f0f]/55 p-2 rounded-lg border border-gray-900">
          <div className="text-[10px] text-rose-400 font-bold">BEARISH</div>
          <div className="text-sm font-bold text-gray-100 mt-0.5">{bearishCount}</div>
        </div>
      </div>

      <div className="mt-3 text-center relative z-10">
        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          SYSTEM CLASSIFIED AT {timestamp}
        </span>
      </div>
    </div>
  );
}

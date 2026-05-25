import React from 'react';
import { Shield, Sparkles, RefreshCw, Terminal } from 'lucide-react';

interface HeaderProps {
  onManualRefresh: () => void;
  isRefreshing: boolean;
  activeTab: string;
  refreshInterval: number;
  lastUpdated: string;
}

export function Header({
  onManualRefresh,
  isRefreshing,
  activeTab,
  refreshInterval,
  lastUpdated
}: HeaderProps) {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return '📊 Sentiment Dashboard';
      case 'news': return '📰 News Feed';
      case 'trending': return '🔥 Trending Assets';
      case 'ai-analysis': return '🤖 AI Core Analysis';
      case 'settings': return '⚙️ Analyzer Settings';
      default: return 'Terminal';
    }
  };

  return (
    <header className="border-b border-gray-800/80 bg-[#0f0f0f]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title and Branding */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-lg bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/5">
            <Terminal className="h-5 w-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 id="app-title" className="text-lg font-bold font-mono tracking-tight text-white bg-gradient-to-r from-white via-gray-200 to-cyan-300 bg-clip-text text-transparent">
                MARKET <span className="text-cyan-400">SENTIMENT</span> EYE
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded border border-purple-500/30 bg-purple-500/5 text-purple-300">
                AI.V3.5
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-wide">
              Market Sentiment Eye Intelligence Terminal
            </p>
          </div>
        </div>

        {/* Dynamic Display of System Badge & Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t border-gray-800/50 md:border-t-0 pt-3 md:pt-0">
          {/* Cyan Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-mono border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.1)]">
            <span>🔋 Live Intelligence Feed</span>
          </div>

          {/* Sync status & Manual trigger */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] font-mono text-gray-500">
                AUTO-REFRESH: {refreshInterval}m
              </span>
              <span className="block text-[11px] font-mono text-cyan-400/80">
                UPDATED: {lastUpdated || 'Never'}
              </span>
            </div>
            
            <button
              id="refresh-btn"
              onClick={onManualRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 font-mono text-xs ${isRefreshing ? 'border-purple-500/50 text-purple-400' : ''}`}
              title="Recalculate Feed"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
              <span className="hidden xs:inline">RECALCULATE</span>
            </button>

            <a
              id="x-link"
              href="https://x.com/trozan006"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-black border border-gray-800 hover:border-cyan-500/50 text-gray-400 hover:text-white transition-all active:scale-95 flex items-center justify-center shadow-md hover:shadow-cyan-500/10 cursor-pointer h-8 w-8 shrink-0"
              title="Follow trozan on X"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              id="tg-link"
              href="https://t.me/RoxyBitget"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#0088cc]/10 border border-gray-800 hover:border-[#0088cc]/50 text-gray-400 hover:text-[#0088cc] transition-all active:scale-95 flex items-center justify-center shadow-md hover:shadow-[#0088cc]/10 cursor-pointer h-8 w-8 shrink-0"
              title="Join trozan on Telegram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701-.33 4.955c.488 0 .705-.224.978-.487l2.35-2.285 4.886 3.61c.9.497 1.547.241 1.772-.835l3.202-15.093c.329-1.32-.5-1.916-1.636-1.4c0 0 0 .001 0 .001z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

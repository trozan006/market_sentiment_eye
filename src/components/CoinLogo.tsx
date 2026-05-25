import React, { useState } from 'react';

interface CoinLogoProps {
  coin: string;
  fullName?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const OFFICIAL_LOGOS: Record<string, string> = {
  BTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  ETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  SOL: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  DOGE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
  PEPE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png',
  XRP: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  TON: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
  WIF: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28752.png',
};

export function CoinLogo({ coin, fullName, className = '', size = 'md' }: CoinLogoProps) {
  const ticker = coin.toUpperCase();
  const [imgFailed, setImgFailed] = useState(false);

  // Dimensions based on size
  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const currentSizeClass = sizeClasses[size];
  const logoUrl = OFFICIAL_LOGOS[ticker];

  // If a valid official CDN logo is found and hasn't failed, render it beautifully with custom image controls
  if (logoUrl && !imgFailed) {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-full bg-slate-900/40 select-none shrink-0 border border-white/5 overflow-hidden ${currentSizeClass} ${className}`}
        title={fullName || coin}
      >
        <img
          src={logoUrl}
          alt={fullName || coin}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    );
  }

  // Fallback to beautiful high-fidelity custom SVG/CSS vectors if CDN image fails or is unavailable
  switch (ticker) {
    case 'BTC':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#F7931A] to-[#D57B11] text-white font-sans font-black shadow-[0_2px_8px_rgba(247,147,26,0.25)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'Bitcoin'}
        >
          <span className="transform -translate-y-[0.5px]">₿</span>
        </div>
      );

    case 'ETH':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#627EEA] via-[#4F68C4] to-[#3B4F99] text-white shadow-[0_2px_8px_rgba(98,126,234,0.25)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'Ethereum'}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4/6 h-4/6 text-white drop-shadow-sm">
            <path d="M12 2L11.8 2.6V15.2L12 15.4L18.5 11.5L12 2Z" fill="white" fillOpacity="0.95"/>
            <path d="M12 2L5.5 11.5L12 15.4V9.3V2Z" fill="white" fillOpacity="0.65"/>
            <path d="M12 16.6L11.9 16.7V21.7L12 22L18.5 12.8L12 16.6Z" fill="white" fillOpacity="0.95"/>
            <path d="M12 22V16.6L5.5 12.8L12 22Z" fill="white" fillOpacity="0.65"/>
            <path d="M12 15.4L18.5 11.5L12 8.6V15.4Z" fill="white" fillOpacity="0.45"/>
            <path d="M12 15.4V8.6L5.5 11.5L12 15.4Z" fill="white" fillOpacity="0.35"/>
          </svg>
        </div>
      );

    case 'SOL':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#14F195] via-[#8062D6] to-[#9945FF] p-[1.5px] text-white shadow-[0_2px_8px_rgba(153,69,255,0.3)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'Solana'}
        >
          <div className="w-full h-full bg-[#0c0c0e]/90 rounded-full flex items-center justify-center p-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5/6 h-5/6 text-white">
              <path d="M4.3 17.5H19.7L16.4 20.8H1L4.3 17.5Z" fill="url(#solana-grad)" />
              <path d="M19.7 10.8H4.3L1 14.1H16.4L19.7 10.8Z" fill="url(#solana-grad)" />
              <path d="M4.3 4H19.7L16.4 7.3H1L4.3 4Z" fill="url(#solana-grad)" />
              <defs>
                <linearGradient id="solana-grad" x1="1" y1="0.5" x2="0" y2="0.5">
                  <stop offset="0%" stopColor="#14F195" />
                  <stop offset="50%" stopColor="#8062D6" />
                  <stop offset="100%" stopColor="#9945FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      );

    case 'DOGE':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#C2A633] via-[#A88B1E] to-[#80660B] text-white font-sans font-black shadow-[0_2px_8px_rgba(194,166,51,0.25)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'Dogecoin'}
        >
          <span className="transform -translate-y-[0.5px]">Ð</span>
        </div>
      );

    case 'PEPE':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] text-white font-mono font-black shadow-[0_2px_8px_rgba(16,185,129,0.25)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'Pepe Coin'}
        >
          <div className="flex flex-col items-center justify-center mt-[-1px]">
            <span className="text-[10px] leading-none mb-[-2px] text-yellow-300">👑</span>
            <span className="text-xs leading-none font-sans">🐸</span>
          </div>
        </div>
      );

    case 'XRP':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#23292F] to-[#00AAE4] p-[1.5px] text-white shadow-[0_2px_8px_rgba(0,170,228,0.25)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'Ripple'}
        >
          <div className="w-full h-full bg-[#0a0f14] rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4/6 h-4/6 text-cyan-400">
              <path d="M3 12h18M12 3v18L3 12l9 9" />
            </svg>
          </div>
        </div>
      );

    case 'TON':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#0098EA] to-[#007cc0] text-white shadow-[0_2px_8px_rgba(0,152,234,0.3)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'The Open Network'}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4/6 h-4/6 text-white drop-shadow-sm">
            <path d="M12 2.5L2 12.0L9.0 13.5L12 21.5L14.5 13.5L22 12.0L12 2.5Z" />
          </svg>
        </div>
      );

    case 'WIF':
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#dfc8a5] via-[#cbb085] to-[#9f7d54] text-white font-mono font-black border border-[#beaa8a]/40 shadow-[0_2px_8px_rgba(223,200,165,0.25)] select-none shrink-0 ${currentSizeClass} ${className}`}
          title={fullName || 'dogwifhat'}
        >
          <div className="flex flex-col items-center justify-center leading-none">
            <span className="text-[10px] leading-none mb-[-2px] filter drop-shadow">🎩</span>
            <span className="text-[9px] font-sans text-gray-900 font-bold leading-none">WIF</span>
          </div>
        </div>
      );

    default:
      const initial = ticker.slice(0, 2);
      return (
        <div 
          className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white font-mono font-extrabold tracking-tight uppercase shadow-[0_2px_6px_rgba(59,130,246,0.2)] select-none shrink-0 border border-white/10 ${currentSizeClass} ${className}`}
          title={fullName || coin}
        >
          <span className="text-[10px] sm:text-xs">{initial}</span>
        </div>
      );
  }
}

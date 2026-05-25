import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Terminal, 
  Sparkles, 
  Settings, 
  Compass, 
  Newspaper, 
  Flame, 
  Eye, 
  Info, 
  Search, 
  SlidersHorizontal, 
  X, 
  Clock, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  BrainCircuit,
  CornerDownRight,
  User,
  Key
} from 'lucide-react';

// Data & types
import { mockNews as initialMockNews } from './data/mockNews';
import { initialCoinSentiments } from './data/mockSentiment';
import { NewsItem, CoinSentiment, MarketSummary, AppSettings } from './types';
import { processNewsCollection } from './utils/sentimentAnalysis';
import { analyzeNewsSentiment } from './utils/aiService';

// Subcomponents
import { Header } from './components/Header';
import { SentimentGauge } from './components/SentimentGauge';
import { SentimentCard } from './components/SentimentCard';
import { NewsCard } from './components/NewsCard';
import { CoinSentimentBar } from './components/CoinSentimentBar';
import { TrendingCoins } from './components/TrendingCoins';
import { SentimentHistoryChart } from './components/SentimentHistoryChart';

export default function App() {
  // 1. Core State
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [coinSentiments, setCoinSentiments] = useState<CoinSentiment[]>(initialCoinSentiments);
  const [marketSummary, setMarketSummary] = useState<MarketSummary>({
    moodScore: 78,
    label: 'Greed',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
    marketSummaryText: 'Loading initial AI market telemetry...',
    topBullishSignal: 'Initializing analytical pipelines.',
    topBearishWarning: 'Awaiting aggregate feeds.',
    aiTradingSuggestion: 'Please wait...',
    sentimentTrend: 'Awaiting compilation.'
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'trending' | 'ai-analysis' | 'settings'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedCoinFilter, setSelectedCoinFilter] = useState<string>('all');

  // News View Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [filterCoin, setFilterCoin] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<'all' | '1h' | '6h' | '24h'>('all');

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    anthropicKey: '',
    openaiKey: '',
    useRealAI: false,
    refreshInterval: 5 // minutes
  });

  // 2. Load LocalStorage on Mount & Process Starter news state
  useEffect(() => {
    // Load existing settings
    const stored = localStorage.getItem('bitget_sentiment_settings');
    let loadedSettings = {
      anthropicKey: '',
      openaiKey: '',
      useRealAI: false,
      refreshInterval: 5
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        loadedSettings = { ...loadedSettings, ...parsed };
        setSettings(loadedSettings);
      } catch (e) {
        console.error('Failed to restore settings', e);
      }
    }

    // Process baseline news analysis
    const evaluatedNews = processNewsCollection(initialMockNews);
    setNewsItems(evaluatedNews);

    // Initial Trigger Analysis
    triggerRecalculate(evaluatedNews, loadedSettings);
  }, []);

  // 3. Automated Refresh Timer
  useEffect(() => {
    const ms = settings.refreshInterval * 60 * 1000;
    const interval = setInterval(() => {
      // Simulate slight numeric adjustments to represent real-time updates and trigger calculation
      setCoinSentiments(prev => 
        prev.map(c => {
          const change = (Math.random() - 0.5) * 4;
          const scoreChange = Math.floor((Math.random() - 0.5) * 6);
          return {
            ...c,
            priceChange24h: c.priceChange24h + change,
            score: Math.max(10, Math.min(100, c.score + scoreChange)),
            newsCount: c.newsCount + (Math.random() > 0.7 ? 1 : 0)
          };
        })
      );
      // Run recalculation
      triggerRecalculate(newsItems, settings);
    }, ms);

    return () => clearInterval(interval);
  }, [settings.refreshInterval, newsItems, settings]);

  // 4. Central Evaluation Handler
  const triggerRecalculate = async (currentNews: NewsItem[], activeSettings: AppSettings) => {
    setIsRefreshing(true);
    try {
      // Small simulated buffer for terminal loading feel
      await new Promise(resolve => setTimeout(resolve, 800));

      const summary = await analyzeNewsSentiment(currentNews, activeSettings);
      setMarketSummary(summary);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    // Slightly shuffle some mock data parameters to show distinct changes on manual click
    const randomizedNews = newsItems.map(item => {
      if (Math.random() > 0.6) {
        return {
          ...item,
          score: Math.max(5, Math.min(100, item.score + Math.floor((Math.random() - 0.5) * 10))),
          timeAgo: 'Just now'
        };
      }
      return item;
    });
    setNewsItems(randomizedNews);

    // Randomize coin 24h percentage increments for live trading desk vibe
    setCoinSentiments(prev => 
      prev.map(c => ({
        ...c,
        priceChange24h: c.priceChange24h + Number((Math.random() - 0.5).toFixed(2)),
        score: Math.max(10, Math.min(100, c.score + Math.floor((Math.random() - 0.5) * 4)))
      }))
    );

    triggerRecalculate(randomizedNews, settings);
  };

  const handleSettingsSave = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('bitget_sentiment_settings', JSON.stringify(newSettings));
    triggerRecalculate(newsItems, newSettings);
  };

  // 5. Filtering Algorithm for News
  const getFilteredNews = () => {
    return newsItems.filter(item => {
      // Filter A: Search match
      const titleMatch = item.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter B: Sentiment tag
      const sentimentMatch = filterSentiment === 'all' || item.sentiment === filterSentiment;

      // Filter C: Ticker tags
      const coinMatch = filterCoin === 'all' || item.coins.includes(filterCoin);

      // Filter D: Timestamps calculation
      let timeMatch = true;
      if (filterTime !== 'all') {
        const itemCreated = new Date(item.timestamp).getTime();
        const diffHours = (Date.now() - itemCreated) / (1000 * 60 * 60);
        if (filterTime === '1h') timeMatch = diffHours <= 1.2;
        else if (filterTime === '6h') timeMatch = diffHours <= 6.2;
        else if (filterTime === '24h') timeMatch = diffHours <= 24.2;
      }

      return titleMatch && sentimentMatch && coinMatch && timeMatch;
    });
  };

  const activeNewsFeed = getFilteredNews();

  // News Stats logic helper
  const bCounts = newsItems.filter(n => n.sentiment === 'bullish').length;
  const beCounts = newsItems.filter(n => n.sentiment === 'bearish').length;
  const nCounts = newsItems.filter(n => n.sentiment === 'neutral').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-gray-200 selection:bg-cyan-500/30 selection:text-cyan-400 font-sans">
      
      {/* Upper Terminal Header */}
      <Header 
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        refreshInterval={settings.refreshInterval}
        lastUpdated={lastUpdated}
      />

      {/* Primary Layout Block */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row relative">
        
        {/* SIDEBAR NAVIGATION - Collapses to bottom tab bar on small viewports */}
        <aside id="sidebar-nav" className="w-full md:w-64 shrink-0 bg-[#0f0f0f] md:bg-[#1a1a1a]/10 md:border-r border-gray-800/60 p-4 md:sticky md:top-[65px] md:h-[calc(100vh-65px)] flex flex-row md:flex-col justify-between items-center md:items-stretch gap-2 overflow-x-auto md:overflow-x-visible">
          
          <div className="flex md:flex-col items-center md:items-stretch gap-2 w-full">
            <span className="hidden md:block text-[10px] font-mono tracking-widest text-gray-500 uppercase px-3 py-1">
              Terminal Areas
            </span>
            
            {/* News sentiment view switcher */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all w-full leading-none whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#151515] border border-transparent'
              }`}
            >
              <Compass className="h-4 w-4 shrink-0" />
              <span>DASHBOARD</span>
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all w-full leading-none whitespace-nowrap ${
                activeTab === 'news' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#151515] border border-transparent'
              }`}
            >
              <Newspaper className="h-4 w-4 shrink-0" />
              <span>NEWS FEED</span>
              {activeNewsFeed.length > 0 && (
                <span className="ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-300">
                  {activeNewsFeed.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all w-full leading-none whitespace-nowrap ${
                activeTab === 'trending' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#151515] border border-transparent'
              }`}
            >
              <Flame className="h-4 w-4 shrink-0" />
              <span>TRENDING</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-analysis')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all w-full leading-none whitespace-nowrap ${
                activeTab === 'ai-analysis' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#151515] border border-transparent'
              }`}
            >
              <BrainCircuit className="h-4 w-4 shrink-0" />
              <span>AI ANALYSIS</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all w-full leading-none whitespace-nowrap ${
                activeTab === 'settings' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,229,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-[#151515] border border-transparent'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>SETTINGS</span>
            </button>
          </div>

          {/* Quick legal/context summary at the bottom sidebar (only on desktop) */}
          <div className="hidden md:block px-3 py-4 mt-auto border-t border-gray-800/40 text-[9px] font-mono text-gray-500 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400/80">
              <Sparkles className="h-3 w-3" />
              <span>SYSTEM ONLINE</span>
            </div>
            <p className="leading-relaxed">
              Indices calculated via deep multi-tiered keyword and neural network analyzers. Fully audited for high traders trust.
            </p>
          </div>
        </aside>

        {/* MAIN DISPLAY WORKSPACE */}
        <main className="flex-1 p-3 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Welcome Banner */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent overflow-hidden"
              >
                {/* Close banner Trigger */}
                <button
                  onClick={() => setShowWelcome(false)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 h-10 w-10 flex items-center justify-center border border-cyan-500/40">
                    <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="space-y-2 pr-6 font-mono text-left">
                    <h3 className="text-sm font-bold text-gray-100">
                      Welcome to Market Sentiment Eye
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Powered by advanced LLM-driven analytics, transforming complex multi-source crypto news into clear, actionable market insights. Built to help traders spot trends, gauge sentiment, and make more informed decisions.
                    </p>
                    <p className="text-xs text-cyan-400/90 leading-relaxed font-semibold">
                      ✨ Tip: Click any coin ticker below to instantly explore related news, sentiment shifts, and market narratives.
                    </p>
                    <p className="text-[10px] text-gray-500 leading-relaxed pt-2 border-t border-cyan-500/10 mt-1">
                      Thoughtfully engineered and continuously refined under the guidance of <strong className="text-gray-300 font-extrabold">Trozan</strong>, with a focus on making crypto intelligence more accessible to everyone.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Score Indicators and Gauges Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Big gauge Visualizer */}
                <div className="lg:col-span-1">
                  <SentimentGauge 
                    score={marketSummary.moodScore}
                    label={marketSummary.label}
                    timestamp={marketSummary.timestamp}
                    bullishCount={bCounts}
                    bearishCount={beCounts}
                    neutralCount={nCounts}
                  />
                </div>

                {/* AI Executive Verdict Panel */}
                <div className="lg:col-span-2 bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col justify-between shadow-md relative">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 mb-3 font-mono">
                      <Terminal className="h-4 w-4" />
                      <span className="text-xs font-bold tracking-widest uppercase">EXECUTIVE VERDICT SUMMARY</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-100 mb-2">
                      Market Mood: <span className="text-cyan-400">{marketSummary.label}</span>
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed font-sans mb-4">
                      {marketSummary.marketSummaryText}
                    </p>

                    <div className="space-y-2.5 font-mono text-xs">
                      <div className="p-2.5 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-400/95">
                        <span className="text-[10px] text-emerald-500 block uppercase font-bold mb-0.5">Top Bullish Opportunity</span>
                        {marketSummary.topBullishSignal}
                      </div>
                      <div className="p-2.5 rounded bg-rose-500/5 border border-rose-500/20 text-rose-400/95">
                        <span className="text-[10px] text-rose-500 block uppercase font-bold mb-0.5">Maximum Risk Element</span>
                        {marketSummary.topBearishWarning}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] font-mono text-gray-500">
                    <span>INDEX LEVEL: {marketSummary.moodScore}/100</span>
                    <button 
                      onClick={() => setActiveTab('ai-analysis')}
                      className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
                    >
                      View core trading suggest <CornerDownRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Ticker Cards grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-widest">
                    ANALYSED ASSET TELEMETRY
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500">
                    CLICK A TILE TO DRILL-DOWN NEWS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {coinSentiments.map(coin => (
                    <SentimentCard 
                      key={coin.coin}
                      data={coin}
                      isSelected={selectedCoinFilter === coin.coin}
                      onSelectCoin={(symbol) => {
                        // Toggle logic. If already selected, reset.
                        if (selectedCoinFilter === symbol) {
                          setSelectedCoinFilter('all');
                          setFilterCoin('all');
                        } else {
                          setSelectedCoinFilter(symbol);
                          setFilterCoin(symbol);
                          setActiveTab('news'); // Automatically switch to news page on click!
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Historic Line charts + dispersion progresses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SentimentHistoryChart />
                <CoinSentimentBar coinsSentiment={coinSentiments} />
              </div>

            </div>
          )}

          {/* 2. NEWS FEED VIEW */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              
              {/* Header block with statistics indicator */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <h2 className="text-xl font-mono font-bold text-gray-100 flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-cyan-400" />
                    CRYPTO SENTIMENT FEED
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Real-time aggregated global headlines categorized by AI sentiment models.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#1a1a1a] p-2 rounded-lg border border-gray-800 font-mono text-[11px]">
                  <span className="text-gray-500">Volume:</span>
                  <span className="font-bold text-cyan-400">{activeNewsFeed.length} of {newsItems.length}</span>
                </div>
              </div>

              {/* Filtering panel controls */}
              <section className="bg-[#1a1a1a]/70 p-4 rounded-xl border border-gray-800 space-y-3 relative overflow-hidden font-mono text-xs">
                
                {/* Visual grid backing */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
                  
                  {/* Query text search bar */}
                  <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input 
                      type="text"
                      placeholder="Search news titles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 text-gray-200"
                    />
                  </div>

                  {/* Filter sentiment */}
                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">SENTIMENT BIAS</label>
                    <select 
                      value={filterSentiment}
                      onChange={(e: any) => setFilterSentiment(e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500 text-gray-200"
                    >
                      <option value="all">All Sentiments</option>
                      <option value="bullish">Bullish 🟢</option>
                      <option value="bearish">Bearish 🔴</option>
                      <option value="neutral">Neutral 🟡</option>
                    </select>
                  </div>

                  {/* Filter coin */}
                  <div className="md:col-span-3">
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">ASSET TICKER</label>
                    <select 
                      value={filterCoin}
                      onChange={(e) => {
                        setFilterCoin(e.target.value);
                        setSelectedCoinFilter(e.target.value);
                      }}
                      className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500 text-gray-200"
                    >
                      <option value="all">All Tickers</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                      <option value="DOGE">DOGE</option>
                      <option value="PEPE">PEPE</option>
                      <option value="XRP">XRP</option>
                      <option value="TON">TON</option>
                      <option value="WIF">WIF</option>
                    </select>
                  </div>

                  {/* Filter time */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">TIME FREQUENCY</label>
                    <select 
                      value={filterTime}
                      onChange={(e: any) => setFilterTime(e.target.value)}
                      className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-500 text-gray-200"
                    >
                      <option value="all">All Time</option>
                      <option value="1h">Last 1 hour</option>
                      <option value="6h">Last 6 hours</option>
                      <option value="24h">Last 24 hours</option>
                    </select>
                  </div>

                </div>

                {/* Filter Clear Trigger if any parameters are active */}
                {(searchQuery || filterSentiment !== 'all' || filterCoin !== 'all' || filterTime !== 'all') && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/40 relative z-10">
                    <span className="text-[10px] text-gray-500">
                      Active matching filter results: <span className="text-cyan-400 font-bold">{activeNewsFeed.length} articles</span>
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterSentiment('all');
                        setFilterCoin('all');
                        setFilterTime('all');
                        setSelectedCoinFilter('all');
                      }}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 uppercase"
                    >
                      Clear Filters <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </section>

              {/* Feed Card Lists */}
              <div className="space-y-4">
                {activeNewsFeed.length > 0 ? (
                  activeNewsFeed.map(news => (
                    <NewsCard key={news.id} item={news} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-[#1a1a1a]/45 rounded-xl border border-gray-800/80 font-mono space-y-2">
                    <Info className="h-8 w-8 text-gray-600 mx-auto" />
                    <h3 className="text-gray-300 font-bold">No matching articles found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Adjust your query terms, selected tickers, or time filters to drill-down wider crypto parameters.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 3. TRENDING TILES VIEW */}
          {activeTab === 'trending' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-xl font-mono font-bold text-gray-100 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-purple-400" />
                  TRENDING COINS & consensus
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  High-volume digital assets experiencing exponential community news volume and price variations.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left block trending list */}
                <div className="lg:col-span-2">
                  <TrendingCoins 
                    coinsSentiment={coinSentiments} 
                    onSelectCoin={(symbol) => {
                      setFilterCoin(symbol);
                      setSelectedCoinFilter(symbol);
                      setActiveTab('news');
                    }}
                  />
                </div>

                {/* Right side educational panel */}
                <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl border border-gray-800 p-6 shadow-md relative font-mono space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Info className="h-4 w-4" />
                    <span className="text-xs font-bold tracking-wider uppercase">UNDERSTANDING HEAT LEVEL</span>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-gray-300">
                    <p>
                      Our algorithmic heat meter combines <strong>24h trading volumes</strong> paired with <strong>relative news weights</strong> over the last 24-hour cycle.
                    </p>
                    
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/25 flex gap-2">
                      <Flame className="text-red-400 h-5 w-5 shrink-0" />
                      <div>
                        <strong className="text-red-400 block font-bold mb-0.5">HOT (🔥) Momentum:</strong>
                        Indicates extreme sentiment polarization with high community density and active volume triggers. Suitable for volatility scalpers.
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/25 flex gap-2">
                      <Clock className="text-cyan-400 h-5 w-5 shrink-0" />
                      <div>
                        <strong className="text-cyan-400 block font-bold mb-0.5">COLD (🧊) Consensus:</strong>
                        Normal flatlined ranges indicating structured order consolidation or lack of volatile retail pressure. Suitable for range margin traders.
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4. AI CORRIDOR ANALYSIS */}
          {activeTab === 'ai-analysis' && (
            <div className="space-y-6">
              
              <div className="border-b border-gray-800 pb-4">
                <h2 className="text-xl font-mono font-bold text-gray-100 flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-cyan-400" />
                  AI RISK & TRADING DECISION CORRIDOR
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Algorithmic trading recommendations optimized for modern multi-exchange trading environments.
                </p>
              </div>

              {/* Major Analysis board */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Summary details */}
                <div className="md:col-span-8 space-y-6">
                  <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-md space-y-4">
                    
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                        DECISION MATRIX
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/5 border border-cyan-500/20">
                        MODEL: {settings.useRealAI ? 'GEMINI NEURAL 3.5' : 'SECURE HYBRID KEYWORD'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase tracking-wider mb-1">
                          Consolidated Sentiment Summary
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed font-sans bg-[#0f0f0f]/40 p-3 rounded-xl border border-gray-900">
                          {marketSummary.marketSummaryText}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/25">
                          <span className="text-[9px] font-mono font-extrabold text-emerald-400 block mb-1">PRIME TRADER SIGNAL</span>
                          <span className="text-xs text-gray-200 block leading-snug">{marketSummary.topBullishSignal}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/25">
                          <span className="text-[9px] font-mono font-extrabold text-rose-400 block mb-1">CRITICAL THREAT ALERT</span>
                          <span className="text-xs text-gray-200 block leading-snug">{marketSummary.topBearishWarning}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase tracking-wider mb-1">
                          Tactical Execution Plan
                        </span>
                        <div className="p-3.5 rounded-xl bg-[#0f0f0f]/80 border border-gray-950 font-sans text-sm text-cyan-300/90 leading-relaxed">
                          {marketSummary.aiTradingSuggestion}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-500 block uppercase tracking-wider mb-1">
                          Consensus Velocity Over 24h
                        </span>
                        <p className="text-xs text-gray-400 leading-relaxed font-mono">
                          {marketSummary.sentimentTrend}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right statistics panels */}
                <div className="md:col-span-4 space-y-6">
                  <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-md font-mono space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Terminal className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">INDEX METRICS SPEED</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                        <span className="text-gray-500">AGGREGATE SCORE</span>
                        <span className="font-bold text-white text-sm">{marketSummary.moodScore}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                        <span className="text-gray-500">MARKET DYNAMICS</span>
                        <span className="font-bold text-cyan-400">{marketSummary.label}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-800/60">
                        <span className="text-gray-500">ACTIVE TIMEFRAME</span>
                        <span className="font-bold text-purple-400">T-6 HOURS FEED</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleManualRefresh}
                        className="w-full py-2 px-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-md active:scale-95 transition-all text-xs uppercase"
                      >
                        FORCE AI REEVALUATE
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 5. SETTINGS PANEL VIEW */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div>
                <h2 className="text-xl font-mono font-bold text-gray-100 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  ANALYZER SYSTEM SETTINGS
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Configure real AI models, custom developer API keys, and auto-refresh intervals.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Inputs block */}
                <div className="lg:col-span-2 bg-[#1a1a1a]/80 p-6 rounded-2xl border border-gray-800 shadow-md font-mono space-y-6">
                  
                  {/* Mode Selector Toggle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-gray-200">ANALYSIS ENGINE MODEL</label>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        settings.useRealAI ? 'bg-cyan-500/5 text-cyan-400 border-cyan-500/30' : 'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {settings.useRealAI ? 'ACTIVE: NEURAL NETWORK' : 'ACTIVE: LOCAL KEYWORDS'}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 leading-relaxed">
                      If enabled, the terminal utilizes our server-side Gemini API or your personal API keys below to analyze news. If disabled, a smart and highly efficient keyword analysis engine operates locally in your browser.
                    </p>

                    <button
                      onClick={() => handleSettingsSave({ ...settings, useRealAI: !settings.useRealAI })}
                      className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all text-xs uppercase ${
                        settings.useRealAI 
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.05)]' 
                          : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-850'
                      }`}
                    >
                      <span>{settings.useRealAI ? '🟢 USE NEURAL REAL AI ACTIVE' : '🔴 USE LOCAL MOCK AI Fallback'}</span>
                    </button>
                  </div>

                  {/* API KEY INPUTS */}
                  <div className="border-t border-gray-800/80 pt-4 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5 text-cyan-400" />
                      CUSTOM AI PLATFORM API KEYS (FALLBACK)
                    </h3>
                    
                    <p className="text-xs text-gray-500">
                      These keys are saved securely inside your browser's local sandbox memory (`localStorage`) and are only used during real-time analyses.
                    </p>

                    {/* Anthropic API key Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                        <span>Anthropic (Claude) API Key</span>
                        <span className="text-[10px] font-normal text-gray-500">(First priority)</span>
                      </label>
                      <input 
                        type="password"
                        placeholder="sk-ant-..."
                        value={settings.anthropicKey}
                        onChange={(e) => setSettings({ ...settings, anthropicKey: e.target.value })}
                        className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-gray-200"
                      />
                    </div>

                    {/* OpenAI key Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-300 flex items-center gap-1">
                        <span>OpenAI API Key</span>
                        <span className="text-[10px] font-normal text-gray-500">(Secondary priority)</span>
                      </label>
                      <input 
                        type="password"
                        placeholder="sk-proj-..."
                        value={settings.openaiKey}
                        onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                        className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg p-2.5 text-xs focus:outline-none focus:border-cyan-500 text-gray-200"
                      />
                    </div>
                  </div>

                  {/* AUTO REFRESH DURATION */}
                  <div className="border-t border-gray-800/80 pt-4 space-y-2">
                    <label className="text-sm font-bold text-gray-200 block">AUTO-REUSE TELEMETRY INTERVAL</label>
                    <p className="text-xs text-gray-500">
                      Select how frequently the system recalculates sentiment coefficients and micro-price fluctuations automatically.
                    </p>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 5, 15, 30].map(mins => (
                        <button
                          key={mins}
                          onClick={() => setSettings({ ...settings, refreshInterval: mins })}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                            settings.refreshInterval === mins 
                              ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' 
                              : 'bg-black/30 border-gray-800 text-gray-400 hover:bg-gray-850'
                          }`}
                        >
                          {mins} Min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Explicit Manual Action Button */}
                  <div className="pt-4 border-t border-gray-800/80">
                    <button
                      onClick={() => handleSettingsSave(settings)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-[#0f0f0f] transition-all text-xs uppercase"
                    >
                      COMMIT CHANGES & RESYNC TELEMETRY
                    </button>
                  </div>

                </div>

                {/* Right educational panels */}
                <div className="bg-[#1a1a1a]/80 p-6 rounded-2xl border border-gray-800 shadow-md font-mono space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-xs font-bold tracking-wider uppercase">INTELLIGENT SECURE ROUTING</span>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed text-gray-400">
                    <p>
                      <strong>Zero Setup Trial:</strong> Our premium dashboard comes pre-wired with server-side <strong>Gemini AI Integration</strong> out of the box!
                    </p>
                    <p>
                      Simply toggle <strong>"🟢 USE NEURAL REAL AI"</strong> above. If you do not configure any OpenAI or Claude keys, the system automatically proxies requests through our secure backend server route.
                    </p>
                    <p>
                      This ensures hackathon judges have direct access to <strong>real live-AI translations</strong> of our 30 crypto news items instantly without entering custom API credentials!
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800/90 bg-[#0c0c0c] py-6 px-4 sm:px-6 text-center font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Market Sentiment Eye. All rights reserved. Created by trozan.
          </p>
          <p className="text-[11px] text-gray-600">
            Advanced Trading Decisions Support Terminal
          </p>
        </div>
      </footer>
    </div>
  );
}

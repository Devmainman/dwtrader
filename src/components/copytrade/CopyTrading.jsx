"use client";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import CopyTradingHeader from "./CopyTradingHeader";
import TraderStats from "./TraderStats";
import TopTradersList from "./TopTradersList";
import CopyTradingModal from "./CopyTradingModal";
import PerformanceChart from "./PerformanceChart";
import CopyTradingPositions from "./CopyTradingPositions";

export default function CopyTrading() {
  const { fetchWithAuth, user } = useUserAuth();
  
  // State management
  const [traders, setTraders] = useState([]);
  const [topTraders, setTopTraders] = useState([]);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [copyPositions, setCopyPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    totalCopiers: 0,
    totalTraders: 0,
    totalVolume: 0,
    averageProfit: 0
  });
  
  // UI State
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [sortBy, setSortBy] = useState("profit");

  // Load traders data
  const loadTraders = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/copy-trading/traders");
      
      if (response.data?.success) {
        setTraders(response.data.traders || []);
        setTopTraders(response.data.topTraders || []);
        setStats(response.data.stats || {
          totalCopiers: 0,
          totalTraders: 0,
          totalVolume: 0,
          averageProfit: 0
        });
      }
    } catch (err) {
      console.error('Error loading traders:', err);
      setTraders(generateMockTraders());
      setTopTraders(generateMockTraders().slice(0, 5));
      setStats({
        totalCopiers: 1245,
        totalTraders: 87,
        totalVolume: 24500000,
        averageProfit: 12.5
      });
    } finally {
      setLoading(false);
    }
  };

  // Load copy positions
  const loadCopyPositions = async () => {
    try {
      const response = await fetchWithAuth("/copy-trading/positions");
      if (response.data?.success) {
        setCopyPositions(response.data.positions || []);
      }
    } catch (err) {
      console.error('Error loading copy positions:', err);
      setCopyPositions(generateMockPositions());
    }
  };

  // Generate mock traders for fallback
  const generateMockTraders = () => {
    const names = ["CryptoWizard", "ForexMaster", "DayTraderPro", "SwingKing", "ArbitrageBot", 
                   "TrendHunter", "VolatilityPro", "ScalpMaster", "PositionTrader", "AlgorithmicX"];
    
    return names.map((name, index) => ({
      id: `trader_${index + 1}`,
      username: name,
      fullName: `${name} Trader`,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
      profitPercent: 15 + Math.random() * 50,
      winRate: 60 + Math.random() * 35,
      totalTrades: 100 + Math.floor(Math.random() * 400),
      totalCopiers: 50 + Math.floor(Math.random() * 200),
      avgTradeSize: 1000 + Math.floor(Math.random() * 4000),
      maxDrawdown: 5 + Math.random() * 15,
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      tradingStyle: ["scalping", "day", "swing", "position"][Math.floor(Math.random() * 4)],
      markets: ["crypto", "forex", "both"][Math.floor(Math.random() * 3)],
      isCopying: index < 3,
      copyAmount: index < 3 ? (500 + Math.random() * 2000) : 0,
      weeklyPerformance: [12, 8, -5, 15, 20, 18, 25],
      monthlyProfit: 1500 + Math.random() * 5000,
      joinedDate: "2024-01-15",
      description: "Professional trader with 5+ years experience in crypto and forex markets."
    }));
  };

  // Generate mock positions
  const generateMockPositions = () => {
    return [
      {
        id: "pos_1",
        traderId: "trader_1",
        traderName: "CryptoWizard",
        symbol: "BTC/USDT",
        side: "buy",
        quantity: 0.5,
        entryPrice: 45250.50,
        currentPrice: 46000.00,
        profitLoss: 375.25,
        profitPercent: 1.66,
        openedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "pos_2",
        traderId: "trader_2",
        traderName: "ForexMaster",
        symbol: "EUR/USD",
        side: "sell",
        quantity: 10000,
        entryPrice: 1.0850,
        currentPrice: 1.0800,
        profitLoss: 50.00,
        profitPercent: 0.46,
        openedAt: "2024-01-15T09:15:00Z"
      }
    ];
  };

  // Copy a trader
  const handleCopyTrader = async (traderId, amount) => {
    try {
      const response = await fetchWithAuth("/copy-trading/copy", {
        method: "POST",
        data: { traderId, amount }
      });
      
      if (response.data?.success) {
        setMessage(`Successfully started copying trader with $${amount}`);
        loadTraders();
        loadCopyPositions();
        setShowCopyModal(false);
      } else {
        setMessage(response.data?.error || "Failed to copy trader");
      }
    } catch (err) {
      console.error('Error copying trader:', err);
      setMessage(err.response?.data?.error || "Failed to copy trader");
    }
  };

  // Stop copying a trader
  const handleStopCopying = async (traderId) => {
    try {
      const response = await fetchWithAuth("/copy-trading/stop", {
        method: "POST",
        data: { traderId }
      });
      
      if (response.data?.success) {
        setMessage("Stopped copying trader successfully");
        loadTraders();
        loadCopyPositions();
      } else {
        setMessage(response.data?.error || "Failed to stop copying");
      }
    } catch (err) {
      console.error('Error stopping copy:', err);
      setMessage(err.response?.data?.error || "Failed to stop copying");
    }
  };

  // Filter traders based on active filter and search
  const filteredTraders = traders.filter(trader => {
    if (searchTerm && !trader.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (activeFilter === "crypto" && trader.markets !== "crypto" && trader.markets !== "both") {
      return false;
    }
    if (activeFilter === "forex" && trader.markets !== "forex" && trader.markets !== "both") {
      return false;
    }
    if (activeFilter === "top" && !topTraders.find(t => t.id === trader.id)) {
      return false;
    }
    
    return true;
  });

  // Sort traders
  const sortedTraders = [...filteredTraders].sort((a, b) => {
    switch (sortBy) {
      case "profit":
        return b.profitPercent - a.profitPercent;
      case "winRate":
        return b.winRate - a.winRate;
      case "copiers":
        return b.totalCopiers - a.totalCopiers;
      case "trades":
        return b.totalTrades - a.totalTrades;
      default:
        return b.profitPercent - a.profitPercent;
    }
  });

  // Load data on mount
  useEffect(() => {
    loadTraders();
    loadCopyPositions();
    
    const interval = setInterval(() => {
      loadTraders();
      loadCopyPositions();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden px-5 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
        <div className="w-full flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full px-3 py-3 rounded-xl bg-neutral-800 animate-pulse h-24" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden px-5 py-3 mx-auto w-full rounded-3xl bg-neutral-900 max-w-[480px]">
      {/* Header */}
      <CopyTradingHeader 
        stats={stats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Statistics Cards */}
      <TraderStats stats={stats} />

      {/* Top Traders Carousel */}
      <TopTradersList 
        traders={topTraders}
        onSelectTrader={setSelectedTrader}
        onShowStats={() => setShowStatsModal(true)}
      />

      {/* All Traders Grid */}
      <div className="w-full mt-5">
        <div className="flex justify-between items-center mb-1.5">
          <h3 className="text-[12px] tracking-normal leading-none text-stone-300">ALL AVAILABLE TRADERS</h3>
          <span className="text-[10px] text-stone-300">
            Showing {sortedTraders.length} of {traders.length} traders
          </span>
        </div>
        
        <div className="mt-1.5 space-y-1.5">
          {sortedTraders.map((trader) => (
            <TraderCard
              key={trader.id}
              trader={trader}
              onCopy={() => {
                setSelectedTrader(trader);
                setShowCopyModal(true);
              }}
              onStopCopy={() => handleStopCopying(trader.id)}
              onViewDetails={() => setSelectedTrader(trader)}
            />
          ))}
        </div>
        
        {sortedTraders.length === 0 && (
          <div className="text-center py-12 text-stone-300 text-[12px]">
            No traders found matching your criteria
          </div>
        )}
      </div>

      {/* My Copy Positions */}
      <CopyTradingPositions 
        positions={copyPositions}
        onClosePosition={handleStopCopying}
      />

      {/* Performance Chart Modal */}
      {selectedTrader && showStatsModal && (
        <PerformanceChart
          trader={selectedTrader}
          onClose={() => {
            setSelectedTrader(null);
            setShowStatsModal(false);
          }}
        />
      )}

      {/* Copy Trader Modal */}
      {selectedTrader && showCopyModal && (
        <CopyTradingModal
          trader={selectedTrader}
          userBalance={user?.balance || 0}
          onCopy={handleCopyTrader}
          onClose={() => {
            setSelectedTrader(null);
            setShowCopyModal(false);
          }}
        />
      )}

      {/* Message Display */}
      {message && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-[10px] ${
          message.includes('Success') || message.includes('success') 
            ? 'bg-green-900/90 text-green-300' 
            : 'bg-red-900/90 text-red-300'
        }`}>
          {message}
          <button 
            onClick={() => setMessage("")}
            className="ml-4 text-stone-300 hover:text-zinc-100"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}

// TraderCard Component with updated styling
const TraderCard = ({ trader, onCopy, onStopCopy, onViewDetails }) => {
  const riskColor = {
    low: "bg-green-700/20 text-green-700",
    medium: "bg-yellow-700/20 text-yellow-700",
    high: "bg-red-600/20 text-red-600"
  };

  const styleColor = {
    scalping: "bg-blue-700/20 text-blue-700",
    day: "bg-purple-700/20 text-purple-700",
    swing: "bg-pink-700/20 text-pink-700",
    position: "bg-indigo-700/20 text-indigo-700"
  };

  return (
    <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-[60px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={trader.avatar}
            alt={trader.username}
            className="object-contain shrink-0 self-stretch my-auto w-9 aspect-square rounded-full"
          />
          <div>
            <h4 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{trader.username}</h4>
            <p className="text-[10px] text-stone-300">{trader.fullName}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-[12px] font-medium tracking-wide leading-tight ${trader.profitPercent >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {trader.profitPercent >= 0 ? '+' : ''}{trader.profitPercent.toFixed(2)}%
          </div>
          <div className="text-[10px] text-stone-300">Profit</div>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-2 gap-2.5 text-[10px]">
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Win Rate:</span>
          <span className="text-zinc-100 font-semibold">{trader.winRate.toFixed(1)}%</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Trades:</span>
          <span className="text-zinc-100 font-semibold">{trader.totalTrades}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Copiers:</span>
          <span className="text-zinc-100 font-semibold">{trader.totalCopiers}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Risk:</span>
          <span className={`px-1 py-0.5 rounded text-[10px] ${riskColor[trader.riskLevel]}`}>
            {trader.riskLevel}
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className={`px-1 py-0.5 rounded text-[10px] ${styleColor[trader.tradingStyle]}`}>
          {trader.tradingStyle}
        </span>
        <span className="px-1 py-0.5 rounded text-[10px] bg-neutral-700 text-stone-300">
          {trader.markets}
        </span>
      </div>

      <div className="mt-1.5 flex gap-1.5">
        {trader.isCopying ? (
          <>
            <button
              onClick={onViewDetails}
              className="flex-1 px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100"
            >
              View Details
            </button>
            <button
              onClick={onStopCopy}
              className="flex-1 px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 rounded-3xl text-[10px] text-zinc-100"
            >
              Stop Copying
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onViewDetails}
              className="flex-1 px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100"
            >
              Details
            </button>
            <button
              onClick={onCopy}
              className="flex-1 px-2.5 py-1.5 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100"
            >
              Copy Trade
            </button>
          </>
        )}
      </div>
    </div>
  );
};
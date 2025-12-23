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
  
  const userCurrency = user?.currency || "USD";
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sortBy, setSortBy] = useState("profit");

  // Load traders data
  const loadTraders = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/copy-trading/traders");
      
      if (response?.data?.success) {
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
      setMessage("Failed to load traders data");
      // No fallback data - just empty states
      setTraders([]);
      setTopTraders([]);
      setStats({
        totalCopiers: 0,
        totalTraders: 0,
        totalVolume: 0,
        averageProfit: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Load copy positions
  const loadCopyPositions = async () => {
    try {
      const response = await fetchWithAuth("/copy-trading/positions");
      if (response?.data?.success) {
        setCopyPositions(response.data.positions || []);
      }
    } catch (err) {
      console.error('Error loading copy positions:', err);
      setCopyPositions([]);
    }
  };

  // Copy a trader
  const handleCopyTrader = async (traderId, amount) => {
  console.log('handleCopyTrader called with:', { traderId, amount });
  
  try {
    const response = await fetchWithAuth("/copy-trading/copy", {
      method: "POST",
      data: { traderId, amount }
    });
    
    console.log('Backend response:', response);
    
    if (response?.data?.success) {
      setMessage(`Successfully started copying trader with $${amount}`);
      loadTraders();
      loadCopyPositions();
      setShowCopyModal(false);
    } else {
      setMessage(response?.data?.error || "Failed to copy trader");
    }
  } catch (err) {
    console.error('Error copying trader:', err);
    setMessage("Failed to copy trader. Please try again.");
  }
};

  // Stop copying a trader
  const handleStopCopying = async (traderId) => {
  console.log('Stopping copy for traderId:', traderId);
  
  try {
    const response = await fetchWithAuth("/copy-trading/stop", {
      method: "POST",
      data: { traderId }
    });
    
    if (response?.data?.success) {
      setMessage("Stopped copying trader successfully");
      loadTraders();
      loadCopyPositions();
    } else {
      setMessage(response?.data?.error || "Failed to stop copying");
    }
  } catch (err) {
    console.error('Error stopping copy:', err);
    setMessage("Failed to stop copying. Please try again.");
  }
};

  // Filter traders based on active filter and search
  const filteredTraders = traders.filter(trader => {
    if (!trader) return false;
    
    if (searchTerm && !trader.username?.toLowerCase().includes(searchTerm.toLowerCase())) {
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

  // TraderDetailsModal Component
const TraderDetailsModal = ({ trader, onClose, userCurrency }) => {
  if (!trader) return null;

  const formatCurrency = (amount) => {
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      // ... add more
    };
    const symbol = currencySymbols[userCurrency] || userCurrency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm pb-30">
      <div className="bg-neutral-900 rounded-3xl p-5 max-w-[480px] w-full max-h-[90vh] overflow-y-auto border border-neutral-800">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <img
            src={trader.avatar || `https://ui-avatars.com/api/?name=${trader.username || 'Trader'}&background=6366f1&color=fff`}
            alt={trader.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <h3 className="text-[14px] font-medium tracking-wide leading-tight text-zinc-100">
              {trader.username || "Unknown Trader"}
            </h3>
            <p className="text-[11px] text-stone-300">{trader.fullName || "Professional Trader"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-300 hover:text-zinc-100 rounded-full hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        {/* Trader Info */}
        <div className="mb-5 space-y-3">
          {trader.bio && (
            <div>
              <h4 className="text-[11px] font-medium text-stone-300 mb-1">About</h4>
              <p className="text-[12px] text-zinc-100">{trader.bio}</p>
            </div>
          )}

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-800 rounded-2xl">
              <div className="text-[10px] text-stone-300">Trading Experience</div>
              <div className="text-[12px] font-medium text-zinc-100">{trader.tradingExperience || "N/A"}</div>
            </div>
            <div className="p-3 bg-neutral-800 rounded-2xl">
              <div className="text-[10px] text-stone-300">Country</div>
              <div className="text-[12px] font-medium text-zinc-100">{trader.country || "Global"}</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="p-3 bg-neutral-800 rounded-2xl">
            <h4 className="text-[11px] font-medium text-stone-300 mb-2">Performance Statistics</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-stone-300">Total Profit</div>
                <div className={`text-[12px] font-medium ${(trader.performance?.profitPercent || 0) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {(trader.performance?.profitPercent || 0) >= 0 ? '+' : ''}{(trader.performance?.profitPercent || 0).toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Win Rate</div>
                <div className="text-[12px] font-medium text-zinc-100">{(trader.performance?.winRate || 0).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Total Trades</div>
                <div className="text-[12px] font-medium text-zinc-100">{trader.performance?.totalTrades || 0}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Avg. Trade</div>
                <div className="text-[12px] font-medium text-zinc-100">{formatCurrency(trader.performance?.averageTrade || 0)}</div>
              </div>
            </div>
          </div>

          {/* Risk Metrics */}
          <div className="p-3 bg-neutral-800 rounded-2xl">
            <h4 className="text-[11px] font-medium text-stone-300 mb-2">Risk Profile</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-stone-300">Risk Level</div>
                <div className="text-[12px] font-medium text-zinc-100 capitalize">{trader.riskLevel || "medium"}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Max Drawdown</div>
                <div className="text-[12px] font-medium text-red-600">-{(trader.riskMetrics?.maxDrawdown || 0).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Sharpe Ratio</div>
                <div className="text-[12px] font-medium text-zinc-100">{(trader.riskMetrics?.sharpeRatio || 0).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Profit Factor</div>
                <div className="text-[12px] font-medium text-zinc-100">{(trader.riskMetrics?.profitFactor || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Trading Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-800 rounded-2xl">
              <div className="text-[10px] text-stone-300">Trading Style</div>
              <div className="text-[12px] font-medium text-zinc-100 capitalize">{trader.tradingStyle || "day"}</div>
            </div>
            <div className="p-3 bg-neutral-800 rounded-2xl">
              <div className="text-[10px] text-stone-300">Markets</div>
              <div className="text-[12px] font-medium text-zinc-100 capitalize">{trader.markets || "crypto"}</div>
            </div>
          </div>

          {/* Social Stats */}
          <div className="p-3 bg-neutral-800 rounded-2xl">
            <h4 className="text-[11px] font-medium text-stone-300 mb-2">Community</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] text-stone-300">Copiers</div>
                <div className="text-[12px] font-medium text-zinc-100">{trader.socialStats?.copiers || 0}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Followers</div>
                <div className="text-[12px] font-medium text-zinc-100">{trader.socialStats?.followers || 0}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-300">Rating</div>
                <div className="text-[12px] font-medium text-zinc-100">{(trader.socialStats?.rating || 0).toFixed(1)}/5</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 px-2.5 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
          >
            Close
          </button>
          {!trader.isCopying && (
            <button
              onClick={() => {
                onClose();
                // You would need to pass a callback to open the copy modal here
              }}
              className="flex-1 px-2.5 py-3 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
            >
              Copy This Trader
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

  // Sort traders
  const sortedTraders = [...filteredTraders].sort((a, b) => {
    if (!a || !b) return 0;
    
    switch (sortBy) {
      case "profit":
        return (b.profitPercent || 0) - (a.profitPercent || 0);
      case "winRate":
        return (b.winRate || 0) - (a.winRate || 0);
      case "copiers":
        return (b.totalCopiers || 0) - (a.totalCopiers || 0);
      case "trades":
        return (b.totalTrades || 0) - (a.totalTrades || 0);
      default:
        return (b.profitPercent || 0) - (a.profitPercent || 0);
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
      <TraderStats stats={stats} userCurrency={userCurrency} />

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
          {sortedTraders.length > 0 ? (
            sortedTraders.map((trader) => (
            <TraderCard
              key={trader._id || trader.traderId || trader.id}
              userCurrency={userCurrency}
              trader={trader}
              onCopy={() => {
                setSelectedTrader(trader);
                setShowCopyModal(true);
              }}
              onStopCopy={() => {
                const traderId = trader.id || trader.traderId || trader._id;
                handleStopCopying(traderId);
              }}
              onViewDetails={() => {
                setSelectedTrader(trader);
                setShowDetailsModal(true); // Add this line
              }}
            />
          ))

          ) : (
            <div className="text-center py-12 text-stone-300 text-[12px]">
              {traders.length === 0 ? "No traders available" : "No traders found matching your criteria"}
            </div>
          )}
        </div>
      </div>

      {/* My Copy Positions */}
      {copyPositions.length > 0 && (
        <CopyTradingPositions 
          positions={copyPositions}
          onClosePosition={handleStopCopying}
          userCurrency={userCurrency}
        />
      )}

      {/* Trader Details Modal */}
    {selectedTrader && showDetailsModal && (
      <TraderDetailsModal
        trader={selectedTrader}
        onClose={() => {
          setSelectedTrader(null);
          setShowDetailsModal(false);
        }}
        userCurrency={userCurrency}
      />
    )}

      {/* Performance Chart Modal */}
      {selectedTrader && showStatsModal && (
        <PerformanceChart
          trader={selectedTrader}
          onClose={() => {
            setSelectedTrader(null);
            setShowStatsModal(false);
          }}
          userCurrency={userCurrency}
        />
      )}

      {/* Copy Trader Modal */}
      {selectedTrader && showCopyModal && (
        <CopyTradingModal
          trader={selectedTrader}
          userBalance={user?.balance || 0}
          userCurrency={userCurrency}
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

// TraderCard Component
// TraderCard Component
const TraderCard = ({ trader, onCopy, onStopCopy, onViewDetails }) => {
  if (!trader) return null;

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

  // Use nested properties
  const profitPercent = trader.performance?.profitPercent || 0;
  const winRate = trader.performance?.winRate || 0;
  const totalTrades = trader.performance?.totalTrades || 0;
  const totalCopiers = trader.socialStats?.copiers || 0;

  return (
    <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-[60px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={trader.avatar || `https://ui-avatars.com/api/?name=${trader.username || 'Trader'}&background=6366f1&color=fff`}
            alt={trader.username}
            className="object-contain shrink-0 self-stretch my-auto w-9 aspect-square rounded-full"
          />
          <div>
            <h4 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
              {trader.username || "Unknown Trader"}
            </h4>
            <p className="text-[10px] text-stone-300">
              {trader.fullName || "Professional Trader"}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-[12px] font-medium tracking-wide leading-tight ${profitPercent >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
          </div>
          <div className="text-[10px] text-stone-300">Profit</div>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-2 gap-2.5 text-[10px]">
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Win Rate:</span>
          <span className="text-zinc-100 font-semibold">{winRate.toFixed(1)}%</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Trades:</span>
          <span className="text-zinc-100 font-semibold">{totalTrades}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Copiers:</span>
          <span className="text-zinc-100 font-semibold">{totalCopiers}</span>
        </div>
        <div className="flex gap-0.5 items-center">
          <span className="text-stone-300">Risk:</span>
          <span className={`px-1 py-0.5 rounded text-[10px] ${riskColor[trader.riskLevel] || 'bg-neutral-700 text-stone-300'}`}>
            {trader.riskLevel || "medium"}
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1">
        <span className={`px-1 py-0.5 rounded text-[10px] ${styleColor[trader.tradingStyle] || 'bg-neutral-700 text-stone-300'}`}>
          {trader.tradingStyle || "day"}
        </span>
        <span className="px-1 py-0.5 rounded text-[10px] bg-neutral-700 text-stone-300">
          {trader.markets || "crypto"}
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
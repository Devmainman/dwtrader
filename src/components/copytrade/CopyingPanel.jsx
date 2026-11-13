import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

export default function CopyTradingPositions() {
  const { fetchWithAuth, user } = useUserAuth();
  const [copyTrades, setCopyTrades] = useState([]);
  const [openPositions, setOpenPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load user's copy trading data
  const loadCopyTradingData = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("/copy-trading/my-copies");
      
      if (response?.data?.success) {
        setCopyTrades(response.data.copyTrades || []);
        setOpenPositions(response.data.openPositions || []);
      }
    } catch (err) {
      console.error('Error loading copy trading data:', err);
      setMessage("Failed to load copy trading data");
      setCopyTrades([]);
      setOpenPositions([]);
    } finally {
      setLoading(false);
    }
  };

  // Stop copying a trader
  const handleStopCopying = async (copyTradeId) => {
    try {
      const response = await fetchWithAuth("/copy-trading/stop", {
        method: "POST",
        data: { copyTradeId }
      });
      
      if (response?.data?.success) {
        setMessage("Stopped copying trader successfully");
        loadCopyTradingData();
      } else {
        setMessage(response?.data?.error || "Failed to stop copying");
      }
    } catch (err) {
      console.error('Error stopping copy:', err);
      setMessage("Failed to stop copying. Please try again.");
    }
  };

  useEffect(() => {
    loadCopyTradingData();
    
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadCopyTradingData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <section className="
        overflow-hidden
        px-5 py-3
        mx-auto w-full
        rounded-3xl
        bg-neutral-900
        max-w-[480px]
        md:max-w-[900px]
        lg:max-w-[1200px]
      ">
        <div className="w-full flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-full px-3 py-3 rounded-xl bg-neutral-800 animate-pulse h-24" />
          ))}
        </div>
      </section>
    );
  }

  // Calculate total statistics
  const totalInvested = copyTrades.reduce((sum, trade) => sum + (trade.totalInvested || 0), 0);
  const totalProfit = copyTrades.reduce((sum, trade) => sum + (trade.performance?.netProfit || 0), 0);
  const activeTraders = copyTrades.length;

  const userCurrency = user?.currency || "USD";
  
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
    };
    const symbol = currencySymbols[userCurrency] || userCurrency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <section className="
      overflow-hidden
      px-5 py-3
      mx-auto w-full
      rounded-3xl
      bg-neutral-900
      max-w-[480px]
      md:max-w-[900px]
      lg:max-w-[1200px]
    ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5">
        <div>
          <h1 className="text-[16px] font-semibold tracking-wide leading-tight text-zinc-100">
            My Copy Trading Dashboard
          </h1>
          <p className="text-[12px] text-stone-300">Manage your copied traders and positions</p>
        </div>
        
        <div className="flex gap-1.5">
          <button
            onClick={loadCopyTradingData}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-3xl text-[10px] text-stone-300 border border-neutral-900"
          >
            Refresh Data
          </button>
          <a
            href="/copytrade"
            className="px-3 py-1.5 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100"
          >
            Browse Traders
          </a>
        </div>
      </div>

      {/* Stats Cards - RESPONSIVE */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-1.5 
        mb-5
      ">
        <div className="px-2.5 py-3 bg-neutral-800 rounded-2xl border border-neutral-900">
          <div className="text-[10px] text-stone-300">Active Traders</div>
          <div className="text-[16px] font-medium text-zinc-100">{activeTraders}</div>
          <div className="text-[10px] text-stone-300 mt-0.5">Traders you're currently copying</div>
        </div>
        
        <div className="px-2.5 py-3 bg-neutral-800 rounded-2xl border border-neutral-900">
          <div className="text-[10px] text-stone-300">Total Invested</div>
          <div className="text-[16px] font-medium text-zinc-100">{formatCurrency(totalInvested)}</div>
          <div className="text-[10px] text-stone-300 mt-0.5">In open positions</div>
        </div>
        
        <div className="px-2.5 py-3 bg-neutral-800 rounded-2xl border border-neutral-900">
          <div className="text-[10px] text-stone-300">Total Profit</div>
          <div className={`text-[16px] font-medium ${totalProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(totalProfit)}
          </div>
          <div className="text-[10px] text-stone-300 mt-0.5">Net profit from all copies</div>
        </div>
      </div>

      {/* Active Copy Trades Section */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <h2 className="text-[12px] tracking-normal leading-none text-stone-300">ACTIVE COPY TRADES</h2>
          <span className="text-[10px] text-stone-300">
            {copyTrades.length} trader{copyTrades.length !== 1 ? 's' : ''}
          </span>
        </div>

        {copyTrades.length > 0 ? (
          <div className="
            space-y-1.5
            md:space-y-0
            md:grid md:grid-cols-2
            lg:grid-cols-3
            md:gap-3
          ">
            {copyTrades.map((copyTrade) => (
              <div key={copyTrade.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 min-h-[60px]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={copyTrade.traderAvatar || `https://ui-avatars.com/api/?name=${copyTrade.traderUsername}&background=6366f1&color=fff`}
                      alt={copyTrade.traderUsername}
                      className="object-contain shrink-0 self-stretch my-auto w-9 aspect-square rounded-full"
                    />
                    <div>
                      <h3 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                        {copyTrade.traderUsername || "Unknown Trader"}
                      </h3>
                      <p className="text-[10px] text-stone-300">
                        Copied {formatCurrency(copyTrade.amount)} • {copyTrade.openTradesCount || 0} open trades
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-[12px] font-medium tracking-wide leading-tight ${copyTrade.performance?.netProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {formatCurrency(copyTrade.performance?.netProfit || 0)}
                    </div>
                    <div className="text-[10px] text-stone-300">Net Profit</div>
                  </div>
                </div>
                
                <div className="mt-1.5 grid grid-cols-2 gap-2.5 text-[10px]">
                  <div className="flex gap-0.5 items-center">
                    <span className="text-stone-300">Win Rate:</span>
                    <span className="text-zinc-100 font-semibold">
                      {copyTrade.performance?.winRate?.toFixed(1) || '0.0'}%
                    </span>
                  </div>
                  <div className="flex gap-0.5 items-center">
                    <span className="text-stone-300">Total Trades:</span>
                    <span className="text-zinc-100 font-semibold">
                      {copyTrade.performance?.totalTrades || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-1.5 flex gap-1.5">
                  <button
                    onClick={() => handleStopCopying(copyTrade.id)}
                    className="flex-1 px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 rounded-3xl text-[10px] text-zinc-100"
                  >
                    Stop Copying
                  </button>
                  <button className="flex-1 px-2.5 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-3xl text-[10px] text-zinc-100">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center px-2.5 py-8 bg-neutral-800 rounded-3xl border border-neutral-900">
            <p className="text-[12px] text-stone-300 mb-3">You're not copying any traders yet</p>
            <a
              href="/copytrade"
              className="inline-block px-4 py-2 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100"
            >
              Browse Traders to Copy
            </a>
          </div>
        )}
      </div>

      {/* Open Positions Section */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <h2 className="text-[12px] tracking-normal leading-none text-stone-300">OPEN POSITIONS</h2>
          <span className="text-[10px] text-stone-300">
            {openPositions.length} position{openPositions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {openPositions.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Table Headers - Hidden on mobile, shown on desktop */}
              <div className="hidden md:grid md:grid-cols-7 gap-2 px-2.5 py-2 bg-neutral-800 rounded-t-2xl border-b border-neutral-900 text-[10px] text-stone-300">
                <div>Symbol</div>
                <div>Trader</div>
                <div>Side</div>
                <div>Quantity</div>
                <div>Entry Price</div>
                <div>Current Value</div>
                <div>Opened</div>
              </div>
              
              {/* Positions List */}
              <div className="space-y-1.5 md:space-y-0">
                {openPositions.map((position, index) => (
                  <div key={index} className="
                    overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900
                    md:rounded-none md:border-b md:last:rounded-b-2xl
                  ">
                    {/* Mobile View - Card Style */}
                    <div className="md:hidden">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium text-zinc-100">{position.symbol}</span>
                          <span className={`px-1 py-0.5 rounded text-[10px] ${position.side === 'buy' ? 'bg-green-700/20 text-green-700' : 'bg-red-600/20 text-red-600'}`}>
                            {position.side.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-[12px] font-medium text-zinc-100">{formatCurrency(position.currentValue)}</div>
                          <div className="text-[10px] text-stone-300">Value</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <div className="text-stone-300">Trader</div>
                          <div className="text-zinc-100 font-medium">{position.traderUsername}</div>
                        </div>
                        <div>
                          <div className="text-stone-300">Quantity</div>
                          <div className="text-zinc-100 font-medium">{position.quantity.toFixed(4)}</div>
                        </div>
                        <div>
                          <div className="text-stone-300">Entry</div>
                          <div className="text-zinc-100 font-medium">{formatCurrency(position.entryPrice)}</div>
                        </div>
                        <div>
                          <div className="text-stone-300">Opened</div>
                          <div className="text-zinc-100 font-medium">
                            {new Date(position.openedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop View - Table Row */}
                    <div className="hidden md:grid md:grid-cols-7 gap-2 items-center text-[10px]">
                      <div className="font-medium text-zinc-100">{position.symbol}</div>
                      <div className="flex items-center gap-1.5">
                        <img
                          src={`https://ui-avatars.com/api/?name=${position.traderUsername}&background=6366f1&color=fff`}
                          alt={position.traderUsername}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-zinc-100">{position.traderUsername}</span>
                      </div>
                      <div>
                        <span className={`px-1 py-0.5 rounded ${position.side === 'buy' ? 'bg-green-700/20 text-green-700' : 'bg-red-600/20 text-red-600'}`}>
                          {position.side.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-zinc-100">{position.quantity.toFixed(4)}</div>
                      <div className="text-zinc-100">{formatCurrency(position.entryPrice)}</div>
                      <div className="text-zinc-100">{formatCurrency(position.currentValue)}</div>
                      <div className="text-stone-300">
                        {new Date(position.openedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center px-2.5 py-8 bg-neutral-800 rounded-3xl border border-neutral-900">
            <p className="text-[12px] text-stone-300">No open positions</p>
          </div>
        )}
      </div>

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
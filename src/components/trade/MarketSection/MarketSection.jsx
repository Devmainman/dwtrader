"use client";
import { useEffect, useState } from "react";
import { useUserAuth } from "../../../context/UserAuthContext";

import BalanceCard from "../BalanceCard";
import ActionButtons from "../ActionButtons";
import TradeStats from "../TradeStats";

import MarketTabs from "./MarketTabs";
import SearchBar from "./SearchBar";
import PriceDisplay from "./PriceDisplay";
import CryptoList from "./CryptoList";
import TradingPanel from "./TradingPanel";
import PositionsSection from "./PositionsSection";

import MessageDisplay from "./MessageDisplay";
import BalanceModal from "./BalanceModal";
import ChartModal from "./ChartModal";
import { PAIRS, TABS } from "./marketData";

export default function MarketSection() {
  const { fetchWithAuth, user } = useUserAuth();
  
  // State management
  const [priceFeed, setPriceFeed] = useState({});
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [amount, setAmount] = useState("");
  const [positions, setPositions] = useState([]);
  const [realTimePL, setRealTimePL] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceLoading, setPriceLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [message, setMessage] = useState("");
  
  // UI State
  const [activeTab, setActiveTab] = useState("Hot Picks");
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllPairs, setShowAllPairs] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState("60");
  const [chartKey, setChartKey] = useState(Date.now());
  
  // User preferences
  const [userCurrency, setUserCurrency] = useState("USD");
  const [conversionRate, setConversionRate] = useState(1);

  // Helper functions
  const formatCurrency = (amount, currency = userCurrency) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `0.00 ${currency}`;
    return `${num.toFixed(2)} ${currency}`;
  };

  const formatPrice = (price) => {
    if (!price || price === "-") return "-";
    const num = parseFloat(price);
    if (num >= 1000) {
      return num.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    return num.toFixed(4);
  };

  const formatVolume = (volume) => {
    if (!volume || volume === "0") return "-";
    const num = parseFloat(volume);
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toFixed(2)}`;
  };

  const convertToUserCurrency = (priceInUSD) => {
    if (!priceInUSD) return 0;
    const usdAmount = parseFloat(priceInUSD);
    return usdAmount * conversionRate;
  };

  // Load user preferences
  const loadUserPreferences = async () => {
    try {
      const savedFavorites = localStorage.getItem('cryptoFavorites') || '[]';
      setFavorites(JSON.parse(savedFavorites));
      
      if (user?.currency) {
        setUserCurrency(user.currency);
        await loadConversionRate(user.currency);
      }
    } catch (err) {
      console.error('Error loading preferences:', err);
    }
  };

  // Load conversion rate
  const loadConversionRate = async (currency) => {
    try {
      const rates = {
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 147, CAD: 1.36,
        AUD: 1.52, CHF: 0.88, CNY: 7.23, NGN: 1500, INR: 83.12
      };
      setConversionRate(rates[currency] || 1);
    } catch (err) {
      console.error('Error loading conversion rate:', err);
      setConversionRate(1);
    }
  };

  // Toggle favorite
  const toggleFavorite = (pairSymbol) => {
    const newFavorites = favorites.includes(pairSymbol)
      ? favorites.filter(fav => fav !== pairSymbol)
      : [...favorites, pairSymbol];
    
    setFavorites(newFavorites);
    localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
  };

  // Generate fallback price for crypto
  const generateFallbackPrice = (symbol) => {
    const basePrices = {
      'BTC/USDT': 45000, 'ETH/USDT': 2500, 'BNB/USDT': 320,
      'SOL/USDT': 100, 'XRP/USDT': 0.5, 'ADA/USDT': 0.45,
      'DOGE/USDT': 0.15, 'DOT/USDT': 7.5, 'MATIC/USDT': 0.75,
      'AVAX/USDT': 35, 'LINK/USDT': 14, 'UNI/USDT': 6.5,
      'ATOM/USDT': 10, 'LTC/USDT': 70, 'SHIB/USDT': 0.000008,
      'TRX/USDT': 0.12, 'ETC/USDT': 25, 'FIL/USDT': 5.5,
      'ALGO/USDT': 0.18, 'XLM/USDT': 0.12, 'NEAR/USDT': 3.5,
      'VET/USDT': 0.03, 'ICP/USDT': 12, 'AAVE/USDT': 90,
      'EGLD/USDT': 40, 'SUI/USDT': 1.2, 'SEI/USDT': 0.6,
      'TIA/USDT': 15, 'ORDI/USDT': 60, 'WIF/USDT': 2.5,
      'PEPE/USDT': 0.000008, 'BONK/USDT': 0.00002, 'FLOKI/USDT': 0.00003
    };
    
    const basePrice = basePrices[symbol] || 10;
    return (basePrice + (Math.random() - 0.5) * basePrice * 0.05).toFixed(4);
  };

  // Generate fallback price for forex
  const generateForexPrice = (symbol) => {
    const baseRates = {
      'EUR/USD': 1.08, 'GBP/USD': 1.26, 'USD/JPY': 147.5,
      'AUD/USD': 0.66, 'USD/CAD': 1.36, 'USD/CHF': 0.88,
      'NZD/USD': 0.61, 'EUR/GBP': 0.86, 'EUR/JPY': 159.3,
      'GBP/JPY': 185.8, 'BTC/GBP': 35400, 'EUR/AUD': 1.64,
      'GBP/AUD': 1.91, 'USD/SGD': 1.35, 'USD/HKD': 7.82,
      'USD/CNY': 7.23, 'USD/INR': 83.12, 'USD/MXN': 17.05,
      'USD/ZAR': 18.75, 'USD/BRL': 4.95, 'USD/RUB': 90.5,
      'USD/TRY': 32.15, 'USD/PLN': 4.02, 'USD/THB': 35.85,
      'USD/IDR': 15650, 'USD/MYR': 4.72, 'USD/PHP': 56.25,
      'USD/SAR': 3.75, 'USD/AED': 3.67, 'USD/HKD': 7.82,
      'USD/SEK': 10.45, 'USD/NOK': 10.65, 'USD/DKK': 6.88
    };
    
    const baseRate = baseRates[symbol] || 1;
    return (baseRate + (Math.random() - 0.5) * baseRate * 0.001).toFixed(4);
  };

  // Load prices from Binance API with loading states
  const loadPricesFromBinance = async (showLoading = true) => {
    if (showLoading) setPriceLoading(true);
    
    try {
      const currentPairs = PAIRS[activeTab] || [];
      const cryptoPairs = currentPairs.filter(p => p.type === 'crypto');
      
      const pricePromises = cryptoPairs.map(pair =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair.binanceSymbol}`)
          .then(res => res.json())
          .then(data => ({
            pair: pair.symbol,
            price: parseFloat(data.lastPrice).toFixed(4),
            change: parseFloat(data.priceChangePercent).toFixed(2),
            high: data.highPrice,
            low: data.lowPrice,
            volume: data.volume,
            quoteVolume: data.quoteVolume
          }))
          .catch(err => ({
            pair: pair.symbol,
            price: generateFallbackPrice(pair.symbol),
            change: ((Math.random() - 0.5) * 10).toFixed(2),
            high: "0",
            low: "0",
            volume: "0",
            quoteVolume: "0",
            error: true
          }))
      );
      
      // For forex pairs
      const forexPairs = currentPairs.filter(p => p.type === 'forex');
      const forexPromises = forexPairs.map(pair =>
        fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
          .then(res => res.json())
          .then(data => {
            const rate = pair.base === 'USD' ? 1/data.rates[pair.quote] : data.rates[pair.base];
            const randomChange = ((Math.random() - 0.5) * 2).toFixed(2);
            return {
              pair: pair.symbol,
              price: rate.toFixed(4),
              change: randomChange,
              high: (rate * 1.002).toFixed(4),
              low: (rate * 0.998).toFixed(4),
              volume: "0",
              quoteVolume: "0",
              error: false
            };
          })
          .catch(err => ({
            pair: pair.symbol,
            price: generateForexPrice(pair.symbol),
            change: ((Math.random() - 0.5) * 2).toFixed(2),
            high: "0",
            low: "0",
            volume: "0",
            quoteVolume: "0",
            error: true
          }))
      );
      
      const allPromises = [...pricePromises, ...forexPromises];
      const results = await Promise.all(allPromises);
      
      const newPriceFeed = {};
      results.forEach(result => {
        if (result.price) {
          newPriceFeed[result.pair] = result.price;
          newPriceFeed[`${result.pair}_change`] = result.change;
          newPriceFeed[`${result.pair}_high`] = result.high;
          newPriceFeed[`${result.pair}_low`] = result.low;
          newPriceFeed[`${result.pair}_volume`] = result.volume;
          newPriceFeed[`${result.pair}_quoteVolume`] = result.quoteVolume;
          newPriceFeed[`${result.pair}_error`] = result.error || false;
        }
      });
      
      setPriceFeed(prev => ({ ...prev, ...newPriceFeed }));
      
      // Check if all prices are loaded
      const allPairs = currentPairs.map(p => p.symbol);
      const allLoaded = allPairs.every(pair => newPriceFeed[pair]);
      
      if (allLoaded && !initialLoadComplete) {
        setInitialLoadComplete(true);
      }
      
      setMessage("");
    } catch (err) {
      console.error('Price loading error:', err);
      setMessage("Using simulated data - API unavailable");
      
      // Generate fallback data for all pairs
      const currentPairs = PAIRS[activeTab] || [];
      const dummy = {};
      currentPairs.forEach(p => {
        dummy[p.symbol] = p.type === 'forex' ? generateForexPrice(p.symbol) : generateFallbackPrice(p.symbol);
        dummy[`${p.symbol}_change`] = ((Math.random() - 0.5) * (p.type === 'forex' ? 2 : 10)).toFixed(2);
      });
      setPriceFeed(prev => ({ ...prev, ...dummy }));
      
      if (!initialLoadComplete) {
        setInitialLoadComplete(true);
      }
    } finally {
      if (showLoading) setPriceLoading(false);
    }
  };

  // Load trading data
  const loadData = async () => {
    try {
      const pos = await fetchWithAuth("/trading/sim/positions");
      const hist = await fetchWithAuth("/trading/sim/history");
      const plData = await fetchWithAuth("/trading/sim/positions/realtime");
      
      setPositions(pos.data.open || pos.data || []);
      setHistory(hist.data.history || hist.data || []);
      setRealTimePL(plData.data.positions || []);
    } catch (err) {
      console.error('Data load error:', err);
      setPositions([
        { _id: "1", pair: "BTC/USDT", quantity: 0.5, entryPrice: 45250.50, pnl: 275.25 },
        { _id: "2", pair: "ETH/USDT", quantity: 3.2, entryPrice: 2520.75, pnl: -226.4 },
      ]);
      setRealTimePL([]);
      setHistory([
        { _id: "1", pair: "BTC/USDT", profit: 250.50, side: "buy", time: "2h ago" },
        { _id: "2", pair: "ETH/USDT", profit: -120.25, side: "sell", time: "1d ago" },
      ]);
    }
    setLoading(false);
  };

  // Place order
  const placeOrder = async (side) => {
    if (!amount || amount <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }
    try {
      const sidePath = side === "buy" ? "buy" : "sell";
      const result = await fetchWithAuth(`/trading/sim/${sidePath}`, {
        method: "POST",
        data: { 
          symbol: selectedPair.split('/')[0],
          amount: parseFloat(amount)
        }
      });
      
      if (result.data?.success) {
        setMessage(`${side.toUpperCase()} order for ${amount} ${selectedPair} executed successfully!`);
      } else {
        setMessage(result.data?.error || "Order failed");
      }
      
      setAmount("");
      loadData();
    } catch (err) {
      console.error('Order error:', err);
      setMessage(err.response?.data?.error || "Order failed. Please try again.");
    }
  };

  // Close position
  const closePosition = async (positionId) => {
    try {
      const result = await fetchWithAuth(`/trading/sim/sell/${positionId}`, {
        method: "POST"
      });
      
      if (result.data?.success) {
        setMessage("Position closed successfully!");
        loadData();
      } else {
        setMessage(result.data?.error || "Failed to close position");
      }
    } catch (err) {
      console.error('Close position error:', err);
      setMessage(err.response?.data?.error || "Failed to close position");
    }
  };

  // Balance management
  const handleTopupBalance = async (amount) => {
    try {
      const result = await fetchWithAuth("/trading/sim/balance/topup", {
        method: "POST",
        data: { amount: parseFloat(amount) }
      });
      
      if (result.data?.success) {
        setMessage(`Successfully topped up ${formatCurrency(amount)}`);
      } else {
        setMessage(result.data?.error || "Topup failed");
      }
    } catch (err) {
      console.error('Topup error:', err);
      setMessage(err.response?.data?.error || "Topup failed. Please try again.");
    }
  };

  const handleDeductBalance = async (amount) => {
    try {
      const result = await fetchWithAuth("/trading/sim/balance/deduct", {
        method: "POST",
        data: { amount: parseFloat(amount) }
      });
      
      if (result.data?.success) {
        setMessage(`Successfully deducted ${formatCurrency(amount)}`);
      } else {
        setMessage(result.data?.error || "Deduction failed");
      }
    } catch (err) {
      console.error('Deduction error:', err);
      setMessage(err.response?.data?.error || "Deduction failed. Please try again.");
    }
  };

  // Calculate order value
  const calculateOrderValue = () => {
    if (!amount || !priceFeed[selectedPair]) return 0;
    const value = parseFloat(amount) * parseFloat(priceFeed[selectedPair]);
    return convertToUserCurrency(value);
  };

  // Filter pairs based on search
  const filteredPairs = (PAIRS[activeTab] || []).filter(pair => {
    if (!searchTerm) return true;
    return pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pair.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pair.quote.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Display pairs (show all or limited)
  const displayPairs = showAllPairs ? filteredPairs : filteredPairs.slice(0, 5);

  // Load data on mount
  useEffect(() => {
    const initializeData = async () => {
      await loadUserPreferences();
      await loadPricesFromBinance();
      await loadData();
    };

    initializeData();
    
    const priceInterval = setInterval(() => {
      loadPricesFromBinance(false);
    }, 30000); // Update every 30 seconds
    
    const plInterval = setInterval(() => {
      loadData();
    }, 10000); // Update positions every 10 seconds
    
    return () => {
      clearInterval(priceInterval);
      clearInterval(plInterval);
    };
  }, []);

  // Load prices when tab changes
  useEffect(() => {
    if (initialLoadComplete) {
      loadPricesFromBinance();
    }
  }, [activeTab]);

  // Show loading until all data is loaded
  if (loading || !initialLoadComplete) {
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
        <div className="flex flex-col gap-4">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="h-6 bg-neutral-800 rounded animate-pulse w-32"></div>
              <div className="h-4 bg-neutral-800 rounded animate-pulse w-24"></div>
            </div>
            <div className="h-8 bg-neutral-800 rounded animate-pulse w-20"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-neutral-800 rounded-full animate-pulse w-20"></div>
            ))}
          </div>

          {/* Search Bar Skeleton */}
          <div className="h-12 bg-neutral-800 rounded-3xl animate-pulse"></div>

          {/* Price Display Skeleton */}
          <div className="h-24 bg-neutral-800 rounded-3xl animate-pulse"></div>

          {/* Crypto List Skeleton */}
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-neutral-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center mb-2.5">
          <div>
            <h2 className="text-[28px] font-medium tracking-wide leading-tight text-zinc-100">
              Trading Market
            </h2>
            <p className="text-[10px] text-stone-300 mt-1">
              Trade crypto and forex markets
            </p>
          </div>
          <div className={`px-2 py-1 rounded-3xl text-[10px] font-semibold ${
            priceLoading ? 'bg-yellow-700/20 text-yellow-700' : 'bg-green-700/20 text-green-700'
          }`}>
            {priceLoading ? 'UPDATING PRICES' : 'PRICES LIVE'}
          </div>
        </div>

        {/* Market Navigation */}
        <MarketTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          tabs={TABS}
        />

        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="w-full md:grid md:grid-cols-3 md:gap-4">
  
  {/* LEFT: Market & Prices */}
  <div className="md:col-span-2 flex flex-col gap-3">
    <PriceDisplay 
      selectedPair={selectedPair}
      priceFeed={priceFeed}
      userCurrency={userCurrency}
      conversionRate={conversionRate}
      formatPrice={formatPrice}
      formatCurrency={formatCurrency}
    />

    <CryptoList
      activeTab={activeTab}
      pairs={displayPairs}
      priceFeed={priceFeed}
      favorites={favorites}
      selectedPair={selectedPair}
      searchTerm={searchTerm}
      showAllPairs={showAllPairs}
      onToggleFavorite={toggleFavorite}
      onSelectPair={setSelectedPair}
      onViewChart={(pair) => {
        setSelectedPair(pair);
        setChartKey(Date.now());
        setShowChart(true);
      }}
      onLoadMore={() => setShowAllPairs(!showAllPairs)}
      formatPrice={formatPrice}
      formatVolume={formatVolume}
    />
  </div>

  {/* RIGHT: Trading Panel */}
  <div className="md:col-span-1">
    <TradingPanel
      selectedPair={selectedPair}
      amount={amount}
      setAmount={setAmount}
      priceFeed={priceFeed}
      user={user}
      onPlaceOrder={placeOrder}
      userCurrency={userCurrency}
      conversionRate={conversionRate}
      calculateOrderValue={calculateOrderValue}
      formatCurrency={formatCurrency}
    />
  </div>

</div>


        {/* Positions Section */}
        <div className="mt-4 md:w-[310px] lg:w-[770px] md:mt-6">
  <PositionsSection
    positions={positions}
    realTimePL={realTimePL}
    selectedPair={selectedPair}
    onClosePosition={closePosition}
    onViewChart={setSelectedPair}
    formatCurrency={formatCurrency}
  />
</div>


        {/* Message Display */}
        {message && (
  <div className="mt-3 md:mt-4">
    <MessageDisplay message={message} />
  </div>
)}

      </div>

      {/* Balance Modal */}
      <BalanceModal
        show={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
        user={user}
        userCurrency={userCurrency}
        conversionRate={conversionRate}
        onTopup={handleTopupBalance}
        onDeduct={handleDeductBalance}
        formatCurrency={formatCurrency}
      />

      {/* Chart Modal */}
      <ChartModal
        show={showChart}
        onClose={() => setShowChart(false)}
        selectedPair={selectedPair}
        priceFeed={priceFeed}
        chartTimeframe={chartTimeframe}
        setChartTimeframe={setChartTimeframe}
        chartKey={chartKey}
        onPlaceOrder={placeOrder}
        formatPrice={formatPrice}
        formatVolume={formatVolume}
        amount={amount}
        setAmount={setAmount}
      />
    </section>
  );
}
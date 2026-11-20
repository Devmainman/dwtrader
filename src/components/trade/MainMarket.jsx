"use client";

import { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { RefreshCw, Search, BarChart3, LineChart, Wallet, Star, ArrowUpRight, ArrowDownRight, Check } from "lucide-react";

// Extended list of crypto pairs
const PAIRS = [
  { symbol: "BTC/USDT", base: "BTC", quote: "USDT", binanceSymbol: "BTCUSDT", category: "major" },
  { symbol: "ETH/USDT", base: "ETH", quote: "USDT", binanceSymbol: "ETHUSDT", category: "major" },
  { symbol: "BNB/USDT", base: "BNB", quote: "USDT", binanceSymbol: "BNBUSDT", category: "major" },
  { symbol: "SOL/USDT", base: "SOL", quote: "USDT", binanceSymbol: "SOLUSDT", category: "major" },
  { symbol: "XRP/USDT", base: "XRP", quote: "USDT", binanceSymbol: "XRPUSDT", category: "major" },
  { symbol: "ADA/USDT", base: "ADA", quote: "USDT", binanceSymbol: "ADAUSDT", category: "altcoin" },
  { symbol: "DOGE/USDT", base: "DOGE", quote: "USDT", binanceSymbol: "DOGEUSDT", category: "meme" },
  { symbol: "DOT/USDT", base: "DOT", quote: "USDT", binanceSymbol: "DOTUSDT", category: "altcoin" },
  { symbol: "MATIC/USDT", base: "MATIC", quote: "USDT", binanceSymbol: "MATICUSDT", category: "altcoin" },
  { symbol: "AVAX/USDT", base: "AVAX", quote: "USDT", binanceSymbol: "AVAXUSDT", category: "altcoin" },
  { symbol: "LINK/USDT", base: "LINK", quote: "USDT", binanceSymbol: "LINKUSDT", category: "defi" },
  { symbol: "UNI/USDT", base: "UNI", quote: "USDT", binanceSymbol: "UNIUSDT", category: "defi" },
  { symbol: "ATOM/USDT", base: "ATOM", quote: "USDT", binanceSymbol: "ATOMUSDT", category: "cosmos" },
  { symbol: "LTC/USDT", base: "LTC", quote: "USDT", binanceSymbol: "LTCUSDT", category: "major" },
  { symbol: "SHIB/USDT", base: "SHIB", quote: "USDT", binanceSymbol: "SHIBUSDT", category: "meme" },
  { symbol: "TRX/USDT", base: "TRX", quote: "USDT", binanceSymbol: "TRXUSDT", category: "altcoin" },
  { symbol: "ETC/USDT", base: "ETC", quote: "USDT", binanceSymbol: "ETCUSDT", category: "major" },
  { symbol: "FIL/USDT", base: "FIL", quote: "USDT", binanceSymbol: "FILUSDT", category: "storage" },
  { symbol: "ALGO/USDT", base: "ALGO", quote: "USDT", binanceSymbol: "ALGOUSDT", category: "altcoin" },
  { symbol: "XLM/USDT", base: "XLM", quote: "USDT", binanceSymbol: "XLMUSDT", category: "payments" },
  { symbol: "NEAR/USDT", base: "NEAR", quote: "USDT", binanceSymbol: "NEARUSDT", category: "layer1" },
  { symbol: "VET/USDT", base: "VET", quote: "USDT", binanceSymbol: "VETUSDT", category: "enterprise" },
  { symbol: "ICP/USDT", base: "ICP", quote: "USDT", binanceSymbol: "ICPUSDT", category: "web3" },
  { symbol: "AAVE/USDT", base: "AAVE", quote: "USDT", binanceSymbol: "AAVEUSDT", category: "defi" },
  { symbol: "EGLD/USDT", base: "EGLD", quote: "USDT", binanceSymbol: "EGLDUSDT", category: "layer1" },
];

export default function MainMarket() {
  const { fetchWithAuth, user } = useUserAuth();
  const [priceFeed, setPriceFeed] = useState({});
  const [selectedPair, setSelectedPair] = useState(PAIRS[0].symbol);
  const [amount, setAmount] = useState("");
  const [positions, setPositions] = useState([]);
  const [realTimePL, setRealTimePL] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [priceLoading, setPriceLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState("60");
  const [chartKey, setChartKey] = useState(Date.now());
  
  // Favorites and user preferences
  const [favorites, setFavorites] = useState([]);
  const [userCurrency, setUserCurrency] = useState("USD");
  const [conversionRate, setConversionRate] = useState(1);
  const [balanceTopupAmount, setBalanceTopupAmount] = useState("");
  const [balanceDeductAmount, setBalanceDeductAmount] = useState("");
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState("market"); // "market", "favorites", "positions"
  const [searchTerm, setSearchTerm] = useState("");
  
  // Load user preferences and favorites
  const loadUserPreferences = async () => {
    try {
      // Load from localStorage
      const savedFavorites = localStorage.getItem('cryptoFavorites') || '[]';
      setFavorites(JSON.parse(savedFavorites));
      
      // Get user currency from context
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
      // In production, use a real API like ExchangeRate-API
      const rates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        NGN: 1500,
        JPY: 147,
        CAD: 1.36,
        AUD: 1.52,
        CHF: 0.88,
        CNY: 7.23,
        INR: 83.12
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
  
  // Load real prices from Binance with more pairs
  const loadPricesFromBinance = async () => {
    setPriceLoading(true);
    try {
      // Fetch in batches to avoid too many requests
      const batchSize = 10;
      const allResults = [];
      
      for (let i = 0; i < PAIRS.length; i += batchSize) {
        const batch = PAIRS.slice(i, i + batchSize);
        const pricePromises = batch.map(pair =>
          fetch(`https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${pair.binanceSymbol}`)
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
        
        const batchResults = await Promise.all(pricePromises);
        allResults.push(...batchResults);
        
        // Small delay between batches
        if (i + batchSize < PAIRS.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      const newPriceFeed = {};
      allResults.forEach(result => {
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
      
      setPriceFeed(newPriceFeed);
      setMessage("");
    } catch (err) {
      console.error('Direct API error:', err);
      setMessage("Using simulated data - API unavailable");
      
      const dummy = {};
      PAIRS.forEach(p => {
        dummy[p.symbol] = generateFallbackPrice(p.symbol);
        dummy[`${p.symbol}_change`] = ((Math.random() - 0.5) * 10).toFixed(2);
      });
      setPriceFeed(dummy);
    } finally {
      setPriceLoading(false);
    }
  };
  
  const generateFallbackPrice = (symbol) => {
    const basePrices = {
      'BTC/USDT': 45000,
      'ETH/USDT': 2500,
      'BNB/USDT': 320,
      'SOL/USDT': 100,
      'XRP/USDT': 0.5,
      'ADA/USDT': 0.45,
      'DOGE/USDT': 0.15,
      'DOT/USDT': 7.5,
      'MATIC/USDT': 0.75,
      'AVAX/USDT': 35,
      'LINK/USDT': 14,
      'UNI/USDT': 6.5,
      'ATOM/USDT': 10,
      'LTC/USDT': 70,
      'SHIB/USDT': 0.000008,
      'TRX/USDT': 0.12,
      'ETC/USDT': 25,
      'FIL/USDT': 5.5,
      'ALGO/USDT': 0.18,
      'XLM/USDT': 0.12,
      'NEAR/USDT': 3.5,
      'VET/USDT': 0.03,
      'ICP/USDT': 12,
      'AAVE/USDT': 90,
      'EGLD/USDT': 40
    };
    
    const basePrice = basePrices[symbol] || 10;
    return (basePrice + (Math.random() - 0.5) * basePrice * 0.05).toFixed(4);
  };
  
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
  
  const handlePairClick = (pairSymbol, openChart = false) => {
    setSelectedPair(pairSymbol);
    if (openChart) {
      setChartKey(Date.now());
      setShowChart(true);
    }
  };
  
  const formatPrice = (price, decimals = 4) => {
    if (!price || price === "-") return "-";
    const num = parseFloat(price);
    if (num >= 1000) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else if (num < 0.0001) {
      return num.toFixed(6);
    } else if (num < 0.01) {
      return num.toFixed(6);
    }
    return num.toFixed(decimals);
  };
  
  const convertToUserCurrency = (priceInUSD) => {
    if (!priceInUSD) return 0;
    const usdAmount = parseFloat(priceInUSD);
    return usdAmount * conversionRate;
  };
  
  const formatCurrency = (amount, currency = userCurrency) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return `0.00 ${currency}`;
  
  // Simple formatting that works with any currency
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return `${formatted} ${currency}`;
};
  
  const getCurrentPrice = () => {
    const price = priceFeed[selectedPair];
    if (!price) return `- ${userCurrency}`;
    const convertedPrice = convertToUserCurrency(price);
    return formatCurrency(convertedPrice, userCurrency);
  };
  
  const calculateOrderValue = () => {
    if (!amount || !priceFeed[selectedPair]) return 0;
    const value = parseFloat(amount) * parseFloat(priceFeed[selectedPair]);
    return convertToUserCurrency(value);
  };
  
  // Balance management functions
  const handleTopupBalance = async () => {
    if (!balanceTopupAmount || balanceTopupAmount <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }
    
    try {
      const result = await fetchWithAuth("/trading/sim/balance/topup", {
        method: "POST",
        data: { amount: parseFloat(balanceTopupAmount) }
      });
      
      if (result.data?.success) {
        setMessage(`Successfully topped up ${formatCurrency(balanceTopupAmount)}`);
        setBalanceTopupAmount("");
        setShowBalanceModal(false);
        // Refresh user data if needed
      } else {
        setMessage(result.data?.error || "Topup failed");
      }
    } catch (err) {
      console.error('Topup error:', err);
      setMessage(err.response?.data?.error || "Topup failed. Please try again.");
    }
  };
  
  const handleDeductBalance = async () => {
    if (!balanceDeductAmount || balanceDeductAmount <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }
    
    try {
      const result = await fetchWithAuth("/trading/sim/balance/deduct", {
        method: "POST",
        data: { amount: parseFloat(balanceDeductAmount) }
      });
      
      if (result.data?.success) {
        setMessage(`Successfully deducted ${formatCurrency(balanceDeductAmount)}`);
        setBalanceDeductAmount("");
        setShowBalanceModal(false);
      } else {
        setMessage(result.data?.error || "Deduction failed");
      }
    } catch (err) {
      console.error('Deduction error:', err);
      setMessage(err.response?.data?.error || "Deduction failed. Please try again.");
    }
  };
  
  // Filter pairs based on search and favorites
  const filteredPairs = PAIRS.filter(pair => {
    const matchesSearch = pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pair.base.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "favorites") {
      return matchesSearch && favorites.includes(pair.symbol);
    }
    
    return matchesSearch;
  });
  
  // Sort pairs: favorites first, then by category/name
  const sortedPairs = [...filteredPairs].sort((a, b) => {
    const aIsFavorite = favorites.includes(a.symbol);
    const bIsFavorite = favorites.includes(b.symbol);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    
    // If same favorite status, sort by category then symbol
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    
    return a.symbol.localeCompare(b.symbol);
  });
  
  // Group pairs by category for better organization
  const groupedPairs = sortedPairs.reduce((groups, pair) => {
    if (!groups[pair.category]) {
      groups[pair.category] = [];
    }
    groups[pair.category].push(pair);
    return groups;
  }, {});
  
  const getTradingViewSymbol = () => {
    const baseSymbol = selectedPair.split('/')[0];
    const pair = PAIRS.find(p => p.symbol === selectedPair);
    return pair?.binanceSymbol || "BTCUSDT";
  };
  
  const getChartUrl = () => {
    const symbol = getTradingViewSymbol();
    return `https://www.tradingview.com/widgetembed/?symbol=BINANCE%3A${symbol}&interval=${chartTimeframe}&theme=dark&style=1&locale=en`;
  };
  
  useEffect(() => {
    loadUserPreferences();
    loadPricesFromBinance();
    loadData();
    
    const priceInterval = setInterval(loadPricesFromBinance, 10000);
    const plInterval = setInterval(loadData, 5000); // Update P/L every 5 seconds
    
    return () => {
      clearInterval(priceInterval);
      clearInterval(plInterval);
    };
  }, []);
  
  if (loading) {
    return (
      <section className="flex flex-col gap-4 justify-center items-center px-4 py-5 w-full rounded-3xl bg-[#1D1D1F] max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1229px] overflow-hidden">
        <div className="w-full flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full px-3 py-3 rounded-xl bg-neutral-800 animate-pulse h-20" />
          ))}
        </div>
      </section>
    );
  }
  
  return (
    <>
      <section className="flex flex-col gap-4 justify-center items-center px-4 py-5 w-full rounded-3xl bg-[#1D1D1F] max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1229px] overflow-hidden">
        {/* Header with user balance and currency */}
        <div className="w-full flex flex-col">
          <div className="flex flex-wrap justify-between items-center w-full gap-4">
            <h2 className="text-sm md:text-base font-medium tracking-normal leading-tight text-zinc-100">
              Trading Market {priceLoading && <RefreshCw className="inline w-3.5 h-3.5 ml-1 animate-spin text-neutral-400" />}
            </h2>
            <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
              <div className="text-right">
                <p className="text-xs text-neutral-400">Your Balance</p>
                <p className="text-lg font-semibold text-zinc-100">
                  {user?.balance ? formatCurrency(user.balance, userCurrency) : "Loading..."}
                </p>
                <p className="text-[10px] text-neutral-400">
                  Currency: {userCurrency} • 1 USD = {(1/conversionRate).toFixed(4)} {userCurrency}
                </p>
              </div>
              <button
                onClick={() => setShowBalanceModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white"
              >
                Manage Balance
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-4 flex border-b border-neutral-800">
            <button
              onClick={() => setActiveTab("market")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "market" ? "text-blue-400 border-b-2 border-blue-400" : "text-neutral-400"}`}
            >
              Market Pairs ({PAIRS.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "favorites" ? "text-blue-400 border-b-2 border-blue-400" : "text-neutral-400"}`}
            >
              <span className="inline-flex items-center gap-1">Favorites <Star className="w-3.5 h-3.5" /> ({favorites.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("positions")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "positions" ? "text-blue-400 border-b-2 border-blue-400" : "text-neutral-400"}`}
            >
              Positions ({positions.length})
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mt-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crypto pairs..."
                className="w-full bg-black/40 p-2 pl-10 rounded-lg text-white text-sm outline-none"
              />
              <div className="absolute left-3 top-2.5 text-neutral-400">
                <Search className="w-4 h-4" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Current Price Display */}
          <div className="mt-4 p-3 bg-neutral-900 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-neutral-400">Current Price ({selectedPair})</p>
                <p className="text-lg font-semibold text-zinc-100">{getCurrentPrice()}</p>
                <p className="text-xs text-neutral-400">
                  {priceFeed[selectedPair] && `$${formatPrice(priceFeed[selectedPair])} USD`}
                </p>
              </div>
              {priceFeed[`${selectedPair}_change`] && (
                <div className={`text-sm font-medium ${parseFloat(priceFeed[`${selectedPair}_change`]) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {parseFloat(priceFeed[`${selectedPair}_change`]) >= 0 ? <ArrowUpRight className="inline w-4 h-4" /> : <ArrowDownRight className="inline w-4 h-4" />} 
                  {Math.abs(parseFloat(priceFeed[`${selectedPair}_change`])).toFixed(2)}%
                </div>
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-neutral-400">
              <span>24h High: {formatCurrency(convertToUserCurrency(priceFeed[`${selectedPair}_high`]))}</span>
              <span>24h Low: {formatCurrency(convertToUserCurrency(priceFeed[`${selectedPair}_low`]))}</span>
            </div>
          </div>
          
          {/* Market Pairs Display */}
          {activeTab !== "positions" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-neutral-400">
                  {activeTab === "favorites" ? "Favorite Pairs" : "All Market Pairs"}
                </h3>
                <span className="text-xs text-neutral-400">
                  Showing {sortedPairs.length} of {PAIRS.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                {Object.entries(groupedPairs).map(([category, pairs]) => (
                  <div key={category}>
                    <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1 mt-2">
                      {category} ({pairs.length})
                    </div>
                    {pairs.map((pair) => {
                      const price = priceFeed[pair.symbol] || "-";
                      const change = priceFeed[`${pair.symbol}_change`] || "0.00";
                      const isPositive = parseFloat(change) >= 0;
                      const isFavorite = favorites.includes(pair.symbol);
                      
                      return (
                        <div 
                          key={pair.symbol}
                          onClick={() => handlePairClick(pair.symbol, true)}
                          className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-colors hover:bg-neutral-800 ${
                            selectedPair === pair.symbol ? 'bg-neutral-800 ring-1 ring-blue-500' : 'bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(pair.symbol);
                              }}
                              className={`text-lg ${isFavorite ? 'text-yellow-400' : 'text-neutral-500 hover:text-yellow-300'}`}
                              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Star className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                            </button>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-zinc-100">{pair.symbol}</span>
                                {selectedPair === pair.symbol && (
                                  <span className="text-xs text-blue-400"><Check className="inline w-3 h-3" /> Selected</span>
                                )}
                              </div>
                              <span className="text-xs text-neutral-400">
                                {formatCurrency(convertToUserCurrency(price))}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {isPositive ? '+' : ''}{change}%
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePairClick(pair.symbol, true);
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white"
                              title="View Chart"
                            >
                              <BarChart3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                
                {sortedPairs.length === 0 && (
                  <div className="text-center py-8 text-neutral-400">
                    {activeTab === "favorites" 
                      ? "No favorites yet. Click the star icon to add pairs to favorites."
                      : "No pairs found matching your search."}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Open Positions Display */}
          {activeTab === "positions" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-neutral-400">Your Open Positions</h3>
                <div className="flex gap-2">
                  <span className="text-xs text-neutral-400">
                    Real-time P/L: {
                      realTimePL.reduce((sum, pos) => sum + (pos.unrealizedPL || 0), 0) >= 0 
                        ? <span className="text-green-400">+${Math.abs(realTimePL.reduce((sum, pos) => sum + (pos.unrealizedPL || 0), 0)).toFixed(2)}</span>
                        : <span className="text-red-400">-${Math.abs(realTimePL.reduce((sum, pos) => sum + (pos.unrealizedPL || 0), 0)).toFixed(2)}</span>
                    }
                  </span>
                </div>
              </div>
              
              {positions.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  No open positions. Start trading!
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {positions.map((position, index) => {
                    const realTimeData = realTimePL.find(p => p._id === position._id);
                    const currentPL = realTimeData?.unrealizedPL || position.pnl;
                    const plPercent = realTimeData?.unrealizedPLPercent || 
                                     ((currentPL / (position.quantity * position.entryPrice)) * 100).toFixed(2);
                    
                    return (
                      <div key={position._id} className="bg-neutral-900 rounded-xl p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium text-zinc-100">{position.pair}</div>
                            <div className="text-xs text-neutral-400">
                              Qty: {position.quantity} • Entry: {formatCurrency(convertToUserCurrency(position.entryPrice))}
                              {realTimeData?.currentPrice && (
                                <span className="ml-2">• Current: {formatCurrency(convertToUserCurrency(realTimeData.currentPrice))}</span>
                              )}
                            </div>
                          </div>
                          <div className={`text-right ${currentPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <div className="text-sm font-medium">
                              {currentPL >= 0 ? '+' : ''}{formatCurrency(convertToUserCurrency(Math.abs(currentPL)))}
                            </div>
                            <div className="text-xs">
                              {plPercent >= 0 ? '+' : ''}{Math.abs(parseFloat(plPercent)).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => closePosition(position._id)}
                            className="flex-1 bg-red-600 hover:bg-red-500 py-1.5 rounded text-xs text-white"
                          >
                            Close Position
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPair(position.pair);
                              setChartKey(Date.now());
                              setShowChart(true);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white"
                          >
                            Chart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          {/* Trading Panel (Only show if not in positions tab) */}
          {activeTab !== "positions" && (
            <div className="mt-4">
              <h3 className="text-xs text-neutral-400 mb-2">Trade {selectedPair}</h3>
              <div className="bg-neutral-900 rounded-xl p-3 space-y-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    Amount ({selectedPair.split('/')[0]})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-black/40 p-2 rounded-lg text-white text-sm outline-none"
                    placeholder="0.00"
                    step="0.0001"
                    min="0"
                  />
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>Order Value: {formatCurrency(calculateOrderValue())}</span>
                    <div className="flex gap-1">
                      {[0.25, 0.5, 0.75, 1].map((percent) => (
                        <button
                          key={percent}
                          onClick={() => {
                            const available = user?.balance || 0;
                            const maxAmount = available / parseFloat(priceFeed[selectedPair] || 1);
                            setAmount((maxAmount * percent).toFixed(4));
                          }}
                          className="hover:text-white px-1"
                        >
                          {percent * 100}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => placeOrder("buy")}
                    className="bg-green-600 hover:bg-green-500 py-2 rounded-lg text-sm text-white font-medium"
                  >
                    BUY {selectedPair.split('/')[0]}
                  </button>
                  <button
                    onClick={() => placeOrder("sell")}
                    className="bg-red-600 hover:bg-red-500 py-2 rounded-lg text-sm text-white font-medium"
                  >
                    SELL {selectedPair.split('/')[0]}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Message Display */}
          {message && (
            <div className={`mt-4 px-3 py-2 rounded-lg text-xs ${message.includes('success') || message.includes('executed') || message.includes('closed') || message.includes('topped up') || message.includes('deducted') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
              {message}
            </div>
          )}
          
          {/* Recent Trades */}
          <div className="mt-4">
            <h3 className="text-xs text-neutral-400 mb-2">Recent Trades</h3>
            {history.length === 0 ? (
              <p className="text-neutral-400 text-xs text-center py-2">No recent trades</p>
            ) : (
              <div className="flex flex-col gap-2">
                {history.slice(0, 5).map((trade) => (
                  <div key={trade._id} className="flex justify-between items-center bg-neutral-900 rounded-xl p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.side?.toUpperCase() || 'TRADE'}
                        </span>
                        <span className="text-sm text-zinc-100">{trade.pair}</span>
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">{trade.time || 'Recently'}</div>
                    </div>
                    <div className={`text-sm font-medium ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.profit >= 0 ? '+' : ''}{formatCurrency(convertToUserCurrency(Math.abs(trade.profit)))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="mt-4 flex justify-between gap-2">
            <button
              onClick={loadPricesFromBinance}
              disabled={priceLoading}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {priceLoading ? 'Refreshing...' : 'Refresh Prices'}
            </button>
            <button
              onClick={() => {
                setChartKey(Date.now());
                setShowChart(true);
              }}
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white"
            >
              <LineChart className="inline w-3.5 h-3.5 mr-1" />View Chart
            </button>
            <button
              onClick={() => setShowBalanceModal(true)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-xs text-white"
            >
              <Wallet className="inline w-3.5 h-3.5 mr-1" />Manage Balance
            </button>
          </div>
        </div>
      </section>
      
      {/* Balance Management Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1D1D1F] rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-zinc-100">Manage Balance</h3>
              <button
                onClick={() => setShowBalanceModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-neutral-900 rounded-xl">
              <p className="text-sm text-neutral-400">Current Balance</p>
              <p className="text-2xl font-bold text-zinc-100">
                {user?.balance ? formatCurrency(user.balance, userCurrency) : "0.00"}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Currency: {userCurrency} • Rate: 1 USD = {(1/conversionRate).toFixed(4)} {userCurrency}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Top Up Balance</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={balanceTopupAmount}
                    onChange={(e) => setBalanceTopupAmount(e.target.value)}
                    className="flex-1 bg-black/40 p-2 rounded-lg text-white text-sm outline-none"
                    placeholder="Amount in USD"
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={handleTopupBalance}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm text-white"
                  >
                    Add
                  </button>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Will add: {balanceTopupAmount ? formatCurrency(parseFloat(balanceTopupAmount) * conversionRate, userCurrency) : '0.00'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Deduct Balance</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={balanceDeductAmount}
                    onChange={(e) => setBalanceDeductAmount(e.target.value)}
                    className="flex-1 bg-black/40 p-2 rounded-lg text-white text-sm outline-none"
                    placeholder="Amount in USD"
                    min="0"
                    step="0.01"
                  />
                  <button
                    onClick={handleDeductBalance}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm text-white"
                  >
                    Deduct
                  </button>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Will deduct: {balanceDeductAmount ? formatCurrency(parseFloat(balanceDeductAmount) * conversionRate, userCurrency) : '0.00'}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-800">
              <button
                onClick={() => setShowBalanceModal(false)}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chart Modal - Keep your existing chart modal code */}
      {showChart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Your existing chart modal code */}
        </div>
      )}
    </>
  );
}
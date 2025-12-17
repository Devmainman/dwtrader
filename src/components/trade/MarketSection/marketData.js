// Market data constants
export const PAIRS = {
  "Hot Picks": [
    { symbol: "BTC/USDT", base: "BTC", quote: "USDT", binanceSymbol: "BTCUSDT", type: "crypto", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { symbol: "ETH/USDT", base: "ETH", quote: "USDT", binanceSymbol: "ETHUSDT", type: "crypto", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { symbol: "SOL/USDT", base: "SOL", quote: "USDT", binanceSymbol: "SOLUSDT", type: "crypto", image: "https://cryptologos.cc/logos/solana-sol-logo.png" },
    { symbol: "EUR/USD", base: "EUR", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/europe/flag-400.png" },
    { symbol: "GBP/USD", base: "GBP", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png" },
  ],
  "Popular": [
    { symbol: "BTC/USDT", base: "BTC", quote: "USDT", binanceSymbol: "BTCUSDT", type: "crypto", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { symbol: "ETH/USDT", base: "ETH", quote: "USDT", binanceSymbol: "ETHUSDT", type: "crypto", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { symbol: "BNB/USDT", base: "BNB", quote: "USDT", binanceSymbol: "BNBUSDT", type: "crypto", image: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
    { symbol: "XRP/USDT", base: "XRP", quote: "USDT", binanceSymbol: "XRPUSDT", type: "crypto", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
    { symbol: "ADA/USDT", base: "ADA", quote: "USDT", binanceSymbol: "ADAUSDT", type: "crypto", image: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
    { symbol: "DOGE/USDT", base: "DOGE", quote: "USDT", binanceSymbol: "DOGEUSDT", type: "crypto", image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
    { symbol: "EUR/USD", base: "EUR", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/europe/flag-400.png" },
    { symbol: "GBP/USD", base: "GBP", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png" },
    { symbol: "USD/JPY", base: "USD", quote: "JPY", type: "forex", image: "https://cdn.countryflags.com/thumbs/japan/flag-400.png" },
    { symbol: "AUD/USD", base: "AUD", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/australia/flag-400.png" },
  ],
  "New": [
    { symbol: "SUI/USDT", base: "SUI", quote: "USDT", binanceSymbol: "SUIUSDT", type: "crypto", image: "https://cryptologos.cc/logos/sui-sui-logo.png" },
    { symbol: "SEI/USDT", base: "SEI", quote: "USDT", binanceSymbol: "SEIUSDT", type: "crypto", image: "https://cryptologos.cc/logos/sei-coin-sei-logo.png" },
    { symbol: "TIA/USDT", base: "TIA", quote: "USDT", binanceSymbol: "TIAUSDT", type: "crypto", image: "https://cryptologos.cc/logos/celestia-tia-logo.png" },
    { symbol: "ORDI/USDT", base: "ORDI", quote: "USDT", binanceSymbol: "ORDIUSDT", type: "crypto", image: "https://cryptologos.cc/logos/ordinals-ordi-logo.png" },
    { symbol: "BTC/GBP", base: "BTC", quote: "GBP", type: "forex-crypto", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
  ],
  "Top Gainers": [
    { symbol: "WIF/USDT", base: "WIF", quote: "USDT", binanceSymbol: "WIFUSDT", type: "crypto", image: "https://cryptologos.cc/logos/dogwifhat-wif-logo.png" },
    { symbol: "PEPE/USDT", base: "PEPE", quote: "USDT", binanceSymbol: "PEPEUSDT", type: "crypto", image: "https://cryptologos.cc/logos/pepe-pepe-logo.png" },
    { symbol: "BONK/USDT", base: "BONK", quote: "USDT", binanceSymbol: "BONKUSDT", type: "crypto", image: "https://cryptologos.cc/logos/bonk-bonk-logo.png" },
    { symbol: "FLOKI/USDT", base: "FLOKI", quote: "USDT", binanceSymbol: "FLOKIUSDT", type: "crypto", image: "https://cryptologos.cc/logos/floki-floki-logo.png" },
    { symbol: "SHIB/USDT", base: "SHIB", quote: "USDT", binanceSymbol: "SHIBUSDT", type: "crypto", image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png" },
  ],
  "Meme": [
    { symbol: "DOGE/USDT", base: "DOGE", quote: "USDT", binanceSymbol: "DOGEUSDT", type: "crypto", image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png" },
    { symbol: "SHIB/USDT", base: "SHIB", quote: "USDT", binanceSymbol: "SHIBUSDT", type: "crypto", image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png" },
    { symbol: "PEPE/USDT", base: "PEPE", quote: "USDT", binanceSymbol: "PEPEUSDT", type: "crypto", image: "https://cryptologos.cc/logos/pepe-pepe-logo.png" },
    { symbol: "WIF/USDT", base: "WIF", quote: "USDT", binanceSymbol: "WIFUSDT", type: "crypto", image: "https://cryptologos.cc/logos/dogwifhat-wif-logo.png" },
    { symbol: "FLOKI/USDT", base: "FLOKI", quote: "USDT", binanceSymbol: "FLOKIUSDT", type: "crypto", image: "https://cryptologos.cc/logos/floki-floki-logo.png" },
    { symbol: "BONK/USDT", base: "BONK", quote: "USDT", binanceSymbol: "BONKUSDT", type: "crypto", image: "https://cryptologos.cc/logos/bonk-bonk-logo.png" },
  ],
  "Forex": [
    { symbol: "EUR/USD", base: "EUR", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/europe/flag-400.png" },
    { symbol: "GBP/USD", base: "GBP", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png" },
    { symbol: "USD/JPY", base: "USD", quote: "JPY", type: "forex", image: "https://cdn.countryflags.com/thumbs/japan/flag-400.png" },
    { symbol: "AUD/USD", base: "AUD", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/australia/flag-400.png" },
    { symbol: "USD/CAD", base: "USD", quote: "CAD", type: "forex", image: "https://cdn.countryflags.com/thumbs/canada/flag-400.png" },
    { symbol: "USD/CHF", base: "USD", quote: "CHF", type: "forex", image: "https://cdn.countryflags.com/thumbs/switzerland/flag-400.png" },
    { symbol: "NZD/USD", base: "NZD", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/new-zealand/flag-400.png" },
    { symbol: "EUR/GBP", base: "EUR", quote: "GBP", type: "forex", image: "https://cdn.countryflags.com/thumbs/europe/flag-400.png" },
    { symbol: "EUR/JPY", base: "EUR", quote: "JPY", type: "forex", image: "https://cdn.countryflags.com/thumbs/europe/flag-400.png" },
    { symbol: "GBP/JPY", base: "GBP", quote: "JPY", type: "forex", image: "https://cdn.countryflags.com/thumbs/united-kingdom/flag-400.png" },
  ],
  "24h Volume": [
    { symbol: "BTC/USDT", base: "BTC", quote: "USDT", binanceSymbol: "BTCUSDT", type: "crypto", image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
    { symbol: "ETH/USDT", base: "ETH", quote: "USDT", binanceSymbol: "ETHUSDT", type: "crypto", image: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { symbol: "SOL/USDT", base: "SOL", quote: "USDT", binanceSymbol: "SOLUSDT", type: "crypto", image: "https://cryptologos.cc/logos/solana-sol-logo.png" },
    { symbol: "XRP/USDT", base: "XRP", quote: "USDT", binanceSymbol: "XRPUSDT", type: "crypto", image: "https://cryptologos.cc/logos/xrp-xrp-logo.png" },
    { symbol: "EUR/USD", base: "EUR", quote: "USD", type: "forex", image: "https://cdn.countryflags.com/thumbs/europe/flag-400.png" },
  ],
  "Losers": [
    { symbol: "ADA/USDT", base: "ADA", quote: "USDT", binanceSymbol: "ADAUSDT", type: "crypto", image: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
    { symbol: "DOT/USDT", base: "DOT", quote: "USDT", binanceSymbol: "DOTUSDT", type: "crypto", image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
    { symbol: "LINK/USDT", base: "LINK", quote: "USDT", binanceSymbol: "LINKUSDT", type: "crypto", image: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
    { symbol: "MATIC/USDT", base: "MATIC", quote: "USDT", binanceSymbol: "MATICUSDT", type: "crypto", image: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
    { symbol: "TRX/USDT", base: "TRX", quote: "USDT", binanceSymbol: "TRXUSDT", type: "crypto", image: "https://cryptologos.cc/logos/tron-trx-logo.png" },
  ]
};

export const TABS = ["Hot Picks", "Popular", "New", "Top Gainers", "Meme", "Forex", "24h Volume", "Losers"];

// Helper functions
export const getBinanceSymbol = (pair) => {
  if (pair.binanceSymbol) return pair.binanceSymbol;
  return `${pair.base}${pair.quote}`;
};

export const getPairTypeLabel = (type) => {
  const labels = {
    'crypto': 'Crypto',
    'forex': 'Forex',
    'forex-crypto': 'Forex/Crypto'
  };
  return labels[type] || type;
};
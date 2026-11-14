"use client";
import React, { useEffect, useRef, useState } from "react";
import ChartTabs from "./ChartTabs";
import ChartToolbar from "./ChartToolbar";

function TradingChart() {
  const containerRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState({ 
    price: 0, 
    open: 0, 
    high: 0, 
    low: 0, 
    close: 0,
    change: 0, 
    changePercent: 0 
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch latest price data
  const fetchCurrentPrice = async () => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`
      );
      
      const data = await response.json();
      const lastPrice = parseFloat(data.lastPrice);
      const openPrice = parseFloat(data.openPrice);
      const highPrice = parseFloat(data.highPrice);
      const lowPrice = parseFloat(data.lowPrice);
      const priceChange = parseFloat(data.priceChange);
      const priceChangePercent = parseFloat(data.priceChangePercent);
      
      setCurrentPrice({
        price: lastPrice,
        open: openPrice,
        high: highPrice,
        low: lowPrice,
        close: lastPrice,
        change: priceChange,
        changePercent: priceChangePercent,
      });
    } catch (error) {
      console.error("Failed to fetch price data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial price
    fetchCurrentPrice();
    
    // Set up interval for price updates
    const priceInterval = setInterval(fetchCurrentPrice, 10000);
    
    // Load TradingView widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        setTimeout(() => {
          new window.TradingView.widget({
            container_id: "tradingview-chart",
            autosize: true,
            symbol: "BINANCE:BTCUSDT",
            interval: "D",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            allow_symbol_change: false,
            hide_top_toolbar: true,
            hide_side_toolbar: true,
            hide_legend: true,
            details: false,
            hotlist: false,
            calendar: false,
            show_popup_button: false,
            studies: [],
            backgroundColor: "#1D1D1F",
            gridColor: "#363A45",
            widgetFontColor: "#D9D9D9",
            hide_volume: false,
            withdateranges: false,
            hideideas: true,
            hideideasbutton: true,
            disabled_features: [
              "header_widget", 
              "header_symbol_search", 
              "symbol_search_hot_key",
              "timeframes_toolbar",
              "go_to_date",
              "compare_symbol",
              "control_bar",
              "timezone_menu",
              "edit_buttons_in_legend"
            ],
            enabled_features: [
              "side_toolbar_in_fullscreen_mode",
              "header_in_fullscreen_mode",
              "hide_left_toolbar_by_default"
            ]
          });
        }, 100);
      }
    };
    
    document.head.appendChild(script);

    return () => {
      clearInterval(priceInterval);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const priceColor = currentPrice.change >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSign = currentPrice.change >= 0 ? '+' : '';

  return (
    <section className="mt-6 w-full lg:mt-0 lg:bg-[#1D1D1F] lg:rounded-2xl lg:border lg:border-white/5 lg:overflow-hidden">
      <ChartTabs />
      <div className="flex flex-col justify-center p-px w-full bg-gray-800 rounded-sm border-solid border-[0.52px] border-[color:var(--script-viserlab-com-tuna,#363A45)]">
        <div className="flex flex-col justify-center w-full">
          <div className="flex-1 w-full">
            <div className="flex overflow-hidden flex-col justify-center w-full">
              <div className="overflow-hidden flex-1 w-full">
                <div className="overflow-hidden pb-1">
                  <div className="flex-1 w-full">
                    <ChartToolbar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Container - Reduced Height */}
        <div className="relative w-full h-[180px] lg:h-[420px] bg-[#1D1D1F]">
          {/* TradingView Chart */}
          <div 
            ref={containerRef}
            id="tradingview-chart" 
            className="absolute inset-0 w-full h-full"
          />
          
          {/* Market Info Overlay */}
          <div className="absolute top-1 left-1 z-10">
            <div className="flex flex-col">
              <div className="flex mb-1">
                <div className="flex items-center py-0.5 px-1 h-full bg-gray-900 bg-opacity-80 rounded">
                  <div className="flex gap-1 items-center">
                    <div className="flex items-center w-[9px]">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/113690dd451dda1b56627ff28e13f58855fff754521b0a73771080d4b58f20d6?placeholderIfAbsent=true"
                        className="w-2.5 aspect-[1.11]"
                        alt="Bitcoin icon"
                      />
                    </div>
                    <div className="text-xs text-gray-300">
                      BTC/USDT
                    </div>
                    <div className="text-xs text-gray-300">
                      ·
                    </div>
                    <div className="text-xs text-gray-300">
                      1D
                    </div>
                    <div className="text-xs text-gray-300">
                      ·
                    </div>
                    <div className="text-xs text-gray-300">
                      BINANCE
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Price Data - Shows only when loaded */}
              {!isLoading && (
                <div className="flex items-center py-1 px-2 text-xs bg-gray-900 bg-opacity-80 rounded">
                  <div className="flex items-center gap-3">
                    <div className="whitespace-nowrap">
                      <span className="text-gray-300">O </span>
                      <span className={priceColor}>
                        {currentPrice.open.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-300">H </span>
                      <span className={priceColor}>
                        {currentPrice.high.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-300">L </span>
                      <span className={priceColor}>
                        {currentPrice.low.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="text-gray-300">C </span>
                      <span className={priceColor}>
                        {currentPrice.close.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className={`whitespace-nowrap ${priceColor}`}>
                      {changeSign}{currentPrice.change.toFixed(2)} ({changeSign}{Math.abs(currentPrice.changePercent).toFixed(2)}%)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TradingChart;
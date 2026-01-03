import React, { useEffect, useRef } from "react";

function TradingSection() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      // eslint-disable-next-line no-undef
      new TradingView.widget({
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#1D1D1F",
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        container_id: "tradingview_chart",
      });
    };

    chartRef.current.appendChild(script);
  }, []);

  return (
    <section className="w-full max-w-[866px] rounded-[20px] border border-neutral-600 bg-[#1D1D1F]">
      <nav className="flex flex-wrap gap-10 justify-between items-center px-6 py-3 text-xs border-b border-neutral-600 text-neutral-400">
        <span className="text-blue-600">Chart</span>
        <span>Market</span>
        <span>History</span>
      </nav>

      <div className="rounded-b-[20px]">
        <div className="flex">
          {/* Chart */}
          <div className="w-full aspect-[0.89]">
            <div
              id="tradingview_chart"
              ref={chartRef}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TradingSection;

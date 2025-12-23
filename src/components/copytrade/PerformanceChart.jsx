"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function PerformanceChart({ trader, onClose }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  const timeframes = [
    { label: "1D", value: "daily" },
    { label: "1W", value: "weekly" },
    { label: "1M", value: "monthly" },
    { label: "3M", value: "quarterly" },
    { label: "1Y", value: "yearly" },
    { label: "ALL", value: "all" }
  ];

  const [selectedTimeframe, setSelectedTimeframe] = useState("monthly");
  const [chartType, setChartType] = useState("line");

  // Fetch chart data from API
  const fetchChartData = async (timeframe) => {
    if (!trader?.id) return;
    
    setLoading(true);
    try {
      // This should be replaced with your actual API endpoint
      // const response = await fetch(`/api/trader-performance/${trader.id}?timeframe=${timeframe}`);
      // const data = await response.json();
      
      // For now, return empty data
      const labels = Array.from({ length: 12 }, (_, i) => `Period ${i + 1}`);
      const data = Array.from({ length: 12 }, () => 0);
      
      setChartData({ labels, data });
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setChartData({ labels: [], data: [] });
    } finally {
      setLoading(false);
    }
  };

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    
    const chartConfig = {
      labels: chartData.labels,
      datasets: [
        {
          label: "Profit/Loss (%)",
          data: chartData.data,
          borderColor: (trader?.profitPercent || 0) >= 0 ? "#15803d" : "#dc2626",
          backgroundColor: chartType === "line" || chartType === "area" 
            ? `rgba(21, 128, 61, 0.1)` 
            : `rgba(21, 128, 61, 0.7)`,
          borderWidth: 2,
          fill: chartType === "area",
          tension: 0.4,
          pointBackgroundColor: (trader?.profitPercent || 0) >= 0 ? "#15803d" : "#dc2626",
          pointBorderColor: "#fafafa",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };

    chartInstance.current = new Chart(ctx, {
      type: chartType === "area" ? "line" : chartType,
      data: chartConfig,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#fafafa",
              font: {
                size: 10
              },
              padding: 10
            }
          },
          tooltip: {
            backgroundColor: "rgba(23, 23, 23, 0.9)",
            titleColor: "#fafafa",
            bodyColor: "#fafafa",
            borderColor: (trader?.profitPercent || 0) >= 0 ? "#15803d" : "#dc2626",
            borderWidth: 1,
            cornerRadius: 6,
            padding: 8,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `Profit: ${context.parsed.y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: "rgba(120, 113, 108, 0.3)",
              drawBorder: false
            },
            ticks: {
              color: "#a8a29e",
              font: {
                size: 9
              }
            }
          },
          y: {
            grid: {
              color: "rgba(120, 113, 108, 0.3)",
              drawBorder: false
            },
            ticks: {
              color: "#a8a29e",
              font: {
                size: 9
              },
              callback: function(value) {
                return value + "%";
              }
            },
            beginAtZero: true
          }
        },
        interaction: {
          intersect: false,
          mode: "index"
        },
        animation: {
          duration: 750,
          easing: "easeOutQuart"
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType, trader]);

  // Fetch data when timeframe changes
  useEffect(() => {
    fetchChartData(selectedTimeframe);
  }, [selectedTimeframe, trader?.id]);

  if (!trader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-3xl p-5 max-w-[480px] w-full max-h-[90vh] overflow-y-auto border border-neutral-800">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <img
            src={trader.avatar || `https://ui-avatars.com/api/?name=${trader.username || 'Trader'}&background=6366f1&color=fff`}
            alt={trader.username}
            className="w-11 h-11 rounded-full"
          />
          <div>
            <h3 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
              {trader.username}'s Performance
            </h3>
            <p className="text-[10px] text-stone-300">
              Profit/Loss analysis
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1 text-stone-300 hover:text-zinc-100 rounded-full hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>

        {/* Trader Stats Summary */}
        <div className="grid grid-cols-2 gap-1.5 mb-5">
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Total Profit</div>
            <div className={`text-[12px] font-medium tracking-wide leading-tight ${(trader.profitPercent || 0) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {(trader.profitPercent || 0) >= 0 ? '+' : ''}{(trader.profitPercent || 0).toFixed(2)}%
            </div>
          </div>
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Win Rate</div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{(trader.winRate || 0).toFixed(1)}%</div>
          </div>
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Total Trades</div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{trader.totalTrades || 0}</div>
          </div>
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Active Copiers</div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{trader.totalCopiers || 0}</div>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-1 mb-5">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value}
              onClick={() => setSelectedTimeframe(timeframe.value)}
              className={`px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
                selectedTimeframe === timeframe.value
                  ? "bg-blue-700/80 text-zinc-100"
                  : "bg-neutral-800 text-stone-300 hover:text-zinc-100 hover:bg-neutral-700"
              }`}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-1 mb-2.5">
          {["line", "bar", "area"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold capitalize ${
                chartType === type
                  ? "bg-blue-700/80 text-zinc-100"
                  : "bg-neutral-800 text-stone-300 hover:text-zinc-100 hover:bg-neutral-700"
              }`}
            >
              {type} Chart
            </button>
          ))}
        </div>

        {/* Chart Container */}
        <div className="bg-neutral-800 rounded-3xl border border-neutral-900 p-2.5 mb-5">
          <div className="h-[200px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-stone-300 text-[10px]">Loading chart data...</div>
              </div>
            ) : (
              <canvas ref={chartRef} />
            )}
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900 mb-5">
          <h4 className="text-[10px] font-semibold text-zinc-100 mb-2.5">Risk Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-300">Risk Level</span>
              <span className={`px-2 py-0.5 rounded-3xl text-[10px] font-semibold ${
                trader.riskLevel === 'low' ? 'bg-green-700/20 text-green-700' :
                trader.riskLevel === 'medium' ? 'bg-yellow-700/20 text-yellow-700' :
                'bg-red-600/20 text-red-600'
              }`}>
                {trader.riskLevel || "medium"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-stone-300">Max Drawdown</span>
              <span className="text-[10px] text-zinc-100 font-semibold">{(trader.maxDrawdown || 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-2.5 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
        >
          Close Analysis
        </button>
      </div>
    </div>
  );
}

export default PerformanceChart;
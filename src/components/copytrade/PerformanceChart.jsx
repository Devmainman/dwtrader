"use client";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function PerformanceChart({ trader, onClose }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const timeframes = [
    { label: "1D", value: "daily" },
    { label: "1W", value: "weekly" },
    { label: "1M", value: "monthly" },
    { label: "3M", value: "quarterly" },
    { label: "1Y", value: "yearly" },
    { label: "ALL", value: "all" }
  ];

  const [selectedTimeframe, setSelectedTimeframe] = React.useState("monthly");
  const [chartType, setChartType] = React.useState("line");

  // Generate sample data for the chart
  const generateChartData = () => {
    const baseData = {
      daily: [65, 59, 80, 81, 56, 55, 40, 70, 85, 90, 95, 88],
      weekly: [12, 8, -5, 15, 20, 18, 25, 30, 22, 28, 32, 35],
      monthly: [5, 10, 8, 12, 15, 20, 18, 25, 30, 35, 40, 45],
      quarterly: [15, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
      yearly: [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
      all: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65]
    };

    const labels = {
      daily: ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"],
      weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      quarterly: ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"],
      yearly: ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031"],
      all: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029"]
    };

    const data = baseData[selectedTimeframe] || baseData.monthly;
    const label = labels[selectedTimeframe] || labels.monthly;

    return {
      labels: label,
      datasets: [
        {
          label: "Profit/Loss (%)",
          data: data,
          borderColor: trader?.profitPercent >= 0 ? "#15803d" : "#dc2626",
          backgroundColor: chartType === "line" || chartType === "area" 
            ? `rgba(21, 128, 61, 0.1)` 
            : `rgba(21, 128, 61, 0.7)`,
          borderWidth: 2,
          fill: chartType === "area",
          tension: 0.4,
          pointBackgroundColor: trader?.profitPercent >= 0 ? "#15803d" : "#dc2626",
          pointBorderColor: "#fafafa",
          pointBorderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };
  };

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current || !trader) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    
    const chartData = generateChartData();

    chartInstance.current = new Chart(ctx, {
      type: chartType === "area" ? "line" : chartType,
      data: chartData,
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
            borderColor: trader?.profitPercent >= 0 ? "#15803d" : "#dc2626",
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
  }, [selectedTimeframe, chartType, trader]);

  if (!trader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-3xl p-5 max-w-[480px] w-full max-h-[90vh] overflow-y-auto border border-neutral-800">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <img
            src={trader.avatar}
            alt={trader.username}
            className="w-11 h-11 rounded-full"
          />
          <div>
            <h3 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
              {trader.username}'s Performance
            </h3>
            <p className="text-[10px] text-stone-300">
              Profit/Loss analysis and trading metrics
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
            <div className={`text-[12px] font-medium tracking-wide leading-tight ${trader.profitPercent >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {trader.profitPercent >= 0 ? '+' : ''}{trader.profitPercent.toFixed(2)}%
            </div>
          </div>
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Win Rate</div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{trader.winRate.toFixed(1)}%</div>
          </div>
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Total Trades</div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{trader.totalTrades}</div>
          </div>
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <div className="text-[10px] text-stone-300">Active Copiers</div>
            <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">{trader.totalCopiers}</div>
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
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-2.5 mb-5">
          {/* Risk Metrics */}
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <h4 className="text-[10px] font-semibold text-zinc-100 mb-2.5">Risk Metrics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-300">Risk Level</span>
                <span className={`px-2 py-0.5 rounded-3xl text-[10px] font-semibold ${
                  trader.riskLevel === 'low' ? 'bg-green-700/20 text-green-700' :
                  trader.riskLevel === 'medium' ? 'bg-yellow-700/20 text-yellow-700' :
                  'bg-red-600/20 text-red-600'
                }`}>
                  {trader.riskLevel}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-300">Max Drawdown</span>
                <span className="text-[10px] text-zinc-100 font-semibold">{trader.maxDrawdown?.toFixed(1) || "5.2"}%</span>
              </div>
            </div>
          </div>

          {/* Trading Stats */}
          <div className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
            <h4 className="text-[10px] font-semibold text-zinc-100 mb-2.5">Trading Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-300">Average Trade Size</span>
                <span className="text-[10px] text-zinc-100 font-semibold">${trader.avgTradeSize?.toFixed(2) || "1,250"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-stone-300">Trading Style</span>
                <span className="text-[10px] text-zinc-100 font-semibold capitalize">{trader.tradingStyle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="px-2.5 py-3 bg-gradient-to-r from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-900 mb-5">
          <h4 className="text-[10px] font-semibold text-zinc-100 mb-1.5">Performance Summary</h4>
          <p className="text-[10px] text-stone-300">
            {trader.username} has maintained a consistent profit margin of {trader.profitPercent.toFixed(2)}% 
            with a win rate of {trader.winRate.toFixed(1)}%.
          </p>
          <div className="flex items-center gap-1 mt-2.5">
            <span className="text-[10px] text-stone-300">Verified:</span>
            <span className={`px-1.5 py-0.5 rounded-3xl text-[10px] ${trader.verified ? 'bg-green-700/20 text-green-700' : 'bg-yellow-700/20 text-yellow-700'}`}>
              {trader.verified ? '✓ Verified Trader' : 'Pending Verification'}
            </span>
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
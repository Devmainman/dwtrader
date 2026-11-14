"use client";
import React from "react";
import { BarChart3, Settings, Rocket, Coins, Pause, Play } from "lucide-react";

function MiningHeader({ 
  isMining, 
  miningStats, 
  activeTab, 
  setActiveTab,
  onStartMining,
  onStopMining 
}) {
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "equipment", label: "Equipment", icon: Settings },
    { id: "boosters", label: "Boosters", icon: Rocket },
    { id: "rewards", label: "Rewards", icon: Coins }
  ];
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-zinc-100">Cryptocurrency Mining</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Mine cryptocurrencies with your computing power
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isMining ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-neutral-400">
              {isMining ? 'Mining Active' : 'Mining Stopped'}
            </span>
          </div>
          
          {isMining ? (
            <button
              onClick={onStopMining}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm font-medium flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop Mining
            </button>
          ) : (
            <button
              onClick={onStartMining}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-medium flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Mining
            </button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
            }`}
          >
            <span><tab.icon className="w-3.5 h-3.5" /></span>
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Mining Status Bar */}
      <div className="bg-neutral-900 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="text-xs text-neutral-400">Current Hash Rate</div>
            <div className="text-2xl font-bold text-zinc-100">
              {miningStats.hashRate.toFixed(1)} <span className="text-lg text-neutral-400">MH/s</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-neutral-400">Power</div>
              <div className="text-lg font-medium text-zinc-100">{miningStats.powerConsumption}W</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-neutral-400">Temp</div>
              <div className={`text-lg font-medium ${miningStats.temperature > 70 ? 'text-red-400' : 'text-green-400'}`}>
                {miningStats.temperature.toFixed(1)}°C
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-neutral-400">Efficiency</div>
              <div className="text-lg font-medium text-zinc-100">{miningStats.efficiency.toFixed(2)} J/MH</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiningHeader;
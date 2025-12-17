"use client";
import React, { useState } from "react";

function MiningBoostersList({ boosters, activeBoosters, onActivateBooster }) {
  const boosterTemplates = {
    'hash_boost': {
      name: 'Hash Rate Boost',
      description: 'Increase your mining speed by 50%',
      multiplier: 1.5,
      duration: 3600,
      price: 10
    },
    'energy_saver': {
      name: 'Energy Saver',
      description: 'Reduce power consumption by 20%',
      multiplier: 0.8,
      duration: 7200,
      price: 15
    },
    'double_rewards': {
      name: 'Double Rewards',
      description: 'Earn double mining rewards',
      multiplier: 2,
      duration: 1800,
      price: 25
    }
  };

  const handleActivate = (boosterId) => {
    if (window.confirm("Activate this booster?")) {
      onActivateBooster(boosterId);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isBoosterActive = (boosterId) => {
    return activeBoosters?.some(b => b.id === boosterId);
  };

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          MINING BOOSTERS
        </h3>
        <div className="text-[10px] text-stone-300">
          Active: {activeBoosters?.length || 0}/{Object.keys(boosterTemplates).length}
        </div>
      </div>

      <div className="mt-1.5 space-y-1.5">
        {Object.entries(boosterTemplates).map(([id, template]) => {
          const isActive = isBoosterActive(id);
          
          return (
            <div key={id} className={`overflow-hidden px-2.5 py-3 rounded-3xl border border-solid ${
              isActive ? 'border-green-700/30 bg-neutral-800' : 'bg-neutral-800 border-neutral-900'
            }`}>
              <div className="flex justify-between items-start mb-2.5">
                <div>
                  <h4 className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {template.name}
                  </h4>
                  <div className="text-[10px] text-stone-300 mt-0.5">
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {template.multiplier}x
                  </div>
                  <div className="text-[10px] text-stone-300">
                    {formatTime(template.duration)}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-stone-300 mb-3">
                {template.description}
              </div>

              <div className="flex items-center justify-between text-[10px] mb-3">
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Effect:</span>
                  <span className="text-zinc-100 font-semibold">
                    {template.name.includes('Hash Rate') ? `${template.multiplier}x Hash Power` :
                     template.name.includes('Energy') ? `${(1-template.multiplier)*100}% Less Power` :
                     `${template.multiplier}x Rewards`}
                  </span>
                </div>
                <div className="text-yellow-700 font-semibold">${template.price}</div>
              </div>

              <button
                onClick={() => handleActivate(id)}
                disabled={isActive}
                className={`w-full px-2.5 py-1.5 rounded-3xl text-[10px] font-semibold ${
                  isActive
                    ? 'bg-green-700/20 text-green-700'
                    : 'bg-gradient-to-r from-purple-700/80 to-pink-700/80 hover:from-purple-700 hover:to-pink-700 text-zinc-100'
                }`}
              >
                {isActive ? 'ACTIVE' : `ACTIVATE FOR $${template.price}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MiningBoostersList;
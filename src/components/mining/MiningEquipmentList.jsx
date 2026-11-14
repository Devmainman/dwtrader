"use client";
import React from "react";
import { Monitor, Server, Cpu, HardDrive } from 'lucide-react';
const EquipIcon = ({ type }) => { const I = type === 'GPU' ? Monitor : type === 'ASIC' ? Server : type === 'CPU' ? Cpu : HardDrive; return <I className="w-4 h-4" strokeWidth={1.8} />; };

function MiningEquipmentList({ equipment, onPurchaseEquipment, onActivateEquipment, detailed = false }) {
  const equipmentTemplates = {
    'gpu_1': {
      name: 'NVIDIA RTX 4090',
      type: 'GPU',
      hashRate: 120,
      powerConsumption: 450,
      efficiency: 0.27,
      purchasePrice: 1599,
      description: 'High-end GPU for mining'
    },
    'gpu_2': {
      name: 'NVIDIA RTX 4080',
      type: 'GPU',
      hashRate: 85,
      powerConsumption: 320,
      efficiency: 0.27,
      purchasePrice: 1199,
      description: 'Mid-range GPU for mining'
    },
    'asic_1': {
      name: 'Bitmain Antminer S19',
      type: 'ASIC',
      hashRate: 110,
      powerConsumption: 3250,
      efficiency: 29.5,
      purchasePrice: 2899,
      description: 'ASIC miner for Bitcoin'
    }
  };

  const handlePurchase = (equipmentId) => {
    const template = equipmentTemplates[equipmentId];
    if (template && window.confirm(`Purchase ${template.name} for $${template.purchasePrice}?`)) {
      onPurchaseEquipment(equipmentId);
    }
  };

  const handleActivate = (equipmentId, equipmentName) => {
    if (window.confirm(`Activate ${equipmentName}?`)) {
      onActivateEquipment(equipmentId);
    }
  };

  // Check if user has any purchased equipment
  const hasPurchasedEquipment = equipment.length > 0;
  
  // Show available equipment for purchase if no equipment owned
  const availableEquipment = Object.entries(equipmentTemplates).map(([id, template]) => ({
    id,
    ...template,
    status: 'available'
  }));

  return (
    <div className="w-full mt-5">
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[12px] tracking-normal leading-none text-stone-300">
          {detailed ? "ALL EQUIPMENT" : "RECENT EQUIPMENT"}
        </h3>
        {!detailed && equipment.length > 3 && (
          <button className="text-[10px] text-blue-700 hover:text-blue-600">
            View All
          </button>
        )}
      </div>

      <div className="mt-1.5 space-y-1.5">
        {hasPurchasedEquipment ? (
          // Show user's purchased equipment
          equipment.slice(0, detailed ? equipment.length : 3).map((item) => (
            <div key={item.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    item.status === 'active' ? 'bg-green-700/20' :
                    item.status === 'idle' ? 'bg-yellow-700/20' : 'bg-red-600/20'
                  }`}>
                    <span className="text-[14px]">
                      <EquipIcon type={item.type} />
                    </span>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-stone-300">{item.type}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {item.hashRate} MH/s
                  </div>
                  <div className="text-[10px] text-stone-300">{item.powerConsumption}W</div>
                </div>
              </div>
              
              <div className="mt-2.5 grid grid-cols-2 gap-2.5 text-[10px]">
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Efficiency:</span>
                  <span className="text-zinc-100 font-semibold">{item.efficiency} J/MH</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Status:</span>
                  <span className={`font-semibold ${
                    item.status === 'active' ? 'text-green-700' :
                    item.status === 'idle' ? 'text-yellow-700' : 'text-red-600'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Temp:</span>
                  <span className="text-zinc-100 font-semibold">{item.temperature}°C</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Price:</span>
                  <span className="text-green-700 font-semibold">${item.purchasePrice}</span>
                </div>
              </div>
              
              {item.status === 'idle' && onActivateEquipment && (
                <button
                  onClick={() => handleActivate(item.id, item.name)}
                  className="w-full mt-2.5 px-2.5 py-1.5 bg-green-700/80 hover:bg-green-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
                >
                  Activate Equipment
                </button>
              )}
            </div>
          ))
        ) : detailed ? (
          // Show available equipment for purchase (detailed view)
          availableEquipment.map((item) => (
            <div key={item.id} className="overflow-hidden px-2.5 py-3 rounded-3xl border border-solid bg-neutral-800 border-neutral-900">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-blue-700/20">
                    <span className="text-[14px]">
                      <EquipIcon type={item.type} />
                    </span>
                  </div>
                  <div>
                    <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                      {item.name}
                    </div>
                    <div className="text-[10px] text-stone-300">{item.type}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-[12px] font-medium tracking-wide leading-tight text-zinc-100">
                    {item.hashRate} MH/s
                  </div>
                  <div className="text-[10px] text-stone-300">{item.powerConsumption}W</div>
                </div>
              </div>
              
              <div className="mt-2.5 grid grid-cols-2 gap-2.5 text-[10px]">
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Efficiency:</span>
                  <span className="text-zinc-100 font-semibold">{item.efficiency} J/MH</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Status:</span>
                  <span className="text-blue-700 font-semibold">Available</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Type:</span>
                  <span className="text-zinc-100 font-semibold">{item.type}</span>
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-stone-300">Price:</span>
                  <span className="text-green-700 font-semibold">${item.purchasePrice}</span>
                </div>
              </div>
              
              <button
                onClick={() => handlePurchase(item.id)}
                className="w-full mt-2.5 px-2.5 py-1.5 bg-gradient-to-r from-blue-700/80 to-purple-700/80 hover:from-blue-700 hover:to-purple-700 rounded-3xl text-[10px] text-zinc-100 font-semibold"
              >
                Purchase Equipment
              </button>
            </div>
          ))
        ) : (
          // Empty state for overview
          <div className="text-center py-6 text-stone-300 text-[12px]">
            No equipment available. Go to Equipment tab to purchase.
          </div>
        )}
      </div>
    </div>
  );
}

export default MiningEquipmentList;
"use client";
import React, { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import MiningTabs from "./MiningTabs";
import MiningControls from "./MiningControls";
import MiningStats from "./MiningStats";
import MiningEquipmentList from "./MiningEquipmentList"; // Import the actual component
import MiningBoostersList from "./MiningBoostersList";
import MiningRewardsList from "./MiningRewardsList";
import MiningHistoryList from "./MiningHistoryList";
import MiningPoolsList from "./MiningPoolsList";

export default function Mining() {
  const { fetchWithAuth, user } = useUserAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isMining, setIsMining] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [showDebugTools, setShowDebugTools] = useState(false);
  
  // Changed to match backend structure
  const [stats, setStats] = useState({
    hashRate: 0,
    coinsMined: 0,
    earningsToday: 0,
    totalEarnings: 0,
    activeTime: 0,
    powerConsumption: 0,
    temperature: 0,
    efficiency: 0,
    isMining: false,
    activeSession: null
  });
  
  const [equipment, setEquipment] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [boosters, setBoosters] = useState([]);
  const [activeBoosters, setActiveBoosters] = useState([]);
  const [history, setHistory] = useState([]);
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);

  const formatDuration = (seconds) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return `$0.00`;
    return `$${num.toFixed(2)}`;
  };

  // FIXED: Load data to match backend response structure
  const loadMiningData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    
    try {
      // Load all data in parallel
      const [statsRes, equipmentRes, rewardsRes, boostersRes, historyRes, poolsRes] = await Promise.all([
        fetchWithAuth("/mining/stats"),
        fetchWithAuth("/mining/equipment"),
        fetchWithAuth("/mining/rewards"),
        fetchWithAuth("/mining/boosters"),
        fetchWithAuth("/mining/history"),
        fetchWithAuth("/mining/pools")
      ]);

      // Set data from backend responses
      if (statsRes.data?.success) {
        setStats(statsRes.data.stats);
        setIsMining(statsRes.data.stats?.isMining || false);
      }

      if (equipmentRes.data?.success) {
        setEquipment(equipmentRes.data.equipment || []);
      }

      if (rewardsRes.data?.success) {
        setRewards(rewardsRes.data.rewards || []);
      }

      if (boostersRes.data?.success) {
        setBoosters(boostersRes.data.boosters || []);
        setActiveBoosters(boostersRes.data.activeBoosters || []);
      }

      if (historyRes.data?.success) {
        setHistory(historyRes.data.history || []);
      }

      if (poolsRes.data?.success) {
        const poolList = (poolsRes.data.pools || []).map(pool => ({
          ...pool,
          id: pool.id || pool._id
        }));

        setPools(poolList);

        if (!selectedPool && poolList.length > 0) {
          setSelectedPool(poolList[0]);
        }
      }

      setMessage("");
    } catch (err) {
      console.error('Load mining data error:', err);
      setMessage("Failed to load mining data");
      // Fallback data for development
      setFallbackData();
    } finally {
      if (showLoading) setLoading(false);
      setRefreshLoading(false);
    }
  };

  // Fallback data for development
  const setFallbackData = () => {
    const mockPools = [
      { id: '1', name: 'Bitcoin Pool', fee: 1.0, algorithm: 'SHA-256', miners: 12500, uptime: 99.8, minPayout: 0.001 }
    ];
    
    setPools(mockPools);
    setSelectedPool(mockPools[0]);
    setEquipment([
      { id: 'gpu_1', name: 'NVIDIA RTX 4090', type: 'GPU', hashRate: 120, powerConsumption: 450, efficiency: 0.27, status: 'active', temperature: 68, purchasePrice: 1599 },
      { id: 'gpu_2', name: 'NVIDIA RTX 4080', type: 'GPU', hashRate: 85, powerConsumption: 320, efficiency: 0.27, status: 'active', temperature: 65, purchasePrice: 1199 }
    ]);
    setRewards([
      { id: '1', coin: 'BTC', amount: 0.000123, value: 5.23, status: 'pending', createdAt: new Date() },
      { id: '2', coin: 'BTC', amount: 0.000089, value: 3.78, status: 'pending', createdAt: new Date() }
    ]);
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    await loadMiningData(false);
  };

  // Debug function to check equipment status
  const checkEquipmentStatus = async () => {
    try {
      console.log("🔍 Checking equipment status...");
      const response = await fetchWithAuth("/mining/equipment");
      
      if (response.data?.success) {
        const equipmentList = response.data.equipment || [];
        console.log("📊 Equipment List:", equipmentList);
        
        // Group by status
        const byStatus = {};
        equipmentList.forEach(eq => {
          if (!byStatus[eq.status]) byStatus[eq.status] = [];
          byStatus[eq.status].push(eq.name);
        });
        
        console.log("📈 Equipment by status:", byStatus);
        
        if (equipmentList.length === 0) {
          setMessage("No equipment found. Please purchase equipment first.");
        } else if (!byStatus['active'] || byStatus['active'].length === 0) {
          setMessage(`Found ${equipmentList.length} equipment items, but none are active. Statuses: ${Object.keys(byStatus).join(', ')}`);
        } else {
          setMessage(`Found ${byStatus['active'].length} active equipment items: ${byStatus['active'].join(', ')}`);
        }
      }
    } catch (err) {
      console.error("Error checking equipment:", err);
    }
  };

  // Function to activate equipment
  const activateEquipment = async (equipmentId) => {
    try {
      const response = await fetchWithAuth("/mining/activate-equipment", {
        method: "POST",
        data: { equipmentId }
      });
      
      if (response.data?.success) {
        setMessage(`${response.data.equipment?.name || "Equipment"} activated successfully!`);
        // Refresh equipment list
        await loadMiningData(false);
      } else {
        setMessage(response.data?.error || "Failed to activate equipment");
      }
    } catch (err) {
      setMessage(err.message || "Failed to activate equipment");
    }
  };

  // Function to activate all equipment
  const activateAllEquipment = async () => {
    try {
      const response = await fetchWithAuth("/mining/activate-all-equipment", {
        method: "POST"
      });
      
      if (response.data?.success) {
        setMessage(`Activated ${response.data.modifiedCount} equipment items!`);
        // Refresh equipment list
        await loadMiningData(false);
      } else {
        setMessage(response.data?.error || "Failed to activate equipment");
      }
    } catch (err) {
      setMessage(err.message || "Failed to activate equipment");
    }
  };

  // Debug function to test purchase
  const testPurchaseEquipment = async () => {
    try {
      console.log("Testing equipment purchase...");
      const response = await fetchWithAuth("/mining/purchase-equipment", {
        method: "POST",
        data: { equipmentId: "gpu_1" }
      });
      
      console.log("Purchase response:", response.data);
      
      if (response.data?.success) {
        setMessage(`Purchased ${response.data.equipment?.name || "equipment"} successfully!`);
        await loadMiningData(false);
      } else {
        setMessage(`Purchase failed: ${response.data?.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setMessage(`Error: ${err.message}`);
    }
  };

  // FIXED: Updated to match backend parameters
  const startMining = async () => {
    if (!selectedPool) {
      setMessage("Please select a mining pool first.");
      return;
    }

    console.log("=== DEBUG START MINING ===");
    console.log("1. Selected Pool:", selectedPool);
    console.log("2. Pool ID:", selectedPool.id);
    console.log("3. Is Mining State:", isMining);
    console.log("4. Current equipment:", equipment);
    
    const poolId = selectedPool.id || selectedPool._id;
    
    if (!poolId) {
      setMessage("Selected pool has an invalid ID.");
      return;
    }

    try {
      console.log("5. Sending request with poolId:", poolId);
      
      const response = await fetchWithAuth("/mining/start", {
        method: "POST",
        data: { poolId: poolId }
      });

      console.log("6. Full response:", response);
      console.log("7. Response data:", response.data);

      if (response.data?.success) {
        setIsMining(true);
        setMessage(`Mining started successfully in ${selectedPool.name}!`);
        
        // Refresh stats immediately
        const statsRes = await fetchWithAuth("/mining/stats");
        if (statsRes.data?.success) {
          setStats(statsRes.data.stats);
        }
      } else {
        console.error("8. Server returned error:", response.data);
        const errorMsg = response.data?.error || 
                        response.data?.message || 
                        "Failed to start mining";
        setMessage(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error("=== START MINING CATCH ERROR ===");
      console.error("Error object:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.message);
      
      // Extract error from server response
      let errorMessage = "Failed to start mining";
      
      if (err.response?.data) {
        const serverError = err.response.data;
        console.log("Server error details:", serverError);
        
        if (serverError.error) {
          errorMessage = serverError.error;
        } else if (serverError.message) {
          errorMessage = serverError.message;
        }
      }
      
      setMessage(`Error: ${errorMessage}`);
    }
  };

  const stopMining = async () => {
    try {
      const response = await fetchWithAuth("/mining/stop", {
        method: "POST"
      });
      
      if (response.data?.success) {
        setIsMining(false);
        setMessage("Mining stopped successfully!");
        // Refresh stats
        const statsRes = await fetchWithAuth("/mining/stats");
        if (statsRes.data?.success) {
          setStats(statsRes.data.stats);
        }
      } else {
        setMessage(response.data?.error || "Failed to stop mining");
      }
    } catch (err) {
      setMessage(err.message || "Failed to stop mining");
    }
  };

  const claimRewards = async () => {
    try {
      const response = await fetchWithAuth("/mining/claim-rewards", {
        method: "POST"
      });
      
      if (response.data?.success) {
        setMessage(`Rewards claimed successfully! Amount: $${response.data.amount}`);
        // Refresh rewards
        const rewardsRes = await fetchWithAuth("/mining/rewards");
        if (rewardsRes.data?.success) {
          setRewards(rewardsRes.data.rewards);
        }
        // Refresh stats
        const statsRes = await fetchWithAuth("/mining/stats");
        if (statsRes.data?.success) {
          setStats(statsRes.data.stats);
        }
      } else {
        setMessage(response.data?.error || "Failed to claim rewards");
      }
    } catch (err) {
      setMessage(err.message || "Failed to claim rewards");
    }
  };

  const activateBooster = async (boosterId) => {
    try {
      const response = await fetchWithAuth("/mining/activate-booster", {
        method: "POST",
        data: { boosterId }
      });
      
      if (response.data?.success) {
        setMessage(`${response.data.booster?.name || "Booster"} activated successfully!`);
        // Refresh boosters
        const boostersRes = await fetchWithAuth("/mining/boosters");
        if (boostersRes.data?.success) {
          setBoosters(boostersRes.data.boosters);
          setActiveBoosters(boostersRes.data.activeBoosters);
        }
      } else {
        setMessage(response.data?.error || "Failed to activate booster");
      }
    } catch (err) {
      setMessage(err.message || "Failed to activate booster");
    }
  };

  const purchaseEquipment = async (equipmentId) => {
    try {
      const response = await fetchWithAuth("/mining/purchase-equipment", {
        method: "POST",
        data: { equipmentId }
      });
      
      if (response.data?.success) {
        setMessage(`${response.data.equipment?.name || "Equipment"} purchased successfully!`);
        // Refresh equipment
        await loadMiningData(false);
      } else {
        setMessage(response.data?.error || "Failed to purchase equipment");
      }
    } catch (err) {
      setMessage(err.message || "Failed to purchase equipment");
    }
  };

  const switchPool = async (newPool) => {
    if (!newPool) {
      setMessage("Please select a valid pool to switch to.");
      return;
    }

    const poolId = newPool.id || newPool._id;
    
    if (!poolId) {
      setMessage("Selected pool has an invalid ID.");
      return;
    }

    try {
      const response = await fetchWithAuth("/mining/switch-pool", {
        method: "POST",
        data: { 
          poolId: poolId 
        }
      });

      console.log("Switch pool response:", response);

      if (response.data?.success) {
        setMessage(`Switched to ${newPool.name} successfully!`);
        setSelectedPool(newPool);
        
        // If mining was active, it might have been restarted
        const statsRes = await fetchWithAuth("/mining/stats");
        if (statsRes.data?.success) {
          setStats(statsRes.data.stats);
          setIsMining(statsRes.data.stats?.isMining || false);
        }
      } else {
        const errorMsg = response.data?.error || 
                        response.data?.message || 
                        "Failed to switch pool.";
        setMessage(errorMsg);
      }
    } catch (err) {
      console.error("Switch pool error:", err);
      setMessage(err.message || "Failed to switch pool.");
    }
  };

  // Load data on mount
  useEffect(() => {
    loadMiningData();
    
    // Poll for updates if mining is active
    let interval;
    if (isMining) {
      interval = setInterval(() => {
        fetchWithAuth("/mining/stats").then(statsRes => {
          if (statsRes.data?.success) {
            setStats(statsRes.data.stats);
          }
        });
      }, 10000); // Update every 10 seconds while mining
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMining]);

  if (loading) {
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
        <div className="w-full flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full px-3 py-3 rounded-3xl bg-neutral-800 animate-pulse h-24" />
          ))}
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
            <h2 className="text-[26px] font-medium tracking-wide leading-tight text-zinc-100">
              Mining Dashboard
            </h2>
            <p className="text-[10px] text-stone-300 mt-1">
              Mine cryptocurrencies efficiently
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`px-2 py-1 rounded-3xl text-[10px] font-semibold ${
              isMining ? 'bg-green-700/20 text-green-700' : 'bg-red-600/20 text-red-600'
            }`}>
              {isMining ? 'MINING ACTIVE' : 'MINING INACTIVE'}
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-3xl text-stone-300 hover:text-zinc-100"
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/...refresh-icon..."
                className={`w-3.5 h-3.5 ${refreshLoading ? 'animate-spin' : ''}`}
                alt="Refresh"
              />
            </button>
            {/* Debug toggle button */}
            <button
              onClick={() => setShowDebugTools(!showDebugTools)}
              className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-3xl text-stone-300 hover:text-zinc-100 text-xs"
              title="Toggle debug tools"
            >
              🐞
            </button>
          </div>
        </div>

        {/* Mining Tabs */}
        <MiningTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Debug Tools (Conditional) */}
      {showDebugTools && (
        <div className="w-full mt-3 p-3 rounded-3xl bg-neutral-800 border border-yellow-600/50">
          <h3 className="text-xs font-semibold text-yellow-400 mb-2">Debug Tools</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={checkEquipmentStatus}
              className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              Check Equipment
            </button>
            <button
              onClick={activateAllEquipment}
              className="px-2 py-1 text-xs bg-orange-600 hover:bg-orange-700 rounded-lg"
            >
              Activate All
            </button>
            <button
              onClick={testPurchaseEquipment}
              className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded-lg"
            >
              Test Purchase
            </button>
          </div>
        </div>
      )}
      
      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="
          w-full mt-5
          space-y-5
          md:space-y-0
          md:grid md:grid-cols-2 md:gap-5
        ">
          <MiningStats stats={{ ...stats, isMining }} />
          <MiningControls 
            isMining={isMining}
            selectedPool={selectedPool}
            onStartMining={startMining}
            onStopMining={stopMining}
            onClaimRewards={claimRewards}
          />
          {equipment.length > 0 && (
            <MiningEquipmentList 
              equipment={equipment.slice(0, 3)}
              onPurchaseEquipment={purchaseEquipment}
              detailed={false}
            />
          )}
          {rewards.length > 0 && (
            <MiningRewardsList 
              rewards={rewards.slice(0, 3)}
              onClaimRewards={claimRewards}
              detailed={false}
            />
          )}
        </div>
      )}

      {activeTab === "equipment" && (
        <MiningEquipmentList 
          equipment={equipment}
          onPurchaseEquipment={purchaseEquipment}
          detailed={true}
        />
      )}

      {activeTab === "boosters" && (
        <MiningBoostersList 
          boosters={boosters}
          activeBoosters={activeBoosters}
          onActivateBooster={activateBooster}
        />
      )}

      {activeTab === "rewards" && (
        <MiningRewardsList 
          rewards={rewards}
          onClaimRewards={claimRewards}
          detailed={true}
        />
      )}

      {activeTab === "history" && (
        <MiningHistoryList 
          history={history}
          formatDuration={formatDuration}
        />
      )}

      {activeTab === "pools" && (
        <MiningPoolsList 
          pools={pools}
          selectedPool={selectedPool}
          onSelectPool={switchPool}
        />
      )}

      {/* Message Display */}
      {message && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-[10px] ${
          message.includes('Success') || message.includes('success') || 
          message.includes('started') || message.includes('claimed') ||
          message.includes('activated') || message.includes('purchased') ||
          message.includes('Switched')
            ? 'bg-green-900/90 text-green-300' 
            : 'bg-red-900/90 text-red-300'
        }`}>
          {message}
          <button 
            onClick={() => setMessage("")}
            className="ml-4 text-stone-300 hover:text-zinc-100"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
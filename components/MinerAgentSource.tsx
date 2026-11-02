import React from 'react';
import { FileCode, Copy, Terminal, Check } from 'lucide-react';
import { motion } from 'motion/react';

const MinerAgentSource: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const cppCode = `/**
 * HTB_SENTINEL_MINER_AGENT v1.0.4
 * ICubed Studios // J_P LaForest
 * 
 * High-performance edge node telemetry broadcaster.
 */

#include <iostream>
#include <string>
#include <chrono>
#include <thread>
#include "sentinel_core.h"

class MinerAgent {
public:
    MinerAgent(std::string nodeId) : id(nodeId), active(true) {}

    void startTransmission() {
        std::cout << ">> INITIALIZING UPLINK: " << id << std::endl;
        
        while (active) {
            auto telemetry = collectMetrics();
            broadcastPacket(telemetry);
            std::this_thread::sleep_for(std::chrono::milliseconds(500));
        }
    }

private:
    std::string id;
    bool active;

    TelemetryPacket collectMetrics() {
        return {
            .cpu_load = getCPULoad(),
            .temp_c = getThermalData(),
            .fan_rpm = getFanSpeed(),
            .timestamp = std::chrono::system_clock::now()
        };
    }

    void broadcastPacket(TelemetryPacket p) {
        // Multi-path routing to SENTINEL_DATA_CORE
        Sentinel::Uplink::send("/stream/miner", p.serialize());
    }
};

int main() {
    MinerAgent agent("OPTIPLEX_3090_NODE");
    agent.startTransmission();
    return 0;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-htb-dark p-6 overflow-hidden flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
            MINER <span className="text-blue-400">SOURCE</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Target binary configuration // C++ Edge Agent</p>
        </div>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold text-gray-300 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          {copied ? 'COPIED' : 'COPY SOURCE'}
        </button>
      </div>

      <div className="flex-1 bg-black/50 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
            <FileCode className="w-3 h-3" />
            sentinel_miner_agent.cpp
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6 font-mono text-sm custom-scrollbar">
          <pre className="text-blue-300">
            {cppCode}
          </pre>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-htb-panel p-4 border border-gray-800 rounded-lg">
          <div className="text-emerald-500 text-[10px] font-black uppercase mb-2">Build Command</div>
          <code className="text-xs text-gray-400">g++ -O3 agent.cpp -lsentinel -o miner_agent</code>
        </div>
        <div className="bg-htb-panel p-4 border border-gray-800 rounded-lg">
          <div className="text-blue-500 text-[10px] font-black uppercase mb-2">Dependencies</div>
          <code className="text-xs text-gray-400">libsentinel-core // std::chrono</code>
        </div>
        <div className="bg-htb-panel p-4 border border-gray-800 rounded-lg">
          <div className="text-purple-500 text-[10px] font-black uppercase mb-2">Target OS</div>
          <div className="text-xs text-gray-400 font-mono">Linux Kernel 5.4+ // ARM64 / x86_64</div>
        </div>
      </div>
    </div>
  );
};

export default MinerAgentSource;


import React, { useState, useEffect } from 'react';
import { Database, Activity, Cpu, Thermometer, AlertTriangle, FileText, Code, CheckCircle, Smartphone, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTelemetry = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  cpu: 2 + Math.random() * 5,
  temp: 40 + Math.random() * 5,
  mem: 1.2 + Math.random() * 0.5
}));

const DataMiner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'logs' | 'patterns' | 'code'>('monitor');
  const [miningStatus, setMiningStatus] = useState('idle');

  const startMining = () => {
    setMiningStatus('mining');
    setTimeout(() => setMiningStatus('processing'), 2000);
  };

  return (
    <div className="h-full bg-htb-dark text-gray-200 overflow-hidden flex flex-col p-6 font-mono">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-blue-400 flex items-center gap-3">
            <Database className="w-8 h-8" />
            EDGE DATA MINER
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Dell Optiplex 3090 Node // Local Agent Container</p>
        </div>
        <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
           {['monitor', 'logs', 'patterns', 'code'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'monitor' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Node Real-time Telemetry</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${miningStatus === 'idle' ? 'bg-gray-500' : 'bg-blue-500 animate-pulse'}`}></span>
                    <span className="text-[10px] text-gray-500 uppercase">{miningStatus}</span>
                  </div>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTelemetry}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="time" stroke="#4b5563" fontSize={10} tickLine={false} />
                      <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                        itemStyle={{ fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" name="CPU Load %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                    <Thermometer className="w-4 h-4 text-orange-500 mx-auto mb-2" />
                    <span className="text-[9px] text-gray-600 block mb-1">NODE TEMP</span>
                    <span className="text-lg font-black text-orange-400">42.4°C</span>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                    <Activity className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
                    <span className="text-[9px] text-gray-600 block mb-1">FAN DUTY</span>
                    <span className="text-lg font-black text-emerald-400">1400 RPM</span>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                    <Cpu className="w-4 h-4 text-blue-500 mx-auto mb-2" />
                    <span className="text-[9px] text-gray-600 block mb-1">GPU COMPUTE</span>
                    <span className="text-lg font-black text-blue-400">0.0%</span>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                    <Smartphone className="w-4 h-4 text-purple-500 mx-auto mb-2" />
                    <span className="text-[9px] text-gray-600 block mb-1">EDGE LINK</span>
                    <span className="text-lg font-black text-purple-400">Nokia-3310</span>
                  </div>
                </div>
              </div>

              <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Hardware Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                     <div className="flex justify-between py-1 border-b border-gray-800">
                       <span className="text-gray-500">Model</span><span className="text-white">Optiplex 3090 Micro</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-800">
                       <span className="text-gray-500">Processor</span><span className="text-white">Intel Core i5-10500T</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-800">
                       <span className="text-gray-500">Threads</span><span className="text-white">12 Total</span>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between py-1 border-b border-gray-800">
                       <span className="text-gray-500">RAM</span><span className="text-white">64GB Dual-Channel</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-800">
                       <span className="text-gray-500">Drive Type</span><span className="text-white">NVMe Gen3 x4</span>
                     </div>
                     <div className="flex justify-between py-1 border-b border-gray-800">
                       <span className="text-gray-500">Status</span><span className="text-emerald-500 font-bold">HEALTHY</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-htb-panel border border-gray-700 rounded-xl p-5">
                 <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Agent API Operations
                 </h3>
                 <div className="space-y-4">
                    <button 
                      onClick={startMining}
                      className="w-full py-3 bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-black rounded hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                    >
                      INITIALIZE MINING SEQUENCE
                    </button>
                    <button className="w-full py-3 bg-gray-800 border border-gray-700 text-gray-400 text-[10px] font-black rounded hover:bg-gray-700 transition-all uppercase tracking-widest">
                       Generate Insight Report
                    </button>
                    <div className="pt-4 border-t border-gray-800">
                       <p className="text-[10px] text-gray-500 mb-3 tracking-widest">API ENDPOINTS</p>
                       <div className="space-y-2 font-mono text-[9px]">
                          <div className="flex justify-between bg-black/40 p-2 rounded">
                             <span className="text-blue-400">GET /status</span><span className="text-emerald-500">READY</span>
                          </div>
                          <div className="flex justify-between bg-black/40 p-2 rounded">
                             <span className="text-blue-400">GET /patterns</span><span className="text-emerald-500">READY</span>
                          </div>
                          <div className="flex justify-between bg-black/40 p-2 rounded">
                             <span className="text-blue-400">POST /report</span><span className="text-gray-600">IDLE</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-blue-900/10 border border-blue-900/30 rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <AlertTriangle className="w-16 h-16 text-blue-400" />
                </div>
                <h3 className="text-xs font-black uppercase text-blue-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Recent Anomalies
                </h3>
                <div className="space-y-3">
                   <div className="p-2 bg-gray-900/50 rounded border-l-2 border-blue-500">
                      <p className="text-[10px] text-gray-300">Thermal Creep Detected</p>
                      <p className="text-[8px] text-gray-500">+0.05% spike above baseline</p>
                   </div>
                   <div className="p-2 bg-gray-900/50 rounded border-l-2 border-orange-500">
                      <p className="text-[10px] text-gray-300">Windows Log: Auth Failure</p>
                      <p className="text-[8px] text-gray-500">EventID 4625 :: Repeats 4x</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="h-full bg-htb-panel border border-gray-700 rounded-xl overflow-hidden flex flex-col font-mono">
            <div className="bg-gray-900 p-2 border-b border-gray-800 flex items-center justify-between">
              <div className="flex gap-4 px-2">
                 <span className="text-[10px] text-blue-400 font-bold">miner.py</span>
                 <span className="text-[10px] text-gray-500">server.py</span>
                 <span className="text-[10px] text-gray-500">patterns.py</span>
                 <span className="text-[10px] text-gray-500">audit_bot.cpp</span>
              </div>
              <Code className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 overflow-auto p-6 bg-black/40 text-[11px] leading-relaxed relative">
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-900/50 flex flex-col items-center pt-6 text-gray-700 border-r border-gray-800">
                 {Array.from({length: 30}).map((_, i) => <div key={i} className="mb-0.5">{i+1}</div>)}
              </div>
              <div className="pl-8 space-y-0.5">
                <p><span className="text-pink-500">import</span> psutil, time, logging</p>
                <p><span className="text-pink-500">from</span> data_miner.core <span className="text-pink-500">import</span> AnomalyEngine</p>
                <p className="text-gray-500"># OPTIPLEX 3090 HW PROFILE AGENT</p>
                <p><span className="text-pink-500">class</span> <span className="text-blue-400">MinerAgent</span>:</p>
                <p className="pl-4"><span className="text-pink-500">def</span> <span className="text-emerald-400">__init__</span>(self):</p>
                <p className="pl-8">self.engine = AnomalyEngine(sensitivity=<span className="text-orange-400">0.85</span>)</p>
                <p className="pl-8">self.hw_id = <span className="text-orange-400">"DELL_OPTIPLEX_3090_NODE_X"</span></p>
                <p className="pl-4 text-gray-500 mt-2"># Collect Windows Event Logs and HW Telemetry</p>
                <p className="pl-4"><span className="text-pink-500">def</span> <span className="text-emerald-400">mine_telemetry</span>(self):</p>
                <p className="pl-8">stats = psutil.cpu_percent(interval=<span className="text-orange-400">1</span>)</p>
                <p className="pl-8">thermal = self.get_thermal_creep()</p>
                <p className="pl-8"><span className="text-pink-500">return</span> self.engine.analyze(stats, thermal)</p>
                <p className="pl-4 mt-2"><span className="text-pink-500">def</span> <span className="text-emerald-400">main_loop</span>(self):</p>
                <p className="pl-8"><span className="text-pink-500">while</span> <span className="text-pink-500">True</span>:</p>
                <p className="pl-12">raw_data = self.mine_telemetry()</p>
                <p className="pl-12">self.push_to_ledger(raw_data)</p>
                <p className="pl-12">time.sleep(<span className="text-orange-400">5</span>)</p>
                <p className="text-gray-500 mt-4"># --- END AGENT CODE ---</p>
              </div>
              <div className="sticky bottom-0 right-0 bg-htb-panel border border-gray-700 p-3 rounded-lg flex items-center gap-3 float-right m-4 shadow-2xl">
                 <div className="p-2 bg-emerald-500/20 rounded shadow-inner">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-white uppercase">Agent Compiled</p>
                    <p className="text-[9px] text-gray-500">Bytecode verified against HSM signature</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback for other tabs */}
        {(activeTab === 'logs' || activeTab === 'patterns') && (
           <div className="h-full flex items-center justify-center bg-htb-panel border border-gray-700 rounded-xl text-gray-600 italic">
              Module loading... [RE-LINKING AGENT CONTAINER]
           </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="mt-6 bg-htb-panel border-t border-gray-700 -mx-6 -mb-6 px-6 py-2 flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-500">
        <div className="flex gap-4">
            <span className="flex items-center gap-1 font-black text-blue-400"><Server className="w-3 h-3" /> NODE: OPTIPLEX-3090-OFFLINE</span>
            <span className="text-gray-600">//</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> ICUBED_UPLINK: SYNCED</span>
        </div>
        <div className="flex gap-4">
            <span>DEV: J_P_LAFOREST</span>
            <span>MEM: 12.4 GB / 64GB</span>
        </div>
      </div>
    </div>
  );
};

export default DataMiner;

import React from 'react';
import { Share2, ArrowRight, Shield, Zap, Cpu, Database, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const DataFlowDiagram: React.FC = () => {
  return (
    <div className="h-full bg-htb-dark p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">
            SENTINEL <span className="text-purple-500">DATA_FLOW</span>
          </h2>
          <p className="text-sm text-gray-500 font-mono uppercase tracking-widest leading-relaxed">
            Full System Architecture // Frontend ↔ Miner ↔ Multi-Path Backend
          </p>
        </div>

        {/* Diagram Visualization */}
        <div className="relative bg-black/40 border border-gray-800 rounded-3xl p-12 mb-12 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05),transparent_70%)]"></div>
          
          <div className="relative z-10 space-y-16">
            
            {/* Input Tier */}
            <div className="flex justify-center gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/50 rounded-2xl flex items-center justify-center mb-3">
                  <Activity className="text-blue-400 w-8 h-8" />
                </div>
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">WebSocket In</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/50 rounded-2xl flex items-center justify-center mb-3">
                  <Cpu className="text-emerald-400 w-8 h-8" />
                </div>
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Miner Telemetry</div>
              </motion.div>
            </div>

            {/* Router Node */}
            <div className="flex justify-center relative">
               <div className="absolute top-0 -translate-y-full w-px h-16 bg-gradient-to-t from-purple-500 to-transparent"></div>
               <motion.div 
                 animate={{ scale: [1, 1.05, 1] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 className="w-40 h-40 rounded-full border-4 border-purple-500/20 bg-purple-500/5 flex items-center justify-center relative shadow-[0_0_50px_rgba(168,85,247,0.1)]"
               >
                 <div className="absolute inset-0 border-2 border-purple-500/40 rounded-full animate-ping opacity-20"></div>
                 <div className="text-center">
                    <Database className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                    <div className="text-xs font-black text-white italic tracking-tighter uppercase">Multi-Path</div>
                    <div className="text-[8px] text-purple-400 font-mono tracking-widest">ROUTER</div>
                 </div>
               </motion.div>
            </div>

            {/* Output Pipelines */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {[
                 { name: "Threat Analysis", icon: <Shield />, color: "text-red-400", bg: "bg-red-400/10" },
                 { name: "Data Ingestion", icon: <Share2 />, color: "text-blue-400", bg: "bg-blue-400/10" },
                 { name: "Behavioral Risk", icon: <Activity />, color: "text-yellow-400", bg: "bg-yellow-400/10" },
                 { name: "System Logs", icon: <FileCode />, color: "text-gray-400", bg: "bg-gray-400/10" }
               ].map((pipe, i) => (
                 <motion.div 
                   key={pipe.name}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.4 + (i * 0.1) }}
                   className={`${pipe.bg} border border-white/5 rounded-2xl p-6 text-center`}
                 >
                   <div className={`${pipe.color} mb-3 flex justify-center`}>
                     {React.cloneElement(pipe.icon as React.ReactElement, { className: "w-6 h-6" })}
                   </div>
                   <div className="text-[10px] font-black text-white uppercase tracking-tighter italic">{pipe.name}</div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>

        {/* Legend / Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-htb-panel border border-gray-800 rounded-2xl p-8">
             <h4 className="text-white font-bold text-lg mb-4 italic tracking-tight">Routing Logic</h4>
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                   <div className="text-xs text-gray-500 leading-relaxed"><span className="text-gray-300 font-bold uppercase">Classification:</span> Real-time parsing and type-tagging for all incoming telemetry packets.</div>
                </li>
                <li className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                   <div className="text-xs text-gray-500 leading-relaxed"><span className="text-gray-300 font-bold uppercase">Dynamic Routing:</span> Deterministic path selection based on risk profile and operational context.</div>
                </li>
             </ul>
           </div>
           <div className="bg-htb-panel border border-gray-800 rounded-2xl p-8">
             <h4 className="text-white font-bold text-lg mb-4 italic tracking-tight">System Performance</h4>
             <div className="space-y-4">
                <div>
                   <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">Throughput Capacity</div>
                   <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-purple-500"></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2">Inference Latency</div>
                   <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                      <div className="w-[15%] h-full bg-emerald-500"></div>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const FileCode = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export default DataFlowDiagram;

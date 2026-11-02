import React from 'react';
import { Shield, Mail, Zap, Cpu, Database, Binary, Activity, Box, Terminal, Globe, Lock, Eye, BookOpen, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveView } from '../types';

interface LandingPageProps {
  setActiveView: (view: ActiveView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setActiveView }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full overflow-y-auto bg-htb-dark text-gray-200 custom-scrollbar relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
        <Shield className="w-[500px] h-[500px] text-emerald-500" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10 font-sans">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Zap className="w-3 h-3" />
            System Fully Operational
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic">
            HTB SENTINEL <span className="text-emerald-500">MASTER</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Enterprise-grade cybersecurity command center with multi-layered AI defense, 
            real-time telemetry, and Microsoft-centric infrastructure integration.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button 
              onClick={() => setActiveView('tactical')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-htb-dark font-black rounded-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105"
            >
              LAUNCH COMMAND CENTER
            </button>
            <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-lg border border-gray-700 transition-all uppercase text-sm tracking-widest">
              View Documentation
            </button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32"
        >
          {/* Core Systems */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter italic">
              <Shield className="w-8 h-8 text-emerald-500" />
              Core Defense Systems
            </h2>
            
            <div className="space-y-6">
              <div className="group border-l-2 border-gray-800 hover:border-emerald-500 pl-6 transition-all">
                <h3 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Gmail Sentinel Pro Suite
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400">
                  Autonomous 30-feature security engine featuring AI Phishing Shields, 2FA Orchestration, 
                  Session Leashing, and DLP Kill-Chains with visual audit scanning.
                </p>
              </div>

              <div className="group border-l-2 border-gray-800 hover:border-emerald-500 pl-6 transition-all">
                <h3 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Enterprise AI Shield
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400">
                  Hardened security matrix implementing Adversarial Training, Dynamic Risk Scoring, 
                  Behavioral Biometrics, and Self-Healing Configurations.
                </p>
              </div>

              <div className="group border-l-2 border-gray-800 hover:border-emerald-500 pl-6 transition-all">
                <h3 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Microsoft-Centric Hooks
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400">
                  Production-ready conceptual integrations with Azure Entra, Purview DLP, 
                  and TPM 2.0 Entropy sources for root-of-trust operations.
                </p>
              </div>

              <div className="group border-l-2 border-gray-800 hover:border-emerald-500 pl-6 transition-all">
                <h3 className="text-lg font-bold text-emerald-400 mb-1 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> XAI Explainability Layer
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400">
                  Deep provenance metadata tracking provides human-readable context and 
                  remediation logic for every AI-driven security decision.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Integrated Console Info */}
          <motion.div variants={itemVariants} className="space-y-8 flex flex-col justify-center">
            <div className="bg-htb-panel border border-gray-800 p-8 rounded-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               <h3 className="text-xl font-black text-white mb-4 uppercase italic flex items-center gap-3">
                 <Terminal className="w-6 h-6 text-emerald-500" /> Command Capability
               </h3>
               <p className="text-gray-400 leading-relaxed mb-6">
                 Sentinel Master provides a unified interface for tactical response, enterprise security audit, 
                 and automated sentinel surveillance. All modules are backed by high-performance intelligence 
                 engines and real-time telemetry pipelines.
               </p>
               <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg font-mono text-[10px] text-gray-500">
                  <div className="flex justify-between mb-1">
                     <span>THREAT_CORE:</span>
                     <span className="text-emerald-500">ONLINE</span>
                  </div>
                  <div className="flex justify-between mb-1">
                     <span>SECURITY_PROTOCOLS:</span>
                     <span className="text-blue-500">ENFORCED</span>
                  </div>
                  <div className="flex justify-between">
                     <span>AI_INTELLIGENCE:</span>
                     <span className="text-purple-500">v2.1.0_READY</span>
                  </div>
               </div>
            </div>

            <div className="bg-blue-900/10 border border-blue-900/20 p-6 rounded-xl">
               <h3 className="text-sm font-black text-blue-400 mb-2 uppercase italic flex items-center gap-2">
                 <Database className="w-4 h-4" /> Data Integrity
               </h3>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Experience unified navigation between TACTICAL, ENT_SEC, and SENTINEL environments 
                 with live transactional consistency and deep forensic logging.
               </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Infrastructure Highlights */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gray-900/40 border border-gray-800 rounded-2xl p-10 mb-20 shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 p-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-mono transform rotate-45 translate-x-4 -translate-y-1 w-24 text-center">
            SECURE_ID
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <div className="text-center">
                <div className="text-2xl font-black text-white mb-1 tracking-tighter italic">Cyberpunk</div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">Swiss-Modern Aesthetic</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-black text-white mb-1 tracking-tighter italic">Matter.js</div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">Physics Core</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-black text-white mb-1 tracking-tighter italic">Tailwind</div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">Post-CSS Styling</div>
             </div>
             <div className="text-center">
                <div className="text-2xl font-black text-white mb-1 tracking-tighter italic">Motion</div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest">Framer Animation</div>
             </div>
          </div>
        </motion.div>

        <footer className="text-center pb-20">
           <p className="text-[10px] text-gray-400 font-mono uppercase tracking-[0.4em] mb-2">
             Created by J_P LaForest // ICubed Studios
           </p>
           <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.4em]">
             Authorized Use Only // HTB_SENTINEL_MASTER_v1.0.4
           </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

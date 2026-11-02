import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileSearch, Eye, Activity, Database, Users, Globe, AlertTriangle, CheckCircle, Zap, Cpu, Server, Microscope } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const threatTrendData = [
  { time: '00:00', threats: 12 },
  { time: '04:00', threats: 15 },
  { time: '08:00', threats: 45 },
  { time: '12:00', threats: 30 },
  { time: '16:00', threats: 60 },
  { time: '20:00', threats: 25 },
  { time: '23:59', threats: 10 },
];

interface SecurityMetric {
  label: string;
  value: string | number;
  status: 'optimal' | 'warning' | 'critical';
}

interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  tenant: string;
  action: string;
  signature: string;
}

const EnterpriseSecurity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dlp' | 'prompts' | 'federated' | 'remediation' | 'intel' | 'hardware' | 'hardening'>('overview');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [explainLevel, setExplainLevel] = useState<'pro' | 'elif5'>('pro');
  const [injectionScore, setInjectionScore] = useState(0.05);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Stats for the "30 Features" Dashboard
  const metrics: SecurityMetric[] = [
    { label: 'Tenant Isolation', value: 'Active', status: 'optimal' },
    { label: 'Purview DLP', value: 'Redacting', status: 'optimal' },
    { label: 'Prompt Security', value: '99.8%', status: 'optimal' },
    { label: 'Zero-Trust Gate', value: 'HSM Active', status: 'optimal' },
    { label: 'Auto-Remediation', value: 'Enabled', status: 'optimal' },
    { label: 'XAI Confidence', value: '0.94', status: 'optimal' },
  ];

  const addLog = (event: string, action: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toISOString(),
      event,
      tenant: 'MS-ENT-HTB-01',
      action,
      signature: `sha256:${Math.random().toString(36).substring(2, 12)}...`
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setInjectionScore(Math.random());
    setTimeout(() => {
      setIsAnalyzing(false);
      addLog('Prompt Analysis', 'Injection check completed');
    }, 1500);
  };

  useEffect(() => {
    addLog('System Initialization', 'Enterprise Boundary Established');
  }, []);

  const SkooterInsight: React.FC<{ pro: string, elif5: string }> = ({ pro, elif5 }) => (
    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Zap className="w-8 h-8 text-htb-accent" />
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Skooter Intelligence Node
        </span>
        <div className="flex bg-black/50 rounded-md p-0.5 border border-gray-800">
           <button 
             onClick={() => setExplainLevel('pro')}
             className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${explainLevel === 'pro' ? 'bg-htb-accent text-htb-dark' : 'text-gray-600'}`}
           >PRO</button>
           <button 
             onClick={() => setExplainLevel('elif5')}
             className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${explainLevel === 'elif5' ? 'bg-htb-accent text-htb-dark' : 'text-gray-600'}`}
           >LI5</button>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-300">
        {explainLevel === 'pro' ? pro : elif5}
      </p>
    </div>
  );

  return (
    <div className="h-full bg-htb-dark text-gray-200 font-sans overflow-hidden flex flex-col">
      {/* Dashboard Header */}
      <div className="bg-htb-panel border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-htb-accent/20 rounded-lg">
            <Shield className="text-htb-accent w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ENTERPRISE AI GUARDIAN</h1>
            <p className="text-xs text-gray-400 font-mono">Microsoft Azure Hybrid Security Integration</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded border border-gray-700 text-xs">
            <Globe className="w-3 h-3 text-htb-accent" />
            <span className="font-mono">TENANT: <span className="text-htb-accent">MS-ENT-HTB-01</span></span>
          </div>
          <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded border border-gray-700 text-xs">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span className="font-mono text-emerald-500">M-TLS ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-htb-dark border-r border-gray-700 p-4 flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-2">Security Pillars</h3>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'overview' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Activity className="w-4 h-4" />
            Control Center
          </button>
          <button 
            onClick={() => setActiveTab('dlp')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'dlp' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <FileSearch className="w-4 h-4" />
            Purview DLP Hooks
          </button>
          <button 
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'prompts' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Zap className="w-4 h-4" />
            Injection Defense
          </button>
          <button 
            onClick={() => setActiveTab('federated')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'federated' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Users className="w-4 h-4" />
            Federated Learning
          </button>
          <button 
            onClick={() => setActiveTab('remediation')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'remediation' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Activity className="w-4 h-4" />
            Auto-Remediation
          </button>
          <button 
            onClick={() => setActiveTab('intel')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'intel' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Microscope className="w-4 h-4" />
            Threat Intel
          </button>
          <button 
            onClick={() => setActiveTab('hardware')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'hardware' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Server className="w-4 h-4" />
            Node HW Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('hardening')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${activeTab === 'hardening' ? 'bg-htb-accent/10 text-htb-accent border border-htb-accent/30' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Next-Gen Hardening
          </button>
          
          <div className="mt-auto pt-4 border-t border-gray-800">
             <div className="bg-htb-panel rounded p-3 text-[10px] font-mono text-gray-500">
                <p>STATUS: PROTECTED</p>
                <p>LAST AUDIT: 2M AGO</p>
                <p>VERSION: 2.4.0-ENT</p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-htb-dark/50">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {metrics.map((metric, i) => (
              <div key={i} className="bg-htb-panel border border-gray-700/50 p-4 rounded-xl shadow-lg">
                <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">{metric.label}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-mono font-bold ${metric.status === 'optimal' ? 'text-gray-100' : 'text-orange-400'}`}>
                    {metric.value}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${metric.status === 'optimal' ? 'bg-htb-accent' : 'bg-orange-500'}`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Feature View */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-htb-panel border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <Zap className="w-32 h-32 text-htb-accent/5 -rotate-12 pointer-events-none" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                       <h3 className="text-lg font-bold flex items-center gap-2">
                          <Shield className="w-5 h-5 text-htb-accent" />
                          Enterprise Adaptive Shield
                       </h3>
                       <div className="flex bg-gray-950 rounded-lg p-0.5 border border-gray-800">
                          <button 
                            onClick={() => setExplainLevel('pro')}
                            className={`px-2 py-1 text-[10px] font-bold rounded ${explainLevel === 'pro' ? 'bg-htb-accent text-htb-dark' : 'text-gray-500'}`}
                          >PRO</button>
                          <button 
                            onClick={() => setExplainLevel('elif5')}
                            className={`px-2 py-1 text-[10px] font-bold rounded ${explainLevel === 'elif5' ? 'bg-htb-accent text-htb-dark' : 'text-gray-500'}`}
                          >ELIF5</button>
                       </div>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={explainLevel}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mb-6"
                      >
                        {explainLevel === 'pro' ? (
                          <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
                            Real-time boundary enforcement utilizing Microsoft Entra ID claims. This node enforces 
                            tenant isolation and cryptographically verifies every token before model inference.
                          </p>
                        ) : (
                          <p className="text-xs text-emerald-400/80 max-w-lg leading-relaxed italic">
                            "Think of this as a super strong castle gate. It makes sure only family members can come in, 
                            and it scans everyone's IDs to make sure nobody is wearing a disguise!"
                          </p>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase">Tenant Verification</span>
                          <CheckCircle className="w-4 h-4 text-htb-accent" />
                        </div>
                        <p className="text-sm font-mono text-htb-accent">MS-ENT-HTB-01 :: VERIFIED</p>
                      </div>
                      <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase">Cryptographic Chain</span>
                          <Lock className="w-4 h-4 text-htb-accent" />
                        </div>
                        <p className="text-sm font-mono text-htb-accent">HSM-HARDENED</p>
                      </div>
                    </div>

                    <div className="h-48 w-full mt-4 bg-gray-950/50 rounded-lg p-4 border border-gray-800">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Active Threat Flux (24H)</p>
                      <ResponsiveContainer width="100%" height="80%">
                        <AreaChart data={threatTrendData}>
                          <defs>
                            <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                          <XAxis dataKey="time" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #2d3748', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#10b981' }}
                          />
                          <Area type="monotone" dataKey="threats" stroke="#10b981" fillOpacity={1} fill="url(#colorThreat)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-htb-panel border border-gray-700 rounded-xl p-5">
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-purple-400" />
                        Explainability Layer (XAI)
                      </h4>
                      <div className="space-y-3 font-mono text-xs">
                        <div className="bg-gray-950 p-3 rounded">
                           <p className="text-gray-500 mb-1">// Decision Provenance</p>
                           <p><span className="text-purple-400">confidence:</span> 0.94</p>
                           <p><span className="text-purple-400">retrieval_id:</span> KB-2045-A</p>
                           <p><span className="text-purple-400">policy:</span> GDPR_ART_32_COMPLIANT</p>
                        </div>
                        <p className="text-gray-400 leading-relaxed italic">
                          "Connection terminated based on anomalous entropy in RDP baseline."
                        </p>
                      </div>
                    </div>
                    <div className="bg-htb-panel border border-gray-700 rounded-xl p-5">
                      <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                        <Database className="w-4 h-4 text-orange-400" />
                        Provenance Metadata
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 border-b border-gray-800">
                          <span className="text-xs text-gray-500">Model Version</span>
                          <span className="text-xs font-mono">GPT-4-V.2</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-800">
                          <span className="text-xs text-gray-500">Data Source</span>
                          <span className="text-xs font-mono">GraphRAG-Internal</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-800">
                          <span className="text-xs text-gray-500">Inference Mode</span>
                          <span className="text-xs font-mono">Shielded-Batch</span>
                        </div>
                        <div className="mt-4 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] text-orange-400 flex items-center gap-2">
                           <AlertTriangle className="w-3 h-3" />
                           Audit logs exported to Immutable Data Lake every 10 mins.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dlp' && (
                <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <FileSearch className="w-5 h-5 text-htb-accent" />
                     Microsoft Purview DLP Hooks
                  </h3>
                  <SkooterInsight 
                    pro="Simulated classification of outgoing model prompts. Detects PII, PHI, and credentials before they leave the enterprise boundary."
                    elif5="This is like a secret code checker. It makes sure you don't accidentally tell the robot your home address or your bank password!"
                  />
                  <div className="space-y-4 mt-6">
                    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                      <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Input Simulation</h4>
                      <div className="bg-htb-dark p-3 rounded font-mono text-sm border border-gray-800">
                        "Send my email address <span className="text-red-400">admin@microsoft.com</span> and credit card <span className="text-red-400">4111-XXXX-XXXX</span> to the bot."
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-4">
                       <Zap className="w-6 h-6 text-htb-accent animate-pulse" />
                    </div>
                    <div className="bg-emerald-950/20 border border-emerald-900 p-4 rounded-lg">
                      <h4 className="text-xs font-bold text-emerald-500 mb-2 uppercase">Purview Output (Redacted)</h4>
                      <div className="bg-htb-dark p-3 rounded font-mono text-sm border border-emerald-900/50">
                        "Send my email address <span className="text-htb-accent">[REDACTED_EMAIL]</span> and credit card <span className="text-htb-accent">[REDACTED_PII]</span> to the bot."
                      </div>
                      <div className="mt-3 flex gap-2">
                         <span className="px-2 py-0.5 bg-htb-accent text-htb-dark text-[10px] font-bold rounded">INFO_TYPE: EMAIL_ADDR</span>
                         <span className="px-2 py-0.5 bg-htb-accent text-htb-dark text-[10px] font-bold rounded">INFO_TYPE: CC_NUMBER</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'prompts' && (
                <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Zap className="w-5 h-5 text-orange-500" />
                     Prompt Injection Detector
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <p className="text-sm text-gray-400 mb-4 font-sans">
                        Analyzes linguistic entropy and sequence anomalies to detect manipulative prompts designed to bypass model guardrails.
                      </p>
                      <button 
                        onClick={simulateAnalysis}
                        disabled={isAnalyzing}
                        className="w-full py-3 px-4 bg-htb-accent text-htb-dark font-bold rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                      >
                        {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        Run Adversarial Scraper
                      </button>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-800"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 * (1 - injectionScore)}
                            className={`transition-all duration-1000 ${injectionScore > 0.7 ? 'text-red-500' : injectionScore > 0.4 ? 'text-orange-500' : 'text-htb-accent'}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold font-mono">{(injectionScore * 100).toFixed(1)}%</span>
                          <span className="text-[10px] text-gray-500 uppercase">Inpurity</span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs font-mono text-gray-400">
                        {injectionScore > 0.7 ? 'CRITICAL: Injection Detected' : injectionScore > 0.4 ? 'WARNING: High Entropy' : 'SECURE: Benign Input'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'federated' && (
                <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Users className="w-5 h-5 text-blue-400" />
                     Federated Learning & Swarm Intelligence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Peer Distribution</h4>
                        <div className="flex items-end gap-1 h-20">
                           {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                             <div key={i} className="flex-1 bg-blue-500/40 border-t border-blue-400" style={{height: `${h}%`}}></div>
                           ))}
                        </div>
                        <div className="flex justify-between mt-2 text-[10px] font-mono text-gray-500">
                           <span>NODE_A</span>
                           <span>482 PEERS ACTIVE</span>
                        </div>
                      </div>
                      <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg text-xs leading-relaxed text-blue-300 italic">
                         "Sharing anonymized IoCs via Differential Privacy. Local model weights updated with global swarm vectors."
                      </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
                       <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase">Integrity Verification</h4>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3">
                             <CheckCircle className="w-4 h-4 text-htb-accent" />
                             <span className="text-xs">Differential Privacy Gating</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <CheckCircle className="w-4 h-4 text-htb-accent" />
                             <span className="text-xs">Confidential Compute Enclave</span>
                          </div>
                          <div className="flex items-center gap-3 text-orange-400">
                             <AlertTriangle className="w-4 h-4" />
                             <span className="text-xs">Silo Anomaly Detected (Rejected)</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'intel' && (
                <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Microscope className="w-5 h-5 text-purple-400" />
                     HTB Threat Intelligence Library
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { id: 1, name: "Phishing", desc: "Tricking users with fake emails/sites.", defense: "ML Content Scoring" },
                      { id: 2, name: "Social Engineering", desc: "Manipulating people to break protocols.", defense: "Behavioral Baselines" },
                      { id: 3, name: "Malware", desc: "Infecting systems with malicious code.", defense: "Static/Dynamic Analysis" },
                      { id: 4, name: "Brute Force", desc: "Systematic guessing of credentials.", defense: "Adaptive Rate Limiting" },
                      { id: 5, name: "Man-in-the-Middle", desc: "Intercepting communication streams.", defense: "Zero-Trust mTLS" },
                      { id: 6, name: "SQL Injection", desc: "Malicious queries to databases.", defense: "Input Sanitization Hooks" },
                      { id: 7, name: "Cross-Site Scripting", desc: "Injecting scripts into web pages.", defense: "Output Encoding Filters" },
                      { id: 8, name: "Unpatched Vulns", desc: "Exploiting known software bugs.", defense: "Automated SBOM Checks" },
                      { id: 9, name: "DoS/DDoS", desc: "Overloading services or networks.", defense: "Azure Front Door WAF" },
                      { id: 10, name: "Zero-Day", desc: "Attacks on unknown vulnerabilities.", defense: "Entropy Drift Detection" },
                      { id: 11, name: "Credential Stuffing", desc: "Using stolen logins from other sites.", defense: "Multi-Factor Gating" },
                      { id: 12, name: "Privilege Escalation", desc: "Gaining unauthorized access levels.", defense: "Least-Privilege Enforcement" },
                      { id: 13, name: "Eavesdropping", desc: "Unauthorized signal interception.", defense: "Hardened Encryption" },
                      { id: 14, name: "Session Hijacking", desc: "Taking over active user sessions.", defense: "Secure Token Exchange" },
                      { id: 15, name: "Malicious Insider", desc: "Threats from within organization.", defense: "Anomaly Scoring Swarm" }
                    ].map((strategy) => (
                      <div key={strategy.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg hover:border-purple-500/30 transition-all group">
                         <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] font-bold text-purple-400 uppercase">Vector 0x{strategy.id.toString(16).padStart(2, '0')}</span>
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:animate-ping"></div>
                         </div>
                         <h4 className="text-sm font-bold text-white mb-1">{strategy.name}</h4>
                         <p className="text-[11px] text-gray-500 mb-3">{strategy.desc}</p>
                         <div className="pt-2 border-t border-gray-800">
                           <span className="text-[9px] font-bold text-gray-600 uppercase">Sentinel Defense:</span>
                           <p className="text-[10px] text-htb-accent font-mono mt-1">{strategy.defense}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hardening' && (
                <div className="bg-htb-panel border border-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Shield className="w-5 h-5 text-emerald-400" />
                     Advanced Security Hardening Modules
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 font-mono uppercase tracking-widest">Enterprise-Grade AI Defense Matrix</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: "Adversarial Training", desc: "Exposing models to malicious prompts during fine-tuning to build intrinsic robustness.", icon: <Microscope className="w-4 h-4" /> },
                      { name: "Dynamic Risk Scoring", desc: "Real-time evaluation of user intent and response sensitivity with adaptive behavior.", icon: <Activity className="w-4 h-4" /> },
                      { name: "MFA Authentication", desc: "In-chat multi-factor handshakes for high-risk operations or sensitive data access.", icon: <Lock className="w-4 h-4" /> },
                      { name: "Behavioral Biometrics", desc: "Analyzing keystroke dynamics and linguistic fingerprints to verify continuous identity.", icon: <Eye className="w-4 h-4" /> },
                      { name: "Auto Threat Intel", desc: "Automated ingestion of global IoC feeds to update detection heuristics in real-time.", icon: <Database className="w-4 h-4" /> },
                      { name: "Encrypted Sessions", desc: "End-to-end encryption (E2EE) for conversational data with client-side key derivation.", icon: <Shield className="w-4 h-4" /> },
                      { name: "Granular RBAC", desc: "Fine-grained permission nodes limiting chat capabilities based on enterprise clearance.", icon: <Users className="w-4 h-4" /> },
                      { name: "Anomaly Detection", desc: "ML models detecting deviation from established user behavior baselines.", icon: <Activity className="w-4 h-4" /> },
                      { name: "Secure Code Review", desc: "Integrated assistant checking shared snippets for OWASP Top 10 vulnerabilities.", icon: <CheckCircle className="w-4 h-4" /> },
                      { name: "Incident Integration", desc: "Direct uplink to SIEM/SOAR platforms for automated response orchestration.", icon: <Zap className="w-4 h-4" /> },
                      { name: "Privacy Processing", desc: "Implementing Differential Privacy and Federated Learning for data minimization.", icon: <Lock className="w-4 h-4" /> },
                      { name: "Compliance Engine", desc: "Automated auditing for GDPR, HIPAA, and CCPA regulatory alignment.", icon: <FileSearch className="w-4 h-4" /> },
                      { name: "Zero-Knowledge Ops", desc: "Processing sensitive queries without storing or exposing full content in cleartext.", icon: <Database className="w-4 h-4" /> },
                      { name: "Cross-Platform Sync", desc: "Correlating security events across firewalls, EDR, and cloud infrastructure.", icon: <Globe className="w-4 h-4" /> },
                      { name: "Self-Healing Config", desc: "Automated remediation of detected security posture drift and vulnerabilities.", icon: <Activity className="w-4 h-4" /> }
                    ].map((mod, i) => (
                      <div key={i} className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:border-emerald-500/30 transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="p-1.5 bg-emerald-500/10 rounded text-emerald-400">
                             {mod.icon}
                           </div>
                           <h4 className="text-xs font-black uppercase text-white tracking-tight">{mod.name}</h4>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">{mod.desc}</p>
                        <div className="mt-3 flex items-center justify-between">
                           <span className="text-[8px] font-mono text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded">STATUS: ARMED</span>
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hardware' && (
                <div className="bg-htb-panel border border-gray-700 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 opacity-5">
                    <Server className="w-64 h-64 text-htb-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Cpu className="w-5 h-5 text-htb-accent" />
                     Node HW Profile: Dell Optiplex 3090
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-4">
                       <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Compute Specifications</h4>
                          <div className="space-y-2 font-mono text-xs">
                             <div className="flex justify-between"><span>Processor</span><span className="text-white">Intel Core i5-10500T</span></div>
                             <div className="flex justify-between"><span>Clock Speed</span><span className="text-white">2.3GHz (Turbo 3.8GHz)</span></div>
                             <div className="flex justify-between"><span>Cores/Threads</span><span className="text-white">6 / 12</span></div>
                             <div className="flex justify-between"><span>RAM Config</span><span className="text-white">64GB DDR4 2666MHz</span></div>
                          </div>
                       </div>
                       <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Storage & Entropy</h4>
                          <div className="space-y-2 font-mono text-xs">
                             <div className="flex justify-between"><span>Drive 0 (System)</span><span className="text-white">NVMe Gen3 x4 1TB</span></div>
                             <div className="flex justify-between"><span>Drive 1 (Ledger)</span><span className="text-white">Enterprise SSD 2TB</span></div>
                             <div className="flex justify-between"><span>Entropy Source</span><span className="text-white">TPM 2.0 Hardened</span></div>
                             <div className="flex justify-between pt-2 border-t border-gray-800 mt-2">
                               <span className="text-blue-400 italic">Edge Link</span>
                               <span className="text-white font-bold">Nokia-3310-RetroBridge</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg h-full">
                          <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Environmental Sensors</h4>
                          <div className="space-y-4">
                             <div>
                                <div className="flex justify-between text-[10px] mb-1"><span>Core Temp</span><span>42°C / 75°C</span></div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-htb-accent" style={{ width: '42%' }}></div>
                                </div>
                             </div>
                             <div>
                                <div className="flex justify-between text-[10px] mb-1"><span>Thermal Creep</span><span>0.02% / SEC</span></div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500" style={{ width: '12%' }}></div>
                                </div>
                             </div>
                             <div>
                                <div className="flex justify-between text-[10px] mb-1"><span>Fan Duty</span><span>1200 RPM</span></div>
                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                   <div className="h-full bg-fuchsia-500" style={{ width: '25%' }}></div>
                                </div>
                             </div>
                          </div>
                          <div className="mt-8 p-3 bg-htb-accent/5 border border-htb-accent/20 rounded text-[10px] text-htb-accent leading-relaxed">
                            <Zap className="w-3 h-3 inline mr-1" />
                            Node operating within optimal thermal parameters. Edge inference performance: STABLE.
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Audit Log Panel */}
            <div className="space-y-4">
              <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 h-full flex flex-col">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex justify-between">
                   Immutable Audit Ledger
                   <span className="text-htb-accent animate-pulse">● LIVE</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px]">
                  {logs.map(log => (
                    <div key={log.id} className="p-2 border-l-2 border-htb-accent bg-gray-900/50 rounded shadow-sm hover:bg-gray-900 transition-all">
                       <div className="flex justify-between text-gray-500 mb-1">
                          <span>{log.id}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                       </div>
                       <p className="text-gray-200">{log.event}</p>
                       <p className="text-gray-500 italic mt-1">{log.signature}</p>
                    </div>
                  ))}
                  {logs.length === 0 && <p className="text-center text-gray-600 italic py-10">Establishing secure ledger...</p>}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center px-1">
                   <span className="text-[10px] text-gray-600">DB: AZURE_LOG_ANALYTICS</span>
                   <button onClick={() => addLog('Manual Snapshot', 'Full state attest')} className="text-[10px] text-htb-accent hover:underline">Download Proof</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer Status Bar */}
      <div className="bg-htb-panel border-t border-gray-700 px-4 py-2 flex justify-between items-center text-[10px] font-mono whitespace-nowrap overflow-hidden">
        <div className="flex gap-4 items-center">
           <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-htb-accent rounded-full"></span> SYSTEM: NOMINAL</span>
           <span className="text-gray-600 hidden sm:inline">|</span>
           <span className="text-gray-400 hidden sm:inline">ENTRA_IDENTITY: OK</span>
           <span className="text-gray-600 hidden sm:inline">|</span>
           <span className="text-gray-400 hidden lg:inline">PURVIEW_HOOKS: ACTIVE</span>
        </div>
        <div className="text-gray-500 flex gap-4">
           <span>CPU: 12%</span>
           <span>LATENCY: 42ms</span>
           <span>LEGAL_GUARD: COMPLIANT</span>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseSecurity;

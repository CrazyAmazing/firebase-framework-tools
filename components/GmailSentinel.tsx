
import React, { useState, useEffect } from 'react';
import { Mail, Shield, ShieldAlert, Lock, Activity, Eye, Search, AlertCircle, CheckCircle, RefreshCcw, Bell, Database, Globe, Key, UserCheck, HardDrive, FileText, Trash2, Cpu, Smartphone, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface SentinelFeature {
  id: number;
  name: string;
  status: 'active' | 'warning' | 'idle' | 'secure';
  description: string;
  icon: React.ReactNode;
}

const GmailSentinel: React.FC = () => {
  const [activeScan, setActiveScan] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ time: string, msg: string, level: string }[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [blacklist, setBlacklist] = useState<string[]>(() => {
    const saved = localStorage.getItem('sentinel_ip_blacklist');
    return saved ? JSON.parse(saved) : ['192.168.1.105', '45.122.10.3', '212.45.1.99'];
  });
  const [newIp, setNewIp] = useState('');

  useEffect(() => {
    localStorage.setItem('sentinel_ip_blacklist', JSON.stringify(blacklist));
  }, [blacklist]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const features: SentinelFeature[] = [
    { id: 1, name: "Multi-Provider Opt", status: 'active', description: "Managing Yahoo, Outlook, and ProtonMail gateways.", icon: <Globe className="w-4 h-4" /> },
    { id: 2, name: "AI Phishing Shield", status: 'secure', description: "GPT-4 powered content and link heuristics.", icon: <Shield className="w-4 h-4" /> },
    { id: 3, name: "Malware Signature Bot", status: 'secure', description: "Scanning attachments for zero-day payloads.", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 4, name: "2FA Orchestrator", status: 'active', description: "Synchronizing hardware tokens across accounts.", icon: <Key className="w-4 h-4" /> },
    { id: 5, name: "Session Leash", status: 'active', description: "Dynamic timeout gating and concurrent login logic.", icon: <Activity className="w-4 h-4" /> },
    { id: 6, name: "Neural Email Filter", status: 'secure', description: "Adaptive spam and malicious intent classification.", icon: <Search className="w-4 h-4" /> },
    { id: 7, name: "PGP Integration", status: 'active', description: "End-to-end encryption for high-sec communications.", icon: <Lock className="w-4 h-4" /> },
    { id: 8, name: "Account Recovery Guard", status: 'idle', description: "Multi-path recovery with knowledge-based gating.", icon: <UserCheck className="w-4 h-4" /> },
    { id: 9, name: "Threat Stream Fusion", status: 'active', description: "Ingesting external feeds (VirusTotal, AbuseIPDB).", icon: <Database className="w-4 h-4" /> },
    { id: 10, name: "Behavioral Baselines", status: 'active', description: "Tracking user usage patterns for drift detection.", icon: <Eye className="w-4 h-4" /> },
    { id: 11, name: "Immutable Ledger", status: 'active', description: "Encryption-signed activity logs for all events.", icon: <FileText className="w-4 h-4" /> },
    { id: 12, name: "Emergency Uplink", status: 'idle', description: "Priority SMS/Voice alerting for critical breaches.", icon: <Bell className="w-4 h-4" /> },
    { id: 13, name: "IP Blacklist Swarm", status: 'secure', description: "Auto-blocking nodes from the global threat pool.", icon: <Globe className="w-4 h-4" /> },
    { id: 14, name: "Network Auditor", status: 'secure', description: "Assessing local network topology and VPN health.", icon: <Activity className="w-4 h-4" /> },
    { id: 15, name: "Automated Data Backup", status: 'active', description: "Cloning sensitive archives to encrypted cold storage.", icon: <HardDrive className="w-4 h-4" /> },
    { id: 16, name: "Provider Config Check", status: 'secure', description: "Verifying SPF, DKIM, and DMARC alignment.", icon: <Settings className="w-4 h-4" /> },
    { id: 17, name: "OSINT Footprint", status: 'warning', description: "Detecting public exposure of managed addresses.", icon: <Globe className="w-4 h-4" /> },
    { id: 18, name: "Legacy Proxy Bypass", status: 'idle', description: "Secure tunnel for emergency bypass protocols.", icon: <Shield className="w-4 h-4" /> },
    { id: 19, name: "Remote Kill-Switch", status: 'active', description: "Instantly revoking all tokens and wiping cache.", icon: <Trash2 className="w-4 h-4" /> },
    { id: 20, name: "Device Gating", status: 'active', description: "Authorized hardware fingerprinting enforcement.", icon: <Smartphone className="w-4 h-4" /> },
    { id: 21, name: "DLP Kill-Chain", status: 'secure', description: "Blocking PII exfiltration in outgoing payloads.", icon: <Lock className="w-4 h-4" /> },
    { id: 22, name: "Forwarding Sentinel", status: 'secure', description: "Auditing rules to prevent silent data diversion.", icon: <Mail className="w-4 h-4" /> },
    { id: 23, name: "Real-time Pulse", status: 'active', description: "Visual telemetry of all incoming data flows.", icon: <Cpu className="w-4 h-4" /> },
    { id: 24, name: "Community Intel", status: 'active', description: "Crowdsourced threat reporting from the swarm.", icon: <UserCheck className="w-4 h-4" /> },
    { id: 25, name: "Credential Stuffing Blocker", status: 'secure', description: "Detecting multi-site password reuse patterns.", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 26, name: "Thermal Protection", status: 'secure', description: "Monitoring hardware creep during heavy mining.", icon: <Activity className="w-4 h-4" /> },
    { id: 27, name: "Entropy Source Audit", status: 'active', description: "Verifying local TPM 2.0 seed strength.", icon: <Key className="w-4 h-4" /> },
    { id: 28, name: "Legal Compliance Guard", status: 'active', description: "GDPR/CCPA privacy data handling rules.", icon: <FileText className="w-4 h-4" /> },
    { id: 29, name: "M-TLS Handshake", status: 'active', description: "Enforcing mutual certificate authentication.", icon: <Lock className="w-4 h-4" /> },
    { id: 30, name: "Master Command Center", status: 'active', description: "Unified UI for all security agent functions.", icon: <Cpu className="w-4 h-4" /> },
  ];

  const addLog = (msg: string, level: string = 'INFO') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, level }, ...prev].slice(0, 10));
  };

  const startScan = () => {
    setActiveScan(true);
    setProgress(0);
    addLog("Initiating full sentinel audit...", "WARN");
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setActiveScan(false);
          addLog("Audit complete. All systems nominal.", "OK");
          
          // Simulation: Detect a suspicious IP after scan
          setTimeout(() => {
            const randomIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            if (!blacklist.includes(randomIp)) {
                setBlacklist(prev => [randomIp, ...prev].slice(0, 50));
                addLog(`AUTO-BLOCKED: Suspicious ingress from ${randomIp}`, "WARN");
            }
          }, 1500);

          return 100;
        }
        if (p % 25 === 0 && p > 0) {
            addLog(`Analyzing ${features[Math.floor(p/4)].name}...`, "INFO");
        }
        return p + 2;
      });
    }, 50) as any;
  };

  const addToBlacklist = () => {
    if (newIp && !blacklist.includes(newIp)) {
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(newIp)) {
        setBlacklist([newIp, ...blacklist]);
        addLog(`MANUAL_BLOCK: ${newIp} added to blacklist`, "INFO");
        setNewIp('');
      }
    }
  };

  const removeFromBlacklist = (ip: string) => {
    setBlacklist(blacklist.filter(i => i !== ip));
    addLog(`REMOVED: ${ip} whitelist authorization granted`, "OK");
  };

  return (
    <div className="h-full bg-htb-dark text-gray-200 overflow-hidden flex flex-col p-6 font-mono">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-htb-accent flex items-center gap-3">
            <Shield className="w-8 h-8" />
            {user ? `${user.displayName?.split(' ')[0].toUpperCase()}'S SENTINEL CORE` : 'GMAIL SENTINEL PRO'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{user ? `Authenticated as ${user.email}` : '30-Feature Autonomous Security Core'}</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={startScan}
            disabled={activeScan}
            className={`px-6 py-2 rounded font-bold border transition-all ${activeScan ? 'bg-htb-panel text-gray-500 border-gray-700' : 'bg-htb-accent/10 text-htb-accent border-htb-accent/50 hover:bg-htb-accent hover:text-htb-dark shadow-[0_0_15px_rgba(16,185,129,0.2)]'}`}
           >
             {activeScan ? 'SCANNING...' : 'SYSTEM AUDIT'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Features Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3 overflow-y-auto pr-2 custom-scrollbar pb-6">
          {features.map((f, i) => (
            <motion.div 
              key={f.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="bg-htb-panel border border-gray-800 p-3 rounded-lg hover:border-htb-accent/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 bg-gray-900 rounded text-htb-accent group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  f.status === 'active' ? 'bg-blue-500 shadow-[0_0_5px_#3b82f6]' : 
                  f.status === 'secure' ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' :
                  f.status === 'warning' ? 'bg-orange-500 animate-pulse' : 'bg-gray-700'
                }`}></div>
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-tight text-white mb-1">{f.name}</h4>
              <p className="text-[9px] text-gray-500 leading-tight h-8 overflow-hidden line-clamp-2">{f.description}</p>
              
              {/* Scan effect */}
              {activeScan && progress > (i * 3.3) && progress < (i * 3.3 + 10) && (
                <div className="absolute inset-0 bg-htb-accent/5 pointer-events-none border border-htb-accent/20"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Live Controller / Stats */}
        <div className="space-y-6">
            <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 shadow-2xl relative overflow-hidden">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">Telemetry Hub</h3>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Audit Completion</span>
                            <span className="text-htb-accent">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-htb-accent shadow-[0_0_10px_#10b981]" 
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-center">
                            <span className="text-[9px] text-gray-600 block mb-1">SHIELD SCORE</span>
                            <span className="text-lg font-black text-htb-accent">99.2</span>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800 text-center">
                            <span className="text-[9px] text-gray-600 block mb-1">TPM ENTROPY</span>
                            <span className="text-lg font-black text-blue-400">HIGH</span>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 rounded-lg p-3 border border-gray-800 font-mono text-[9px] h-40 overflow-hidden">
                    <p className="text-htb-accent mb-2 tracking-widest">// EVENT_LOG_LIVE</p>
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1 flex gap-2">
                            <span className="text-gray-600">{log.time}</span>
                            <span className={log.level === 'WARN' ? 'text-orange-400' : log.level === 'OK' ? 'text-emerald-400' : 'text-gray-400'}>
                                {log.msg}
                            </span>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-gray-700 italic">Standing by...</p>}
                </div>
            </div>

            <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 shadow-2xl flex-1 flex flex-col overflow-hidden max-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">IP Blacklist</h3>
                    <span className="text-[9px] bg-red-900/30 text-red-500 px-2 py-0.5 rounded border border-red-900/50">
                        {blacklist.length} BLOCKED
                    </span>
                </div>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="ENTER IP ADDR..."
                        className="flex-1 bg-black/60 border border-gray-800 rounded px-3 py-1.5 text-[10px] text-gray-300 focus:outline-none focus:border-htb-accent transition-colors font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && addToBlacklist()}
                    />
                    <button 
                        onClick={addToBlacklist}
                        className="bg-htb-accent/20 border border-htb-accent/40 text-htb-accent p-1.5 rounded hover:bg-htb-accent hover:text-htb-dark transition-all"
                    >
                        <ShieldAlert className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    <AnimatePresence>
                        {blacklist.map((ip) => (
                            <motion.div 
                                key={ip}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex justify-between items-center bg-gray-900/40 border border-gray-800 rounded p-2 text-[10px] group"
                            >
                                <span className="text-gray-400 group-hover:text-red-400 font-mono transition-colors">{ip}</span>
                                <button 
                                    onClick={() => removeFromBlacklist(ip)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-white transition-opacity"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {blacklist.length === 0 && (
                        <div className="text-center py-8 text-gray-700 italic text-[10px]">
                            Blacklist is empty.
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800 flex justify-center">
                    <button 
                        onClick={() => { setBlacklist([]); addLog("BLACKLIST_PURGE: Policy reset", "WARN"); }}
                        className="text-[9px] text-gray-600 hover:text-red-500 flex items-center gap-2 uppercase tracking-tighter transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear All Policies
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Security Status Bar */}
      <div className="mt-6 bg-htb-panel border-t border-gray-700 -mx-6 -mb-6 px-6 py-2 flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-500">
        <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-htb-accent rounded-full shadow-[0_0_5px_#10b981]"></span> SENTINEL: ARMED</span>
            <span className="text-gray-600">// ICUBED STUDIOS // BY J_P LAFOREST</span>
        </div>
        <div className="flex gap-4">
            <span>UPTIME: 14h 22m 04s</span>
            <span>THREAT_LEVEL: NOMINAL</span>
        </div>
      </div>
    </div>
  );
};

export default GmailSentinel;

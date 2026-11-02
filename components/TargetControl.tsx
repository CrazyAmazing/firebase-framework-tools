import React from 'react';
import { TargetConfig } from '../types';

interface TargetControlProps {
  config: TargetConfig;
  setConfig: (config: TargetConfig) => void;
  onQuickAction: (actionPrompt: string) => void;
}

const TargetControl: React.FC<TargetControlProps> = ({ config, setConfig, onQuickAction }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const generatePrompt = (action: string) => {
    const targetInfo = `Target: ${config.name} (${config.ip}) [${config.os.toUpperCase()}]`;
    
    switch (action) {
      case 'hosts':
        return `${targetInfo}. Generate the exact command to add this target to my /etc/hosts file.`;
      case 'ping':
        return `${targetInfo}. Provide a ping command to verify connectivity and explain what the TTL might indicate about the OS.`;
      case 'nmap-initial':
        return `${targetInfo}. Generate a reliable initial Nmap scan command to enumerate open ports. Explain the flags used.`;
      case 'nmap-full':
        return `${targetInfo}. Generate a comprehensive Nmap command (all ports, versions, scripts) for deep enumeration.`;
      case 'nmap-discovery':
        return `${targetInfo}. Provide Nmap options to customize the host discovery phase. Specifically generate commands and explain the tactical necessity for:
1. Disabling ping (-Pn) - When to treat host as online.
2. ICMP Echo probes (-PE) - Standard discovery.
3. Timestamp probes (-PP) - Firewall evasion.
4. Netmask probes (-PM) - Internal subnet mapping.
Explain which might work best against a Linux target and a Windows target.`;
      case 'masscan-nmap':
        return `${targetInfo}. Generate a workflow command that uses Masscan to rapidly scan all TCP ports (0-65535) and then pipes the discovered open ports directly into Nmap for deep service enumeration (-sV -sC). Explain the rate limiting strategy for Masscan to avoid dropping packets.`;
      case 'web-enum':
        return `${targetInfo}. Assuming port 80/443 is open, provide a Gobuster or FFUF command to fuzz for directories using a common wordlist.`;
      case 'smb-enum':
        return `${targetInfo}. Provide tools and commands to enumerate SMB shares and permissions for this target.`;
      case 'shell-upgrade':
        return `I have a raw shell on the ${config.os} target. Provide the commands to upgrade it to a fully interactive TTY (e.g., using python, stty).`;
      default:
        return '';
    }
  };

  const handleActionClick = (action: string) => {
    const prompt = generatePrompt(action);
    if (prompt) onQuickAction(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-700 w-full md:w-80 flex-shrink-0">
      <div className="p-4 border-b border-gray-700 bg-gray-800/50">
        <h2 className="text-htb-accent font-mono text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Target Configuration
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 font-mono mb-1">TARGET IP</label>
            <input
              type="text"
              name="ip"
              value={config.ip}
              onChange={handleInputChange}
              placeholder="10.10.10.x"
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white font-mono focus:border-htb-accent focus:outline-none focus:ring-1 focus:ring-htb-accent transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 font-mono mb-1">BOX NAME</label>
            <input
              type="text"
              name="name"
              value={config.name}
              onChange={handleInputChange}
              placeholder="e.g. Lame"
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white font-mono focus:border-htb-accent focus:outline-none focus:ring-1 focus:ring-htb-accent transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 font-mono mb-1">OPERATING SYSTEM</label>
            <div className="flex bg-gray-950 rounded border border-gray-700 p-1">
              <button
                onClick={() => setConfig({...config, os: 'linux'})}
                className={`flex-1 text-xs font-mono py-1 rounded transition-colors ${config.os === 'linux' ? 'bg-htb-panel text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                LINUX
              </button>
              <button
                onClick={() => setConfig({...config, os: 'windows'})}
                className={`flex-1 text-xs font-mono py-1 rounded transition-colors ${config.os === 'windows' ? 'bg-htb-panel text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                WINDOWS
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-gray-500 font-mono text-xs font-bold uppercase mb-3">Tactical Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'hosts', label: 'Add to /etc/hosts', icon: '📝' },
            { id: 'ping', label: 'Connectivity Check', icon: '📡' },
            { id: 'nmap-initial', label: 'Initial Nmap Scan', icon: '🔍' },
            { id: 'nmap-full', label: 'Full Port Audit', icon: '🔬' },
            { id: 'nmap-discovery', label: 'Host Discovery Tactics', icon: '👻' },
            { id: 'masscan-nmap', label: 'Masscan + Nmap', icon: '🚀' },
            { id: 'web-enum', label: 'Web Enumeration', icon: '🌐' },
            { id: 'smb-enum', label: 'SMB Recon', icon: '📂' },
            { id: 'shell-upgrade', label: 'Upgrade Shell', icon: '🐚' },
          ].map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              disabled={!config.ip}
              className="flex items-center gap-3 px-3 py-2.5 bg-gray-800/40 hover:bg-gray-800 text-left rounded border border-gray-700 hover:border-htb-accent/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{action.icon}</span>
              <div>
                <div className="text-sm text-gray-300 font-medium group-hover:text-white">{action.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800/30">
        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span className={`w-2 h-2 rounded-full ${config.ip ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
            {config.ip ? 'TARGET LOCKED' : 'NO TARGET SET'}
        </div>
      </div>
    </div>
  );
};

export default TargetControl;
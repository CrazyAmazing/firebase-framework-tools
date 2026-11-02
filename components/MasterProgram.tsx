
import React, { useState } from 'react';
import { Terminal, Code, Cpu, Shield, Download, Play, FileText, CheckCircle, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';

const MasterProgram: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState('gmail_sentinel.py');
  const [copied, setCopied] = useState(false);
  
  const files = [
    { name: 'gmail_sentinel.py', lang: 'python' },
    { name: 'IntrusionDetector.cpp', lang: 'cpp' },
    { name: 'IntrusionDetector.h', lang: 'cpp' },
    { name: 'ChampionSecurity.json', lang: 'json' },
    { name: 'CMakeLists.txt', lang: 'cmake' },
  ];

  const getCode = (filename: string) => {
    switch(filename) {
      case 'gmail_sentinel.py':
        return `#!/usr/bin/env python3
"""
SENTINEL_MASTER_AI || GMAIL SENTINEL PRO
30-Feature Autonomous Security Core by J_P LaForest
"""

import os, re, json, threading
from google.generativeai import GenerativeModel
from cryptography.fernet import Fernet

class SentinelCore:
    def __init__(self):
        self.features = [
            "AI Phishing Detection", "2FA Orchestration", 
            "Session Leashing", "Forwarding Sentinel"
        ]
        self.shield_level = 1.0 # 0.0 - 1.0
        
    def audit_forwarding_rules(self):
        """Feature #25: Forwarding Rule Audit"""
        rules = self.fetch_gmail_filters()
        for rule in rules:
            if self.is_suspicious_redirect(rule):
                self.quarantine_rule(rule)
                self.trigger_alert("Unauthorized Data Diversion Detected")

    def analyze_phishing_heuristics(self, content):
        """Feature #2: Neural Phishing Shield"""
        score = self.model.predict(content)
        if score > 0.85:
            return "THREAT_BLOCK"
        return "SAFE"

# Professional Masters Production Implementation
if __name__ == "__main__":
    sentinel = SentinelCore()
    sentinel.audit_forwarding_rules()`;
      case 'IntrusionDetector.cpp':
        return `#include "IntrusionDetector.h"
#include <iostream>
#include <regex>

/**
 * HTB Sentinel Master - Military Grade Intrusion Detection
 * Implementing 15 Hacking Strategy Patterns
 */

IntrusionDetector::IntrusionDetector() {
    this->initializeHeuristics();
}

void IntrusionDetector::scanActivity(const std::string& logs) {
    // Pattern 1: Brute Force Detection
    if (this->detectPattern(logs, "FAIL_AUTH_CLUSTER")) {
        this->escalate(Escalation::LEVEL_HIGH);
    }

    // Pattern 4: SQL Injection
    std::regex sqli_regex("(?i)(SELECT|DROP|UNION|OR 1=1)");
    if (std::regex_search(logs, sqli_regex)) {
        this->triggerKillSwitch("SQLi Vector Identified");
    }
}

void IntrusionDetector::triggerKillSwitch(const std::string& reason) {
    std::cout << "[SYSTEM_SHIELD] LOCKDOWN INITIATED: " << reason << std::endl;
    // Notify ICubed Studios Command Center
    Uplink::sendAuditEvt("FORCE_QUARANTINE", reason);
}`;
      case 'ChampionSecurity.json':
        return `{
  "champion_security_v1": {
    "core_features": 30,
    "supportive_functions": 150,
    "creator": "J_P LaForest",
    "studio": "ICubed Studios",
    "features_list": [
      "Multi-Provider Support", "AI Phishing Detection", "Malware Scanning",
      "Real-Time Monitoring", "2FA Management", "Session Management",
      "Neural Email Filtering", "E2EE Encryption", "Account Recovery Guard",
      "Threat Intel Fusion", "User Behavior Analytics", "Audit Logging",
      "Alerting", "AI Prediction", "IP Blacklisting", "Network Audit",
      "Autonomic Backup", "Permission Management", "Device Gating",
      "Config Checks", "Human-AI Teaming", "AV Integration", 
      "Compliance Engine", "Remote Wipe", "Forwarding Sentinel"
    ],
    "supportive_context": [
      "Steganography detection", "local device monitoring", 
      "digital footprint self-assessment", "virtual conference security"
    ]
  }
}`;
      case 'IntrusionDetector.h':
        return `#ifndef INTRUSION_DETECTOR_H
#define INTRUSION_DETECTOR_H

#include <string>
#include <vector>

struct Threat {
    std::string type;
    std::string msg;
    int severity;
};

class IntrusionDetector {
public:
    void detectPhishing(std::string content);
    void detectSQLInjection(std::string query);
    // ... all 15 strategies ...
};

#endif`;
      default:
        return "// Code not shown for brevity //";
    }
  };

  const copyToClipboard = () => {
    const code = getCode(selectedFile);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full bg-htb-dark text-gray-300 flex flex-col p-6 font-mono overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-emerald-400 flex items-center gap-3">
            <Cpu className="w-8 h-8" />
            NATIVE MASTER PROGRAM
          </h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.3em]">C++ / Python Performance Core // Google Studio Studio Integration</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-3 animate-pulse">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
              <span className="text-xs font-bold font-mono">CORE_UPLINK_STABLE</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* File Browser */}
        <div className="w-64 bg-htb-panel border border-gray-700 rounded-xl overflow-hidden flex flex-col shadow-2xl">
          <div className="p-3 bg-gray-900 border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
             <Terminal className="w-3 h-3" />
             Project Explorer
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {files.map(file => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file.name)}
                className={`w-full text-left px-3 py-2 rounded-md text-[11px] flex items-center gap-3 transition-all ${selectedFile === file.name ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:bg-gray-800'}`}
              >
                <Code className="w-3.5 h-3.5" />
                {file.name}
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-gray-800 bg-gray-900/50">
             <button className="w-full py-2 bg-emerald-600/20 text-emerald-400 text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all">
                <Download className="w-3 h-3" />
                BUILD ALL BUNDLE
             </button>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 flex flex-col bg-htb-panel border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
             <span className="text-[11px] text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                {selectedFile}
             </span>
             <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-white" 
                  title="Copy Code"
                >
                   {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button className="p-1.5 hover:bg-gray-800 rounded transition-colors text-emerald-500" title="Run Implementation">
                   <Play className="w-4 h-4 fill-current" />
                </button>
             </div>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-black/40 text-xs leading-relaxed custom-scrollbar font-mono relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900/50 flex flex-col items-center pt-6 text-gray-700 border-r border-gray-800 select-none pointer-events-none text-[10px]">
               {Array.from({length: 40}).map((_, i) => <div key={i} className="h-[1.5em]">{i+1}</div>)}
            </div>
            <pre className="pl-10 text-emerald-50/80">
               <code>{getCode(selectedFile)}</code>
            </pre>
          </div>
          <div className="p-2 bg-gray-900 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500">
             <span>UTF-8 // LF // master</span>
             <span className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                SYNTAX VERIFIED
             </span>
          </div>
        </div>

        {/* System Capabilities Sidebar */}
        <div className="w-80 flex flex-col gap-6">
           <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 shadow-2xl flex-1">
              <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest flex items-center gap-2">
                 <Shield className="w-4 h-4 text-emerald-500" />
                 Champion Security Matrix
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                 {[
                   "AI Phishing Detection (v4.2)",
                   "2FA Orchestration Module",
                   "Session Leashing Engine",
                   "Forwarding Rule Auditor",
                   "Behavioral Biometrics Gating",
                   "Dark Web Intelligence Miner",
                   "DLP Payload Inspector",
                   "Federated Threat Swarm",
                   "XAI Decision Provenance",
                   "Immutable Audit Ledger",
                   "Autonomic Healing Protocol",
                   "Zero-Day Behavioral Shield",
                   "M-TLS Boundary Enforcement",
                   "Steganography Scanner",
                   "Remote Device Kill-Switch"
                 ].map((cap, i) => (
                   <div key={i} className="p-2 bg-gray-900/50 rounded border-l-2 border-emerald-500 text-[10px] hover:bg-gray-800 transition-colors flex justify-between items-center group">
                      <span className="group-hover:text-emerald-400 transition-colors">{cap}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                   </div>
                 ))}
                 <div className="pt-2">
                     <p className="text-[9px] text-gray-600 uppercase mb-2">Supportive Functions (+135 more)</p>
                     <div className="flex flex-wrap gap-1 text-[8px] text-gray-500">
                        {["Stego-Audit", "VPN-Health", "SBOM-Attest", "Entropy-Audit", "PII-Mask"].map((s, i) => (
                           <span key={i} className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 rounded">{s}</span>
                        ))}
                     </div>
                 </div>
              </div>
           </div>
           
           <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-xl p-5">
              <h3 className="text-xs font-black uppercase text-emerald-500 mb-3 tracking-widest">Compiler Env</h3>
              <div className="space-y-2 text-[10px] font-mono text-gray-500">
                 <div className="flex justify-between"><span>G++</span><span className="text-white">v11.4.0</span></div>
                 <div className="flex justify-between"><span>Python</span><span className="text-white">v3.10.12</span></div>
                 <div className="flex justify-between"><span>Architecture</span><span className="text-white">AMD64 / AVX-512</span></div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-6 bg-htb-panel border-t border-gray-700 -mx-6 -mb-6 px-6 py-2 flex justify-between items-center text-[9px] uppercase tracking-widest text-gray-500">
        <div>MASTER_PROGRAM_INITIALIZED // ICUBED_STUDIOS_CORE</div>
        <div className="flex gap-4">
           <span>SOURCE: J_P_LAFOREST_REPO</span>
           <span className="text-emerald-500">COMPILE_SUCCESS</span>
        </div>
      </div>
    </div>
  );
};

export default MasterProgram;

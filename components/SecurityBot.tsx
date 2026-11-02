import React, { useState, useRef, useEffect } from 'react';

// Types for the log entries
interface LogEntry {
  id: string;
  time: string;
  message: string;
  level: 'info' | 'ok' | 'warn' | 'err';
}

const SecurityBot: React.FC = () => {
  // --- State ---
  const [state, setState] = useState({
    demo: true,
    protections: 0,
    investigations: 0,
    contained: 0,
    auditEvents: 0
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [xaiContent, setXaiContent] = useState<React.ReactNode>(
    <em>No decisions yet—trigger an action to see explainability in action.</em>
  );
  const [simStep, setSimStep] = useState<number>(0); // 0 = idle, 1-5 = simulation steps
  
  const logContainerRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const addLog = (msg: string, level: 'info' | 'ok' | 'warn' | 'err' = 'info') => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString(),
      message: msg,
      level
    };
    setLogs(prev => [newEntry, ...prev]);

    if (msg.includes('AUDIT')) {
      setState(prev => ({ ...prev, auditEvents: prev.auditEvents + 1 }));
    }
  };

  const bumpProtection = (msg: string) => {
    setState(prev => ({ ...prev, protections: prev.protections + 1 }));
    addLog(msg, 'ok');
  };

  const bumpInvestigation = (msg: string) => {
    setState(prev => ({ ...prev, investigations: prev.investigations + 1 }));
    addLog(msg, 'warn');
  };

  const bumpContained = (msg: string) => {
    setState(prev => ({ ...prev, contained: prev.contained + 1 }));
    addLog(msg, 'ok');
  };

  const clearLog = () => {
    setLogs([]);
    addLog('Log cleared. AUDIT: clear action recorded.', 'info');
  };

  const toggleMode = () => {
    setState(prev => {
      const newMode = !prev.demo;
      addLog(`MODE: ${newMode ? 'Demo' : 'Live'} — Safety rails engaged; actions simulate defensive operations only.`, 'info');
      return { ...prev, demo: newMode };
    });
  };

  // --- Actions ---
  const runSelfCoder = () => bumpProtection('Self‑coder: scanned services and queued safe optimizations. AUDIT: change‑set recorded.');
  const runAdversarialHardening = () => bumpInvestigation('Adversarial hardening: simulated attacks uncovered 2 non‑exploitable findings. AUDIT: report generated.');
  const generateSyntheticData = () => addLog('Synthetic data: generated benign threat telemetry for training. AUDIT: dataset hash logged.', 'info');

  const decodeArtifact = () => bumpInvestigation('Code deconstructor: decoded artifact safely in sandbox. AUDIT: behavior profile stored.');
  const memoryScan = () => bumpInvestigation('Memory forensics: snapshot scanned, no in‑memory threats found. AUDIT: evidence sealed.');
  const fuseThreatIntel = () => addLog('Threat fusion: correlated feeds; risk graph updated with current priorities.', 'info');
  const nlThreatParse = () => addLog('NLP parser: scanned messages; no phishing indicators detected. AUDIT: parser decision recorded.', 'info');

  const enforceZeroTrust = () => bumpProtection('Zero‑trust: policies applied; continuous verification active. AUDIT: policy version attested.');
  const deployDecoys = () => bumpProtection('Deception fabric: decoys deployed. AUDIT: decoy fingerprints notarized.');
  const enablePQCrypto = () => bumpProtection('PQ crypto: migration plan staged (demo). AUDIT: key management plan logged.');
  const behavioralAuth = () => addLog('Behavioral biometrics: profile baseline intact; no anomalies.', 'info');

  const containBot = () => bumpContained('Containment: rogue automation isolated in sandbox. AUDIT: quarantine event recorded.');
  const dismantleContained = () => addLog('Dismantler: safely deconstructed contained bot components; evidence preserved. AUDIT: dismantle report.', 'info');
  
  const enforceCode = () => bumpProtection('Code enforcement: blocked insecure commit; suggested patches. AUDIT: CI gate decision logged.');
  const verifySupplyChain = () => bumpProtection('Supply‑chain: SBOM verified; signatures valid. AUDIT: attestation stored.');
  const autonomicHeal = () => bumpProtection('Autonomic healing: restored service from golden image (demo). AUDIT: rollback recorded.');
  const predictExhaustion = () => addLog('Predictor: resource usage normal; no DoS forecast in current window.', 'info');

  const emitAudit = () => {
    setState(prev => ({ ...prev, auditEvents: prev.auditEvents + 1 }));
    addLog('AUDIT: manual event emitted—checkpoint notarized.', 'info');
  };

  const explainDecision = () => {
    setXaiContent(
      <div className="space-y-2">
        <p><strong className="text-htb-accent">Why was this connection terminated?</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Anomaly Score:</strong> 8.7/10 (threshold: 7.0)</li>
            <li><strong>Indicators:</strong>
                <ul className="list-[square] list-inside ml-4 opacity-80">
                    <li>Data exfiltration: 450 MB in 12 seconds</li>
                    <li>Destination IP: 203.0.113.42 (Threat Feed)</li>
                    <li>Port: 4444 (C2)</li>
                </ul>
            </li>
            <li><strong>Policy Match:</strong> Zero-Trust Rule #27</li>
        </ul>
        <p className="text-green-400 mt-2 text-xs">✓ Decision logged to immutable audit ledger (Block #{state.auditEvents + 1})</p>
      </div>
    );
    addLog('XAI: Decision explanation generated and displayed.', 'info');
  };

  const complianceCheck = () => {
      // In a real app we'd use a modal, here we'll simulate a check
      const action = "terminate connection to 203.0.113.42"; // Hardcoded for demo UI
      
      const risks = [
          { law: 'GDPR Art. 32', status: 'ok', msg: 'Security measures adequate' },
          { law: 'CFAA § 1030', status: 'ok', msg: 'Defensive action authorized' },
          { law: 'Ethical AI', status: 'ok', msg: 'Human override available' }
      ];

      setXaiContent(
          <div>
            <strong>Compliance Pre-Flight Check:</strong><br/>
            <div className="mt-2 space-y-1">
                {risks.map((r, i) => (
                    <div key={i}>
                        <span className={r.status === 'ok' ? 'text-green-400' : 'text-yellow-400'}>
                            {r.status === 'ok' ? '✓' : '⚠'} {r.law}:
                        </span> {r.msg}
                    </div>
                ))}
            </div>
          </div>
      );
      addLog(`Compliance check: "${action}" — APPROVED`, 'ok');
  };

  const killSwitchPrompt = () => addLog('Kill‑switch: multi‑party authorization required—no action taken (demo safeguard).', 'warn');
  const compressAlerts = () => addLog('Alert compressor: reduced 847 events to 3 actionable incidents (credential abuse, port scan, config drift).', 'ok');
  const queryThreats = () => addLog('Query: "show lateral movement" — Found 2 matches. Opening interactive graph... (demo)', 'info');
  const suggestPlaybook = () => addLog('Playbook learner: detected pattern—you always isolate VMs when process "svchost.exe" spawns from unusual parent. Add to playbook? (demo)', 'warn');
  
  const joinThreatSwarm = () => bumpProtection('Federated swarm: connected to 47 peers; sharing anonymized IoCs via differential privacy.');
  const auditVendors = () => bumpInvestigation('Vendor monitor: detected overprivileged OAuth app in Salesforce (read-write on all objects). AUDIT: finding escalated.');
  const scanRegulations = () => addLog('Regulatory scanner: EU AI Act Amendment 2025-03 detected—adjusting explainability thresholds. AUDIT: policy update queued.', 'warn');


  // --- Simulation Logic ---
  const startThreatSimulation = () => {
    if (!state.demo) {
      addLog('BLOCKED: Threat simulation only available in Demo mode.', 'err');
      return;
    }

    addLog('SIMULATION: Initiating realistic attack scenario...', 'warn');
    setXaiContent(<em>Threat simulation in progress... monitoring for events.</em>);
    
    // Reset KPIs
    setState(prev => ({...prev, protections: 0, investigations: 0, contained: 0, auditEvents: 0}));
    setSimStep(1); // Start viz

    // Sequence
    setTimeout(() => {
        bumpInvestigation('ALERT: Suspicious SSH login from 203.0.113.42 (sanctioned IP) using unknown key.');
        fuseThreatIntel();
        setSimStep(2);
    }, 2000);

    setTimeout(() => {
        bumpInvestigation('ALERT: Anomalous process spawned—attempting to access HR database.');
        setSimStep(3);
    }, 4000);

    setTimeout(() => {
        containBot();
        addLog('RESPONSE: Zero-trust policy automatically downgraded credential trust score.', 'ok');
        setSimStep(4);
    }, 6000);

    setTimeout(() => {
        memoryScan();
        decodeArtifact();
        addLog('FORENSICS: Attack chain reconstructed—initial access via compromised API token.', 'ok');
        setXaiContent(
            <div className="text-xs">
                <strong className="text-htb-accent block mb-1">Simulation Forensics Report:</strong>
                Initial access via compromised API token (user `devops-svc`).<br/>
                Lateral movement via `RDP` to `HR-DB-SERVER`.<br/>
                Exfiltration attempt blocked by auto-containment.<br/>
                Root cause: Weak API key management.
            </div>
        );
        setSimStep(5);
    }, 8000);

    setTimeout(() => {
        dismantleContained();
        autonomicHeal();
        addLog('RESOLVED: Threat neutralized. Evidence preserved. Service restored. AUDIT: incident report generated.', 'ok');
        setState(prev => ({...prev, investigations: Math.max(0, prev.investigations - 1) }));
        setSimStep(5); // Keep final state
    }, 10000);
  };

  const traceAttack = () => {
      bumpInvestigation('Attack tracer: mapped path; initial access via outdated token (demo). AUDIT: visualization archived.');
      setSimStep(5); // Show full graph
  };


  // --- Styling Constants ---
  // Using Tailwind classes mapped to the original CSS logic where possible, plus specific colors
  const cardClass = "bg-[#1f2937] border border-gray-700 rounded-lg p-3 shadow-lg hover:border-gray-500 transition-all flex flex-col";
  const btnClass = "px-3 py-1.5 rounded text-xs border border-emerald-900 bg-emerald-900/20 text-emerald-100 hover:bg-emerald-900/40 hover:border-emerald-500 hover:text-white transition-all text-left truncate";
  
  return (
    <div className="bg-[#0b0f14] min-h-full p-4 md:p-8 font-sans text-gray-200 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
            
            {/* Top Bar / Status */}
            <div className="flex justify-between items-center mb-6 bg-[#1f2937] p-3 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${state.demo ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></span>
                    <h2 className="text-sm font-bold tracking-wide">AUTONOMOUS GUARDIAN</h2>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                    Mode: <strong className="text-white">{state.demo ? 'Demo' : 'Live'}</strong> • 
                    Ledger: <span className="text-emerald-500 border border-emerald-900 bg-emerald-900/20 px-1 rounded ml-1">Tamper‑proof</span> • 
                    Zero‑Trust: <span className="text-emerald-500 border border-emerald-900 bg-emerald-900/20 px-1 rounded ml-1">Enabled</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#121821] border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-500 text-xs uppercase font-bold">Active Protections</div>
                    <div className="text-2xl text-green-500 font-mono mt-1">{state.protections}</div>
                </div>
                <div className="bg-[#121821] border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-500 text-xs uppercase font-bold">Open Investigations</div>
                    <div className="text-2xl text-orange-500 font-mono mt-1">{state.investigations}</div>
                </div>
                <div className="bg-[#121821] border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-500 text-xs uppercase font-bold">Contained Bots</div>
                    <div className="text-2xl text-green-500 font-mono mt-1">{state.contained}</div>
                </div>
                <div className="bg-[#121821] border border-gray-700 rounded-lg p-3">
                    <div className="text-gray-500 text-xs uppercase font-bold">Audit Events</div>
                    <div className="text-2xl text-gray-200 font-mono mt-1">{state.auditEvents}</div>
                </div>
            </div>

            {/* Explainability Panel */}
            <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-htb-accent text-sm font-bold mb-2 uppercase">Latest Decision Explanation (XAI)</h3>
                <div className="text-sm text-gray-400 font-mono leading-relaxed bg-[#111827] p-3 rounded border border-gray-800">
                    {xaiContent}
                </div>
            </div>

            {/* Main Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* Pillar 1 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Cognitive & Self‑Mgmt</h2>
                    <p className="text-xs text-gray-500 mb-3">Adaptive optimization & hardening.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={runSelfCoder} className={btnClass}>Run self‑coder</button>
                        <button onClick={runAdversarialHardening} className={btnClass}>Adversarial hardening</button>
                        <button onClick={generateSyntheticData} className={btnClass}>Generate synthetic data</button>
                    </div>
                </div>

                {/* Pillar 2 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Analysis & Forensics</h2>
                    <p className="text-xs text-gray-500 mb-3">Decode artifacts & threat intel.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={decodeArtifact} className={btnClass}>Decode artifact</button>
                        <button onClick={memoryScan} className={btnClass}>Scan memory (safe)</button>
                        <button onClick={fuseThreatIntel} className={btnClass}>Fuse threat intel</button>
                        <button onClick={nlThreatParse} className={btnClass}>Parse messages</button>
                    </div>
                </div>

                {/* Pillar 3 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Defense & Shielding</h2>
                    <p className="text-xs text-gray-500 mb-3">Zero‑trust & deception fabric.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={enforceZeroTrust} className={btnClass}>Enforce zero‑trust</button>
                        <button onClick={deployDecoys} className={btnClass}>Deploy decoy fabric</button>
                        <button onClick={enablePQCrypto} className={btnClass}>Enable PQ crypto</button>
                        <button onClick={behavioralAuth} className={btnClass}>Behavioral auth</button>
                    </div>
                </div>

                {/* Pillar 4 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Response & Containment</h2>
                    <p className="text-xs text-gray-500 mb-3">Quarantine & dismantle threats.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={containBot} className={btnClass}>Contain rogue bot</button>
                        <button onClick={dismantleContained} className={btnClass}>Dismantle contained</button>
                        <button onClick={traceAttack} className={btnClass}>Trace attack path</button>
                        <button onClick={enforceCode} className={btnClass}>Enforce secure code</button>
                    </div>
                </div>

                {/* Pillar 5 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Integrity & Resilience</h2>
                    <p className="text-xs text-gray-500 mb-3">SBOM & autonomic healing.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={verifySupplyChain} className={btnClass}>Verify supply‑chain</button>
                        <button onClick={autonomicHeal} className={btnClass}>Autonomic healing</button>
                        <button onClick={predictExhaustion} className={btnClass}>Predict resource exhaustion</button>
                    </div>
                </div>

                {/* Pillar 6 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Governance & Controls</h2>
                    <p className="text-xs text-gray-500 mb-3">Auditing & compliance checks.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={emitAudit} className={btnClass}>Emit audit event</button>
                        <button onClick={explainDecision} className={btnClass}>Explain latest decision</button>
                        <button onClick={complianceCheck} className={btnClass}>Compliance pre‑check</button>
                        <button onClick={killSwitchPrompt} className={`${btnClass} text-red-400 border-red-900/50 hover:border-red-500`}>Kill‑switch (multi‑party)</button>
                    </div>
                </div>

                {/* Pillar 7 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Human‑AI Teaming</h2>
                    <p className="text-xs text-gray-500 mb-3">Analyst support & queries.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={compressAlerts} className={btnClass}>Compress alerts</button>
                        <button onClick={queryThreats} className={btnClass}>Natural language query</button>
                        <button onClick={suggestPlaybook} className={btnClass}>Suggest playbook</button>
                    </div>
                </div>

                {/* Pillar 8 */}
                <div className={cardClass}>
                    <h2 className="text-htb-accent text-sm font-bold mb-1">Ecosystem Defense</h2>
                    <p className="text-xs text-gray-500 mb-3">Threat sharing & vendor audit.</p>
                    <div className="grid gap-2 mt-auto">
                        <button onClick={joinThreatSwarm} className={btnClass}>Join threat swarm</button>
                        <button onClick={auditVendors} className={btnClass}>Audit SaaS vendors</button>
                        <button onClick={scanRegulations} className={btnClass}>Scan regulations</button>
                    </div>
                </div>
            </div>

            {/* Event Log & Viz */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                         <h2 className="text-htb-accent text-sm font-bold uppercase">Event Ledger (Immutable)</h2>
                         <div className="flex gap-2">
                             <button onClick={clearLog} className="text-xs text-gray-500 hover:text-white underline">Clear</button>
                             <button onClick={toggleMode} className="text-xs text-gray-500 hover:text-white underline">Toggle Mode</button>
                             <button onClick={startThreatSimulation} className="text-xs text-htb-accent hover:text-emerald-300 font-bold flex items-center gap-1 border border-emerald-900 bg-emerald-900/30 px-2 rounded">
                                 ▶ Run Simulation
                             </button>
                         </div>
                    </div>
                    <div ref={logContainerRef} className="bg-[#111827] border border-gray-700 rounded-lg h-48 overflow-y-auto p-3 font-mono text-xs space-y-1 shadow-inner">
                        {logs.map((log) => (
                            <div key={log.id}>
                                <span className={
                                    log.level === 'ok' ? 'text-green-500' : 
                                    log.level === 'warn' ? 'text-orange-500' : 
                                    log.level === 'err' ? 'text-red-500' : 'text-gray-500'
                                }>[{log.time}]</span> <span className="text-gray-300">{log.message}</span>
                            </div>
                        ))}
                        {logs.length === 0 && <span className="text-gray-600 italic">System ready. Waiting for events...</span>}
                    </div>
                </div>

                <div>
                    <h2 className="text-htb-accent text-sm font-bold uppercase mb-2">Attack Path Visualization</h2>
                    <div className="bg-[#111827] border border-gray-700 rounded-lg h-48 flex items-center justify-center relative overflow-hidden">
                        {simStep === 0 ? (
                            <div className="text-gray-500 text-xs text-center">
                                Run "Trace attack path"<br/>to visualize kill chain
                            </div>
                        ) : (
                            <svg width="100%" height="100%" viewBox="0 0 400 200" className="w-full h-full">
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                                    </marker>
                                </defs>
                                
                                {/* Timeline Labels */}
                                <text x="50" y="30" fill="#6b7280" fontSize="10" textAnchor="middle">Access</text>
                                <text x="150" y="30" fill="#6b7280" fontSize="10" textAnchor="middle">Exec</text>
                                <text x="250" y="30" fill="#6b7280" fontSize="10" textAnchor="middle">Lateral</text>
                                <text x="350" y="30" fill="#6b7280" fontSize="10" textAnchor="middle">Action</text>

                                {/* Edges - Animate based on steps */}
                                {simStep >= 2 && <line x1="70" y1="100" x2="130" y2="100" stroke="#ef4444" strokeWidth="2" />}
                                {simStep >= 3 && <line x1="170" y1="100" x2="230" y2="100" stroke="#f59e0b" strokeWidth="2" />}
                                {simStep >= 4 && <line x1="270" y1="100" x2="330" y2="100" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />}

                                {/* Nodes */}
                                {simStep >= 1 && (
                                    <g>
                                        <circle cx="50" cy="100" r="15" fill="#ef4444" stroke="#fff" strokeWidth="1"/>
                                        <text x="50" y="135" fill="#e5e7eb" fontSize="10" textAnchor="middle">Initial</text>
                                    </g>
                                )}
                                {simStep >= 2 && (
                                    <g>
                                        <circle cx="150" cy="100" r="15" fill="#f59e0b" stroke="#fff" strokeWidth="1"/>
                                        <text x="150" y="135" fill="#e5e7eb" fontSize="10" textAnchor="middle">Process</text>
                                    </g>
                                )}
                                {simStep >= 3 && (
                                    <g>
                                        <circle cx="250" cy="100" r="15" fill="#f59e0b" stroke="#fff" strokeWidth="1"/>
                                        <text x="250" y="135" fill="#e5e7eb" fontSize="10" textAnchor="middle">DB</text>
                                    </g>
                                )}
                                {simStep >= 4 && (
                                    <g>
                                        <circle cx="350" cy="100" r="20" fill="#10b981" stroke="#fff" strokeWidth="2"/>
                                        <text x="350" y="135" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">BLOCKED</text>
                                    </g>
                                )}
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-8 text-center border-t border-gray-800 pt-4 text-xs text-gray-500 font-mono">
                SecurityBot © — Defensive, lawful, explainable. All actions are logged and audit‑ready.<br/>
                Shortcuts: Ctrl+K (clear) | Ctrl+S (simulate)
            </footer>
        </div>
    </div>
  );
};

export default SecurityBot;

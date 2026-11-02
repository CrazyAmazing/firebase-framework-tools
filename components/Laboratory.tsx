
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const Laboratory: React.FC = () => {
  // Tokenizer State
  const [tokenText, setTokenText] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState(0);
  
  // Retokenizer State
  const [retokenMode, setRetokenMode] = useState<'hex' | 'base64' | 'bpe'>('bpe');
  const [retokenOutput, setRetokenOutput] = useState('');

  // Infinite Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [genStream, setGenStream] = useState<string[]>([]);
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Cash Appsolootlee State
  const [balance, setBalance] = useState(1337420);
  const [isCashing, setIsCashing] = useState(false);

  // Tokenization Heuristic
  useEffect(() => {
    const tokens = tokenText.length > 0 ? Math.ceil(tokenText.length / 3.7) : 0;
    setEstimatedTokens(tokens);

    // Update Retokenizer
    if (retokenMode === 'hex') {
      setRetokenOutput(Array.from(tokenText).map((c: string) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '));
    } else if (retokenMode === 'base64') {
      try { setRetokenOutput(btoa(tokenText)); } catch { setRetokenOutput('Encoding Error'); }
    } else {
      // Simulate BPE by highlighting sub-words
      setRetokenOutput(tokenText.split(/(\s+)/).map(w => w.trim() ? `|${w}|` : w).join(''));
    }
  }, [tokenText, retokenMode]);

  // Infinite Generator Loop
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        const hash = Math.random().toString(16).substring(2, 10).toUpperCase();
        const salience = (Math.random() * 0.9 + 0.1).toFixed(4);
        setGenCount(prev => prev + 1);
        setGenStream(prev => [...prev.slice(-12), `[0x${hash}] MINTED :: SALIENCE: ${salience}`]);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [genStream]);

  const handleCashApp = () => {
    setIsCashing(true);
    setTimeout(() => {
      setBalance(prev => prev + Math.floor(Math.random() * 5000));
      setIsCashing(false);
    }, 1200);
  };

  const getTacticalInsight = () => {
    switch(retokenMode) {
      case 'hex':
        return {
          title: "HEX: Binary & Shellcode",
          themeColor: "text-gray-400",
          bgColor: "bg-gray-900/10",
          borderColor: "border-gray-800",
          accentColor: "bg-gray-500",
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>,
          purpose: "Represents raw binary data in a human-readable 16-character format (0-9, A-F).",
          useCases: [
            "Shellcode Crafting: Representing CPU instructions as hex bytes for binary exploitation.",
            "Network Forensics: Analyzing non-printable characters and protocol headers in packet captures.",
            "WAF Bypass: Using hex-encoded strings to evade basic regex-based security filters."
          ]
        };
      case 'base64':
        return {
          title: "Base64: Exfiltration & Obfuscation",
          themeColor: "text-emerald-400",
          bgColor: "bg-emerald-900/10",
          borderColor: "border-emerald-900/30",
          accentColor: "bg-emerald-500",
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>,
          purpose: "Encodes raw binary data into a set of 64 printable ASCII characters. In offensive security, this is the premier method for tunneling non-text payloads (like compiled malware or compressed data) through character-restricted channels like HTTP headers, JSON fields, or DNS queries.",
          useCases: [
            "Data Exfiltration: Breaking down sensitive files into Base64-encoded segments to smuggle data out of a network without triggering Data Loss Prevention (DLP) filters programmed to look for cleartext patterns.",
            "PowerShell Obfuscation: Leveraging the `-EncodedCommand` flag to execute complex, multi-line malicious scripts as a single opaque string, successfully evading simple string-based EDR detection.",
            "Persistence Mechanisms: Storing payload components in the Windows Registry or as environment variables in an encoded state to hide them from casual inspection by administrators."
          ]
        };
      case 'bpe':
        return {
          title: "BPE: Prompt Intelligence",
          themeColor: "text-purple-400",
          bgColor: "bg-purple-900/10",
          borderColor: "border-purple-900/30",
          accentColor: "bg-purple-500",
          icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
          purpose: "A sub-word tokenization method used by LLMs to balance vocabulary size and text representation.",
          useCases: [
            "Prompt Injection: Identifying boundary vulnerabilities where specific sub-words trigger instruction overrides.",
            "Safety Jailbreaking: Crafting token sequences that the model's safety filter fails to categorize accurately.",
            "AI Forensics: Analyzing token density and entropy to distinguish between human and model-generated traffic."
          ]
        };
      default:
        return { title: "", purpose: "", useCases: [], themeColor: "", bgColor: "", borderColor: "", accentColor: "", icon: null };
    }
  };

  const insight = getTacticalInsight();

  return (
    <div className="flex flex-col lg:flex-row h-full bg-htb-dark font-mono overflow-hidden">
      
      {/* Left Column: Diagnostics */}
      <div className="flex-1 p-6 border-r border-gray-700 overflow-y-auto space-y-6">
        
        {/* Tokenizer Section */}
        <section className="bg-htb-panel border border-gray-700 rounded-lg p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-htb-accent font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-htb-accent animate-pulse"></span>
              Neural Tokenizer v4.0
            </h2>
            <div className="text-[10px] text-gray-500 bg-black/40 px-2 py-1 rounded">ESTIMATED_PRO_MODEL_V3</div>
          </div>
          
          <textarea
            value={tokenText}
            onChange={(e) => setTokenText(e.target.value)}
            className="w-full h-32 bg-gray-950 border border-gray-700 rounded p-3 text-sm text-white focus:outline-none focus:border-htb-accent resize-none placeholder-gray-700"
            placeholder="Input raw data for tokenization analysis..."
          />
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-900 p-3 rounded border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase">Token Count</div>
              <div className="text-2xl text-white font-black">{estimatedTokens.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900 p-3 rounded border border-gray-800">
              <div className="text-[10px] text-gray-500 uppercase">Byte Size</div>
              <div className="text-2xl text-emerald-500/80 font-black">{new Blob([tokenText]).size} B</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-800/50 text-[11px] text-gray-400 italic">
            <strong className="text-htb-accent uppercase">Security Context:</strong> Token counts determine the "cost" and complexity of LLM interactions. For defenders, monitoring token density can help identify automated scraping or large-scale data ingestion via AI proxies.
          </div>

          <div className="mt-4 space-y-4">
            <div className="p-4 bg-purple-900/10 border border-purple-900/30 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-purple-600/20 rounded">
                  <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Neural Logistics: Token Processing</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                LLMs utilize <span className="text-purple-300 font-bold">Sub-word Tokenization</span> (typically BPE or WordPiece) to convert text into numerical IDs. Unlike a simple character map, this allows the model to compress common words into single tokens while breaking rare words into manageable pieces.
              </p>
            </div>

            <div className="p-4 bg-orange-900/10 border border-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-orange-600/20 rounded">
                  <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Threat Vector: Context Displacement</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <span className="text-orange-300 font-bold">Context Window Management</span> is a finite resource. In high-level prompt injection attacks, malicious actors use "token flooding" to occupy the model's attention. By injecting thousands of irrelevant tokens, they can force the model's <span className="text-orange-200">First-In-First-Out (FIFO)</span> memory to discard original <span className="text-orange-200">System Instructions</span>, effectively leaving the model in an "instructionless" state susceptible to displacement.
              </p>
            </div>
          </div>
        </section>

        {/* Retokenizer Section */}
        <section className="bg-htb-panel border border-gray-700 rounded-lg p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-400 font-bold text-sm uppercase tracking-widest">
              Retokenizer Interface
            </h2>
            <div className="flex gap-2 p-1 bg-gray-900/80 rounded-lg border border-gray-800">
              {(['bpe', 'hex', 'base64'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setRetokenMode(mode)}
                  className={`px-3 py-1 text-[10px] font-black rounded-md uppercase transition-all duration-300 flex items-center gap-1.5 ${
                    retokenMode === mode 
                      ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] translate-y-[-1px]' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${retokenMode === mode ? 'bg-white animate-pulse' : 'bg-gray-700'}`}></div>
                  {mode}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full bg-gray-950 border border-gray-700 rounded p-3 text-xs text-blue-200/70 h-24 overflow-y-auto break-all font-mono mb-4">
            {retokenOutput || 'Awaiting input...'}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={retokenMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-5 rounded-xl border ${insight.borderColor} ${insight.bgColor} relative overflow-hidden shadow-2xl backdrop-blur-sm`}
            >
              {/* Decorative Background Icon */}
              <div className={`absolute -top-4 -right-4 p-4 opacity-5 transition-transform duration-500 scale-150`}>
                {insight.icon}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${insight.accentColor}/20 ${insight.themeColor}`}>
                  {insight.icon}
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] block opacity-50 ${insight.themeColor}`}>Tactical Insight</span>
                  <h3 className={`text-sm font-black uppercase tracking-wider ${insight.themeColor}`}>{insight.title}</h3>
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${insight.accentColor}/30`}></div>
                  <p className="text-[11px] text-gray-300 leading-relaxed pl-4">
                    {insight.purpose}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <span className={`text-[9px] font-bold uppercase tracking-widest block mb-1 opacity-40 ${insight.themeColor}`}>Strategic Vectors</span>
                  {insight.useCases.map((uc, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 bg-black/30 p-3 rounded-lg border border-white/5 group hover:border-white/10 transition-all hover:bg-black/50"
                    >
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${insight.accentColor} group-hover:scale-150 transition-transform`}></div>
                      <p className="text-[11px] text-gray-400 group-hover:text-gray-200 leading-snug">
                        {uc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Progress-like decorative bar at bottom */}
              <div className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${insight.accentColor}`} style={{ width: '100%' }}></div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 rounded-xl opacity-20 blur-xl pointer-events-none -z-10 ${insight.accentColor}`}></div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Infinite Token Generator */}
        <section className="bg-htb-panel border border-gray-700 rounded-lg p-5 shadow-lg relative overflow-hidden group">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-purple-400 animate-ping' : 'bg-gray-600'}`} />
              <h2 className="text-purple-400 font-bold text-sm uppercase tracking-widest">
                Infinite Token Mint
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setGenStream([]); setGenCount(0); }}
                className="px-2 py-1 bg-gray-900 border border-gray-800 text-[10px] text-gray-500 hover:text-gray-300 rounded transition-colors uppercase font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsGenerating(!isGenerating)}
                className={`px-4 py-1 rounded text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] ${
                  isGenerating ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-purple-600 text-white hover:bg-purple-500'
                }`}
              >
                {isGenerating ? 'Shutdown' : 'Engage Mint'}
              </button>
            </div>
          </div>

          <div className="h-44 bg-gray-950 border border-gray-700 rounded p-2 text-[10px] overflow-hidden flex flex-col justify-end gap-1.5 relative">
            {!isGenerating && genStream.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-700 uppercase font-bold text-[9px] tracking-widest">
                System Idle // Awaiting Engagement
              </div>
            )}
            {genStream.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-purple-500/80 font-mono flex justify-between items-center bg-purple-500/5 px-2 py-1 rounded border border-purple-500/10"
              >
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-purple-400" />
                  {s}
                </span>
                <span className="text-[8px] font-black text-purple-900 bg-purple-400/40 px-1 rounded">MINTED</span>
              </motion.div>
            ))}
            <div ref={streamEndRef} />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs border-t border-gray-800/50 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 uppercase text-[9px] font-bold tracking-tighter">Live_Metrics</span>
              <div className="w-24 h-1 bg-gray-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isGenerating ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-purple-500"
                />
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mb-1">MINTED_TOTAL</span>
              <span className="text-sm text-purple-400 font-black tracking-widest">
                {genCount.toLocaleString()} <span className="text-[10px] font-bold opacity-50">STIM</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Cash Appsolootlee App */}
      <div className="w-full lg:w-96 p-6 bg-gray-950 flex flex-col items-center">
        <div className="w-full max-w-[320px] bg-emerald-500 rounded-[40px] p-6 shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden aspect-[9/16] flex flex-col">
          
          {/* App Header */}
          <div className="flex justify-between items-center mb-10 text-emerald-950">
             <div className="font-black text-xl italic tracking-tighter">cashappsolootlee</div>
             <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center border border-emerald-600">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             </div>
          </div>

          {/* Balance */}
          <div className="flex-1 flex flex-col items-center justify-center text-emerald-950">
             <div className="text-sm font-bold uppercase opacity-60 mb-2">HTB OPS BALANCE</div>
             <div className="text-5xl font-black mb-1 flex items-start">
                <span className="text-2xl mt-2">$</span>
                <span className="tracking-tight">{balance.toLocaleString()}</span>
             </div>
             <div className="text-[10px] font-bold bg-emerald-600/20 px-2 py-0.5 rounded-full">ACTIVE_REVENUE_STREAM</div>
          </div>

          {/* Action Pad */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button className="bg-emerald-600/40 py-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-emerald-600/60 transition-colors">
              <svg className="w-6 h-6 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              <span className="text-[10px] font-bold text-emerald-950">ADD CASH</span>
            </button>
            <button className="bg-emerald-600/40 py-4 rounded-2xl flex flex-col items-center gap-1 hover:bg-emerald-600/60 transition-colors">
              <svg className="w-6 h-6 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
              <span className="text-[10px] font-bold text-emerald-950">TRANSFER</span>
            </button>
          </div>

          {/* Main Button */}
          <button 
            disabled={isCashing}
            onClick={handleCashApp}
            className={`w-full py-5 rounded-3xl font-black text-lg transition-all shadow-xl flex items-center justify-center ${
              isCashing ? 'bg-emerald-400 scale-95 opacity-50' : 'bg-emerald-950 text-emerald-400 hover:scale-[1.02]'
            }`}
          >
            {isCashing ? (
              <div className="w-6 h-6 border-4 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
            ) : 'APP‑SOLOOTLEE'}
          </button>

          {/* Nav Bar */}
          <div className="mt-8 flex justify-around opacity-40 text-emerald-950">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
        </div>
        
        <p className="mt-6 text-[10px] text-gray-600 uppercase text-center max-w-[200px]">
          App-Solootlee Billing v1.2<br/>
          Secure Payments for AI Infrastructure
        </p>
      </div>
    </div>
  );
};

export default Laboratory;

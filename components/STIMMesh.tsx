
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Shield, 
  Activity, 
  Database, 
  Cpu, 
  Share2, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  Play,
  RotateCcw,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { stimService, STIMToken, STIMInsight, TokenType } from '../services/stimService';

const STIMMesh: React.FC = () => {
  const [tokens, setTokens] = useState<STIMToken[]>([]);
  const [insights, setInsights] = useState<STIMInsight[]>([]);
  const [economy, setEconomy] = useState(stimService.getEconomyState());
  const [inputText, setInputText] = useState('');
  const [selectedTokenType, setSelectedTokenType] = useState<TokenType>(TokenType.SEMANTIC);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRouting, setIsRouting] = useState<string | null>(null);
  const [isRevaluing, setIsRevaluing] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokensRes, economyRes] = await Promise.all([
          fetch('/api/tokens-live'),
          fetch('/api/economy')
        ]);
        if (tokensRes.ok) setTokens(await tokensRes.json());
        if (economyRes.ok) setEconomy(await economyRes.json());
      } catch (err) {
        console.error('Failed to sync mesh:', err);
      }
    };

    const interval = setInterval(fetchData, 2000);
    fetchData(); // Initial load
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tokens]);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token_type: selectedTokenType,
          payload: { content: inputText },
          origin: 'UI-Manual-Ingest'
        })
      });

      if (res.ok) {
        const newToken = await res.json();
        setInsights(prev => [{
          minerId: 'UI-Ingest-0x1',
          description: `Manual ${selectedTokenType.toUpperCase()} Token Minted`,
          severity: 'INFO',
          data: { tokenId: newToken.id, hash: newToken.hash }
        }, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error('Ingest failed:', err);
    }

    setInputText('');
    setIsProcessing(false);
  };

  const handleRouteToken = async (id: string) => {
    setIsRouting(id);
    try {
      const res = await fetch(`/api/tokens/${id}/route`, { method: 'POST' });
      const decision = await res.json();
      setInsights(prev => [{
        minerId: 'Mesh-Router',
        description: `Token Routing Decision: ${decision.next_agent}`,
        severity: 'INFO',
        data: { reason: decision.reason, tokenId: id }
      }, ...prev].slice(0, 5));
    } catch (err) {
      console.error('Routing failed:', err);
    } finally {
      setIsRouting(null);
    }
  };

  const handleRevalueToken = async (id: string) => {
    setIsRevaluing(id);
    try {
      const res = await fetch(`/api/tokens/${id}/revalue`, { method: 'POST' });
      const result = await res.json();
      setInsights(prev => [{
        minerId: 'Valuation-Engine',
        description: `Token Revalued: ${result.value.toFixed(4)}`,
        severity: 'SUCCESS',
        data: { tokenId: id }
      }, ...prev].slice(0, 5));
    } catch (err) {
      console.error('Revaluation failed:', err);
    } finally {
      setIsRevaluing(null);
    }
  };

  const handleTransferToken = async (id: string) => {
    try {
      await fetch(`/api/tokens/${id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_agent: 'UI-Manual',
          to_agent: 'Sentinel-Relay-0x9',
          metadata: { intent: 'Manual Reallocation' }
        })
      });
      setInsights(prev => [{
        minerId: 'Mesh-Protocol',
        description: `Token Ownership Transferred`,
        severity: 'INFO',
        data: { tokenId: id, target: 'Sentinel-Relay-0x9' }
      }, ...prev].slice(0, 5));
    } catch (err) {
      console.error('Transfer failed:', err);
    }
  };

  const layers = [
    { name: 'Input Normalizer', color: 'bg-blue-500', icon: Database },
    { name: 'Multi-Stage Tokenizer', color: 'bg-emerald-500', icon: Layers },
    { name: 'Semantic Classifier', color: 'bg-purple-500', icon: Share2 },
    { name: 'Risk Engine', color: 'bg-red-500', icon: Shield },
    { name: 'Data Miner Mesh', color: 'bg-amber-500', icon: Cpu },
    { name: 'Retokenization Governor', color: 'bg-cyan-500', icon: Zap },
    { name: 'Output Synthesizer', color: 'bg-gray-500', icon: Activity },
  ];

  return (
    <div className="h-full bg-htb-dark text-gray-300 p-6 flex flex-col font-mono overflow-hidden">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            STIM: Sentinel Token Intelligence Mesh
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase">7-Layer Autonomous Intelligence Orchestrator // v2.4.0</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-gray-800 p-2 rounded-lg flex items-center gap-3">
             <div className="text-right">
                <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Market Cap</p>
                <p className="text-sm font-bold text-amber-400">{economy.totalValue.toFixed(2)} <span className="text-[10px] text-amber-400/50">ST</span></p>
             </div>
             <div className="text-right border-l border-gray-800 pl-3">
                <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Inflation</p>
                <p className="text-sm font-bold text-emerald-500">{(economy.inflation * 100).toFixed(1)}%</p>
             </div>
             <div className="text-right border-l border-gray-800 pl-3">
                <p className="text-[8px] text-gray-500 uppercase tracking-tighter">Processed</p>
                <p className="text-sm font-bold text-blue-500">{economy.processedTokens}</p>
             </div>
             <TrendingUp className="w-4 h-4 text-emerald-500 ml-2" />
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        {/* Left: Token Flow Visualizer */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 min-h-0">
          <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 shadow-2xl flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Live Token Intelligence Stream
               </h3>
               <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  MESH_SYNCHRONIZED
               </div>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-0"
            >
              <AnimatePresence>
                {tokens.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                    <Database className="w-12 h-12 mb-2 animate-pulse" />
                    <p className="text-xs">No active tokens in mesh. Initialize sub-systems.</p>
                  </div>
                ) : (
                  tokens.map((token) => (
                    <motion.div 
                      key={token.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setSelectedTokenId(selectedTokenId === token.id ? null : token.id)}
                      className={`bg-gray-900/50 border ${selectedTokenId === token.id ? 'border-amber-500/50 ring-1 ring-amber-500/20' : 'border-gray-800'} rounded p-3 cursor-pointer flex group hover:bg-gray-800/50 transition-all`}
                    >
                      <div className={`w-1 self-stretch rounded mr-3 ${
                        token.type === 'risk' ? 'bg-red-500' :
                        token.type === 'action' ? 'bg-amber-500' :
                        token.type === 'semantic' ? 'bg-purple-500' : 'bg-gray-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{token.type}</span>
                          <span className="text-[9px] text-gray-600 font-mono">[{token.hash}]</span>
                        </div>
                        <div className="text-sm font-bold text-gray-200">{token.content}</div>
                        {selectedTokenId === token.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-3 flex gap-2 overflow-hidden"
                          >
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRevalueToken(token.id); }}
                              disabled={isRevaluing === token.id}
                              className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                            >
                              <RefreshCw className={`w-3 h-3 ${isRevaluing === token.id ? 'animate-spin' : ''}`} />
                              REVALUE
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleRouteToken(token.id); }}
                              disabled={isRouting === token.id}
                              className="text-[9px] bg-blue-500/10 text-blue-500 border border-blue-500/30 px-2 py-1 rounded hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                            >
                              <Share2 className={`w-3 h-3 ${isRouting === token.id ? 'animate-pulse' : ''}`} />
                              ROUTE
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleTransferToken(token.id); }}
                              className="text-[9px] bg-purple-500/10 text-purple-500 border border-purple-500/30 px-2 py-1 rounded hover:bg-purple-500/20 transition-colors flex items-center gap-1"
                            >
                              <ArrowRight className="w-3 h-3" />
                              TRANSFER
                            </button>
                          </motion.div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-[10px] text-emerald-500/70 font-mono">VAL: ${(token.value).toFixed(2)}</div>
                        <div className="text-[8px] text-gray-600 mt-1 uppercase">{token.origin}</div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800 flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative group">
                  <button className="h-full bg-gray-800 border border-gray-700 px-3 rounded flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                    {selectedTokenType.toUpperCase()}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-full mb-2 left-0 w-32 bg-gray-900 border border-gray-700 rounded-lg shadow-xl hidden group-hover:block p-1 z-10">
                    {Object.values(TokenType).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedTokenType(type)}
                        className={`w-full text-left px-3 py-1.5 text-[10px] rounded hover:bg-gray-800 transition-colors uppercase ${selectedTokenType === type ? 'text-amber-500 bg-amber-500/5' : 'text-gray-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                  placeholder={`Mint unique ${selectedTokenType} token...`}
                  className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-2 rounded-md transition-all flex items-center gap-2 uppercase text-xs"
                >
                  <PlusCircle className="w-3 h-3" />
                  {isProcessing ? 'Minting...' : 'Mint'}
                </button>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    await fetch('/api/tokens/distill', { method: 'POST' });
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-[10px] font-bold text-gray-400 hover:text-white px-3 py-2 rounded border border-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  TRIGGER DISTILLATION CYCLE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Layer System & Insights */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0">
          {/* Layer Hierarchy Visualization */}
          <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 shadow-2xl">
             <h3 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                7-Layer Stack Architecture
             </h3>
             <div className="space-y-3">
               {layers.map((layer, i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${layer.color} shadow-lg transition-transform group-hover:scale-110`}>
                       <layer.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-gray-200 uppercase">{layer.name}</span>
                          <span className="text-[9px] text-gray-600">STIM.L{i+1}</span>
                       </div>
                       <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: isProcessing ? '100%' : '30%' }}
                            transition={{ duration: 0.5 }}
                            className={`h-full ${layer.color}`}
                          />
                       </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Real-time Insights */}
          <div className="bg-htb-panel border border-gray-700 rounded-xl p-5 shadow-2xl flex-1 flex flex-col min-h-0">
             <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Miner Intelligence Insights
             </h3>
             <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {insights.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-700">
                    <Database className="w-8 h-8 mb-2" />
                    <p className="text-[10px] text-center">No high-severity insights recorded in current session.</p>
                  </div>
                ) : (
                  insights.map((insight, i) => (
                    <div key={i} className="bg-gray-900 border border-red-900/30 rounded p-3">
                       <div className="flex justify-between items-center mb-2">
                          <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-red-500/20 text-red-400 uppercase">
                            {insight.severity} THREAT
                          </span>
                          <span className="text-[8px] text-gray-500 font-mono">{insight.minerId}</span>
                       </div>
                       <p className="text-xs font-bold text-gray-300 mb-2">{insight.description}</p>
                       <div className="bg-black/40 rounded p-2 text-[9px] font-mono text-gray-500">
                          {JSON.stringify(insight.data, null, 2)}
                       </div>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STIMMesh;

import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { securityService, SecurityDecision } from '../services/securityService';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'sentinel_chat_history';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      {
        id: '1',
        role: 'model',
        content: 'SENTINEL_MASTER_AI Online. I am the primary intelligence core of the HTB Sentinel Master Security Command Center.\n\nAll intelligence pipelines are standing by. Awaiting your parameters.',
        timestamp: Date.now()
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Switchboard states
  const [shieldMode, setShieldMode] = useState<'ON' | 'STAY_ON' | 'OFF'>('STAY_ON');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Persist messages to local storage
    const persistMessages = messages.filter(msg => !msg.isStreaming);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistMessages));
  }, [messages]);

  const clearHistory = () => {
    const initialMessage = [
      {
        id: uuidv4(),
        role: 'model' as const,
        content: 'Chat history cleared. Intelligence pipelines reset.',
        timestamp: Date.now()
      }
    ];
    setMessages(initialMessage);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSend = async (manualContent?: string) => {
    const contentToSend = manualContent || input;
    if (!contentToSend.trim() || isTyping) return;

    // --- Enterprise Security Analysis ---
    setIsTyping(true);
    const analysis = await securityService.analyzeContent(contentToSend);
    
    if (analysis.decision === SecurityDecision.BLOCK) {
        setMessages(prev => [...prev, 
            {
                id: uuidv4(),
                role: 'user',
                content: contentToSend,
                timestamp: Date.now()
            },
            {
                id: uuidv4(),
                role: 'system',
                content: `⚠️ SECURITY BLOCK: ${analysis.reason}\n\nThis interaction has been logged and blocked by HTB Enterprise Shield.\nTrace ID: ${analysis.metadata.traceId}\nPolicy: ${analysis.metadata.policyMatch}`,
                timestamp: Date.now()
            }
        ]);
        setInput('');
        setIsTyping(false);
        return;
    }

    const isRedacted = analysis.decision === SecurityDecision.REDACT;
    const finalContent = isRedacted 
        ? analysis.redactedContent || contentToSend 
        : contentToSend;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: finalContent,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    
    if (isRedacted) {
        newMessages.push({
            id: uuidv4(),
            role: 'system',
            content: `🛡️ CONTENT SANITIZED: ${analysis.reason}\nTrace ID: ${analysis.metadata.traceId}`,
            timestamp: Date.now()
        });
    }

    setMessages(newMessages);
    if (!manualContent) setInput('');

    // Provide context of shield to the AI implicitly
    const contextPrefix = `[SYSTEM STATE: Ent AI Shield=${shieldMode}] `;
    
    const modelMessageId = uuidv4();
    const initialModelMessage: Message = {
        id: modelMessageId,
        role: 'model',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
    };
    
    setMessages(prev => [...prev, initialModelMessage]);

    try {
        const stream = await geminiService.sendMessageStream(contextPrefix + userMessage.content);
        
        let fullContent = '';
        
        for await (const chunk of stream) {
            fullContent += chunk;
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === modelMessageId 
                        ? { ...msg, content: fullContent } 
                        : msg
                )
            );
        }

        setMessages(prev => 
            prev.map(msg => 
                msg.id === modelMessageId 
                    ? { ...msg, isStreaming: false } 
                    : msg
            )
        );

    } catch (error) {
        console.error("Chat error:", error);
        setMessages(prev => [
            ...prev, 
            {
                id: uuidv4(),
                role: 'system',
                content: "Error: Connection lost or API limit reached. Please check your configuration.",
                timestamp: Date.now()
            }
        ]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderToggle = (label: string, value: string, setter: (val: any) => void) => (
    <div className="mb-4">
      <div className="text-[10px] uppercase text-gray-500 font-mono mb-2 tracking-widest">{label}</div>
      <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800">
        <button 
          onClick={() => setter('ON')}
          className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${value === 'ON' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          ON
        </button>
        <button 
          onClick={() => setter('STAY_ON')}
          className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${value === 'STAY_ON' ? 'bg-blue-500/20 text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          STAY ON
        </button>
        <button 
          onClick={() => setter('OFF')}
          className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all ${value === 'OFF' ? 'bg-red-500/20 text-red-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
        >
          OFF
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden bg-htb-dark relative">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[90%] md:max-w-[85%] rounded-lg p-5 shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-blue-900/40 border border-blue-800/50 text-gray-100 rounded-tr-none' 
                    : msg.role === 'system'
                    ? 'bg-red-900/20 border border-red-800 text-red-300'
                    : 'bg-htb-panel border border-gray-700 text-gray-100 rounded-tl-none'
                }`}
              >
                {msg.role === 'model' && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700/50">
                     <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono border border-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]">AI</div>
                     <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">SENTINEL MASTER</span>
                  </div>
                )}

                {msg.role === 'user' ? (
                  <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <div className="text-sm md:text-base">
                    <MarkdownRenderer content={msg.content} />
                    {msg.isStreaming && (
                      <span className="inline-block w-2 h-4 ml-1 align-middle bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                )}
                
                <div className="mt-2 text-right">
                  <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-htb-panel border-t border-gray-700 shrink-0">
          <div className="max-w-5xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Sentinel Master for risk analysis, mining telemetry updates, or logic overrides..."
              className="w-full bg-htb-dark text-gray-100 rounded-lg pl-4 pr-14 py-4 focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-gray-600 resize-none font-sans text-sm h-14 max-h-48 overflow-y-auto shadow-inner"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 top-2 bottom-2 px-4 rounded-md flex items-center justify-center transition-all ${
                !input.trim() || isTyping 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">
             Human-Supervisor Console Active
          </p>
        </div>
      </div>

      {/* Right Sidebar - Switchboard */}
      <div className="hidden xl:block w-72 h-full bg-htb-panel border-l border-gray-700 p-6 overflow-y-auto">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 italic">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Switchboard
        </h3>

        <div className="space-y-6">
          {renderToggle('Enterprise AI Shield', shieldMode, setShieldMode)}
          
          <div className="bg-htb-dark p-4 rounded-lg border border-gray-800 mt-8">
             <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-2">Live Data Flow</div>
             <div className="flex flex-col gap-2 font-mono text-[9px] text-gray-400">
                <div className="flex justify-between">
                   <span>INPUT:</span>
                   <span className="text-blue-400">0.0 MB/s</span>
                </div>
                <div className="flex justify-between">
                   <span>ROUTER:</span>
                   <span className="text-emerald-400">IDLE</span>
                </div>
                <div className="flex justify-between">
                   <span>PIPELINE:</span>
                   <span className="text-purple-400">THREAT_ANALYSIS</span>
                </div>
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <button 
              onClick={clearHistory}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-900/10 border border-red-900/30 text-red-500 rounded-lg hover:bg-red-900/20 transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Purge History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;


import React, { useState, useEffect } from 'react';
import { ActiveView } from '../types';
import { auth, signInWithGoogle, logout } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (user) {
      await logout();
    } else {
      await signInWithGoogle();
    }
  };

  return (
    <header className="bg-htb-panel border-b border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-lg">
      <div className="flex items-center gap-6">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveView('landing')}
        >
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-white font-bold font-mono border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            &gt;_
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">HTB Sentinel</h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase">Creator J_P LaForest // ICubed Studios</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex bg-gray-900/50 rounded-lg p-1 border border-gray-700/50 overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => setActiveView('landing')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'landing' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            HOME
          </button>
          <button 
            onClick={() => setActiveView('tactical')}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'tactical' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            TACTICAL
          </button>
          <button 
             onClick={() => setActiveView('securitybot')}
             className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'securitybot' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            SECURITYBOT
          </button>
          <button 
             onClick={() => setActiveView('enterprise')}
             className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'enterprise' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ENTERPRISE
          </button>
          <button 
             onClick={() => setActiveView('sentinel')}
             className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'sentinel' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            GMAIL SENTINEL
          </button>
          <button 
             onClick={() => setActiveView('pricing')}
             className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'pricing' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            PRICING
          </button>
          <button 
             onClick={() => setActiveView('checkout')}
             className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'checkout' 
                ? 'bg-htb-panel text-white shadow-sm border border-gray-600' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            CHECKOUT
          </button>
          <div className="w-px h-4 bg-gray-700 mx-2"></div>
          <button 
             onClick={() => setActiveView('data-flow')}
             className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              activeView === 'data-flow' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' 
                : 'text-purple-500/60 hover:text-purple-400'
            }`}
          >
            DIAGRAM
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-400 font-mono">
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
             <span className="text-emerald-500/80 text-xs">UPLINK ESTABLISHED</span>
          </div>
          <div className="border-l border-gray-600 h-4 mx-2"></div>
          <span className="text-xs">v2.1.0-PRO</span>
        </div>

        <button 
          onClick={handleAuthAction}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all border ${
            user 
              ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' 
              : 'bg-emerald-500 text-htb-dark border-emerald-500/50 hover:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
          }`}
        >
          {user ? (
            <>
              <LogOut className="w-3 h-3" />
              LOGOUT
            </>
          ) : (
            <>
              <LogIn className="w-3 h-3" />
              LOGIN
            </>
          )}
        </button>
        
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || ''} 
              className="w-6 h-6 rounded-full border border-emerald-500/50" 
              referrerPolicy="no-referrer"
            />
            <span className="hidden lg:block text-[10px] text-gray-400 font-mono uppercase truncate max-w-[100px]">
              {user.displayName?.split(' ')[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

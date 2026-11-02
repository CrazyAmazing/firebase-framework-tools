import React, { useState } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import SecurityBot from './components/SecurityBot';
import EnterpriseSecurity from './components/EnterpriseSecurity';
import GmailSentinel from './components/GmailSentinel';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import CheckoutPage from './components/CheckoutPage';
import DataFlowDiagram from './components/DataFlowDiagram';
import { ActiveView } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setActiveView('checkout');
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-htb-dark overflow-hidden font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://picsum.photos/1920/1080')] bg-cover bg-center blend-overlay"></div>
        {/* Scanline effect overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] bg-gradient-to-b from-transparent via-white to-transparent bg-[length:100%_4px]"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {activeView === 'landing' ? (
              <LandingPage setActiveView={setActiveView} />
            ) : activeView === 'tactical' ? (
              <ChatInterface />
            ) : activeView === 'securitybot' ? (
              <SecurityBot />
            ) : activeView === 'enterprise' ? (
              <EnterpriseSecurity />
            ) : activeView === 'sentinel' ? (
              <GmailSentinel />
            ) : activeView === 'pricing' ? (
              <PricingPage setActiveView={setActiveView} />
            ) : activeView === 'checkout' ? (
              <CheckoutPage setActiveView={setActiveView} />
            ) : (
              <DataFlowDiagram />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { CreditCard, Lock, Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveView } from '../types';
import { useEffect } from 'react';

interface CheckoutPageProps {
  setActiveView: (view: ActiveView) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ setActiveView }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setIsSuccess(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
      
      const timer = setTimeout(() => setActiveView('tactical'), 4000);
      return () => clearTimeout(timer);
    }
  }, [setActiveView]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate transaction
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => setActiveView('tactical'), 3000);
    }, 2500);
  };

  return (
    <div className="h-full overflow-y-auto bg-htb-dark text-gray-200 custom-scrollbar p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-md w-full">
        <button 
          onClick={() => setActiveView('pricing')}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-mono mb-8 uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Pricing
        </button>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-htb-panel border border-emerald-500/50 rounded-2xl p-12 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 italic tracking-tight uppercase">Access Granted</h3>
            <p className="text-sm text-gray-500 mb-8 font-mono">ENCRYPTED_TRANSACTION_RECONCILED</p>
            <p className="text-sm text-gray-400">Redirecting to Tactical Command Core...</p>
          </motion.div>
        ) : (
          <div className="bg-htb-panel border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
               <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Secure Checkout</h3>
               <div className="flex gap-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <Shield className="w-4 h-4 text-emerald-500" />
               </div>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Cardholder Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="JOHN DOE"
                    className="w-full bg-black/40 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full bg-black/40 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700" 
                    />
                    <CreditCard className="w-4 h-4 text-gray-600 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Expiry Date</label>
                    <input 
                      type="text" 
                      required
                      placeholder="MM/YY"
                      className="w-full bg-black/40 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">CVV</label>
                    <input 
                      type="text" 
                      required
                      placeholder="XXX"
                      className="w-full bg-black/40 border border-gray-800 rounded-lg px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-all placeholder:text-gray-700" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-xs mb-2">
                   <span className="text-gray-500 uppercase">Subtotal</span>
                   <span className="text-white">$49.00</span>
                </div>
                <div className="flex justify-between text-xs mb-6 pb-4 border-b border-gray-800">
                   <span className="text-gray-500 uppercase">Tax</span>
                   <span className="text-white">$0.00</span>
                </div>
                <div className="flex justify-between text-base font-black mb-8 italic tracking-tighter">
                   <span className="text-white uppercase">Total</span>
                   <span className="text-emerald-500">$49.00</span>
                </div>

                <button 
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden relative ${
                    isProcessing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-emerald-500 text-htb-dark hover:bg-emerald-400'
                  }`}
                >
                  <span className={isProcessing ? 'opacity-0' : 'opacity-100'}>
                    Complete Upgrade
                  </span>
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              </div>
            </form>
            <div className="bg-gray-900/50 p-4 text-[9px] text-gray-600 text-center uppercase tracking-widest">
               Encrypted by Sentinel Core SSL // ICubed Studios // J_P LaForest
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;

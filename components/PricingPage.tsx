import React from 'react';
import { Check, Shield, Zap, Cpu, Globe, Lock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveView } from '../types';

import { loadStripe } from '@stripe/stripe-js';

import { auth } from '../services/firebase';

const getStripe = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error('STRIPE_PUBLISHABLE_KEY_MISSING');
  }
  return loadStripe(key);
};

interface PricingPageProps {
  setActiveView: (view: ActiveView) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ setActiveView }) => {
  const [loadingPlan, setLoadingPlan] = React.useState<string | null>(null);
  const [stripeError, setStripeError] = React.useState<string | null>(null);

  const handleSubscribe = async (tier: any) => {
    if (tier.name === "Free") {
      setActiveView('tactical');
      return;
    }
    
    if (tier.name === "Enterprise") {
      // Simulate contact sales
      alert("Relaying message to ICubed Studios sales uplink...");
      return;
    }

    try {
      setLoadingPlan(tier.name);
      setStripeError(null);

      const stripePromise = getStripe();
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: tier.name.toLowerCase(),
          planName: tier.name,
          price: parseFloat(tier.price.replace('$', '')),
          email: auth.currentUser?.email || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const session = await response.json();
      const stripe = await stripePromise;
      
      if (stripe && session.id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
        if (error) {
          throw error;
        }
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (err.message === 'STRIPE_PUBLISHABLE_KEY_MISSING') {
        setStripeError('Stripe API Key is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment.');
      } else {
        setStripeError(err.message || 'An error occurred during checkout initialization.');
      }
    } finally {
      setLoadingPlan(null);
    }
  };
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Basic security for casual users.",
      features: [
        "Tactical Chat Interface",
        "Basic Phishing Detection",
        "Single Node Monitoring",
        "Community Threat Intel"
      ],
      cta: "Current Plan",
      highlight: false,
      icon: <Globe className="w-6 h-6 text-gray-400" />
    },
    {
      name: "Consumer",
      price: "$19",
      description: "Enhanced protection for individuals.",
      features: [
        "Everything in Free",
        "Gmail Sentinel Pro (Limited)",
        "3 Node Logic Monitoring",
        "Daily Threat Reports",
        "Email Notifications"
      ],
      cta: "Get Started",
      highlight: false,
      icon: <Shield className="w-6 h-6 text-blue-400" />
    },
    {
      name: "Pro",
      price: "$49",
      description: "Professional grade security suite.",
      features: [
        "Everything in Consumer",
        "Full Gmail Sentinel Pro",
        "Gravity Physics Terminal",
        "Advanced Anomaly Detection",
        "Hardware Profile Audits",
        "Priority Support"
      ],
      cta: "Go Pro",
      highlight: true,
      icon: <Zap className="w-6 h-6 text-emerald-400" />
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Bespoke protection for organizations.",
      features: [
        "Everything in Pro",
        "Enterprise AI Shield Matrix",
        "Microsoft Entra/Purview Hooks",
        "Custom Remediation Playbooks",
        "24/7 Response Uplink",
        "SLA Guarantees"
      ],
      cta: "Contact Sales",
      highlight: false,
      icon: <Cpu className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-htb-dark text-gray-200 custom-scrollbar p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">
            SENTINEL <span className="text-emerald-500">PRICING</span>
          </h2>
          <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Select your operational clearance level</p>
          
          {stripeError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-mono max-w-2xl mx-auto"
            >
              <Lock className="w-4 h-4 inline mr-2 mb-1" />
              {stripeError}
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-htb-panel border ${tier.highlight ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-gray-800'} rounded-2xl flex flex-col overflow-hidden group`}
            >
              {tier.highlight && (
                <div className="bg-emerald-500 text-htb-dark text-[10px] font-black uppercase tracking-widest text-center py-1">
                  Most Popular
                </div>
              )}
              <div className="p-8 flex-1">
                <div className="mb-6 flex justify-between items-start">
                  <div className="p-2 bg-gray-900 rounded-lg">
                    {tier.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-gray-500 text-xs ml-1 uppercase">/mo</span>}
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">{tier.name}</h3>
                <p className="text-xs text-gray-500 mb-8 leading-relaxed">{tier.description}</p>
                <div className="space-y-4">
                  {tier.features.map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-xs text-gray-400">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 pt-0">
                <button 
                  onClick={() => handleSubscribe(tier)}
                  disabled={loadingPlan === tier.name}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    loadingPlan === tier.name ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                    tier.highlight 
                      ? 'bg-emerald-500 text-htb-dark hover:bg-emerald-400' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {loadingPlan === tier.name && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                  {tier.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-gray-900/40 border border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="p-4 bg-emerald-500/10 rounded-full">
                 <Shield className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                 <h4 className="text-white font-bold text-lg mb-1 italic tracking-tight">Need a custom security audit?</h4>
                 <p className="text-sm text-gray-500">Contact our node engineers for specialized enterprise deployment and hardware optimization.</p>
              </div>
           </div>
           <button className="px-8 py-4 bg-transparent border-2 border-emerald-500 text-emerald-500 font-black rounded-lg hover:bg-emerald-500 hover:text-htb-dark transition-all">
              TALK TO AN ENGINEER
           </button>
        </div>
        <div className="mt-12 text-center">
           <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.4em]">
             Created by J_P LaForest // ICubed Studios // v1.0.4
           </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

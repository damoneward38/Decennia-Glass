import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Lock, Truck } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'cookies' | 'shipping';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [tab, setTab] = useState<'terms' | 'privacy' | 'cookies' | 'shipping'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-3xl bg-[#09090e] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-white/60" />
              <div>
                <h2 className="font-serif text-2xl italic">Atelier Governance & Provenance</h2>
                <p className="text-[11px] text-white/50 font-mono font-light">
                  Decennia Atelier Studio 41-B institutional policies & legal safeguards.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/5 overflow-x-auto">
            <button
              onClick={() => setTab('terms')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'terms' ? 'border-white text-white font-bold' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Terms of Acquisition
            </button>
            <button
              onClick={() => setTab('privacy')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'privacy' ? 'border-white text-white font-bold' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Client Confidentiality
            </button>
            <button
              onClick={() => setTab('shipping')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'shipping' ? 'border-white text-white font-bold' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              White-Glove Shipping
            </button>
            <button
              onClick={() => setTab('cookies')}
              className={`pb-3 px-3 text-xs font-mono uppercase tracking-wider transition-colors border-b-2 ${
                tab === 'cookies' ? 'border-white text-white font-bold' : 'border-transparent text-white/40 hover:text-white'
              }`}
            >
              Data & Cookies
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-xs md:text-sm text-white/70 font-light leading-relaxed">
            {tab === 'terms' && (
              <div className="space-y-4">
                <h3 className="font-serif italic text-lg text-white">Certificate of Provenance & Lifetime Warranty</h3>
                <p>
                  Every piece originating from Decennia Atelier is accompanied by an authenticated Certificate of Provenance
                  signed by the master craftsman and cataloged in our permanent studio ledger.
                </p>
                <p>
                  All structural glass sculptures undergo non-destructive photoelastic stress analysis. We guarantee our laboratory-grade
                  borosilicate 3.3 and quartz formulations against spontaneous thermal fracture for the lifetime of the installation under standard indoor environmental tolerances (-10°C to +45°C).
                </p>
                <p>
                  Commissions require a 50% non-refundable deposit upon structural drawing approval. Kiln annealing schedules are authoritatively tracked and documented.
                </p>
              </div>
            )}

            {tab === 'privacy' && (
              <div className="space-y-4">
                <h3 className="font-serif italic text-lg text-white">Collector & Institutional Discretion</h3>
                <p>
                  Decennia Atelier upholds strict privacy standards for private acquisitions, museum endowments, and architectural installations.
                </p>
                <p>
                  Client contact details, delivery coordinates, and valuation figures are never disseminated or utilized for third-party commercial marketing. All communication concerning private commissions is encrypted and retained solely within Studio 41-B archival records.
                </p>
              </div>
            )}

            {tab === 'shipping' && (
              <div className="space-y-4">
                <h3 className="font-serif italic text-lg text-white">Museum-Grade Transport & Logistics</h3>
                <p>
                  Each glass piece is suspended within a custom CNC-milled closed-cell polyethylene foam cradle housed inside a reinforced Baltic birch or aluminum flight crate.
                </p>
                <p>
                  Shipments include active 3-axis drop and shock indicator sensors (ShockWatch & TiltWatch). We partner exclusively with fine-art logistics specialists ensuring climate-controlled, white-glove delivery directly to your gallery or residence.
                </p>
              </div>
            )}

            {tab === 'cookies' && (
              <div className="space-y-4">
                <h3 className="font-serif italic text-lg text-white">Minimal Digital Footprint</h3>
                <p>
                  This atelier web application uses only essential session state storage to maintain your active archive query preferences, kiln simulator inputs, and terminal session state.
                </p>
                <p>
                  We deploy zero third-party advertising trackers or behavioral cross-site analytics scripts.
                </p>
              </div>
            )}
          </div>

          <div className="p-4 px-6 border-t border-white/10 bg-white/[0.02] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all"
            >
              Acknowledge & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

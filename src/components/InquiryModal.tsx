import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, ShieldCheck, Clock, MapPin, Sparkles } from 'lucide-react';
import { GlassPiece, InquirySubmission } from '../types';
import { submitInquiry } from '../services/api';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPiece?: GlassPiece | null;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  selectedPiece,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState<InquirySubmission['inquiryType']>('Acquisition');
  const [budgetRange, setBudgetRange] = useState('$15,000 – $35,000 USD');
  const [timeline, setTimeline] = useState('Immediate / Ready to Ship');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    referenceCode: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (selectedPiece) {
      setInquiryType('Acquisition');
      setMessage(`I am inquiring regarding acquisition and logistics coordination for "${selectedPiece.title}" (${selectedPiece.serialNumber}, ${selectedPiece.category}).`);
    } else {
      setMessage('');
    }
  }, [selectedPiece, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email, and inquiry details.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await submitInquiry({
        fullName,
        email,
        inquiryType,
        pieceId: selectedPiece?.id,
        pieceTitle: selectedPiece?.title,
        budgetRange,
        timeline,
        message
      });

      setConfirmation({
        referenceCode: res.referenceCode,
        message: res.message
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit inquiry.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmation(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-2xl bg-[#09090e] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden my-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-white/60" />
              <div>
                <h2 className="font-serif text-2xl italic">Atelier Inquiries & Commissions</h2>
                <p className="text-[11px] text-white/50 font-mono font-light">
                  Direct liaison with Decennia Studio 41-B curation.
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto">
            {confirmation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                    Dossier Confirmed
                  </span>
                  <h3 className="font-serif text-2xl italic">Inquiry Received</h3>
                  <div className="inline-block px-4 py-1.5 rounded-lg bg-white/10 font-mono text-base tracking-widest text-white mt-2">
                    {confirmation.referenceCode}
                  </div>
                  <p className="text-xs text-white/60 font-light leading-relaxed pt-2">
                    {confirmation.message}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 font-mono max-w-md mx-auto flex items-center justify-around">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> Response: &lt; 24h
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={13} /> Museum Insured
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> Global Courier
                  </span>
                </div>

                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg"
                >
                  Return to Atelier
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {selectedPiece && (
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                    <img
                      src={selectedPiece.img}
                      alt={selectedPiece.title}
                      className="w-12 h-12 object-cover rounded-lg border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-mono text-white/40 block">
                        Target Piece ({selectedPiece.serialNumber})
                      </span>
                      <h4 className="font-serif text-base italic text-white truncate">
                        {selectedPiece.title}
                      </h4>
                      <span className="text-xs text-white/60 font-mono">
                        {selectedPiece.price || 'Inquire on Commission'}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. elena@curator.ch"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                      Inquiry Type
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value as any)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono cursor-pointer"
                    >
                      <option value="Acquisition">Acquisition</option>
                      <option value="Commission">Bespoke Commission</option>
                      <option value="Gallery Viewing">Private Viewing</option>
                      <option value="Architectural Collaboration">Architectural</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                      Estimated Budget
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono cursor-pointer"
                    >
                      <option value="$10,000 – $25,000 USD">$10,000 – $25,000 USD</option>
                      <option value="$25,000 – $50,000 USD">$25,000 – $50,000 USD</option>
                      <option value="$50,000 – $100,000+ USD">$50,000 – $100,000+ USD</option>
                      <option value="Institutional / Museum">Institutional / Museum</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                      Target Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono cursor-pointer"
                    >
                      <option value="Immediate / Ready to Ship">Ready to Ship</option>
                      <option value="Within 4–8 Weeks">Within 4–8 Weeks</option>
                      <option value="Q3/Q4 2026 Architectural">Late 2026</option>
                      <option value="Flexible / Exhibition Date">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/60">
                    Message / Specifications *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details on display dimensions, lighting conditions, gallery location, or custom annealing requests..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-light leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="text-[10px] font-mono text-white/40 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    White-glove climate-regulated transport.
                  </span>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={13} />
                    <span>{loading ? 'Transmitting...' : 'Transmit Dossier'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

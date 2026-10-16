import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Flame, Sparkles, Compass, ArrowRight, Eye, Scale, Layers } from 'lucide-react';
import { GlassPiece } from '../types';

interface PieceDetailModalProps {
  piece: GlassPiece | null;
  onClose: () => void;
  onAcquire: (piece: GlassPiece) => void;
}

export const PieceDetailModal: React.FC<PieceDetailModalProps> = ({
  piece,
  onClose,
  onAcquire,
}) => {
  if (!piece) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-[#09090d] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 my-auto text-white flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">
                {piece.serialNumber}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
              <span className="text-[11px] uppercase tracking-wider text-white/60">
                {piece.category}
              </span>
              {piece.status === 'Available' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[9px] uppercase tracking-widest font-mono">
                  Available
                </span>
              )}
              {piece.status === "Biennale '24" && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] uppercase tracking-widest font-mono">
                  Biennale '24
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Image side */}
              <div className="md:col-span-5 relative group">
                <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                  <img
                    src={piece.img}
                    alt={piece.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-white/60">
                    <span>POLARISCOPE: 0.00λ</span>
                    <span>STUDIO 41-B</span>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center text-[10px] text-white/40 font-mono">
                  <span>SERIES ID: #{piece.id}</span>
                  <span>YEAR: {piece.year}</span>
                </div>
              </div>

              {/* Specs & Description side */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl italic text-white mb-2">
                    {piece.title}
                  </h2>
                  <p className="text-xs md:text-sm text-white/60 font-light leading-relaxed">
                    {piece.curatorNotes}
                  </p>
                </div>

                {/* Laboratory Specs Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px]">
                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block flex items-center gap-1">
                      <Sparkles size={11} /> Glass Composition
                    </span>
                    <span className="text-white font-medium">{piece.glassType}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block flex items-center gap-1">
                      <Eye size={11} /> Refractive Index (nD)
                    </span>
                    <span className="text-white font-medium">{piece.refractiveIndex}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block flex items-center gap-1">
                      <Flame size={11} /> Annealing Profile
                    </span>
                    <span className="text-white font-medium">{piece.annealTemp}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block flex items-center gap-1">
                      <Layers size={11} /> Dimensions
                    </span>
                    <span className="text-white font-medium">{piece.dimensions}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block flex items-center gap-1">
                      <Scale size={11} /> Net Mass
                    </span>
                    <span className="text-white font-medium">{piece.weight}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-white/40 text-[9px] uppercase tracking-wider block flex items-center gap-1">
                      <Compass size={11} /> Provenance
                    </span>
                    <span className="text-white font-medium truncate block" title={piece.provenance}>
                      {piece.provenance}
                    </span>
                  </div>
                </div>

                {/* Certification Note */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <ShieldCheck size={18} className="text-white/50 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    Every piece is annealed in an atmosphere-controlled kiln, inspected under polarized light
                    for residual strain, and shipped in a custom shock-absorbent archival crate.
                  </p>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-white/40 block">
                      Valuation / Status
                    </span>
                    <span className="font-serif text-xl italic text-white">
                      {piece.price || 'Inquire on Commission'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        onClose();
                        onAcquire(piece);
                      }}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg hover:shadow-white/20"
                    >
                      <span>Inquire / Acquire</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

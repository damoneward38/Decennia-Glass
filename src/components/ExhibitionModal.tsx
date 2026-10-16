import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Compass, ArrowRight, ExternalLink } from 'lucide-react';

interface ExhibitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreWorks: () => void;
}

export const ExhibitionModal: React.FC<ExhibitionModalProps> = ({
  isOpen,
  onClose,
  onExploreWorks,
}) => {
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
          className="relative w-full max-w-3xl bg-[#09090e] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden my-auto flex flex-col"
        >
          {/* Cover image banner */}
          <div className="h-48 sm:h-64 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1518005021503-49fd163f451f?auto=format&fit=crop&q=80&w=1200"
              alt="Biennale Installation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-[#09090e]/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-white/60 hover:text-white backdrop-blur-md transition-colors"
            >
              <X size={18} />
            </button>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 block mb-1">
                EXHIBITION DOSSIER • PAVILION ARSENALE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl italic text-white">
                The Venice Biennale '24
              </h2>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
            <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-white/60 border-b border-white/10 pb-4">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-white/40" /> Giardini della Biennale, Venice, Italy
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-white/40" /> April 20 – November 24, 2024
              </span>
              <span className="flex items-center gap-1.5">
                <Compass size={14} className="text-white/40" /> Curation: Atelier Decennia
              </span>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-white/70 font-light leading-relaxed">
              <p>
                Representing a culmination of ten years of research in structural borosilicate annealing,
                Decennia presents <span className="text-white font-medium italic">"Lattice of Refraction"</span> — an immersive spatial pavilion comprising twelve monumental borosilicate monoliths.
              </p>
              <p>
                Each monolith interacts with the tidal lagoon sunlight of Venice, bending and projecting
                chromatic spectrums onto the centuries-old brick vaults of the Arsenale. The exhibition interrogates
                the permeability between architectural permanence and optical transience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[11px]">
              <div>
                <span className="text-white/40 text-[9px] uppercase tracking-wider block">Total Works</span>
                <span className="text-white font-medium">12 Monolithic Installations</span>
              </div>
              <div>
                <span className="text-white/40 text-[9px] uppercase tracking-wider block">Glass Aggregate</span>
                <span className="text-white font-medium">4,200 kg Vitreous Silica</span>
              </div>
              <div>
                <span className="text-white/40 text-[9px] uppercase tracking-wider block">Critical Acclaim</span>
                <span className="text-white font-medium">Golden Lion Nominee</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono text-white/40">
                Studio 41-B Curatorial Commission No. 88
              </span>
              <button
                onClick={() => {
                  onClose();
                  onExploreWorks();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg"
              >
                <span>View Biennale Pieces in Archive</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

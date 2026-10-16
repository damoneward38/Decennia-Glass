import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface AwardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AWARDS = [
  { year: '2025', title: 'Compasso d’Oro International', category: 'Precision Glass Sculpture', jury: 'Milan Triennale Foundation' },
  { year: '2024', title: 'Venice Biennale Golden Lion Nominee', category: 'Architectural Installation', jury: 'La Biennale di Venezia' },
  { year: '2024', title: 'Corning Museum of Glass Rakow Commission', category: 'Experimental Borosilicate', jury: 'CMOG International Board' },
  { year: '2023', title: 'European Craftsmanship Laureate', category: 'High-Temperature Kiln Innovation', jury: 'Brussels Craft Council' },
  { year: '2023', title: 'Kyoto Triennial Grand Prize in Glass Art', category: 'Refractive Monoliths', jury: 'Kyoto Arts Academy' },
  { year: '2022', title: 'Swiss Design Award in Applied Arts', category: 'Optical Vessel Geometry', jury: 'Federal Office of Culture Bern' },
  { year: '2021', title: 'Murano Contemporary Master Honor', category: 'Vitreous Fusion Technique', jury: 'Consorzio Promovetro Murano' },
  { year: '2020', title: 'Architectural Digest Great Design Award', category: 'Light & Sculpture', jury: 'AD Global Editorial' },
  { year: '2019', title: 'London Glass Biennale First Distinction', category: 'Zero-Birefringence Annealing', jury: 'LGB Jury Panel' },
  { year: '2019', title: 'Red Dot: Best of the Best', category: 'Laboratory Apparatus Aesthetics', jury: 'Essen Design Center' },
  { year: '2018', title: 'Nordic Glass Arts Prize', category: 'Monochrome Cast Glass', jury: 'Stockholm Glass Museum' },
  { year: '2017', title: 'Tokyo Glass Art Triennial Award of Excellence', category: 'Optical Crown Prisms', jury: 'Tokyo Metropolitan Art Museum' },
  { year: '2016', title: 'Coburg Prize for Contemporary Glass', category: 'Debut Atelier Solo', jury: 'Kunstsammlungen der Veste Coburg' },
  { year: '2016', title: 'Atelier Inauguration Gold Medal', category: 'Master Craftsman Certification', jury: 'Vitreous Arts Guild' },
];

export const AwardsModal: React.FC<AwardsModalProps> = ({ isOpen, onClose }) => {
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
              <Award size={20} className="text-white/60" />
              <div>
                <h2 className="font-serif text-2xl italic">14 International Distinctions</h2>
                <p className="text-[11px] text-white/50 font-mono font-light">
                  A decade of peer-recognized mastery in glass science and fine sculptural arts (2016–2026).
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

          {/* List */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-3">
            {AWARDS.map((award, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/40 px-2 py-0.5 rounded bg-white/5">
                      {award.year}
                    </span>
                    <h3 className="font-serif italic text-base text-white">{award.title}</h3>
                  </div>
                  <p className="text-xs text-white/60 font-light">{award.category}</p>
                </div>
                <div className="text-right text-[10px] font-mono text-white/40 shrink-0">
                  {award.jury}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 px-6 border-t border-white/10 bg-white/[0.02] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all"
            >
              Close Dossier
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

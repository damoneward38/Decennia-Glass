import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreArchive: () => void;
}

const ARTICLES = [
  {
    date: 'March 2026',
    readTime: '6 min read',
    title: 'The Thermodynamics of Stillness: Controlled 72-Hour Annealing',
    subtitle: 'Why internal lattice stress is the enemy of light transmission, and how our custom cooling profile removes molecular shear.',
    author: 'Damone Ward & Curation Team',
    img: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&q=80&w=800'
  },
  {
    date: 'January 2026',
    readTime: '4 min read',
    title: 'From Murano to the Modern Cleanroom: A Ten-Year Retrospective',
    subtitle: 'Reflecting on 1,200 unique glass pieces: bridging centuries of Venetian blowpipe traditions with laboratory-grade borosilicate 3.3.',
    author: 'Decennia Studio 41-B',
    img: 'https://images.unsplash.com/photo-1518005021503-49fd163f451f?auto=format&fit=crop&q=80&w=800'
  },
  {
    date: 'November 2025',
    readTime: '8 min read',
    title: 'Polariscope Diagnostics: Reading the Invisible Tension in Crystal',
    subtitle: 'A technical exploration of photoelasticity, birefringence, and how zero-fringe verification guarantees structural permanence.',
    author: 'Optical Engineering Lab',
    img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800'
  }
];

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  onExploreArchive,
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
          className="relative w-full max-w-4xl bg-[#09090e] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-white/60" />
              <div>
                <h2 className="font-serif text-2xl italic">Decennia Atelier Journal</h2>
                <p className="text-[11px] text-white/50 font-mono font-light">
                  Essays on optical physics, kiln metallurgy, and the philosophy of transparency.
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

          {/* Articles list */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-8">
            {ARTICLES.map((art, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all items-center"
              >
                <div className="md:col-span-4 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 relative">
                  <img
                    src={art.img}
                    alt={art.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.author}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl italic text-white leading-tight">
                    {art.title}
                  </h3>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-white/40">
            <span>Published by Decennia Atelier Press</span>
            <button
              onClick={() => {
                onClose();
                onExploreArchive();
              }}
              className="flex items-center gap-2 text-white hover:underline"
            >
              <span>Explore 1,200+ Works in Archive</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

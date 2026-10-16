import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, PlusCircle, Layers, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  onOpenArchive: () => void;
  onOpenForge: () => void;
  onOpenInquiry: () => void;
  totalPiecesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenArchive,
  onOpenForge,
  onOpenInquiry,
  totalPiecesCount = 1200,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 md:px-16 h-20 md:h-24 flex items-center border-b',
        isScrolled
          ? 'bg-[#08080a]/90 backdrop-blur-md border-white/10 shadow-2xl'
          : 'bg-transparent border-white/5'
      )}
    >
      <div className="w-full flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-4 group cursor-pointer">
          <span className="text-2xl text-white group-hover:scale-110 transition-transform">◈</span>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.4em] uppercase leading-none text-white">
              DECENNIA
            </span>
            <span className="text-[9px] tracking-[0.6em] uppercase text-white/40 mt-1">
              ATELIER GLASS • 2016–2026
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          <a
            href="#collection"
            className="text-[10px] uppercase tracking-extra font-medium text-white/60 hover:text-white transition-colors"
          >
            Collection
          </a>

          {/* Interactive Archive Button with Live Count */}
          <button
            onClick={onOpenArchive}
            className="flex items-center gap-2 text-[10px] uppercase tracking-extra font-medium text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <Layers size={13} className="text-white/40" />
            <span>Archive ({totalPiecesCount}+)</span>
          </button>

          <a
            href="#process"
            className="text-[10px] uppercase tracking-extra font-medium text-white/60 hover:text-white transition-colors"
          >
            Methodology
          </a>

          <a
            href="#about"
            className="text-[10px] uppercase tracking-extra font-medium text-white/60 hover:text-white transition-colors"
          >
            Atelier
          </a>

          <button
            onClick={onOpenInquiry}
            className="text-[10px] uppercase tracking-extra font-medium text-white/60 hover:text-white transition-colors"
          >
            Inquire
          </button>

          <div className="w-[1px] h-6 bg-white/20 ml-2" />

          {/* Forge Button */}
          <button
            onClick={onOpenForge}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-black border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer"
          >
            <PlusCircle size={13} />
            <span>Forge Piece</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenForge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white text-[10px] font-mono uppercase tracking-wider"
          >
            <PlusCircle size={12} /> Forge
          </button>
          <button
            className="text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#08080a] border-t border-white/10 p-8 flex flex-col gap-6 lg:hidden shadow-2xl"
          >
            <a
              href="#collection"
              className="text-sm font-light tracking-widest text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collection
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenArchive();
              }}
              className="text-left text-sm font-light tracking-widest text-white/80 hover:text-white flex items-center justify-between"
            >
              <span>Explore Archive</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-white">
                {totalPiecesCount}+
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenForge();
              }}
              className="text-left text-sm font-light tracking-widest text-white/80 hover:text-white flex items-center gap-2"
            >
              <PlusCircle size={15} />
              <span>Forge Custom Piece</span>
            </button>

            <a
              href="#process"
              className="text-sm font-light tracking-widest text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Methodology & Annealing
            </a>

            <a
              href="#about"
              className="text-sm font-light tracking-widest text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              About the Atelier
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="text-left text-sm font-light tracking-widest text-white/80 hover:text-white"
            >
              Commission & Inquiries
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

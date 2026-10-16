/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  Sparkles, 
  Droplets, 
  Flame, 
  ShieldCheck, 
  Layers, 
  PlusCircle, 
  Compass, 
  Eye, 
  Award, 
  BookOpen, 
  Info,
  Calendar
} from 'lucide-react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navigation } from './components/Navigation';
import { GhostTerminal } from './components/GhostTerminal';
import { PieceDetailModal } from './components/PieceDetailModal';
import { ArchiveExplorerModal } from './components/ArchiveExplorerModal';
import { AtelierForgeModal } from './components/AtelierForgeModal';
import { InquiryModal } from './components/InquiryModal';
import { ExhibitionModal } from './components/ExhibitionModal';
import { AwardsModal } from './components/AwardsModal';
import { JournalModal } from './components/JournalModal';
import { PolicyModal } from './components/PolicyModal';
import { GlassPiece, AtelierStats } from './types';
import { fetchPieces, fetchStats } from './services/api';
import { cn } from './lib/utils';

interface SectionHeaderProps {
  number: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, subtitle, className }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div ref={ref} className={cn("mb-12 md:mb-20 relative", className)}>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 0.15, x: 0 } : {}}
        className="font-display text-7xl md:text-9xl absolute -left-4 md:-left-12 -top-8 md:-top-16 opacity-10 pointer-events-none select-none text-white/20"
      >
        {number}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="font-serif text-4xl md:text-6xl mb-4 italic"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.6 } : {}}
          transition={{ delay: 0.4 }}
          className="max-w-xl text-sm md:text-base font-light tracking-wide text-white/60 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default function App() {
  // Modal States
  const [selectedPiece, setSelectedPiece] = useState<GlassPiece | null>(null);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryTargetPiece, setInquiryTargetPiece] = useState<GlassPiece | null>(null);
  const [isBiennaleOpen, setIsBiennaleOpen] = useState(false);
  const [isAwardsOpen, setIsAwardsOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; tab: 'terms' | 'privacy' | 'cookies' | 'shipping' }>({
    isOpen: false,
    tab: 'terms'
  });

  // Featured Pieces from Backend
  const [featuredPieces, setFeaturedPieces] = useState<GlassPiece[]>([]);
  const [stats, setStats] = useState<AtelierStats>({
    totalPieces: 1200,
    activeKilns: 4,
    avgRefractiveIndex: 1.517,
    exhibitionPieces: 12,
    privateAcquisitions: 420,
    yearsActive: 10,
    lastAnnealedBatch: 'Batch #K-26-88'
  });
  const [selectedMethodology, setSelectedMethodology] = useState<number | null>(null);

  // Load initial backend data
  const loadInitialData = async () => {
    try {
      const [piecesRes, statsRes] = await Promise.all([
        fetchPieces({ limit: 6, sort: 'newest' }),
        fetchStats().catch(() => null)
      ]);
      if (piecesRes?.pieces) {
        setFeaturedPieces(piecesRes.pieces);
      }
      if (statsRes) {
        setStats(statsRes);
      }
    } catch (err) {
      console.warn('Initial backend sync in progress:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handlePieceCreated = (newPiece: GlassPiece) => {
    setFeaturedPieces(prev => [newPiece, ...prev.slice(0, 5)]);
    setStats(prev => ({
      ...prev,
      totalPieces: prev.totalPieces + 1
    }));
  };

  const handleAcquireClick = (piece: GlassPiece) => {
    setInquiryTargetPiece(piece);
    setIsInquiryOpen(true);
  };

  const methodologies = [
    {
      icon: Flame,
      title: "Annealing",
      desc: "Controlling cooling rates over 72 hours to eliminate molecular lattice strain.",
      technical: "Thermal soak at 565°C followed by a 1.2°C/hr ramp to achieve strain-point neutrality (zero birefringence)."
    },
    {
      icon: Sparkles,
      title: "Composition",
      desc: "Low-iron boro-silicate glass with custom mineral dopants for extreme clarity.",
      technical: "99.98% pure SiO2 matrix with 13% B2O3 and trace cerium dopants to neutralize iron absorption bands."
    },
    {
      icon: Droplets,
      title: "Refining",
      desc: "Multi-stage diamond lapping and sub-micron slurry polishing.",
      technical: "Six-stage diamond paste abrasive (45μm down to 0.25μm) ensuring planar surface roughness Ra < 0.8nm."
    },
    {
      icon: ShieldCheck,
      title: "Certification",
      desc: "Every piece is stress-tested under circular polariscope inspection.",
      technical: "Verified under Senarmont compensator showing optical retardation lower than 2.5 nm/cm."
    }
  ];

  return (
    <div className="relative min-h-screen text-white bg-[#08080a] selection:bg-white selection:text-black">
      <BackgroundCanvas />
      
      {/* Navigation */}
      <Navigation
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenForge={() => setIsForgeOpen(true)}
        onOpenInquiry={() => {
          setInquiryTargetPiece(null);
          setIsInquiryOpen(true);
        }}
        totalPiecesCount={stats.totalPieces}
      />

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.35 }}
            transition={{ duration: 2 }}
            src="https://images.unsplash.com/photo-1518005021503-49fd163f451f?auto=format&fit=crop&q=80&w=1920"
            alt="Hero Glass"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/60 via-[#08080a]/40 to-[#08080a]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-12 lg:col-span-8 text-center lg:text-left"
          >
            <div className="mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-[11px] uppercase tracking-[0.5em] text-white/50 font-semibold">
                Excellence in Clarity • 2016–2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 font-mono text-[9px] uppercase tracking-wider">
                {stats.totalPieces.toLocaleString()} Registered Works
              </span>
            </div>

            <h1 className="font-serif text-[60px] sm:text-[85px] md:text-[115px] leading-[0.9] tracking-tighter mb-8">
              A Decade<br />
              <span className="italic opacity-90 pl-0 md:pl-16 text-white/90">Refined.</span>
            </h1>

            <p className="max-w-xl mx-auto lg:mx-0 text-white/60 text-sm md:text-base leading-relaxed font-light mb-10">
              Established in 2016, Decennia Glass represents the pinnacle of contemporary kiln-fusing. 
              We engineer architectural laboratory sculptures and refractive vessels that capture the transient nature of light.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              {/* Button: View Archive */}
              <button
                onClick={() => setIsArchiveOpen(true)}
                className="w-full sm:w-auto glass-effect px-8 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-bold hover:bg-white hover:text-black transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                <Layers size={14} />
                <span>Explore {stats.totalPieces}+ Archive</span>
              </button>

              {/* Button: Forge New Piece */}
              <button
                onClick={() => setIsForgeOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-mono border border-white/20 hover:border-white text-white/80 hover:text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 bg-white/5"
              >
                <PlusCircle size={14} />
                <span>Forge Bespoke Piece</span>
              </button>

              {/* Interactive Biennale Pill */}
              <button
                onClick={() => setIsBiennaleOpen(true)}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/10 transition-all text-left cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Current Exhibit</span>
                  <span className="text-xs font-serif italic text-white/90 group-hover:text-white flex items-center gap-1">
                    The Venice Biennale '24 <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <div className="w-[1px] h-10 bg-gradient-to-b from-white/30 to-transparent" />
          <span className="text-[8px] uppercase tracking-[0.25em] text-white/40">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* Featured Collection Section */}
      <section id="collection" className="py-28 px-6 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            number="01"
            title="The Archive"
            subtitle="Curated works from our 1,200+ master collection. Each piece is forged in borosilicate 3.3 or synthetic quartz with certified zero-stress annealing."
            className="mb-0 md:mb-0"
          />

          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 hover:border-white text-xs font-mono uppercase tracking-wider text-white transition-all bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <Layers size={14} />
              <span>Browse All {stats.totalPieces}+ Pieces</span>
            </button>

            <button
              onClick={() => setIsForgeOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer shadow-md"
            >
              <PlusCircle size={14} />
              <span>Forge Piece</span>
            </button>
          </div>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(featuredPieces.length > 0 ? featuredPieces : [
            {
              id: "DG-1200",
              serialNumber: "DG-2026-1200",
              title: "Monolith Vase",
              category: "Vessels" as const,
              year: 2026,
              glassType: "Low-Iron Borosilicate 3.3",
              refractiveIndex: 1.517,
              annealTemp: "565°C / 14h soak",
              dimensions: "45cm × 18cm × 18cm",
              weight: "8.4 kg",
              status: "Biennale '24" as const,
              curatorNotes: "Pure architectural geometry with high-clarity walls. Cast in a custom graphite mold.",
              img: "https://images.unsplash.com/photo-1614850523011-8f49ffc73908?auto=format&fit=crop&q=80&w=800",
              provenance: "Venice Biennale '24 Exhibition",
              price: "$18,500 USD",
              createdAt: "2026-03-10T12:00:00Z"
            },
            {
              id: "DG-1199",
              serialNumber: "DG-2025-1199",
              title: "Prism Sphere",
              category: "Sculpture" as const,
              year: 2025,
              glassType: "Optical Fluorophosphate Crown",
              refractiveIndex: 1.624,
              annealTemp: "610°C / 22h soak",
              dimensions: "32cm × 32cm × 32cm",
              weight: "14.2 kg",
              status: "Available" as const,
              curatorNotes: "Internal light refractions that dance with the ambient viewer.",
              img: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
              provenance: "Decennia Atelier Master Archive",
              price: "$24,000 USD",
              createdAt: "2025-11-14T09:30:00Z"
            },
            {
              id: "DG-1198",
              serialNumber: "DG-2025-1198",
              title: "Aura Decanter",
              category: "Apparatus" as const,
              year: 2025,
              glassType: "Low-Iron Borosilicate 3.3",
              refractiveIndex: 1.514,
              annealTemp: "570°C / 12h soak",
              dimensions: "38cm × 16cm × 16cm",
              weight: "3.6 kg",
              status: "Available" as const,
              curatorNotes: "Precision laboratory glass reimagined for contemplative ceremonies.",
              img: "https://images.unsplash.com/photo-1510444333242-9a3c9736e8ca?auto=format&fit=crop&q=80&w=800",
              provenance: "Commissioned for Private Collector, Basel",
              price: "$12,800 USD",
              createdAt: "2025-08-20T14:15:00Z"
            },
            {
              id: "DG-1197",
              serialNumber: "DG-2024-1197",
              title: "Void Bowl",
              category: "Vessels" as const,
              year: 2024,
              glassType: "Obsidian-Silicate Dense Monolith",
              refractiveIndex: 1.588,
              annealTemp: "590°C / 18h soak",
              dimensions: "52cm × 52cm × 14cm",
              weight: "19.5 kg",
              status: "Permanent Collection" as const,
              curatorNotes: "Deep sapphire tints captured in massive structural glass.",
              img: "https://images.unsplash.com/photo-1574345513550-9bb6da068037?auto=format&fit=crop&q=80&w=800",
              provenance: "Atelier Permanent Retrospective",
              price: "Private Archive",
              createdAt: "2024-04-12T16:45:00Z"
            },
            {
              id: "DG-1196",
              serialNumber: "DG-2024-1196",
              title: "Glacier Fragment",
              category: "Sculpture" as const,
              year: 2024,
              glassType: "Synthetic Fused Quartz",
              refractiveIndex: 1.458,
              annealTemp: "1150°C / 36h soak",
              dimensions: "64cm × 28cm × 22cm",
              weight: "22.1 kg",
              status: "Acquired" as const,
              curatorNotes: "Raw, ice-like textures frozen in crystal.",
              img: "https://images.unsplash.com/photo-1541018613941-86a099d0335e?auto=format&fit=crop&q=80&w=800",
              provenance: "Private Foundation, Zurich",
              price: "Acquired ($36,000 USD)",
              createdAt: "2024-02-18T11:00:00Z"
            },
            {
              id: "DG-1195",
              serialNumber: "DG-2023-1195",
              title: "Crystalline Lens",
              category: "Apparatus" as const,
              year: 2023,
              glassType: "Neodymium Dichroic Crystal",
              refractiveIndex: 1.642,
              annealTemp: "580°C / 16h soak",
              dimensions: "40cm × 40cm × 10cm",
              weight: "11.8 kg",
              status: "Available" as const,
              curatorNotes: "Optical-grade glass focusing natural light.",
              img: "https://images.unsplash.com/photo-1596495573175-975a4f446051?auto=format&fit=crop&q=80&w=800",
              provenance: "Decennia Atelier Master Archive",
              price: "$21,500 USD",
              createdAt: "2023-10-05T13:20:00Z"
            }
          ]).map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPiece(item)}
              className="group relative aspect-[3/4] overflow-hidden glass-effect rounded-2xl cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-500 flex flex-col justify-end p-6"
            >
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
              
              {/* Serial & Status Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/70 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                  {item.serialNumber}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/50 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                  {item.status}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 block font-mono">
                  {item.category} • nD {item.refractiveIndex}
                </span>
                <h3 className="font-serif text-2xl italic leading-tight text-white group-hover:text-white/95">
                  {item.title}
                </h3>
                <p className="text-[11px] font-light text-white/60 leading-relaxed line-clamp-2">
                  {item.curatorNotes}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <span className="font-serif text-sm italic text-white/80">
                    {item.price || 'Inquire on Commission'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPiece(item);
                    }}
                    className="text-[10px] uppercase tracking-widest font-mono flex items-center gap-1.5 text-white/80 group-hover:text-white group-hover:gap-2.5 transition-all"
                  >
                    <span>View Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore all banner */}
        <div className="mt-16 p-8 rounded-2xl glass-effect border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl italic text-white">
              Over 1,200 Commissioned & Archived Creations
            </h3>
            <p className="text-xs text-white/50 font-light max-w-xl">
              From monumental architectural partitions to experimental vacuum cryostats and private vessels. 
              Search the full catalogue, filter by refractive index, or synthesize your own in the kiln.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg"
            >
              Open Full 1,200+ Archive
            </button>
            <button
              onClick={() => setIsForgeOpen(true)}
              className="px-6 py-3 rounded-xl border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Kiln Studio Maker
            </button>
          </div>
        </div>
      </section>

      {/* Process / Methodology Section */}
      <section id="process" className="py-28 px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square glass-effect rounded-full p-4 border-dashed animate-[spin_80s_linear_infinite] absolute -inset-6 opacity-20 pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&q=80&w=1200"
                alt="The Kiln Furnace"
                className="w-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white/60">
                <span>ATMOSPHERE: NITROGEN PURGE</span>
                <span>CORE: 580°C ANNEAL</span>
              </div>
            </div>
          </motion.div>
          
          <div>
            <SectionHeader
              number="02"
              title="Methodology"
              subtitle="Precision physical engineering meets artisanal hand-casting. Click each protocol to inspect laboratory parameters."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {methodologies.map((item, i) => {
                const isSelected = selectedMethodology === i;
                return (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedMethodology(isSelected ? null : i)}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/10 border-white text-white shadow-xl'
                        : 'glass-effect border-white/10 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <item.icon className="w-5 h-5 text-white/50" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">
                        {isSelected ? 'Active Spec' : 'Protocol ' + (i + 1)}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg mb-2 uppercase tracking-extra italic text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs font-light leading-relaxed text-white/60 mb-2">
                      {item.desc}
                    </p>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-3 border-t border-white/10 text-[10px] font-mono text-white/80 leading-relaxed"
                      >
                        <span className="text-amber-300 font-bold">LAB SPEC: </span>
                        {item.technical}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs font-mono text-white/50">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Full ISO 3585 laboratory borosilicate compliance across all 4 studio kilns.</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Interactive Counters */}
      <section id="about" className="py-28 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/50">
            Atelier Retrospective (2016–2026)
          </div>

          <h2 className="font-serif text-4xl md:text-6xl italic">Crafting Silence.</h2>
          
          <p className="text-base md:text-xl font-light leading-relaxed text-white/70 max-w-3xl mx-auto">
            Based in our secluded Studio 41-B facility, we’ve spent ten years perfecting the art of transparency. 
            Our work is installed in private collections, scientific cleanrooms, and architectural landmarks across 24 countries. 
            We believe that <span className="text-white font-medium">glass is not an obstruction</span>, but an optical aperture through which we apprehend the sublime.
          </p>

          {/* Interactive Counter Buttons */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            {/* 1200+ Unique Pieces -> Opens Archive Explorer */}
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="p-6 rounded-2xl glass-effect border border-white/10 hover:border-white/30 transition-all text-center group cursor-pointer"
            >
              <div className="text-4xl md:text-5xl font-display font-light text-white group-hover:scale-105 transition-transform">
                {stats.totalPieces}+
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono mt-2 group-hover:text-white transition-colors">
                Unique Pieces (Explore)
              </div>
            </button>

            {/* 14 Awards -> Opens Awards Modal */}
            <button
              onClick={() => setIsAwardsOpen(true)}
              className="p-6 rounded-2xl glass-effect border border-white/10 hover:border-white/30 transition-all text-center group cursor-pointer"
            >
              <div className="text-4xl md:text-5xl font-display font-light text-white group-hover:scale-105 transition-transform">
                14
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono mt-2 group-hover:text-white transition-colors">
                International Distinctions
              </div>
            </button>

            {/* 01 Obsession -> Opens Journal / Manifesto Modal */}
            <button
              onClick={() => setIsJournalOpen(true)}
              className="p-6 rounded-2xl glass-effect border border-white/10 hover:border-white/30 transition-all text-center group cursor-pointer"
            >
              <div className="text-4xl md:text-5xl font-display font-light text-white group-hover:scale-105 transition-transform">
                01
              </div>
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono mt-2 group-hover:text-white transition-colors">
                Obsession: Pure Clarity
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Direct Inquiries & Commission Callout */}
      <section id="contact" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="p-8 md:p-14 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono">
              DIRECT ATELIER LIAISON
            </span>
            <h3 className="font-serif text-3xl md:text-4xl italic text-white">
              Private Commissions & Gallery Curations
            </h3>
            <p className="text-xs md:text-sm text-white/60 font-light max-w-xl leading-relaxed">
              We collaborate with private collectors, architects, and institutions for bespoke monolithic glass art,
              custom laboratory vessels, and spatial installations. Guaranteed museum-grade white-glove transport.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setInquiryTargetPiece(null);
                setIsInquiryOpen(true);
              }}
              className="px-8 py-4 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl cursor-pointer"
            >
              Initiate Commission Dossier
            </button>
            <button
              onClick={() => setIsJournalOpen(true)}
              className="px-6 py-4 rounded-xl border border-white/20 hover:border-white text-white font-mono text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Read Atelier Journal
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="px-6 md:px-16 py-20 relative bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono font-bold">Heritage</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Hand-poured in the Murano tradition with a modern silicon-carbide finish, ensuring every piece is structurally unique.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono font-bold">Tolerances</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Custom commissions up to 210cm. Laboratory borosilicate 3.3 with thermal expansion coefficient α = 3.3 × 10⁻⁶ K⁻¹.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono font-bold">Curation</span>
              <p className="text-xs text-white/60 leading-relaxed font-light">
                Inquire for private gallery viewing and global logistics coordination via our specialized fine-art handlers.
              </p>
            </div>

            <div className="flex flex-col space-y-3 lg:items-end">
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono font-bold">Atelier Media</span>
              <div className="flex flex-col lg:items-end space-y-2 text-xs font-mono tracking-widest text-white/60">
                <button
                  onClick={() => setIsJournalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ATELIER JOURNAL
                </button>
                <button
                  onClick={() => setIsBiennaleOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  BIENNALE DOSSIER
                </button>
                <button
                  onClick={() => setIsAwardsOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  14 DISTINCTIONS
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-lg text-white">◈</span>
                <span className="text-sm font-bold tracking-[0.4em] uppercase leading-none text-white">DECENNIA</span>
                <span className="text-[9px] tracking-[0.4em] uppercase text-white/40">STUDIO 41-B</span>
              </div>
              <p className="text-[10px] text-white/30 mt-2 font-mono">
                © 2016–2026 Crafted in Glass • All Works Registered Under Decennia Seal
              </p>
            </div>

            {/* Fully Working Policy Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-widest font-mono text-white/50">
              <button
                onClick={() => setPolicyModal({ isOpen: true, tab: 'privacy' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                onClick={() => setPolicyModal({ isOpen: true, tab: 'terms' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms of Provenance
              </button>
              <button
                onClick={() => setPolicyModal({ isOpen: true, tab: 'shipping' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                White-Glove Shipping
              </button>
              <button
                onClick={() => setPolicyModal({ isOpen: true, tab: 'cookies' })}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      
      {/* 1. Piece Detail Modal */}
      <PieceDetailModal
        piece={selectedPiece}
        onClose={() => setSelectedPiece(null)}
        onAcquire={handleAcquireClick}
      />

      {/* 2. Full 1,200+ Archive Explorer Modal */}
      <ArchiveExplorerModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onSelectPiece={(piece) => {
          setIsArchiveOpen(false);
          setSelectedPiece(piece);
        }}
        onOpenForge={() => {
          setIsArchiveOpen(false);
          setIsForgeOpen(true);
        }}
      />

      {/* 3. Atelier Kiln & Forge Modal */}
      <AtelierForgeModal
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
        onPieceCreated={handlePieceCreated}
      />

      {/* 4. Commission & Acquisition Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => {
          setIsInquiryOpen(false);
          setInquiryTargetPiece(null);
        }}
        selectedPiece={inquiryTargetPiece}
      />

      {/* 5. Venice Biennale Exhibition Modal */}
      <ExhibitionModal
        isOpen={isBiennaleOpen}
        onClose={() => setIsBiennaleOpen(false)}
        onExploreWorks={() => {
          setIsBiennaleOpen(false);
          setIsArchiveOpen(true);
        }}
      />

      {/* 6. Awards & Distinctions Modal */}
      <AwardsModal
        isOpen={isAwardsOpen}
        onClose={() => setIsAwardsOpen(false)}
      />

      {/* 7. Atelier Journal Modal */}
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        onExploreArchive={() => {
          setIsJournalOpen(false);
          setIsArchiveOpen(true);
        }}
      />

      {/* 8. Policy & Provenance Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        initialTab={policyModal.tab}
        onClose={() => setPolicyModal(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 9. Ghost Terminal with Real Audio Synthesizer & Backend Pipeline */}
      <GhostTerminal />
    </div>
  );
}

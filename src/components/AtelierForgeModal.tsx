import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Sparkles, CheckCircle2, AlertCircle, Eye, Layers, Scale, Compass, ShieldCheck } from 'lucide-react';
import { PieceCategory, GlassPiece } from '../types';
import { forgePiece } from '../services/api';

interface AtelierForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPieceCreated: (piece: GlassPiece) => void;
}

const GLASS_COMPOSITIONS = [
  { name: 'Low-Iron Borosilicate 3.3', nD: 1.517, defaultTemp: '565°C / 14h soak', color: '#88ccff', desc: 'Maximum optical clarity, zero green-iron tint, extreme thermal shock resistance.' },
  { name: 'Synthetic Fused Quartz', nD: 1.458, defaultTemp: '1150°C / 36h soak', color: '#ffffff', desc: '99.999% pure SiO2. UV-transmissive down to 180nm, virtually zero thermal expansion.' },
  { name: 'Neodymium Dichroic Crystal', nD: 1.642, defaultTemp: '580°C / 18h soak', color: '#c084fc', desc: 'Rare-earth optical filter glass. Shifts between twilight violet and icy blue based on illumination.' },
  { name: 'Cerium-Amber Prismatic Glass', nD: 1.572, defaultTemp: '575°C / 16h soak', color: '#fbbf24', desc: 'Rich golden solar tint with zero radiation degradation. Captures warm oblique light.' },
  { name: 'Obsidian-Silicate Dense Monolith', nD: 1.588, defaultTemp: '590°C / 24h soak', color: '#38bdf8', desc: 'Dark vitreous monolithic mass. High refractive contrast under ambient spotlights.' },
  { name: 'Optical Fluorophosphate Crown', nD: 1.624, defaultTemp: '610°C / 20h soak', color: '#34d399', desc: 'Ultra-low dispersion glass engineered for high-precision prisms and refractive spherical lenses.' }
];

const PRESET_TEXTURES = [
  { name: 'Prismatic Mirror', img: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Architectural Vessel', img: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fluid Apparatus', img: 'https://images.unsplash.com/photo-1510444333242-9a3c9736e8ca?auto=format&fit=crop&q=80&w=800' },
  { name: 'Monolithic Azure', img: 'https://images.unsplash.com/photo-1574345513550-9bb6da068037?auto=format&fit=crop&q=80&w=800' },
  { name: 'Glacial Crystal', img: 'https://images.unsplash.com/photo-1541018613941-86a099d0335e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Refractive Lens', img: 'https://images.unsplash.com/photo-1596495573175-975a4f446051?auto=format&fit=crop&q=80&w=800' },
  { name: 'Vitreous Horizon', img: 'https://images.unsplash.com/photo-1518005021503-49fd163f451f?auto=format&fit=crop&q=80&w=800' }
];

export const AtelierForgeModal: React.FC<AtelierForgeModalProps> = ({
  isOpen,
  onClose,
  onPieceCreated,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PieceCategory>('Sculpture');
  const [glassType, setGlassType] = useState(GLASS_COMPOSITIONS[0].name);
  const [refractiveIndex, setRefractiveIndex] = useState(GLASS_COMPOSITIONS[0].nD);
  const [annealTemp, setAnnealTemp] = useState(GLASS_COMPOSITIONS[0].defaultTemp);
  const [dimensions, setDimensions] = useState('48cm × 24cm × 24cm');
  const [weight, setWeight] = useState('9.2 kg');
  const [curatorNotes, setCuratorNotes] = useState('');
  const [selectedImage, setSelectedImage] = useState(PRESET_TEXTURES[0].img);
  const [price, setPrice] = useState('$19,500 USD');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<GlassPiece | null>(null);

  const handleGlassTypeSelect = (comp: typeof GLASS_COMPOSITIONS[0]) => {
    setGlassType(comp.name);
    setRefractiveIndex(comp.nD);
    setAnnealTemp(comp.defaultTemp);
  };

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a piece title.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await forgePiece({
        title: title.trim(),
        category,
        glassType,
        dimensions,
        weight,
        annealTemp,
        refractiveIndex,
        curatorNotes: curatorNotes.trim() || `Hand-blown and kiln-annealed in Studio 41-B. Fabricated with ${glassType} formulated to high optical precision. Certified with Decennia archival seal.`,
        img: selectedImage,
        price,
        provenance: 'Decennia Atelier Direct Commission, Studio 41-B'
      });

      setSuccessResult(res.piece);
      onPieceCreated(res.piece);
    } catch (err: any) {
      setError(err?.message || 'Failed to register piece with kiln backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setTitle('');
    setCuratorNotes('');
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
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-[#09090e] border border-white/10 rounded-2xl shadow-2xl z-10 text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame size={20} className="text-amber-400 animate-pulse" />
              <div>
                <h2 className="font-serif text-2xl italic">Atelier Glass Kiln & Forge</h2>
                <p className="text-[11px] text-white/50 font-light font-mono">
                  Synthesize and mint new works into the Decennia 1,200+ Master Registry.
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

          {/* Body */}
          <div className="overflow-y-auto p-6 md:p-8">
            {successResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={32} />
                </div>

                <div className="space-y-2 max-w-md">
                  <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                    Piece Annealed & Registered
                  </span>
                  <h3 className="font-serif text-3xl italic">{successResult.title}</h3>
                  <div className="inline-block px-3 py-1 rounded bg-white/10 font-mono text-sm tracking-widest text-white mt-2">
                    {successResult.serialNumber}
                  </div>
                  <p className="text-xs text-white/60 font-light leading-relaxed pt-2">
                    This piece has been committed to the persistent Decennia Archive. It is now live in the 1,200+
                    collection explorer, cataloged under serial <span className="text-white font-mono">{successResult.serialNumber}</span>.
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg"
                  >
                    View in Archive
                  </button>
                  <button
                    onClick={() => {
                      setSuccessResult(null);
                      setTitle('');
                    }}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Forge Another Piece
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleForge} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Piece Title and Category */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                      Piece Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Obelisk of Coherent Light"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 font-serif italic text-lg"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PieceCategory)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/30 font-mono cursor-pointer"
                    >
                      <option value="Sculpture">Sculpture</option>
                      <option value="Vessels">Vessels</option>
                      <option value="Apparatus">Apparatus</option>
                      <option value="Illuminations">Illuminations</option>
                      <option value="Architectural">Architectural</option>
                      <option value="Rare Editions">Rare Editions</option>
                    </select>
                  </div>
                </div>

                {/* Glass Composition Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5">
                      <Sparkles size={13} /> Select Vitreous Matrix Composition
                    </label>
                    <span className="text-[10px] font-mono text-white/40">
                      Selected: {glassType} (nD {refractiveIndex})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {GLASS_COMPOSITIONS.map((comp) => {
                      const isSelected = glassType === comp.name;
                      return (
                        <div
                          key={comp.name}
                          onClick={() => handleGlassTypeSelect(comp)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-white/10 border-white text-white shadow-lg'
                              : 'bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-serif italic text-sm font-semibold">{comp.name}</span>
                            <span className="text-[10px] font-mono text-white/40">nD {comp.nD}</span>
                          </div>
                          <p className="text-[10px] font-light text-white/50 leading-relaxed">
                            {comp.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Annealing & Physical Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <Flame size={11} /> Annealing Temp
                    </label>
                    <input
                      type="text"
                      value={annealTemp}
                      onChange={(e) => setAnnealTemp(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <Eye size={11} /> Refractive Index
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      min="1.400"
                      max="1.800"
                      value={refractiveIndex}
                      onChange={(e) => setRefractiveIndex(parseFloat(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <Layers size={11} /> Dimensions
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 50cm × 20cm × 20cm"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-white/40 flex items-center gap-1">
                      <Scale size={11} /> Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 8.4 kg"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {/* Visual Glass Texture Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                    Visual Glass Aesthetic
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {PRESET_TEXTURES.map((tex) => (
                      <div
                        key={tex.name}
                        onClick={() => setSelectedImage(tex.img)}
                        className={`group relative aspect-[3/4] rounded-lg overflow-hidden border cursor-pointer transition-all ${
                          selectedImage === tex.img
                            ? 'border-white ring-2 ring-white/30 scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={tex.img}
                          alt={tex.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[8px] font-mono text-center truncate block text-white">
                          {tex.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curator Notes & Valuation */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                      Curator Notes & Physical Description
                    </label>
                    <textarea
                      rows={2}
                      value={curatorNotes}
                      onChange={(e) => setCuratorNotes(e.target.value)}
                      placeholder="Optical behavior, kiln notes, refractive highlights..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/30 font-light"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/60">
                      Valuation
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. $18,500 USD"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-serif italic"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Real-time kiln backend persistence enabled.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl disabled:opacity-50 cursor-pointer"
                  >
                    <Flame size={15} />
                    <span>{loading ? 'Annealing in Kiln...' : 'Ignite Kiln & Register'}</span>
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

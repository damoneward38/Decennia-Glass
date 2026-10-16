import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter, Sparkles, ChevronLeft, ChevronRight, ArrowUpDown, PlusCircle, Layers, Eye } from 'lucide-react';
import { GlassPiece, PieceCategory } from '../types';
import { fetchPieces, PiecesResponse } from '../services/api';

interface ArchiveExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPiece: (piece: GlassPiece) => void;
  onOpenForge: () => void;
}

const CATEGORIES: (PieceCategory | 'All')[] = [
  'All',
  'Vessels',
  'Sculpture',
  'Apparatus',
  'Illuminations',
  'Architectural',
  'Rare Editions'
];

export const ArchiveExplorerModal: React.FC<ArchiveExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectPiece,
  onOpenForge,
}) => {
  const [pieces, setPieces] = useState<GlassPiece[]>([]);
  const [total, setTotal] = useState<number>(1200);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(100);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: PiecesResponse = await fetchPieces({
        category: selectedCategory,
        search: searchTerm,
        sort: sortBy,
        page,
        limit: 12
      });
      setPieces(res.pieces);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to load pieces.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, page]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, loadData]);

  // Reset page when category, search, or sort changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-2xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 15 }}
          className="relative w-full max-w-7xl h-[92vh] bg-[#07070a] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl text-white">◈</span>
                <h2 className="font-serif text-2xl md:text-3xl italic">
                  Decennia Atelier Archive
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[10px] uppercase tracking-wider">
                  {total.toLocaleString()} Unique Works
                </span>
              </div>
              <p className="text-xs text-white/50 font-light mt-1">
                A decade of clarity (2016–2026). Explore, inspect refractive properties, or forge custom commissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenForge();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-white/90 transition-all shadow-md"
              >
                <PlusCircle size={15} />
                <span>Forge New Piece</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider font-mono whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search 1,200+ pieces, glass type, serial..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors font-mono"
                />
              </div>

              <div className="relative flex items-center">
                <ArrowUpDown size={13} className="absolute left-3 text-white/40 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  aria-label="Sort pieces"
                  className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-xs text-white/80 focus:outline-none focus:border-white/30 appearance-none font-mono cursor-pointer"
                >
                  <option value="newest" className="bg-[#0b0b10] text-white">Newest First</option>
                  <option value="oldest" className="bg-[#0b0b10] text-white">Oldest (2016)</option>
                  <option value="refraction" className="bg-[#0b0b10] text-white">Highest Refraction (nD)</option>
                  <option value="title" className="bg-[#0b0b10] text-white">Title A–Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-white/50">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-xs font-mono tracking-widest uppercase">Querying Decennia Vault...</span>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-red-400">
                <p className="text-sm">{error}</p>
                <button
                  onClick={loadData}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-mono hover:bg-white/20"
                >
                  Retry Query
                </button>
              </div>
            ) : pieces.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 text-white/40">
                <Layers size={32} className="stroke-1 text-white/20" />
                <p className="text-sm font-light">No pieces match your query filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchTerm('');
                  }}
                  className="text-xs font-mono underline hover:text-white"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pieces.map((piece) => (
                  <motion.div
                    key={piece.id}
                    layoutId={`piece-card-${piece.id}`}
                    whileHover={{ y: -6 }}
                    onClick={() => onSelectPiece(piece)}
                    className="group relative bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/30 transition-all flex flex-col"
                  >
                    {/* Image Aspect Box */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-black/40 relative">
                      <img
                        src={piece.img}
                        alt={piece.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-70 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white/70 border border-white/10">
                          {piece.serialNumber}
                        </span>
                        {piece.custom && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            Custom Forged
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-semibold text-[10px] uppercase tracking-widest shadow-xl">
                          <Eye size={12} /> Inspect Specs
                        </span>
                      </div>
                    </div>

                    {/* Metadata Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-white/40 font-mono mb-1">
                          <span>{piece.category}</span>
                          <span>nD {piece.refractiveIndex}</span>
                        </div>
                        <h3 className="font-serif text-lg text-white group-hover:text-white/90 italic truncate">
                          {piece.title}
                        </h3>
                        <p className="text-[11px] text-white/50 font-light line-clamp-2 mt-1 leading-relaxed">
                          {piece.curatorNotes}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-white/40">{piece.year}</span>
                        <span className="text-white font-medium">{piece.price || 'Commission'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="p-4 px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-white/60">
            <div>
              Showing Page <span className="text-white font-bold">{page}</span> of{' '}
              <span className="text-white font-bold">{totalPages || 1}</span> ({total} pieces total)
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

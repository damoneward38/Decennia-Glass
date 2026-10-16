import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// High quality curated glass imagery
const GLASS_IMAGES = [
  "https://images.unsplash.com/photo-1614850523011-8f49ffc73908?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1510444333242-9a3c9736e8ca?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1574345513550-9bb6da068037?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1541018613941-86a099d0335e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1596495573175-975a4f446051?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1518005021503-49fd163f451f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&q=80&w=800"
];

const CATEGORIES = ['Vessels', 'Sculpture', 'Apparatus', 'Illuminations', 'Architectural', 'Rare Editions'] as const;
const GLASS_TYPES = [
  'Low-Iron Borosilicate 3.3',
  'Synthetic Fused Quartz',
  'Neodymium Dichroic Crystal',
  'Cerium-Amber Prismatic Glass',
  'Obsidian-Silicate Dense Monolith',
  'Optical Fluorophosphate Crown',
  'Barium Heavy Flashing Crystal',
  'Titania-Infused Vitreous Matrix'
];

const NOUNS = [
  'Monolith', 'Vessel', 'Prism', 'Aura', 'Decanter', 'Void', 'Fragment', 'Lens', 'Solenoid',
  'Obelisk', 'Chamber', 'Crucible', 'Sphere', 'Tesseract', 'Cylinder', 'Waveform', 'Matrix',
  'Helix', 'Hyperboloid', 'Chalice', 'Spire', 'Plateau', 'Column', 'Capillary'
];

const ADJECTIVES = [
  'Glacial', 'Crystalline', 'Subtle', 'Deep', 'Refractive', 'Spectral', 'Bespoke',
  'Silent', 'Linear', 'Monolithic', 'Thermal', 'Vitreous', 'Anamorphic', 'Polarized',
  'Luminescent', 'Hyperbaric', 'Isotropic', 'Zero-Stress', 'Annealed', 'Optical'
];

interface GlassPieceItem {
  id: string;
  serialNumber: string;
  title: string;
  category: typeof CATEGORIES[number];
  year: number;
  glassType: string;
  refractiveIndex: number;
  annealTemp: string;
  dimensions: string;
  weight: string;
  status: 'Available' | 'Archived' | 'Permanent Collection' | 'Biennale \'24' | 'Acquired' | 'In Kiln Annealing';
  curatorNotes: string;
  img: string;
  provenance: string;
  price?: string;
  createdAt: string;
  custom?: boolean;
}

// Generate the 1200+ base piece archive procedural dataset
function generateBaseArchive(totalCount = 1200): GlassPieceItem[] {
  const pieces: GlassPieceItem[] = [];

  // Anchor pieces (first iconic 6 from Decennia atelier archive)
  const anchorPieces: GlassPieceItem[] = [
    {
      id: "DG-1200",
      serialNumber: "DG-2026-1200",
      title: "Monolith Vessel",
      category: "Vessels",
      year: 2026,
      glassType: "Low-Iron Borosilicate 3.3",
      refractiveIndex: 1.517,
      annealTemp: "565°C / 14h soak",
      dimensions: "45cm × 18cm × 18cm",
      weight: "8.4 kg",
      status: "Biennale '24",
      curatorNotes: "Pure architectural geometry with high-clarity walls. Cast in a custom graphite mold and annealed over 72 hours to achieve complete optical neutrality.",
      img: GLASS_IMAGES[0],
      provenance: "Venice Biennale '24 Exhibition — Italian Pavilion Central Court",
      price: "$18,500 USD",
      createdAt: "2026-03-10T12:00:00Z"
    },
    {
      id: "DG-1199",
      serialNumber: "DG-2025-1199",
      title: "Prism Sphere",
      category: "Sculpture",
      year: 2025,
      glassType: "Optical Fluorophosphate Crown",
      refractiveIndex: 1.624,
      annealTemp: "610°C / 22h soak",
      dimensions: "32cm × 32cm × 32cm",
      weight: "14.2 kg",
      status: "Available",
      curatorNotes: "Internal light refractions that dance with the ambient viewer. Features three internal spherical inclusions polished using sub-micron diamond lapping.",
      img: GLASS_IMAGES[1],
      provenance: "Decennia Atelier Master Archive, Studio 41-B",
      price: "$24,000 USD",
      createdAt: "2025-11-14T09:30:00Z"
    },
    {
      id: "DG-1198",
      serialNumber: "DG-2025-1198",
      title: "Aura Decanter",
      category: "Apparatus",
      year: 2025,
      glassType: "Low-Iron Borosilicate 3.3",
      refractiveIndex: 1.514,
      annealTemp: "570°C / 12h soak",
      dimensions: "38cm × 16cm × 16cm",
      weight: "3.6 kg",
      status: "Available",
      curatorNotes: "Precision laboratory glass reimagined for contemplative ceremonies. Calibrated to aerodynamic liquid pouring rates with zero laminar drip.",
      img: GLASS_IMAGES[2],
      provenance: "Commissioned for Private Collector, Basel",
      price: "$12,800 USD",
      createdAt: "2025-08-20T14:15:00Z"
    },
    {
      id: "DG-1197",
      serialNumber: "DG-2024-1197",
      title: "Void Bowl",
      category: "Vessels",
      year: 2024,
      glassType: "Obsidian-Silicate Dense Monolith",
      refractiveIndex: 1.588,
      annealTemp: "590°C / 18h soak",
      dimensions: "52cm × 52cm × 14cm",
      weight: "19.5 kg",
      status: "Permanent Collection",
      curatorNotes: "Deep sapphire tints captured in massive structural glass. Absorbs oblique wavelengths while reflecting sharp cyan highlights at normal incidence.",
      img: GLASS_IMAGES[3],
      provenance: "Atelier Permanent Retrospective Collection",
      price: "Private Archive",
      createdAt: "2024-04-12T16:45:00Z"
    },
    {
      id: "DG-1196",
      serialNumber: "DG-2024-1196",
      title: "Glacier Fragment",
      category: "Sculpture",
      year: 2024,
      glassType: "Synthetic Fused Quartz",
      refractiveIndex: 1.458,
      annealTemp: "1150°C / 36h soak",
      dimensions: "64cm × 28cm × 22cm",
      weight: "22.1 kg",
      status: "Acquired",
      curatorNotes: "Raw, ice-like textures frozen in crystal. Thermal shock quenching followed by controlled re-annealing creates non-catastrophic interior tension fields.",
      img: GLASS_IMAGES[4],
      provenance: "Private Foundation, Zurich",
      price: "Acquired ($36,000 USD)",
      createdAt: "2024-02-18T11:00:00Z"
    },
    {
      id: "DG-1195",
      serialNumber: "DG-2023-1195",
      title: "Crystalline Lens",
      category: "Apparatus",
      year: 2023,
      glassType: "Neodymium Dichroic Crystal",
      refractiveIndex: 1.642,
      annealTemp: "580°C / 16h soak",
      dimensions: "40cm × 40cm × 10cm",
      weight: "11.8 kg",
      status: "Available",
      curatorNotes: "Optical-grade glass focusing natural light. Shifts between radiant lavender under fluorescent light and icy azure under direct sunlight.",
      img: GLASS_IMAGES[5],
      provenance: "Decennia Atelier Master Archive, Studio 41-B",
      price: "$21,500 USD",
      createdAt: "2023-10-05T13:20:00Z"
    }
  ];

  pieces.push(...anchorPieces);

  // Procedural generation for the remaining ~1,194 pieces spanning 2016-2026
  for (let i = 1194; i >= 1; i--) {
    const year = 2016 + Math.floor((i / 1200) * 11);
    const catIdx = i % CATEGORIES.length;
    const category = CATEGORIES[catIdx];
    const glassType = GLASS_TYPES[i % GLASS_TYPES.length];
    const adj = ADJECTIVES[(i * 7) % ADJECTIVES.length];
    const noun = NOUNS[(i * 13) % NOUNS.length];
    const title = `${adj} ${noun} ${romanNumeral((i % 12) + 1)}`;
    const img = GLASS_IMAGES[i % GLASS_IMAGES.length];
    const n = 1.45 + ((i * 17) % 250) / 1000;
    const refractiveIndex = Number(n.toFixed(3));
    const h = 25 + (i % 65);
    const w = 15 + ((i * 3) % 40);
    const d = 15 + ((i * 5) % 40);
    const weightVal = (3 + ((i * 11) % 280) / 10).toFixed(1);
    
    let status: GlassPieceItem['status'] = 'Archived';
    if (i > 1150 && i % 3 === 0) status = 'Available';
    else if (i % 17 === 0) status = 'Biennale \'24';
    else if (i % 11 === 0) status = 'Permanent Collection';
    else if (i % 7 === 0) status = 'Acquired';

    const serialNum = `DG-${year}-${String(i).padStart(4, '0')}`;
    const soakHours = 10 + (i % 28);
    const temp = 540 + (i % 90);

    pieces.push({
      id: `DG-${i}`,
      serialNumber: serialNum,
      title,
      category,
      year,
      glassType,
      refractiveIndex,
      annealTemp: `${temp}°C / ${soakHours}h soak`,
      dimensions: `${h}cm × ${w}cm × ${d}cm`,
      weight: `${weightVal} kg`,
      status,
      curatorNotes: `Master series work #${i}. Synthesized from ${glassType} with a refractive index of ${refractiveIndex}. Stress-tested under polariscope inspection to confirm zero structural birefringence.`,
      img,
      provenance: i % 4 === 0 ? `Private Collection, Munich` : (i % 5 === 0 ? `Kyoto Glass Triennial Archive` : `Studio 41-B Master Vault`),
      price: status === 'Available' ? `$${(9500 + (i % 22) * 850).toLocaleString()} USD` : (status === 'Acquired' ? 'Acquired' : 'Private Archive'),
      createdAt: new Date(Date.UTC(year, (i % 12), (i % 28) + 1)).toISOString()
    });
  }

  return pieces;
}

function romanNumeral(num: number): string {
  const lookup: Record<string, number> = { X: 10, IX: 9, V: 5, IV: 4, I: 1 };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

// In-memory data stores with file-persistence fallback
const DATA_DIR = path.resolve(__dirname, 'data');
const CUSTOM_PIECES_FILE = path.resolve(DATA_DIR, 'custom_pieces.json');
const INQUIRIES_FILE = path.resolve(DATA_DIR, 'inquiries.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let customPieces: GlassPieceItem[] = [];
if (fs.existsSync(CUSTOM_PIECES_FILE)) {
  try {
    customPieces = JSON.parse(fs.readFileSync(CUSTOM_PIECES_FILE, 'utf-8'));
  } catch (err) {
    console.error('Failed to parse custom pieces, initializing empty:', err);
    customPieces = [];
  }
}

interface InquiryRecord {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  inquiryType: string;
  pieceId?: string;
  pieceTitle?: string;
  budgetRange?: string;
  message: string;
  timeline?: string;
  createdAt: string;
  status: 'Pending Review' | 'Dossier Prepared' | 'Consultation Scheduled';
}

let inquiries: InquiryRecord[] = [];
if (fs.existsSync(INQUIRIES_FILE)) {
  try {
    inquiries = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
  } catch (err) {
    console.error('Failed to parse inquiries:', err);
    inquiries = [];
  }
}

const baseArchive = generateBaseArchive(1200);

function getAllPieces(): GlassPieceItem[] {
  return [...customPieces, ...baseArchive];
}

function saveCustomPieces() {
  try {
    fs.writeFileSync(CUSTOM_PIECES_FILE, JSON.stringify(customPieces, null, 2));
  } catch (err) {
    console.error('Error saving custom pieces:', err);
  }
}

function saveInquiries() {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
  } catch (err) {
    console.error('Error saving inquiries:', err);
  }
}

// ── API ROUTES ─────────────────────────────────────────────

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    catalogSize: getAllPieces().length,
    activeKilns: 4,
    annealingChamberPressure: '1.02 atm',
    temperatureCore: '582°C'
  });
});

// Atelier Stats
app.get('/api/stats', (req, res) => {
  const all = getAllPieces();
  const available = all.filter(p => p.status === 'Available').length;
  const biennale = all.filter(p => p.status === 'Biennale \'24').length;
  const acquired = all.filter(p => p.status === 'Acquired').length;
  
  const totalRefraction = all.reduce((acc, p) => acc + p.refractiveIndex, 0);
  const avgRefractiveIndex = Number((totalRefraction / all.length).toFixed(3));

  res.json({
    totalPieces: all.length,
    activeKilns: 4,
    avgRefractiveIndex,
    exhibitionPieces: biennale,
    privateAcquisitions: acquired,
    availablePieces: available,
    yearsActive: 10,
    lastAnnealedBatch: `Batch #K-26-88 (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`
  });
});

// Pieces List with Search, Filter & Pagination
app.get('/api/pieces', (req, res) => {
  const {
    category,
    status,
    search,
    sort = 'newest',
    page = '1',
    limit = '12'
  } = req.query as Record<string, string>;

  let list = getAllPieces();

  // Filter category
  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter status
  if (status && status !== 'All') {
    list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  // Filter search
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.serialNumber.toLowerCase().includes(q) ||
      p.glassType.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.curatorNotes.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else if (sort === 'refraction') {
    list.sort((a, b) => b.refractiveIndex - a.refractiveIndex);
  } else if (sort === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const total = list.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = list.slice(startIndex, startIndex + limitNum);

  res.json({
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
    pieces: paginated
  });
});

// Piece Detail by ID or Serial
app.get('/api/pieces/:id', (req, res) => {
  const { id } = req.params;
  const piece = getAllPieces().find(p => p.id === id || p.serialNumber.toLowerCase() === id.toLowerCase());
  if (!piece) {
    res.status(404).json({ error: 'Piece not found in Decennia archive registry.' });
    return;
  }
  res.json(piece);
});

// Forge / Create New Piece
app.post('/api/pieces', (req, res) => {
  try {
    const {
      title,
      category,
      glassType,
      dimensions,
      weight,
      annealTemp,
      refractiveIndex,
      curatorNotes,
      img,
      provenance,
      price
    } = req.body;

    if (!title || !category || !glassType) {
      res.status(400).json({ error: 'Title, category, and glassType are required to register a piece.' });
      return;
    }

    const currentTotal = getAllPieces().length;
    const nextNumber = currentTotal + 1;
    const year = new Date().getFullYear();
    const serialNumber = `DG-${year}-${String(nextNumber).padStart(4, '0')}`;
    const newId = `DG-${nextNumber}`;

    const newPiece: GlassPieceItem = {
      id: newId,
      serialNumber,
      title: title.trim(),
      category: category || 'Sculpture',
      year,
      glassType: glassType.trim(),
      refractiveIndex: Number(refractiveIndex) || 1.517,
      annealTemp: annealTemp || '580°C / 16h soak',
      dimensions: dimensions || '40cm × 20cm × 20cm',
      weight: weight || '7.5 kg',
      status: 'Available',
      curatorNotes: curatorNotes?.trim() || `Atelier bespoke piece forged in Kiln Chamber #1. Tested for zero molecular shear and certified with Decennia watermark seal.`,
      img: img || GLASS_IMAGES[(nextNumber % GLASS_IMAGES.length)],
      provenance: provenance || `Decennia Atelier Master Commission, Studio 41-B`,
      price: price || `$${(14000 + (nextNumber % 15) * 1000).toLocaleString()} USD`,
      createdAt: new Date().toISOString(),
      custom: true
    };

    customPieces.unshift(newPiece);
    saveCustomPieces();

    res.status(201).json({
      success: true,
      message: `Piece ${serialNumber} successfully forged and added to Decennia Glass 1200+ Archive.`,
      piece: newPiece,
      totalCatalogSize: getAllPieces().length
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to forge piece.' });
  }
});

// Submit Acquisition / Commission Inquiry
app.post('/api/inquiries', (req, res) => {
  try {
    const {
      fullName,
      email,
      inquiryType,
      pieceId,
      pieceTitle,
      budgetRange,
      message,
      timeline
    } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({ error: 'Full name, email address, and project brief are required.' });
      return;
    }

    const refNum = Math.floor(1000 + Math.random() * 9000);
    const referenceCode = `DG-REQ-${refNum}`;
    const record: InquiryRecord = {
      id: `inq_${Date.now()}`,
      referenceCode,
      fullName: fullName.trim(),
      email: email.trim(),
      inquiryType: inquiryType || 'Acquisition',
      pieceId,
      pieceTitle,
      budgetRange,
      message: message.trim(),
      timeline: timeline || 'Standard Commission (8-12 weeks)',
      createdAt: new Date().toISOString(),
      status: 'Pending Review'
    };

    inquiries.unshift(record);
    saveInquiries();

    res.status(201).json({
      success: true,
      referenceCode,
      message: `Your inquiry has been cataloged under dossier ${referenceCode}. An atelier representative will review structural tolerances and schedule a private curation call.`,
      inquiry: record
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to save inquiry.' });
  }
});

// List Inquiries
app.get('/api/inquiries', (req, res) => {
  res.json({
    total: inquiries.length,
    inquiries: inquiries.slice(0, 50)
  });
});

// Ghost Terminal Command Processor with AI & Local Fallback
app.post('/api/ghost/execute', async (req, res) => {
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    res.status(400).json({ error: 'Command string is required.' });
    return;
  }

  const raw = command.trim();
  const lower = raw.toLowerCase();
  const parts = lower.split(' ');
  const base = parts[0];
  const args = parts.slice(1);

  // Pieces commands
  if (base === 'pieces' || base === 'archive' || base === 'catalog') {
    const all = getAllPieces();
    if (args[0] === 'count') {
      res.json({
        type: 'success',
        lines: [
          `DECENNIA ARCHIVE REGISTRY:`,
          `  TOTAL UNIQUE PIECES: ${all.length}`,
          `  CUSTOM FORGED:       ${customPieces.length}`,
          `  BASE RETROSPECTIVE:  ${baseArchive.length}`,
          `  STATUS: SYNCHRONIZED ACROSS ALL 10 KILNS`
        ]
      });
      return;
    }

    if (args[0] === 'search' || args[0] === 'find') {
      const q = args.slice(1).join(' ');
      const matches = all.filter(p => p.title.toLowerCase().includes(q) || p.serialNumber.toLowerCase().includes(q) || p.glassType.toLowerCase().includes(q)).slice(0, 5);
      if (matches.length === 0) {
        res.json({
          type: 'warning',
          lines: [`NO PIECES FOUND MATCHING: "${q}"`, `TRY: "pieces search prism" OR "pieces search borosilicate"`]
        });
        return;
      }
      res.json({
        type: 'success',
        lines: [
          `FOUND ${matches.length} MATCHING PIECES:`,
          ...matches.map(m => `  • [${m.serialNumber}] "${m.title}" — ${m.glassType} (${m.status})`)
        ]
      });
      return;
    }

    if (args[0] === 'recent' || args[0] === 'latest') {
      const latest = all.slice(0, 5);
      res.json({
        type: 'success',
        lines: [
          `LATEST ATELIER ENTRIES:`,
          ...latest.map(m => `  • [${m.serialNumber}] "${m.title}" (${m.year}) - ${m.status}`)
        ]
      });
      return;
    }
  }

  // Quick forge from terminal
  if (base === 'forge' && args.length >= 1) {
    const pieceTitle = raw.substring(raw.indexOf(' ')).trim();
    const currentTotal = getAllPieces().length;
    const nextNumber = currentTotal + 1;
    const year = new Date().getFullYear();
    const serialNumber = `DG-${year}-${String(nextNumber).padStart(4, '0')}`;
    
    const forgedPiece: GlassPieceItem = {
      id: `DG-${nextNumber}`,
      serialNumber,
      title: pieceTitle,
      category: 'Sculpture',
      year,
      glassType: 'Neodymium Dichroic Crystal',
      refractiveIndex: 1.588,
      annealTemp: '590°C / 18h soak',
      dimensions: '42cm × 22cm × 22cm',
      weight: '8.8 kg',
      status: 'Available',
      curatorNotes: `Terminal forged piece created via Ghost Core command execution. Certified optical clarity.`,
      img: GLASS_IMAGES[nextNumber % GLASS_IMAGES.length],
      provenance: 'Decennia Atelier Direct Terminal Forge',
      price: '$16,500 USD',
      createdAt: new Date().toISOString(),
      custom: true
    };
    customPieces.unshift(forgedPiece);
    saveCustomPieces();

    res.json({
      type: 'success',
      lines: [
        `╔══════════════════════════════════════════════════╗`,
        `║       PIECE FORGED & REGISTERED IN ARCHIVE      ║`,
        `╚══════════════════════════════════════════════════╝`,
        `SERIAL NUMBER:  ${serialNumber}`,
        `TITLE:          ${pieceTitle}`,
        `GLASS MATRIX:   Neodymium Dichroic Crystal`,
        `TOTAL PIECES:   ${getAllPieces().length}`,
        `STATUS:         AVAILABLE IN ARCHIVE EXPLORER`
      ]
    });
    return;
  }

  // AI query command via Gemini
  if (base === 'ruach' && args[0] === 'query') {
    const prompt = raw.substring(raw.indexOf('query') + 5).trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are RUACH, the contemplative AI and optical intelligence core of Decennia Glass Atelier (an avant-garde laboratory glass and sculptural atelier). 
Respond in concise, precise, poetic, and technical language fitting a master glassmaker and optical physicist. Keep response under 4 lines.
User query: ${prompt}`,
        });

        const text = response.text || 'TRANSMISSION RECEIVED.';
        const responseLines = text.split('\n').filter(Boolean);
        res.json({
          type: 'success',
          lines: [
            `RUACH COGNITIVE CORE:`,
            ...responseLines
          ]
        });
        return;
      } catch (err: any) {
        console.error('Gemini API call error in terminal:', err);
      }
    }

    // Fallback if no key or error
    res.json({
      type: 'success',
      lines: [
        `RUACH INTERNAL ENGINE:`,
        `  "Glass does not hold light—it surrenders to it. At 580°C, molecular lattices align`,
        `   until boundary between object and void dissolves. The equation yields absolute clarity."`,
        `[STATUS: NOMINAL — REFRACTIVE RATIO 1.517]`
      ]
    });
    return;
  }

  // Generic fallback: terminal client will execute local table or return unknown
  res.json({
    type: 'passthrough'
  });
});

// ── VITE / STATIC INTEGRATION ──────────────────────────────

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DECENNIA SERVER] Running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode.`);
  });
}

startServer();

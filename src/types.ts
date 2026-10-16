export type PieceCategory = 
  | 'Vessels'
  | 'Sculpture'
  | 'Apparatus'
  | 'Illuminations'
  | 'Architectural'
  | 'Rare Editions';

export type PieceStatus = 
  | 'Available'
  | 'Archived'
  | 'Permanent Collection'
  | 'Biennale \'24'
  | 'Acquired'
  | 'In Kiln Annealing';

export interface GlassPiece {
  id: string;
  serialNumber: string;
  title: string;
  category: PieceCategory;
  year: number;
  glassType: string;
  refractiveIndex: number;
  annealTemp: string;
  dimensions: string;
  weight: string;
  status: PieceStatus;
  curatorNotes: string;
  img: string;
  provenance: string;
  price?: string;
  createdAt: string;
  custom?: boolean;
}

export interface InquirySubmission {
  id?: string;
  referenceCode?: string;
  fullName: string;
  email: string;
  inquiryType: 'Acquisition' | 'Commission' | 'Gallery Viewing' | 'Architectural Collaboration';
  pieceId?: string;
  pieceTitle?: string;
  budgetRange?: string;
  message: string;
  timeline?: string;
  createdAt?: string;
  status?: 'Pending Review' | 'Dossier Prepared' | 'Consultation Scheduled';
}

export interface AtelierStats {
  totalPieces: number;
  activeKilns: number;
  avgRefractiveIndex: number;
  exhibitionPieces: number;
  privateAcquisitions: number;
  yearsActive: number;
  lastAnnealedBatch: string;
}

export interface ForgePieceInput {
  title: string;
  category: PieceCategory;
  glassType: string;
  dimensions: string;
  weight: string;
  annealTemp: string;
  refractiveIndex: number;
  curatorNotes: string;
  img?: string;
  provenance?: string;
  price?: string;
}

import { GlassPiece, AtelierStats, InquirySubmission, ForgePieceInput } from '../types';

export interface PiecesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pieces: GlassPiece[];
}

export async function fetchStats(): Promise<AtelierStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch atelier stats');
  return res.json();
}

export async function fetchPieces(params: {
  category?: string;
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PiecesResponse> {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.status) query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const res = await fetch(`/api/pieces?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch pieces');
  return res.json();
}

export async function fetchPieceById(id: string): Promise<GlassPiece> {
  const res = await fetch(`/api/pieces/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Piece not found');
  return res.json();
}

export async function forgePiece(input: ForgePieceInput): Promise<{
  success: boolean;
  message: string;
  piece: GlassPiece;
  totalCatalogSize: number;
}> {
  const res = await fetch('/api/pieces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to forge piece');
  }
  return res.json();
}

export async function submitInquiry(input: InquirySubmission): Promise<{
  success: boolean;
  referenceCode: string;
  message: string;
  inquiry: InquirySubmission;
}> {
  const res = await fetch('/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit inquiry');
  }
  return res.json();
}

export async function executeGhostCommand(command: string): Promise<{
  type: 'success' | 'error' | 'warning' | 'passthrough';
  lines?: string[];
}> {
  const res = await fetch('/api/ghost/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command })
  });
  if (!res.ok) {
    return { type: 'passthrough' };
  }
  return res.json();
}

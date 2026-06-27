export type * from './claim'
export type * from './evidence'
export type * from './verdict'

export interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'error'
  hash?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface FilterParams {
  verdict?: string
  greenwashing_risk?: string
  industry?: string
  claim_category?: string
  search?: string
}

export interface SortParams {
  field: 'created_at' | 'confidence_score' | 'greenwashing_risk'
  direction: 'asc' | 'desc'
}

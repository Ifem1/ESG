export type EvidenceType =
  | 'annual_report'
  | 'sustainability_report'
  | 'third_party_audit'
  | 'regulatory_filing'
  | 'news_article'
  | 'academic_paper'
  | 'government_data'
  | 'ngo_report'
  | 'company_press_release'
  | 'certification'
  | 'patent'
  | 'other'

export type EvidenceCategory =
  | 'supporting'
  | 'contradicting'
  | 'contextual'
  | 'methodology'
  | 'baseline'

export type CredibilityLevel =
  | 'high'
  | 'medium'
  | 'low'
  | 'unverified'

export interface Evidence {
  id: number
  case_id: number
  title: string
  ev_type: EvidenceType
  url: string
  url_hash: string
  source_name: string
  credibility_note: string
  relevance: string
  category: EvidenceCategory
  submitted_by: string
  submitted_at: number
}

export interface EvidenceFormData {
  title: string
  ev_type: EvidenceType
  url: string
  url_hash: string
  source_name: string
  credibility_note: string
  relevance: string
  category: EvidenceCategory
}

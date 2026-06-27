export type ClaimCategory =
  | 'carbon_emissions'
  | 'renewable_energy'
  | 'water_usage'
  | 'waste_management'
  | 'biodiversity'
  | 'supply_chain'
  | 'labor_practices'
  | 'governance'
  | 'diversity_inclusion'
  | 'community_impact'
  | 'circular_economy'
  | 'net_zero'
  | 'other'

export type ClaimStatus =
  | 'pending'
  | 'under_review'
  | 'verdict_issued'
  | 'disputed'
  | 'archived'

export type Industry =
  | 'energy'
  | 'manufacturing'
  | 'finance'
  | 'technology'
  | 'agriculture'
  | 'transportation'
  | 'retail'
  | 'healthcare'
  | 'construction'
  | 'mining'
  | 'chemicals'
  | 'food_beverage'
  | 'apparel'
  | 'real_estate'
  | 'other'

export interface Claim {
  id: number
  title: string
  company: string
  claim_category: ClaimCategory
  industry: Industry
  location: string
  esg_claim: string
  claim_source: string
  reporting_period: string
  claimed_impact: string
  claimed_action: string
  assessment_objective: string
  evidence_summary: string
  status: ClaimStatus
  owner: string
  created_at: number
  updated_at: number
  evidence_count: number
  has_verdict: boolean
}

export interface ClaimFormData {
  title: string
  company: string
  claim_category: ClaimCategory
  industry: Industry
  location: string
  esg_claim: string
  claim_source: string
  reporting_period: string
  claimed_impact: string
  claimed_action: string
  assessment_objective: string
  evidence_summary: string
}

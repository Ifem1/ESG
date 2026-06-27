import type { ClaimCategory, Industry, EvidenceType, EvidenceCategory } from '@/types'

export const CLAIM_CATEGORIES: { value: ClaimCategory; label: string }[] = [
  { value: 'carbon_emissions', label: 'Carbon Emissions' },
  { value: 'renewable_energy', label: 'Renewable Energy' },
  { value: 'water_usage', label: 'Water Usage' },
  { value: 'waste_management', label: 'Waste Management' },
  { value: 'biodiversity', label: 'Biodiversity' },
  { value: 'supply_chain', label: 'Supply Chain' },
  { value: 'labor_practices', label: 'Labor Practices' },
  { value: 'governance', label: 'Governance' },
  { value: 'diversity_inclusion', label: 'Diversity & Inclusion' },
  { value: 'community_impact', label: 'Community Impact' },
  { value: 'circular_economy', label: 'Circular Economy' },
  { value: 'net_zero', label: 'Net Zero' },
  { value: 'other', label: 'Other' },
]

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'energy', label: 'Energy' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'retail', label: 'Retail' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'construction', label: 'Construction' },
  { value: 'mining', label: 'Mining' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
]

export const EVIDENCE_TYPES: { value: EvidenceType; label: string }[] = [
  { value: 'annual_report', label: 'Annual Report' },
  { value: 'sustainability_report', label: 'Sustainability Report' },
  { value: 'third_party_audit', label: 'Third-Party Audit' },
  { value: 'regulatory_filing', label: 'Regulatory Filing' },
  { value: 'news_article', label: 'News Article' },
  { value: 'academic_paper', label: 'Academic Paper' },
  { value: 'government_data', label: 'Government Data' },
  { value: 'ngo_report', label: 'NGO Report' },
  { value: 'company_press_release', label: 'Company Press Release' },
  { value: 'certification', label: 'Certification' },
  { value: 'patent', label: 'Patent' },
  { value: 'other', label: 'Other' },
]

export const EVIDENCE_CATEGORIES: { value: EvidenceCategory; label: string }[] = [
  { value: 'supporting', label: 'Supporting' },
  { value: 'contradicting', label: 'Contradicting' },
  { value: 'contextual', label: 'Contextual' },
  { value: 'methodology', label: 'Methodology' },
  { value: 'baseline', label: 'Baseline' },
]

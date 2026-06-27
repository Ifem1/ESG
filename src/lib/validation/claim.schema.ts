import { z } from 'zod'

export const claimSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be under 200 characters'),
  company: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(150, 'Company name must be under 150 characters'),
  claim_category: z.enum([
    'carbon_emissions',
    'renewable_energy',
    'water_usage',
    'waste_management',
    'biodiversity',
    'supply_chain',
    'labor_practices',
    'governance',
    'diversity_inclusion',
    'community_impact',
    'circular_economy',
    'net_zero',
    'other',
  ]),
  industry: z.enum([
    'energy',
    'manufacturing',
    'finance',
    'technology',
    'agriculture',
    'transportation',
    'retail',
    'healthcare',
    'construction',
    'mining',
    'chemicals',
    'food_beverage',
    'apparel',
    'real_estate',
    'other',
  ]),
  location: z
    .string()
    .min(2, 'Location is required')
    .max(100, 'Location must be under 100 characters'),
  esg_claim: z
    .string()
    .min(50, 'ESG claim must be at least 50 characters')
    .max(2000, 'ESG claim must be under 2000 characters'),
  claim_source: z
    .string()
    .min(5, 'Claim source is required')
    .max(300, 'Claim source must be under 300 characters'),
  reporting_period: z
    .string()
    .min(4, 'Reporting period is required')
    .max(50, 'Reporting period must be under 50 characters'),
  claimed_impact: z
    .string()
    .min(20, 'Claimed impact must be at least 20 characters')
    .max(500, 'Claimed impact must be under 500 characters'),
  claimed_action: z
    .string()
    .min(20, 'Claimed action must be at least 20 characters')
    .max(500, 'Claimed action must be under 500 characters'),
  assessment_objective: z
    .string()
    .min(20, 'Assessment objective must be at least 20 characters')
    .max(500, 'Assessment objective must be under 500 characters'),
  evidence_summary: z
    .string()
    .min(20, 'Evidence summary must be at least 20 characters')
    .max(1000, 'Evidence summary must be under 1000 characters'),
})

export type ClaimSchemaType = z.infer<typeof claimSchema>

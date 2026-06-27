import { z } from 'zod'

export const evidenceSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be under 200 characters'),
  ev_type: z.enum([
    'annual_report',
    'sustainability_report',
    'third_party_audit',
    'regulatory_filing',
    'news_article',
    'academic_paper',
    'government_data',
    'ngo_report',
    'company_press_release',
    'certification',
    'patent',
    'other',
  ]),
  url: z
    .string()
    .url('Must be a valid URL')
    .max(2000, 'URL must be under 2000 characters'),
  url_hash: z.string().min(1, 'URL hash is required'),
  source_name: z
    .string()
    .min(2, 'Source name is required')
    .max(150, 'Source name must be under 150 characters'),
  credibility_note: z
    .string()
    .min(10, 'Credibility note must be at least 10 characters')
    .max(500, 'Credibility note must be under 500 characters'),
  relevance: z
    .string()
    .min(10, 'Relevance must be at least 10 characters')
    .max(500, 'Relevance must be under 500 characters'),
  category: z.enum([
    'supporting',
    'contradicting',
    'contextual',
    'methodology',
    'baseline',
  ]),
})

export type EvidenceSchemaType = z.infer<typeof evidenceSchema>

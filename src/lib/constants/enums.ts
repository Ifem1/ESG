import type {
  VerificationVerdict,
  GreenwashingRisk,
  ComplianceAssessment,
  DataQuality,
  ImpactScale,
} from '@/types'

export const VERIFICATION_VERDICTS: {
  value: VerificationVerdict
  label: string
  color: string
}[] = [
  { value: 'SUPPORTED', label: 'Supported', color: '#22c55e' },
  { value: 'PARTIALLY_SUPPORTED', label: 'Partially Supported', color: '#eab308' },
  { value: 'INSUFFICIENT_EVIDENCE', label: 'Insufficient Evidence', color: '#6b7280' },
  { value: 'CONTRADICTED', label: 'Contradicted', color: '#ef4444' },
  { value: 'UNVERIFIABLE', label: 'Unverifiable', color: '#6b7280' },
]

export const GREENWASHING_RISKS: {
  value: GreenwashingRisk
  label: string
  color: string
}[] = [
  { value: 'CRITICAL', label: 'Critical', color: '#ef4444' },
  { value: 'HIGH', label: 'High', color: '#f97316' },
  { value: 'MEDIUM', label: 'Medium', color: '#eab308' },
  { value: 'LOW', label: 'Low', color: '#22c55e' },
  { value: 'MINIMAL', label: 'Minimal', color: '#22c55e' },
]

export const COMPLIANCE_ASSESSMENTS: {
  value: ComplianceAssessment
  label: string
}[] = [
  { value: 'COMPLIANT', label: 'Compliant' },
  { value: 'PARTIALLY_COMPLIANT', label: 'Partially Compliant' },
  { value: 'NON_COMPLIANT', label: 'Non-Compliant' },
  { value: 'UNKNOWN', label: 'Unknown' },
]

export const DATA_QUALITIES: { value: DataQuality; label: string }[] = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'INSUFFICIENT', label: 'Insufficient' },
]

export const IMPACT_SCALES: { value: ImpactScale; label: string }[] = [
  { value: 'TRANSFORMATIVE', label: 'Transformative' },
  { value: 'SIGNIFICANT', label: 'Significant' },
  { value: 'MODERATE', label: 'Moderate' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'NEGLIGIBLE', label: 'Negligible' },
  { value: 'UNKNOWN', label: 'Unknown' },
]

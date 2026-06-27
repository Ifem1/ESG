export type VerificationVerdict =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'INSUFFICIENT_EVIDENCE'
  | 'CONTRADICTED'
  | 'UNVERIFIABLE'

export type GreenwashingRisk =
  | 'CRITICAL'
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'MINIMAL'

export type ComplianceAssessment =
  | 'COMPLIANT'
  | 'PARTIALLY_COMPLIANT'
  | 'NON_COMPLIANT'
  | 'UNKNOWN'

export type DataQuality =
  | 'HIGH'
  | 'MEDIUM'
  | 'LOW'
  | 'INSUFFICIENT'

export type ImpactScale =
  | 'TRANSFORMATIVE'
  | 'SIGNIFICANT'
  | 'MODERATE'
  | 'MINIMAL'
  | 'NEGLIGIBLE'
  | 'UNKNOWN'

export interface Verdict {
  id: number
  case_id: number
  verification_verdict: VerificationVerdict
  confidence_score: number
  greenwashing_risk: GreenwashingRisk
  compliance_assessment: ComplianceAssessment
  data_quality: DataQuality
  impact_scale: ImpactScale
  methodology_soundness: number
  transparency_score: number
  third_party_verification: boolean
  key_supporting_evidence: string[]
  key_contradicting_evidence: string[]
  evidence_gaps: string
  recommended_next_action: string
  follow_up_audit_needed: boolean
  reasoning_summary: string
  consensus_round: number
  validator_count: number
  issued_at: number
  model_version: string
}

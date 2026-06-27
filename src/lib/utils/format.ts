import type { GreenwashingRisk, VerificationVerdict } from '@/types'

export function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(timestamp: number): string {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return 'N/A'
  const seconds = Math.floor(Date.now() / 1000 - timestamp)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`
}

export function formatScore(score: number, decimals = 1): string {
  return score.toFixed(decimals)
}

export function verdictLabel(verdict: VerificationVerdict): string {
  const labels: Record<VerificationVerdict, string> = {
    SUPPORTED: 'Supported',
    PARTIALLY_SUPPORTED: 'Partially Supported',
    INSUFFICIENT_EVIDENCE: 'Insufficient Evidence',
    CONTRADICTED: 'Contradicted',
    UNVERIFIABLE: 'Unverifiable',
  }
  return labels[verdict] ?? verdict
}

export function riskLabel(risk: GreenwashingRisk): string {
  const labels: Record<GreenwashingRisk, string> = {
    CRITICAL: 'Critical Risk',
    HIGH: 'High Risk',
    MEDIUM: 'Medium Risk',
    LOW: 'Low Risk',
    MINIMAL: 'Minimal Risk',
  }
  return labels[risk] ?? risk
}

export function claimCategoryLabel(cat: string): string {
  return cat
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function industryLabel(ind: string): string {
  return ind
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function evidenceTypeLabel(type: string): string {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

import { contractRead } from './client'
import type { Claim } from '@/types/claim'
import type { Evidence } from '@/types/evidence'
import type { Verdict } from '@/types/verdict'

/**
 * Fetch a single case by ID.
 */
export async function getCase(caseId: number): Promise<Claim | null> {
  try {
    const result = await contractRead<Claim>('get_case', [String(caseId)])
    return result
  } catch {
    return null
  }
}

/**
 * Fetch all cases from the contract.
 */
export async function getAllCases(): Promise<Claim[]> {
  try {
    const result = await contractRead<Claim[]>('get_all_cases', [])
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

/**
 * Fetch all cases belonging to a wallet address.
 */
export async function getCasesByOwner(wallet: string): Promise<Claim[]> {
  try {
    const result = await contractRead<Claim[]>('get_cases_by_owner', [wallet])
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

/**
 * Fetch all evidence for a case.
 */
export async function getEvidence(caseId: number): Promise<Evidence[]> {
  try {
    const result = await contractRead<Evidence[]>('get_evidence', [String(caseId)])
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

/**
 * Fetch the latest verdict for a case.
 */
export async function getLatestVerdict(caseId: number): Promise<Verdict | null> {
  try {
    const result = await contractRead<Verdict | null>('get_latest_verdict', [String(caseId)])
    return result ?? null
  } catch {
    return null
  }
}

/**
 * Fetch full verdict history for a case.
 */
export async function getVerdictHistory(caseId: number): Promise<Verdict[]> {
  try {
    const result = await contractRead<Verdict[]>('get_verdict_history', [String(caseId)])
    return Array.isArray(result) ? result : []
  } catch {
    return []
  }
}

/**
 * Fetch the total number of cases.
 */
export async function getCaseCount(): Promise<number> {
  try {
    const result = await contractRead<number>('get_case_count', [])
    return Number(result)
  } catch {
    return 0
  }
}

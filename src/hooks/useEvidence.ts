'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEvidence } from '@/lib/genlayer/contract'
import type { Evidence } from '@/types/evidence'

export function useEvidence(caseId: number | null) {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (caseId === null) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getEvidence(caseId)
      setEvidence(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load evidence')
    } finally {
      setLoading(false)
    }
  }, [caseId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { evidence, loading, error, refetch }
}

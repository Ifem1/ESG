'use client'

import { useState, useEffect, useCallback } from 'react'
import { getLatestVerdict, getVerdictHistory } from '@/lib/genlayer/contract'
import type { Verdict } from '@/types/verdict'

export function useLatestVerdict(caseId: number | null) {
  const [verdict, setVerdict] = useState<Verdict | null>(null)
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
      const data = await getLatestVerdict(caseId)
      setVerdict(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verdict')
    } finally {
      setLoading(false)
    }
  }, [caseId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { verdict, loading, error, refetch }
}

export function useVerdictHistory(caseId: number | null) {
  const [history, setHistory] = useState<Verdict[]>([])
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
      const data = await getVerdictHistory(caseId)
      setHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verdict history')
    } finally {
      setLoading(false)
    }
  }, [caseId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { history, loading, error, refetch }
}

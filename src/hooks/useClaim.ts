'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCase, getAllCases, getCasesByOwner } from '@/lib/genlayer/contract'
import type { Claim } from '@/types/claim'

export function useAllClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllCases()
      setClaims(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load claims')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { claims, loading, error, refetch }
}

export function useClaim(id: number | null) {
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (id === null) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getCase(id)
      setClaim(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load claim')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { claim, loading, error, refetch }
}

export function useOwnerClaims(wallet: string | null) {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!wallet) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getCasesByOwner(wallet)
      setClaims(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load claims')
    } finally {
      setLoading(false)
    }
  }, [wallet])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { claims, loading, error, refetch }
}

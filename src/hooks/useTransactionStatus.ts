'use client'

import { useState, useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import type { TransactionState } from '@/types'

export function useTransactionStatus(hash?: `0x${string}`) {
  const [state, setState] = useState<TransactionState>({ status: 'idle' })

  const { isLoading, isSuccess, isError, error } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (!hash) {
      setState({ status: 'idle' })
      return
    }
    if (isLoading) {
      setState({ status: 'pending', hash })
      return
    }
    if (isSuccess) {
      setState({ status: 'success', hash })
      return
    }
    if (isError) {
      setState({
        status: 'error',
        hash,
        error: error?.message || 'Transaction failed',
      })
      return
    }
  }, [hash, isLoading, isSuccess, isError, error])

  const reset = () => setState({ status: 'idle' })

  return { state, reset }
}

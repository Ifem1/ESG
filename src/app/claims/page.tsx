'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PlusCircle, Search, Filter, RefreshCw, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClaimCard } from '@/components/claims/ClaimCard'
import { LoadingState, CardSkeleton } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'
import { useAllClaims } from '@/hooks/useClaim'
import { CLAIM_CATEGORIES, INDUSTRIES } from '@/lib/constants/categories'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'company', label: 'Company A-Z' },
]

const VERDICT_FILTERS = [
  { value: 'all', label: 'All Verdicts' },
  { value: 'verdict_issued', label: 'Verdict Issued' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
]

export default function ClaimsPage() {
  const { claims, loading, error, refetch } = useAllClaims()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    let result = [...claims]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.esg_claim?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.claim_category === categoryFilter)
    }

    if (industryFilter !== 'all') {
      result = result.filter((c) => c.industry === industryFilter)
    }

    result.sort((a, b) => {
      if (sort === 'newest') return b.created_at - a.created_at
      if (sort === 'oldest') return a.created_at - b.created_at
      if (sort === 'company') return (a.company || '').localeCompare(b.company || '')
      return 0
    })

    return result
  }, [claims, search, statusFilter, categoryFilter, industryFilter, sort])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Claims Ledger</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {claims.length} ESG verification cases on the GenLayer network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/claims/new">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search by company, title, or claim text..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VERDICT_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CLAIM_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-36">
              <SlidersHorizontal className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <p className="text-xs text-text-muted">
          Showing {filtered.length} of {claims.length} claims
        </p>
      )}

      {/* Content */}
      {error ? (
        <ErrorState description={error} onRetry={refetch} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No claims found"
          description={
            search || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'No ESG claims have been submitted yet.'
          }
          action={
            <Link href="/claims/new">
              <Button size="sm">Submit First Claim</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  )
}

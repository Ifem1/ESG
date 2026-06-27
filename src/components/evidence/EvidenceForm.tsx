'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { AlertCircle, Loader2, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransactionStatus } from '@/components/shared/TransactionStatus'
import { EVIDENCE_TYPES, EVIDENCE_CATEGORIES } from '@/lib/constants/categories'
import { hashUrl } from '@/lib/utils/hash'
import { useAddEvidence } from '@/hooks/useContract'
import type { EvidenceType, EvidenceCategory } from '@/types/evidence'

interface EvidenceFormProps {
  caseId: number
}

export function EvidenceForm({ caseId }: EvidenceFormProps) {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { addEvidence, isPending, txState, error, reset: resetTx } = useAddEvidence()

  const [form, setForm] = useState({
    title: '',
    ev_type: 'other' as EvidenceType,
    url: '',
    url_hash: '',
    source_name: '',
    credibility_note: '',
    relevance: '',
    category: 'supporting' as EvidenceCategory,
  })
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    if (!form.url) { setForm((p) => ({ ...p, url_hash: '' })); return }
    try {
      new URL(form.url)
      setUrlError('')
      hashUrl(form.url).then((h) => setForm((p) => ({ ...p, url_hash: h })))
    } catch {
      setUrlError('Enter a valid URL')
      setForm((p) => ({ ...p, url_hash: '' }))
    }
  }, [form.url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !form.url_hash) return
    try {
      await addEvidence(String(caseId), form)
    } catch {
      // handled via txState
    }
  }

  if (txState.status === 'SUCCESS') {
    return (
      <div className="rounded-lg border border-[#22c55e]/30 bg-[#0a1a0d] p-8 text-center">
        <p className="text-[#22c55e] font-semibold mb-2">Evidence submitted!</p>
        <TransactionStatus state={txState} />
        <div className="flex gap-3 justify-center mt-4">
          <Button variant="outline" size="sm" onClick={() => router.push(`/claims/${caseId}`)}>
            View Claim
          </Button>
          <Button size="sm" onClick={() => { resetTx(); setForm({ title: '', ev_type: 'other', url: '', url_hash: '', source_name: '', credibility_note: '', relevance: '', category: 'supporting' }) }}>
            Add More
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[#1e2d22] bg-card p-6 space-y-5">
      <h2 className="text-lg font-semibold text-text-primary">Add Evidence</h2>

      <div className="rounded-md border border-[#eab308]/30 bg-[#1a1500] p-3 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-[#eab308] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#eab308]">
          Only submit publicly accessible URLs. File uploads are not supported.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Evidence Title *</Label>
        <Input
          placeholder="Descriptive title for this evidence"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>URL *</Label>
        <Input
          type="url"
          placeholder="https://..."
          value={form.url}
          onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
          required
        />
        {urlError && <p className="text-xs text-[#ef4444]">{urlError}</p>}
        {form.url_hash && (
          <div className="flex items-center gap-1.5 mt-1">
            <Hash className="h-3 w-3 text-text-muted" />
            <span className="text-[10px] font-mono text-text-muted truncate">{form.url_hash}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Evidence Type *</Label>
          <Select value={form.ev_type} onValueChange={(v) => setForm((p) => ({ ...p, ev_type: v as EvidenceType }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {EVIDENCE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as EvidenceCategory }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {EVIDENCE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Source Name *</Label>
        <Input
          placeholder="e.g. CDP, Bloomberg, Company Annual Report"
          value={form.source_name}
          onChange={(e) => setForm((p) => ({ ...p, source_name: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Relevance *</Label>
        <Textarea
          placeholder="Why is this evidence relevant to the claim?"
          rows={2}
          value={form.relevance}
          onChange={(e) => setForm((p) => ({ ...p, relevance: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Credibility Note</Label>
        <Textarea
          placeholder="Notes on source credibility, methodology, or limitations"
          rows={2}
          value={form.credibility_note}
          onChange={(e) => setForm((p) => ({ ...p, credibility_note: e.target.value }))}
        />
      </div>

      {txState.status !== 'idle' && <TransactionStatus state={txState} onReset={resetTx} />}

      {!isConnected && (
        <div className="flex items-center gap-2 text-sm text-[#ef4444]">
          <AlertCircle className="h-4 w-4" />
          Connect wallet to submit evidence
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!isConnected || isPending || (txState.status !== 'idle' && txState.status !== 'SUCCESS' && txState.status !== 'FAILED_EXECUTION' && txState.status !== 'VALIDATORS_TIMEOUT') || !!urlError || !form.url_hash}
      >
        {(isPending || (txState.status !== 'idle' && txState.status !== 'SUCCESS' && txState.status !== 'FAILED_EXECUTION' && txState.status !== 'VALIDATORS_TIMEOUT' && txState.status !== 'LEADER_TIMEOUT')) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Submit Evidence
      </Button>
    </form>
  )
}

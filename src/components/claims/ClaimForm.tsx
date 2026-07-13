'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { ChevronRight, ChevronLeft, Check, Plus, Trash2, AlertCircle, Loader2 } from 'lucide-react'
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
import { CLAIM_CATEGORIES, INDUSTRIES } from '@/lib/constants/categories'
import { claimSchema, type ClaimSchemaType } from '@/lib/validation/claim.schema'
import { useCreateCase, useAddEvidence } from '@/hooks/useContract'
import { hashUrl } from '@/lib/utils/hash'
import { evidenceSchema, type EvidenceSchemaType } from '@/lib/validation/evidence.schema'
import { EVIDENCE_TYPES, EVIDENCE_CATEGORIES } from '@/lib/constants/categories'
import { getCasesByOwner } from '@/lib/genlayer/contract'
import { waitForFinalizedTransaction } from '@/lib/genlayer/client'
import { cn } from '@/lib/utils/cn'

const STEPS = ['Case Info', 'Evidence', 'Review & Submit']

interface EvidenceEntry extends Partial<EvidenceSchemaType> {
  _id: string
}

export function ClaimForm() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [step, setStep] = useState(0)
  const [evidenceEntries, setEvidenceEntries] = useState<EvidenceEntry[]>([])
  const [submitPhase, setSubmitPhase] = useState<
    'idle' | 'creating' | 'evidence' | 'done' | 'error'
  >('idle')
  const [submitLog, setSubmitLog] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [newCaseId, setNewCaseId] = useState<number | null>(null)

  const { createCase } = useCreateCase()
  const { addEvidence } = useAddEvidence()

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<ClaimSchemaType>({
    resolver: zodResolver(claimSchema),
    mode: 'onBlur',
  })

  const addEvidenceEntry = () => {
    if (evidenceEntries.length >= 20) return
    setEvidenceEntries((prev) => [
      ...prev,
      { _id: Math.random().toString(36).slice(2), ev_type: 'other', category: 'supporting' },
    ])
  }

  const removeEvidenceEntry = (id: string) => {
    setEvidenceEntries((prev) => prev.filter((e) => e._id !== id))
  }

  const updateEvidenceEntry = async (id: string, field: string, value: string) => {
    setEvidenceEntries((prev) =>
      prev.map((e) => {
        if (e._id !== id) return e
        const updated = { ...e, [field]: value }
        if (field === 'url' && value) {
          hashUrl(value).then((hash) => {
            setEvidenceEntries((p) =>
              p.map((x) => (x._id === id ? { ...x, url_hash: hash } : x))
            )
          })
        }
        return updated
      })
    )
  }

  const goNext = async () => {
    if (step === 0) {
      const valid = await trigger([
        'title', 'company', 'claim_category', 'industry', 'location',
        'esg_claim', 'claim_source', 'reporting_period', 'claimed_impact',
        'claimed_action', 'assessment_objective', 'evidence_summary',
      ])
      if (!valid) return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  const log = (msg: string) => setSubmitLog((prev) => [...prev, msg])

  const onSubmit = async (data: ClaimSchemaType) => {
    if (!isConnected) return
    setSubmitError(null)
    setSubmitLog([])

    try {
      const existingCases = await getCasesByOwner(address!)
      const existingIds = new Set(existingCases.map((item) => String(item.id)))

      // 2. Create the case
      setSubmitPhase('creating')
      log('Submitting case — approve in your wallet…')
      const createHash = await createCase(data)
      log('Waiting for case transaction finalization…')
      await waitForFinalizedTransaction(createHash)
      const confirmedCases = await getCasesByOwner(address!)
      const confirmedCase = confirmedCases.find(
        (item) => !existingIds.has(String(item.id)) && item.title === data.title && item.company === data.company
      )
      if (!confirmedCase) throw new Error('Finalized case ID could not be confirmed on-chain.')
      const confirmedCaseId = String(confirmedCase.id)
      setNewCaseId(Number(confirmedCaseId))
      log(`Case #${confirmedCaseId} finalized and confirmed ✓`)

      // 3. Submit each evidence entry
      const validEvidence = evidenceEntries.filter(
        (e) => e.title && e.url && e.source_name
      )

      if (validEvidence.length > 0) {
        setSubmitPhase('evidence')
        for (let i = 0; i < validEvidence.length; i++) {
          const ev = validEvidence[i]
          log(`Submitting evidence ${i + 1}/${validEvidence.length} — approve in your wallet…`)
          const evidenceHash = await addEvidence(confirmedCaseId, {
            title: ev.title ?? '',
            ev_type: ev.ev_type ?? 'other',
            url: ev.url ?? '',
            url_hash: ev.url_hash ?? '',
            source_name: ev.source_name ?? '',
            credibility_note: ev.credibility_note ?? '',
            relevance: ev.relevance ?? '',
            category: ev.category ?? 'supporting',
          })
          await waitForFinalizedTransaction(evidenceHash)
          log(`Evidence ${i + 1} finalized ✓`)
        }
      }

      setSubmitPhase('done')
    } catch (e) {
      setSubmitPhase('error')
      setSubmitError(e instanceof Error ? e.message : String(e))
    }
  }

  if (submitPhase === 'done') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg border border-[#22c55e]/30 bg-[#0a1a0d] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 mx-auto mb-4">
            <Check className="h-8 w-8 text-[#22c55e]" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Claim Submitted</h2>
          <p className="text-sm text-text-secondary mb-4">
            Your ESG claim and evidence have been submitted to the GenLayer network.
            The AI consensus validators will now evaluate the claim.
          </p>

          {/* Submission log */}
          <div className="rounded-md bg-surface border border-[#1e2d22] p-3 text-left mb-6 space-y-1">
            {submitLog.map((line, i) => (
              <p key={i} className="text-xs font-mono text-text-secondary">
                <span className="text-primary mr-2">›</span>{line}
              </p>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            {newCaseId !== null && (
              <Button onClick={() => router.push(`/claims/${newCaseId}`)}>
                View Case #{newCaseId}
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push('/claims')}>
              All Claims
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setSubmitPhase('idle')
                setStep(0)
                setSubmitLog([])
                setNewCaseId(null)
              }}
            >
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-mono font-bold transition-colors',
              i < step ? 'bg-primary border-primary text-[#0a0f0d]' :
              i === step ? 'border-primary text-primary bg-primary/10' :
              'border-[#1e2d22] text-text-muted bg-surface'
            )}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn(
              'ml-2 text-sm font-medium hidden sm:block',
              i === step ? 'text-text-primary' : 'text-text-muted'
            )}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-px mx-4',
                i < step ? 'bg-primary' : 'bg-[#1e2d22]'
              )} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 0: Case Info */}
        {step === 0 && (
          <div className="rounded-lg border border-[#1e2d22] bg-card p-6 space-y-5">
            <h2 className="text-lg font-semibold text-text-primary">Case Information</h2>

            <div className="space-y-2">
              <Label htmlFor="title">Case Title *</Label>
              <Input id="title" placeholder="Brief title describing the ESG claim" {...register('title')} />
              {errors.title && <p className="text-xs text-[#ef4444]">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" placeholder="Company name" {...register('company')} />
                {errors.company && <p className="text-xs text-[#ef4444]">{errors.company.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="Country or region" {...register('location')} />
                {errors.location && <p className="text-xs text-[#ef4444]">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Claim Category *</Label>
                <Controller
                  name="claim_category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {CLAIM_CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.claim_category && <p className="text-xs text-[#ef4444]">{errors.claim_category.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Industry *</Label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((i) => (
                          <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.industry && <p className="text-xs text-[#ef4444]">{errors.industry.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="esg_claim">ESG Claim Text *</Label>
              <Textarea
                id="esg_claim"
                placeholder="Describe the specific sustainability claim being made..."
                rows={4}
                {...register('esg_claim')}
              />
              {errors.esg_claim && <p className="text-xs text-[#ef4444]">{errors.esg_claim.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="claim_source">Claim Source *</Label>
                <Input id="claim_source" placeholder="URL or document reference" {...register('claim_source')} />
                {errors.claim_source && <p className="text-xs text-[#ef4444]">{errors.claim_source.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporting_period">Reporting Period *</Label>
                <Input id="reporting_period" placeholder="e.g. FY2023, Q3 2024" {...register('reporting_period')} />
                {errors.reporting_period && <p className="text-xs text-[#ef4444]">{errors.reporting_period.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimed_impact">Claimed Impact *</Label>
              <Textarea
                id="claimed_impact"
                placeholder="What measurable impact does the company claim?"
                rows={2}
                {...register('claimed_impact')}
              />
              {errors.claimed_impact && <p className="text-xs text-[#ef4444]">{errors.claimed_impact.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="claimed_action">Claimed Action *</Label>
              <Textarea
                id="claimed_action"
                placeholder="What specific actions did the company take?"
                rows={2}
                {...register('claimed_action')}
              />
              {errors.claimed_action && <p className="text-xs text-[#ef4444]">{errors.claimed_action.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment_objective">Assessment Objective *</Label>
              <Textarea
                id="assessment_objective"
                placeholder="What should the AI consensus verify?"
                rows={2}
                {...register('assessment_objective')}
              />
              {errors.assessment_objective && <p className="text-xs text-[#ef4444]">{errors.assessment_objective.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence_summary">Evidence Summary *</Label>
              <Textarea
                id="evidence_summary"
                placeholder="Brief summary of available evidence..."
                rows={3}
                {...register('evidence_summary')}
              />
              {errors.evidence_summary && <p className="text-xs text-[#ef4444]">{errors.evidence_summary.message}</p>}
            </div>
          </div>
        )}

        {/* Step 1: Evidence */}
        {step === 1 && (
          <div className="rounded-lg border border-[#1e2d22] bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Evidence URLs</h2>
              <span className="text-xs text-text-muted font-mono">{evidenceEntries.length}/20</span>
            </div>

            <div className="rounded-md border border-[#eab308]/30 bg-[#1a1500] p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-[#eab308] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#eab308]">
                Only submit publicly accessible URLs. Evidence will be fetched by the AI consensus engine. File uploads are not supported.
              </p>
            </div>

            <div className="space-y-4">
              {evidenceEntries.map((entry, idx) => (
                <div key={entry._id} className="rounded-md border border-[#1e2d22] bg-surface p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-text-muted">Evidence #{idx + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEvidenceEntry(entry._id)}
                      className="text-[#ef4444] h-6 px-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Title</Label>
                    <Input
                      placeholder="Evidence title"
                      value={entry.title || ''}
                      onChange={(e) => updateEvidenceEntry(entry._id, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">URL</Label>
                    <Input
                      placeholder="https://..."
                      value={entry.url || ''}
                      onChange={(e) => updateEvidenceEntry(entry._id, 'url', e.target.value)}
                    />
                    {entry.url_hash && (
                      <p className="text-[10px] font-mono text-text-muted truncate">
                        SHA-256: {entry.url_hash}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={entry.ev_type || 'other'}
                        onValueChange={(v) => updateEvidenceEntry(entry._id, 'ev_type', v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EVIDENCE_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Category</Label>
                      <Select
                        value={entry.category || 'supporting'}
                        onValueChange={(v) => updateEvidenceEntry(entry._id, 'category', v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EVIDENCE_CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value} className="text-xs">{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Source Name</Label>
                    <Input
                      placeholder="Organisation or publication"
                      value={entry.source_name || ''}
                      onChange={(e) => updateEvidenceEntry(entry._id, 'source_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Relevance</Label>
                    <Input
                      placeholder="Why is this evidence relevant?"
                      value={entry.relevance || ''}
                      onChange={(e) => updateEvidenceEntry(entry._id, 'relevance', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Credibility Note</Label>
                    <Input
                      placeholder="Note on source credibility"
                      value={entry.credibility_note || ''}
                      onChange={(e) => updateEvidenceEntry(entry._id, 'credibility_note', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {evidenceEntries.length < 20 && (
              <Button type="button" variant="outline" onClick={addEvidenceEntry} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Evidence URL
              </Button>
            )}

            <p className="text-xs text-text-muted text-center">
              Evidence can also be added after submission via the claim detail page.
            </p>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#1e2d22] bg-card p-6 space-y-3">
              <h2 className="text-lg font-semibold text-text-primary">Review & Submit</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(getValues()).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-xs text-text-muted uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                    <p className="text-text-secondary truncate">{String(val)}</p>
                  </div>
                ))}
              </div>
              {evidenceEntries.length > 0 && (
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Evidence URLs</p>
                  <p className="text-sm text-text-secondary">{evidenceEntries.length} item(s) will be submitted</p>
                </div>
              )}
            </div>

            {!isConnected && (
              <div className="rounded-md border border-[#ef4444]/30 bg-[#1a0808] p-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-[#ef4444]" />
                <p className="text-sm text-[#ef4444]">Connect your wallet to submit</p>
              </div>
            )}

            {submitError && (
              <div className="rounded-md border border-[#ef4444]/30 bg-[#1a0808] p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-[#ef4444] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#ef4444]">Submission failed</p>
                  <p className="text-xs text-[#ef4444]/80 mt-0.5 break-all">{submitError}</p>
                </div>
              </div>
            )}

            {/* Live progress log while submitting */}
            {(submitPhase === 'creating' || submitPhase === 'evidence') && submitLog.length > 0 && (
              <div className="rounded-md bg-surface border border-[#1e2d22] p-3 space-y-1">
                {submitLog.map((line, i) => (
                  <p key={i} className="text-xs font-mono text-text-secondary">
                    <span className="text-primary mr-2">›</span>{line}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isConnected || submitPhase === 'creating' || submitPhase === 'evidence'}
            >
              {(submitPhase === 'creating' || submitPhase === 'evidence') && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {submitPhase === 'creating'
                ? 'Submitting case…'
                : submitPhase === 'evidence'
                ? 'Submitting evidence…'
                : 'Submit to GenLayer'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

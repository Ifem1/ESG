'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Shield, Brain, Globe, FileSearch, AlertTriangle,
  GitMerge, ArrowRight, Lock, Zap, ChevronDown,
  CheckCircle, Eye, Database, Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeroCanvas } from '@/components/landing/HeroCanvas'
import { AnimatedCounter } from '@/components/landing/AnimatedCounter'
import { SectionReveal } from '@/components/landing/SectionReveal'

// ─── Typewriter hook ────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'

function useTypewriter(words: string[], speed = 80, pause = 2200) {
  const [text, setText] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause)
        } else {
          setCharIdx((c) => c + 1)
        }
      } else {
        setText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setWordIdx((w) => (w + 1) % words.length)
          setCharIdx(0)
        } else {
          setCharIdx((c) => c - 1)
        }
      }
    }, deleting ? speed / 2 : speed)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, wordIdx, words, speed, pause])

  return text
}

// ─── Data ───────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: FileSearch,
    title: 'Submit ESG Claim',
    desc: 'Register any sustainability claim — carbon neutrality, social impact, governance commitments — with full context and evidence summary.',
    color: '#22c55e',
  },
  {
    step: '02',
    icon: Database,
    title: 'Attach Evidence',
    desc: 'Link public evidence URLs: annual reports, third-party audits, regulatory filings. Validators fetch and read each source in real time.',
    color: '#4ade80',
  },
  {
    step: '03',
    icon: Brain,
    title: 'AI Consensus',
    desc: 'GenLayer validator nodes independently analyse the claim. The network reaches consensus on a structured verdict using non-comparative equivalence.',
    color: '#86efac',
  },
]

const ESG_CATEGORIES = [
  {
    label: 'Environmental',
    tag: 'E',
    color: '#22c55e',
    desc: 'Carbon emissions, biodiversity, water stewardship, renewable energy, net-zero commitments.',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Social',
    tag: 'S',
    color: '#3b82f6',
    desc: 'Labour rights, supply chain ethics, community impact, diversity & inclusion metrics.',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Governance',
    tag: 'G',
    color: '#a78bfa',
    desc: 'Board independence, executive pay, anti-corruption policies, shareholder rights.',
    img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
  },
]

const RISK_LEVELS = [
  { label: 'MINIMAL', color: '#22c55e', desc: 'Claim strongly verified' },
  { label: 'LOW', color: '#84cc16', desc: 'Well-supported with minor gaps' },
  { label: 'MEDIUM', color: '#eab308', desc: 'Partial support, monitor' },
  { label: 'HIGH', color: '#f97316', desc: 'Significant contradictions' },
  { label: 'CRITICAL', color: '#ef4444', desc: 'Evidence of greenwashing' },
]

const VERDICT_FEED = [
  { company: 'NordGreen AS', verdict: 'SUPPORTED', risk: 'LOW', category: 'Carbon Neutrality', confidence: 88 },
  { company: 'SolarVest Corp', verdict: 'PARTIALLY_SUPPORTED', risk: 'MEDIUM', category: 'Renewable Energy', confidence: 64 },
  { company: 'EcoFab Industries', verdict: 'CONTRADICTED', risk: 'CRITICAL', category: 'Deforestation', confidence: 91 },
  { company: 'Verdant Capital', verdict: 'SUPPORTED', risk: 'MINIMAL', category: 'ESG Governance', confidence: 95 },
  { company: 'BlueSky Airlines', verdict: 'INSUFFICIENT_EVIDENCE', risk: 'HIGH', category: 'Net Zero 2040', confidence: 42 },
  { company: 'Aqua Systems Ltd', verdict: 'SUPPORTED', risk: 'LOW', category: 'Water Stewardship', confidence: 79 },
]

const verdictColor: Record<string, string> = {
  SUPPORTED: '#22c55e',
  PARTIALLY_SUPPORTED: '#eab308',
  CONTRADICTED: '#ef4444',
  INSUFFICIENT_EVIDENCE: '#6b7280',
  UNVERIFIABLE: '#6b7280',
}
const riskColor: Record<string, string> = {
  MINIMAL: '#22c55e', LOW: '#84cc16', MEDIUM: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444',
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const tagline = useTypewriter([
    'Carbon Neutrality Claims.',
    'Net-Zero Commitments.',
    'Supply Chain Ethics.',
    'ESG Governance.',
    'Biodiversity Pledges.',
  ])

  return (
    <div className="relative overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Canvas network background */}
        <HeroCanvas />

        {/* Earth image overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=60"
            alt="Earth from space"
            fill
            className="object-cover opacity-15"
            priority
            unoptimized
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050e07]/80 via-[#050e07]/40 to-[#050e07]" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#050e07]/90" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm px-5 py-2 mb-10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-mono text-primary tracking-widest uppercase">
              Live on GenLayer StudioNet
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.08]"
          >
            The Truth About{' '}
            <span className="block text-primary mt-1">
              {tagline}
              <span className="animate-pulse text-primary/60">|</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            ESG Oracle Protocol deploys decentralised AI validators to verify sustainability
            claims, detect greenwashing, and issue immutable verdicts — no central authority,
            no bias, no compromise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/claims/new">
              <Button size="lg" className="px-10 py-6 text-base font-semibold shadow-lg shadow-primary/20">
                Verify a Claim
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/claims">
              <Button variant="outline" size="lg" className="px-10 py-6 text-base border-white/20 text-white/80 hover:bg-white/5">
                <Eye className="h-4 w-4 mr-2" />
                Explore Ledger
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30"
        >
          <span className="text-[10px] tracking-widest uppercase font-mono">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── LIVE STATS ───────────────────────────────────────────────────── */}
      <section className="relative border-y border-[#1e2d22] bg-[#070f09]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Claims Submitted', value: 0, live: true },
            { label: 'Verdicts Issued', value: 0, live: true },
            { label: 'Risk Categories', value: 5 },
            { label: 'Verdict Types', value: 5 },
          ].map((s, i) => (
            <SectionReveal key={s.label} delay={i * 0.1} className="text-center">
              <p className="text-3xl md:text-4xl font-bold font-mono text-primary mb-1">
                {s.live
                  ? <AnimatedCounter target={s.value} suffix="+" />
                  : <AnimatedCounter target={s.value} />
                }
              </p>
              <p className="text-xs text-white/40 uppercase tracking-widest">{s.label}</p>
              {s.live && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-primary/60">
                  <span className="h-1 w-1 rounded-full bg-primary/60 animate-pulse" />
                  live
                </span>
              )}
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* ── HERO IMAGE STRIP ─────────────────────────────────────────────── */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=70"
          alt="Solar panels aerial view"
          fill
          className="object-cover opacity-40"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050e07] via-transparent to-[#050e07]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050e07] via-transparent to-[#050e07]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <SectionReveal>
            <p className="text-2xl md:text-4xl font-bold text-white/90 text-center px-6 max-w-3xl leading-snug">
              Every sustainability claim deserves{' '}
              <span className="text-primary">independent scrutiny.</span>
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <SectionReveal className="text-center mb-16">
          <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Three steps from claim to immutable verdict. No paperwork. No gatekeepers.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon
            return (
              <SectionReveal key={step.step} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4, borderColor: `${step.color}50` }}
                  className="relative rounded-2xl border border-[#1e2d22] bg-[#070f09] p-8 h-full transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl font-black font-mono text-white/5 select-none">{step.step}</span>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: step.color }} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)` }}
                  />
                </motion.div>
              </SectionReveal>
            )
          })}
        </div>
      </section>

      {/* ── ESG CATEGORIES ───────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#1e2d22]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">Coverage</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">E · S · G Framework</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Comprehensive coverage across all three ESG pillars, with AI models trained on international reporting standards.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ESG_CATEGORIES.map((cat, i) => (
              <SectionReveal key={cat.label} delay={i * 0.12}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-2xl overflow-hidden h-72 group cursor-pointer border border-[#1e2d22]"
                >
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-65 transition-opacity duration-500 group-hover:scale-105 scale-100 transition-transform"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${cat.color}60 0%, transparent 60%)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-black"
                      style={{ backgroundColor: `${cat.color}25`, color: cat.color, border: `1px solid ${cat.color}40` }}
                    >
                      {cat.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{cat.label}</h3>
                    <p className="text-sm text-white/60 leading-relaxed">{cat.desc}</p>
                  </div>
                </motion.div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE VERDICT FEED ────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#1e2d22] overflow-hidden">
        <SectionReveal className="text-center mb-10 px-6">
          <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">Network Activity</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Verdict Feed</h2>
          <p className="text-white/50">Simulated verdict examples from the ESG Oracle network.</p>
        </SectionReveal>

        {/* Scrolling ticker */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050e07] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050e07] to-transparent z-10 pointer-events-none" />
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
            className="flex gap-4 w-max"
          >
            {[...VERDICT_FEED, ...VERDICT_FEED].map((v, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 rounded-xl border border-[#1e2d22] bg-[#070f09] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white truncate pr-2">{v.company}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: riskColor[v.risk], backgroundColor: `${riskColor[v.risk]}15` }}
                  >
                    {v.risk}
                  </span>
                </div>
                <p className="text-xs text-white/40 mb-3">{v.category}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: verdictColor[v.verdict] ?? '#6b7280' }}
                  >
                    {v.verdict.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-white/30 font-mono">{v.confidence}%</span>
                </div>
                <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${v.confidence}%`,
                      backgroundColor: verdictColor[v.verdict] ?? '#6b7280',
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── RISK SPECTRUM ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#1e2d22] bg-[#060e08]">
        <div className="max-w-5xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">Risk Engine</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Greenwashing Risk Spectrum</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Every verdict includes a greenwashing risk score — from evidence-backed confidence to critical flags.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {RISK_LEVELS.map((r, i) => (
              <SectionReveal key={r.label} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-xl border p-5 text-center transition-all"
                  style={{ borderColor: `${r.color}30`, backgroundColor: `${r.color}08` }}
                >
                  <div
                    className="mx-auto mb-3 h-1.5 w-12 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  <p className="text-xs font-black font-mono mb-2" style={{ color: r.color }}>{r.label}</p>
                  <p className="text-[11px] text-white/40 leading-snug">{r.desc}</p>
                </motion.div>
              </SectionReveal>
            ))}
          </div>

          {/* gradient bar */}
          <SectionReveal className="mt-6">
            <div className="h-2 rounded-full" style={{
              background: 'linear-gradient(to right, #22c55e, #84cc16, #eab308, #f97316, #ef4444)'
            }} />
            <div className="flex justify-between mt-1.5 px-1">
              <span className="text-[10px] text-white/30">Safe</span>
              <span className="text-[10px] text-white/30">Critical</span>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────────── */}
      <section className="px-6 py-20 border-t border-[#1e2d22]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <p className="text-xs font-mono text-primary tracking-widest uppercase mb-3">Infrastructure</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Built for Trust</h2>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, color: '#22c55e', title: 'AI Consensus', desc: 'Multiple validator nodes evaluate each claim independently. GenLayer\'s non-comparative equivalence ensures robust consensus without requiring identical outputs.' },
              { icon: AlertTriangle, color: '#f97316', title: 'Greenwashing Detection', desc: 'Five-tier risk scoring from MINIMAL to CRITICAL. Automatic flags for vague language, missing baselines, and unverifiable targets.' },
              { icon: Globe, color: '#22c55e', title: 'Live Evidence Fetching', desc: 'Validators retrieve and read public evidence URLs in real-time — annual reports, audit certificates, regulatory filings.' },
              { icon: Lock, color: '#eab308', title: 'Immutable Audit Trail', desc: 'Every action — submission, evidence, verdict, dispute — is permanently logged on-chain with actor address and timestamp.' },
              { icon: GitMerge, color: '#22c55e', title: 'Multi-Round Consensus', desc: 'Dispute a verdict? Trigger a retry with additional evidence. Each round adds a new on-chain verdict record.' },
              { icon: Activity, color: '#a78bfa', title: 'SDG Alignment Mapping', desc: 'AI maps each verified claim to UN Sustainable Development Goals, creating a machine-readable sustainability ledger.' },
              { icon: Shield, color: '#22c55e', title: 'No Central Authority', desc: 'No single entity controls the verdict. Consensus is mathematical, not political. Anyone can audit the full chain of evidence.' },
              { icon: CheckCircle, color: '#4ade80', title: 'Regulatory-Grade Output', desc: 'Verdicts include methodology soundness, transparency scores, additionality, materiality — structured for compliance workflows.' },
              { icon: Zap, color: '#22c55e', title: 'Instant Verification', desc: 'Connect wallet, submit claim, add evidence, request consensus. From submission to verdict in a single session.' },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <SectionReveal key={f.title} delay={(i % 3) * 0.08}>
                  <motion.div
                    whileHover={{ borderColor: `${f.color}40` }}
                    className="rounded-xl border border-[#1e2d22] bg-[#070f09] p-6 h-full transition-colors"
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg mb-4"
                      style={{ backgroundColor: `${f.color}12`, border: `1px solid ${f.color}25` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: f.color }} />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── IMAGE + QUOTE BREAK ──────────────────────────────────────────── */}
      <section className="relative h-72 md:h-96 overflow-hidden border-t border-[#1e2d22]">
        <Image
          src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1920&q=70"
          alt="Wind turbines"
          fill
          className="object-cover opacity-35"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050e07] via-transparent to-[#050e07]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050e07]/60 via-transparent to-[#050e07]/60" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <SectionReveal>
            <blockquote className="text-center max-w-3xl">
              <p className="text-2xl md:text-3xl font-light text-white/80 italic leading-relaxed">
                &ldquo;Sustainability without accountability is just marketing.
                <span className="text-primary not-italic font-semibold"> ESG Oracle makes accountability programmable.</span>&rdquo;
              </p>
            </blockquote>
          </SectionReveal>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="px-6 py-28 relative overflow-hidden border-t border-[#1e2d22]">
        {/* glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <SectionReveal>
            <Shield className="h-14 w-14 text-primary mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Ready to hold companies
              <span className="block text-primary">accountable?</span>
            </h2>
            <p className="text-white/50 text-lg mb-10 leading-relaxed">
              Submit an ESG claim, attach evidence, and let decentralised AI validators
              do what regulators can&apos;t — deliver fast, unbiased, immutable verdicts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/claims/new">
                <Button size="lg" className="px-12 py-6 text-base font-semibold shadow-xl shadow-primary/20">
                  Start Verifying
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="px-10 py-6 text-base border-white/15 text-white/70 hover:bg-white/5">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

    </div>
  )
}

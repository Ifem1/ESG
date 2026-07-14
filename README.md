# ESG Oracle Protocol

**Decentralized ESG claim verification powered by GenLayer Intelligent Contracts.**

ESG Oracle is a full-stack Web3 application that lets anyone submit Environmental, Social, and Governance (ESG) sustainability claims and have them independently verified by a decentralized AI consensus network. The contract runs on GenLayer StudioNet — a blockchain where smart contracts can call LLMs and fetch live web content as part of execution.

---

## What It Does

| Step | Action |
|------|--------|
| 1 | User submits an ESG claim (company, claim text, evidence URLs) |
| 2 | Evidence is stored on-chain alongside the case |
| 3 | User triggers AI consensus review |
| 4 | GenLayer validators independently evaluate the claim using LLMs + live web fetches |
| 5 | A structured verdict is written on-chain: SUPPORTED / PARTIALLY_SUPPORTED / CONTRADICTED / INSUFFICIENT_EVIDENCE / UNVERIFIABLE |
| 6 | Greenwashing risk score, confidence, compliance assessment, and reasoning are displayed |

---

## Tech Stack

### Smart Contract
- **Language:** Python (GenLayer Intelligent Contract)
- **Runtime:** GenLayer GenVM v0.2.18
- **Consensus:** `gl.eq_principle.prompt_non_comparative` — validators check the leader's verdict against structural criteria instead of independently re-running the LLM (prevents UNDETERMINED on subjective ESG tasks)
- **Non-determinism:** `gl.nondet.exec_prompt` (LLM calls) + `gl.nondet.get_webpage` (live evidence fetching)
- **Storage:** `TreeMap[str, str]` with JSON-encoded values; all keys coerced to `str` to prevent int/string mismatch errors
- **Contract address (StudioNet):** `0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36`

### Frontend
- **Framework:** Next.js 14 (App Router, `'use client'`)
- **Wallet:** Injected wallet only (MetaMask, Rabby, Brave Wallet) via `wagmi` + `injected()` connector — no WalletConnect, no generated private keys
- **GenLayer JS SDK:** `genlayer-js` v1.1.8 — `createClient` with `provider` + `account` for writes, read-only client for views
- **Styling:** Tailwind CSS + custom dark ESG theme
- **Animation:** Framer Motion (scroll reveals, stagger, ticker)
- **UI Components:** shadcn/ui

### Transaction Lifecycle
The frontend polls GenLayer's `getTransaction` every 2.5s and tracks the full consensus pipeline:

```
PENDING → PROPOSING → COMMITTING → REVEALING → ACCEPTED → FINALIZED
```

Only `ACCEPTED` / `FINALIZED` + `SUCCESS` result = true success. `FINISHED_WITH_ERROR` triggers `debugTraceTransaction` and surfaces `stderr` / `genvm_log` in the dev console.

---

## Project Structure

```
├── contract/
│   └── esg_oracle.py          # GenLayer Intelligent Contract (Python)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Stats overview
│   │   ├── claims/            # Claims ledger + detail + evidence
│   │   ├── consensus/         # Consensus history
│   │   ├── greenwashing/      # Risk terminal
│   │   └── explorer/          # Transaction explorer
│   ├── components/
│   │   ├── claims/            # ClaimCard, ClaimForm, ClaimDetail
│   │   ├── evidence/          # EvidenceForm, EvidenceRegistry
│   │   ├── verdict/           # VerdictPanel, ConsensusHistory
│   │   ├── landing/           # HeroCanvas, AnimatedCounter, SectionReveal
│   │   ├── layout/            # Navbar, Sidebar, Footer
│   │   └── shared/            # TransactionStatus (full pipeline UI)
│   ├── hooks/
│   │   ├── useGenLayerTx.ts   # GenLayer tx polling hook (PENDING→SUCCESS)
│   │   ├── useContract.ts     # Write hooks (createCase, addEvidence, requestConsensus)
│   │   ├── useClaim.ts        # Read hooks
│   │   └── useConsensus.ts    # Verdict read hooks
│   └── lib/
│       ├── genlayer/          # client.ts (read/write clients), contract.ts (view helpers)
│       ├── wallet/            # wagmi config (injected only)
│       └── constants/         # Contract address, chain ID, RPC URL
```

---

## Contract Architecture

```python
class ESGOracle(gl.Contract):
    # State
    owner: str
    paused: bool
    case_counter: u256
    cases: TreeMap[str, str]          # JSON-encoded ESGCase
    evidence_items: TreeMap[str, str] # JSON-encoded Evidence
    verdicts: TreeMap[str, str]       # JSON-encoded Verdict
    # ... index TreeMaps for owner, category, tag, status lookups

    # Key write methods
    def create_case(self, title, company, ...) -> str
    def add_evidence(self, case_id, title, url, ...) -> str
    def request_consensus_review(self, case_id) -> str  # triggers AI
    def retry_consensus_review(self, case_id) -> str

    # Key view methods
    def get_case(self, case_id) -> str         # JSON
    def get_all_cases(self) -> str             # JSON array
    def get_evidence(self, case_id) -> str     # JSON array
    def get_latest_verdict(self, case_id) -> str
    def get_case_count(self) -> str
```

The consensus method is intentionally compact — prompts are kept under 800 tokens, all storage reads happen before the nondet block, and every LLM/web call is wrapped in `try/except` with a deterministic `INSUFFICIENT_EVIDENCE` fallback to prevent unhandled GenVM errors.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MetaMask (or any EIP-1193 injected wallet)
- GenLayer StudioNet account with testnet GEN tokens

### Install & Run

```bash
git clone https://github.com/Ifem1/ESG.git
cd ESG
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_EXPLORER_URL=https://studio.genlayer.com
NEXT_PUBLIC_CHAIN_ID=61999
```

```bash
npm run dev
# → http://localhost:3000
```

### Connect Wallet
- Add GenLayer StudioNet to MetaMask: Chain ID `61999`, RPC `https://studio.genlayer.com/api`
- Get testnet tokens from the GenLayer faucet
- Click **Connect Wallet** in the top-right

### Deploy Contract
Open `contract/esg_oracle.py` in [GenLayer Studio](https://studio.genlayer.com), deploy, and update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

### Reproducible SDK smoke check

From a fresh checkout, install the lockfile-pinned dependencies and run:

```bash
npm ci
npm run smoke:contract
```

The check uses `genlayer-js` **exactly at v1.1.8**, reads the submitted contract schema, verifies the `create_case`, `add_evidence`, and `request_consensus_review` write methods plus the case/evidence/verdict read methods, and calls the read methods against the active contract. It requires no private key.

To exercise the write methods as well, provide an EIP-1193 provider and account through a local, untracked module:

```bash
GENLAYER_PROVIDER_MODULE=./private/provider.mjs npm run smoke:contract -- --writes
```

The provider module must export `{ provider, account }`; never commit that file or a private key.

---

## How the AI Verdict Works

When `request_consensus_review` is called:

1. **Leader validator** runs `gl.nondet.exec_prompt` with a compact prompt containing the ESG claim, company, and evidence URLs (capped at 3 items, ~800 tokens total)
2. Returns a canonical 9-field JSON: `{verdict, confidence, risk, compliance, data_quality, supporting[], contradicting[], gaps, reason}`
3. **Other validators** check the leader's output against structural criteria (valid enum values, confidence range, non-empty reason) — they do NOT re-run the LLM
4. If consensus is reached → verdict stored on-chain, case status → `verdict_issued`
5. If validators timeout → retry with `retry_consensus_review`

Verdict fields stored on-chain:
- `verification_verdict` — SUPPORTED / PARTIALLY_SUPPORTED / INSUFFICIENT_EVIDENCE / CONTRADICTED / UNVERIFIABLE
- `confidence_score` — 0–100
- `greenwashing_risk` — CRITICAL / HIGH / MEDIUM / LOW / MINIMAL
- `compliance_assessment`, `data_quality`, `impact_scale`
- `key_supporting_evidence[]`, `key_contradicting_evidence[]`
- `reasoning_summary`, `evidence_gaps`, `recommended_next_action`

---

## Known Behaviour on StudioNet

- **Validators Timeout** — Studionet validators are shared free infrastructure and occasionally time out. Click **Request Review** again to retry.
- **ACCEPTED vs FINALIZED** — Studionet often settles at `ACCEPTED` without progressing to `FINALIZED`. The frontend treats both as success.
- **Transaction queue** — GenLayer queues transactions per account. Wait for one tx to finalize before submitting another.

---

## License

MIT

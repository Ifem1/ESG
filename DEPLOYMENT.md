# ESG Oracle Protocol — Deployment Guide

## Overview

- **Frontend**: Next.js 14 → Vercel
- **Contract**: Python (GenLayer Intelligent Contract) → StudioNet
- **Wallet**: RainbowKit + wagmi v2 (MetaMask, Rainbow, Zerion, WalletConnect)

---

## Phase 1: Deploy the GenLayer Intelligent Contract

### 1. Open GenLayer Studio

Go to [https://studio.genlayer.com](https://studio.genlayer.com)

### 2. Upload the Contract

- Click **New Contract**
- Upload or paste the contents of `contract/esg_oracle.py`

### 3. Deploy to StudioNet

- Select **StudioNet** as the network
- Click **Deploy**
- Confirm the transaction in your wallet (requires GEN tokens)
- Copy the deployed **contract address** (format: `0x...`)

### 4. Verify Deployment

- Open the contract in the GenLayer Studio explorer
- Call `get_case_count()` — should return `0`
- Confirm state is accessible

---

## Phase 2: Configure Frontend Environment

### 1. Create `.env.local`

```bash
cp .env.local.example .env.local
```

### 2. Update `.env.local`

```env
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_EXPLORER_URL=https://studio.genlayer.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_from_cloud.walletconnect.com
NEXT_PUBLIC_CHAIN_ID=61999
```

### 3. Get WalletConnect Project ID

- Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
- Create a project
- Copy the Project ID

---

## Phase 3: Deploy Frontend to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted, set all environment variables from `.env.local`.

### Option B: Vercel Dashboard

1. Push code to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables under **Settings → Environment Variables**:
   - `NEXT_PUBLIC_GENLAYER_RPC_URL`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_EXPLORER_URL`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_CHAIN_ID`
5. Deploy

---

## Phase 4: Post-Deployment Verification

### Frontend Checks

- [ ] Landing page loads
- [ ] Wallet connects (MetaMask / Rainbow)
- [ ] Dashboard shows 0 claims
- [ ] Claims Ledger is empty with correct empty state
- [ ] Greenwashing Terminal shows empty state
- [ ] Settings page shows correct contract address
- [ ] Explorer page links correctly

### Contract Interaction Checks

- [ ] Submit an ESG claim → transaction pending → confirmed
- [ ] Add evidence URL → transaction confirmed
- [ ] Request consensus review → transaction confirmed → await verdict
- [ ] Verdict appears on claim detail page
- [ ] Consensus history shows verdict

---

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Contract: Key Methods

| Method | Type | Description |
|--------|------|-------------|
| `create_case(...)` | Write | Submit a new ESG verification case |
| `add_evidence(case_id, ...)` | Write | Add public evidence URL to a case |
| `request_consensus_review(case_id)` | Write | Trigger AI consensus evaluation |
| `get_case(case_id)` | Read | Fetch a single case |
| `get_all_cases()` | Read | Fetch all cases |
| `get_cases_by_owner(wallet)` | Read | Fetch cases by owner wallet |
| `get_evidence(case_id)` | Read | Fetch evidence for a case |
| `get_latest_verdict(case_id)` | Read | Fetch latest consensus verdict |
| `get_verdict_history(case_id)` | Read | Fetch all verdicts for a case |
| `get_case_count()` | Read | Total number of cases |

---

## Architecture

```
Frontend (Next.js / Vercel)
    ↓ wallet connection (RainbowKit + wagmi)
    ↓ read: JSON-RPC → sim_getContractState
    ↓ write: signed tx via wallet
GenLayer StudioNet
    ↓ non-deterministic execution
    ↓ AI consensus (multiple validators)
ESG Oracle Contract (Python)
    ↓ LLM evaluation prompt
    ↓ canonical verdict stored on-chain
```

---

## Support

- GenLayer Docs: [https://docs.genlayer.com](https://docs.genlayer.com)
- GenLayer Studio: [https://studio.genlayer.com](https://studio.genlayer.com)
- WalletConnect: [https://cloud.walletconnect.com](https://cloud.walletconnect.com)

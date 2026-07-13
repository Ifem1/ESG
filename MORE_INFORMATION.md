# More Information Requested

This document responds to the review request:

> Update the active consensus path to fetch and verify the submitted source content, make validators check the ESG conclusion against that evidence, and make case creation wait for finalization and use the confirmed case ID before adding evidence.

## Resolution summary

All requested changes have been implemented.

### Evidence retrieval and verification

- The active consensus path fetches each submitted public source before evaluating the ESG claim.
- Web access uses the current GenLayer API: `gl.nondet.web.render(url, mode="text")`.
- Retrieved content is bounded before being included in the evaluation prompt.
- Source content is explicitly treated as untrusted evidence, preventing instructions inside a webpage from overriding the assessment task.
- If a source cannot be fetched or read, the validators may only accept `INSUFFICIENT_EVIDENCE` or `UNVERIFIABLE`.

### Validator evidence checks

- Validators must check that the verdict, confidence, risk, supporting evidence, contradicting evidence, gaps, and reasoning are justified by the fetched source content.
- Validators reject conclusions that invent, misstate, or contradict the retrieved evidence.
- The live World Bank test produced `SUPPORTED` with 98% confidence and `HIGH` data quality after validators read the submitted source.

### Case and evidence transaction ordering

- The frontend waits for the case transaction to reach `FINALIZED` before continuing.
- It resolves the new case from confirmed on-chain owner data rather than predicting an ID from the global case counter.
- Evidence is submitted using that confirmed case ID.
- Each evidence transaction finalizes before the next dependent transaction is submitted.

### Web-access safeguards

- Evidence URLs must use HTTPS.
- Localhost, loopback, link-local, private-network, and credential-bearing URLs are rejected.
- Duplicate URLs and duplicate content hashes are rejected per case.
- Fetch count and source-content length are bounded to reduce validator timeouts.

## Network and contract addresses

| Item | Value |
|---|---|
| Network | GenLayer StudioNet |
| Chain ID | `61999` |
| Active contract | `0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36` |
| Superseded contract | `0x5fb01C394d28134dB653851d4264f3DCB9CE1A87` |
| RPC endpoint | `https://studio.genlayer.com/api` |
| Studio | `https://studio.genlayer.com` |
| Contract explorer | `https://explorer-studio.genlayer.com/address/0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36` |
| GitHub repository | `https://github.com/Ifem1/ESG` |

The frontend `.env.local` is configured to read from the active contract address. Local environment files and wallet secrets remain excluded from Git.

## Live verification record

The corrected contract was upgraded at the active address and exercised on StudioNet using public evidence.

### Conclusive real-data case

- Case ID: `2`
- Claim: The World Bank publishes a renewable electricity output indicator for Nigeria measured as a percentage of total electricity output.
- Evidence: `https://data.worldbank.org/indicator/EG.ELC.RNEW.ZS?locations=NG`
- Final consensus round: `2`
- Verdict: `SUPPORTED`
- Confidence: `98`
- Data quality: `HIGH`
- Greenwashing risk: `MINIMAL`
- Compliance assessment: `COMPLIANT`
- Supporting source fact: the page reported Nigeria's 2021 renewable electricity output value as `22.23%`.
- Evidence transaction: `0xb9d69c8aaf43e4732f82d58bc5de87690a79298d7a7eeb3ec9eecf5ab152a5df`
- Initial consensus transaction: `0xcd1ce81c84c19363f6b405edc30cd0f453b38d25ec3bc11c7e102bcf70590866`
- Corrected consensus retry: `0x67bc6fa1b9df2286e2341ac743f12444ad3dd2472aabd0658341a65a3f0df6ad`

### Expected failure handling

An Apple newsroom source blocked validator retrieval. The contract correctly returned `INSUFFICIENT_EVIDENCE` rather than fabricating a supported conclusion. This confirms that inaccessible sources fail safely.

## Files updated

- `contract/esg_oracle.py`
- `src/components/claims/ClaimForm.tsx`
- `src/lib/genlayer/client.ts`
- `src/lib/validation/evidence.schema.ts`
- `MORE_INFORMATION.md`

No private key was created, stored, or committed. Wallet signing remains delegated to the user's injected wallet.

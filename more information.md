# ESG Oracle — More Information for Review

This document records the deployed addresses and reproducible integration evidence for the submitted project.

## Network and deployment

| Item | Value |
|---|---|
| Network | GenLayer StudioNet |
| Chain ID | `61999` |
| RPC endpoint | `https://studio.genlayer.com/api` |
| Explorer | `https://studio.genlayer.com` |
| Active submitted contract | `0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36` |
| Superseded contract (do not use) | `0x5fb01C394d28134dB653851d4264f3DCB9CE1A87` |

The README, `.env.local.example`, and frontend fallback configuration all point to the active submitted contract.

## SDK and verification

The repository pins `genlayer-js` to exactly `1.1.8`. From a fresh checkout, run:

```bash
npm ci
npm run smoke:contract
```

The read-only smoke check retrieves the deployed schema, verifies the create/evidence/review write methods, and calls the case, evidence, and verdict read methods.

The complete write-flow check was run successfully with a funded disposable test account. It finalized:

1. `create_case`
2. `add_evidence`
3. `request_consensus_review`
4. Read-back of the confirmed case, evidence, and verdict data

Successful run: case ID `3`, using SDK `1.1.8`.

The test account address was `0x6B476BF35C4968F3f1775c0CA2110591b4B5FCBe`. Its private key is intentionally not stored in this repository. Because the key was used for testing, it should be rotated or retired after review.

To repeat the write check, set `GENLAYER_PRIVATE_KEY` only in the local shell and run:

```bash
GENLAYER_PRIVATE_KEY=0xYOUR_TEST_KEY npm run smoke:contract -- --writes
```

Never commit that key or a provider module containing it.

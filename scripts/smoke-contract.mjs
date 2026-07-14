import { createAccount, createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'

const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36'
const endpoint = process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api'
const client = createClient({ chain: studionet, endpoint })
const requiredWrites = ['create_case', 'add_evidence', 'request_consensus_review']
const requiredReads = ['get_case_count', 'get_case', 'get_evidence', 'get_latest_verdict', 'get_verdict_history']

const schema = await client.getContractSchema(address)
const methods = new Set(Object.keys(schema?.methods || {}))
for (const method of [...requiredWrites, ...requiredReads]) {
  if (!methods.has(method)) throw new Error(`Contract schema is missing ${method}`)
}

const read = async (functionName, args = []) => client.readContract({ address, functionName, args })
const count = await read('get_case_count')
await read('get_all_cases')
await read('get_evidence', [String(Math.max(0, Number(count) - 1))])
await read('get_latest_verdict', [String(Math.max(0, Number(count) - 1))])
await read('get_verdict_history', [String(Math.max(0, Number(count) - 1))])

if (!process.argv.includes('--writes')) {
  console.log(`PASS: ${address} exposes create/evidence/review writes and case/evidence/verdict reads (SDK 1.1.8).`)
  process.exit(0)
}

const modulePath = process.env.GENLAYER_PROVIDER_MODULE
let provider
let account
if (modulePath) {
  ({ provider, account } = await import(modulePath))
  if (!provider || !account) throw new Error('Provider module must export provider and account.')
} else if (process.env.GENLAYER_PRIVATE_KEY) {
  account = createAccount(process.env.GENLAYER_PRIVATE_KEY)
} else {
  throw new Error('Set GENLAYER_PRIVATE_KEY or GENLAYER_PROVIDER_MODULE for write mode.')
}
const writer = createClient({ chain: studionet, endpoint, ...(provider ? { provider } : {}), account })
const tx = async (functionName, args) => {
  const hash = await writer.writeContract({ address, functionName, args, value: BigInt(0) })
  return writer.waitForTransactionReceipt({ hash, status: 'FINALIZED', interval: 2500, retries: 240 })
}
const marker = `SDK smoke ${Date.now()}`
await tx('create_case', [marker, 'Smoke Test Company', 'environmental', 'technology', 'Global', 'Smoke-test claim', 'https://example.org', '2026', 'Test impact', 'Test action', 'Verify smoke path', 'Smoke evidence'])
const createdCount = Number(await read('get_case_count'))
const caseId = String(Math.max(0, createdCount - 1))
await tx('add_evidence', [caseId, 'Example source', 'other', 'https://example.org', 'smoke-test-hash', 'Example.org', 'Public test source', 'Smoke-test relevance', 'supporting'])
await tx('request_consensus_review', [caseId])
await read('get_case', [caseId])
await read('get_evidence', [caseId])
await read('get_latest_verdict', [caseId])
console.log(`PASS: finalized create_case, add_evidence, request_consensus_review and read-back for case ${caseId} (SDK 1.1.8).`)

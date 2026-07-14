export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`) ||
  '0x4F7ab175196A9C3B3EA475B492f76B8312Ba6e36'

export const GENLAYER_RPC_URL =
  process.env.NEXT_PUBLIC_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api'

export const EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://studio.genlayer.com'

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || '61999')

// Minimal ABI for wagmi interactions — GenLayer contracts expose JSON-RPC
export const ESG_ORACLE_ABI = [
  {
    name: 'create_case',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'title', type: 'string' },
      { name: 'company', type: 'string' },
      { name: 'claim_category', type: 'string' },
      { name: 'industry', type: 'string' },
      { name: 'location', type: 'string' },
      { name: 'esg_claim', type: 'string' },
      { name: 'claim_source', type: 'string' },
      { name: 'reporting_period', type: 'string' },
      { name: 'claimed_impact', type: 'string' },
      { name: 'claimed_action', type: 'string' },
      { name: 'assessment_objective', type: 'string' },
      { name: 'evidence_summary', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'add_evidence',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'case_id', type: 'uint256' },
      { name: 'title', type: 'string' },
      { name: 'ev_type', type: 'string' },
      { name: 'url', type: 'string' },
      { name: 'url_hash', type: 'string' },
      { name: 'source_name', type: 'string' },
      { name: 'credibility_note', type: 'string' },
      { name: 'relevance', type: 'string' },
      { name: 'category', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'request_consensus_review',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'case_id', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'get_case',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'case_id', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'get_all_cases',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'get_cases_by_owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'wallet', type: 'address' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'get_evidence',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'case_id', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'get_latest_verdict',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'case_id', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'get_verdict_history',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'case_id', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'get_case_count',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

/**
 * GenLayer client — genlayer-js v1.1.8
 *
 * Read  → readClient.readContract()   (no wallet, view-only)
 * Write → writeClient(provider, account).writeContract(...)
 *
 * The write client requires BOTH:
 *   provider — EIP-1193 injected wallet (window.ethereum) for transaction signing
 *   account  — the connected wallet address, so GenLayer knows the msg.sender
 *
 * Never generate a private key. Never store anything in localStorage.
 * The injected wallet is the sole signer.
 */
import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'
import { CONTRACT_ADDRESS, GENLAYER_RPC_URL } from '@/lib/constants/contract'
import type { Address } from 'viem'

// ---------------------------------------------------------------------------
// Read-only singleton — no account needed for view calls
// ---------------------------------------------------------------------------

let _readClient: ReturnType<typeof createClient> | null = null

function getReadClient() {
  if (!_readClient) {
    _readClient = createClient({
      chain: studionet,
      endpoint: GENLAYER_RPC_URL,
    })
  }
  return _readClient
}

// ---------------------------------------------------------------------------
// Write client factory — created fresh per call (account can change)
// ---------------------------------------------------------------------------

/**
 * Build a genlayer-js write client wired to the injected wallet.
 *
 * @param provider  EIP-1193 provider (window.ethereum)
 * @param account   Connected wallet address — becomes msg.sender on-chain
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWriteClient(provider: any, account: Address) {
  return createClient({
    chain: studionet,
    endpoint: GENLAYER_RPC_URL,
    provider,
    account,
  })
}

// ---------------------------------------------------------------------------
// Read helper
// ---------------------------------------------------------------------------

export async function contractRead<T = unknown>(
  method: string,
  args: unknown[] = []
): Promise<T> {
  const client = getReadClient()

  const raw = await client.readContract({
    address: CONTRACT_ADDRESS as Address,
    functionName: method,
    args: args as Parameters<typeof client.readContract>[0]['args'],
  })

  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as unknown as T
    }
  }

  return raw as T
}

// ---------------------------------------------------------------------------
// Write helper
// ---------------------------------------------------------------------------

/**
 * Call a @gl.public.write method using the connected injected wallet.
 *
 * @param method    Contract method name
 * @param args      Positional arguments
 * @param provider  window.ethereum (EIP-1193)
 * @param account   Connected wallet address (msg.sender)
 * @returns         Transaction hash
 */
export async function contractWrite(
  method: string,
  args: unknown[],
  provider: unknown,
  account: string
): Promise<`0x${string}`> {
  if (!account) throw new Error('No wallet connected. Connect your wallet to continue.')

  const client = getWriteClient(provider, account as Address)

  const hash = await client.writeContract({
    address: CONTRACT_ADDRESS as Address,
    functionName: method,
    args: args as Parameters<typeof client.writeContract>[0]['args'],
    value: BigInt(0),
  })

  return hash as `0x${string}`
}

export async function waitForFinalizedTransaction(hash: `0x${string}`): Promise<void> {
  // SDK brands transaction hashes/status enums more narrowly than writeContract's public return type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = getReadClient() as any
  const tx = await client.waitForTransactionReceipt({
    hash,
    status: 'FINALIZED',
    interval: 2500,
    retries: 240,
  })
  if (tx.statusName !== 'FINALIZED') {
    throw new Error(`Transaction did not finalize (status: ${tx.statusName ?? 'unknown'}).`)
  }
  if (tx.txExecutionResultName === 'FINISHED_WITH_ERROR' || tx.resultName === 'FAILURE') {
    throw new Error('The finalized transaction failed during contract execution.')
  }
}

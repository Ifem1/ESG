'use client'

import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'
import { CHAIN_ID, GENLAYER_RPC_URL, EXPLORER_URL } from '@/lib/constants/contract'

export const genlayerStudionet = defineChain({
  id: CHAIN_ID,
  name: 'GenLayer StudioNet',
  nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
  rpcUrls: {
    default: { http: [GENLAYER_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'GenLayer Explorer', url: EXPLORER_URL },
  },
  testnet: true,
})

// Injected-only config — uses window.ethereum (MetaMask, Rabby, Brave Wallet, etc.)
// No WalletConnect project ID required.
export const wagmiConfig = createConfig({
  chains: [genlayerStudionet],
  connectors: [injected()],
  transports: {
    [CHAIN_ID]: http(GENLAYER_RPC_URL),
  },
  ssr: true,
})

const EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://studio.genlayer.com'

export function getTxExplorerUrl(txHash: string): string {
  return `${EXPLORER_URL}/tx/${txHash}`
}

export function getAddressExplorerUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}`
}

export function getContractExplorerUrl(): string {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''
  return `${EXPLORER_URL}/address/${address}`
}

export function truncateHash(hash: string, chars = 8): string {
  if (!hash) return ''
  if (hash.length <= chars * 2 + 2) return hash
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

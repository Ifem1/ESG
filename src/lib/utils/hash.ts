/**
 * Compute SHA-256 hash of a string using the Web Crypto API.
 * Returns the hex-encoded digest.
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Compute hash of a URL, prefixed with "0x" for on-chain storage.
 */
export async function hashUrl(url: string): Promise<string> {
  const hash = await sha256(url.trim().toLowerCase())
  return `0x${hash}`
}

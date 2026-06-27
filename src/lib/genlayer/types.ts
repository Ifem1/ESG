// genlayer-js v1.1.8 handles the JSON-RPC transport layer internally.
// Only domain-level helper types are declared here.

export interface ContractCallParams {
  to: string
  data: string
  from?: string
}

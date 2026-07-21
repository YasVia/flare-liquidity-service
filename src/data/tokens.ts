export type FlareToken = {
  symbol: string
  name: string
  address: string
  decimals: number
}

export const FLARE_TOKENS: FlareToken[] = [
  {
    symbol: 'WFLR',
    name: 'Wrapped Flare',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
]

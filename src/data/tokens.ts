export type FlareToken = {
  symbol: string
  name: string
  address: `0x${string}`
  decimals: number
}

export const FLARE_TOKENS: FlareToken[] = [
  {
    symbol: 'WFLR',
    name: 'Wrapped Flare',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 6,
  },
]

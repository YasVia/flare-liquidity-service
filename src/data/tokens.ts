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
    address: '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6',
    decimals: 6,
  },
]

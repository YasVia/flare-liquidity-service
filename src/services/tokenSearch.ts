import { FLARE_TOKENS } from '../data/tokens'

export function searchTokens(query: string) {
  const q = query.toLowerCase()

  return FLARE_TOKENS.filter((token) =>
    [
      token.symbol,
      token.name,
      token.address,
    ]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

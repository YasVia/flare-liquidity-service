export function sortTokens(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
) {
  if (tokenA.toLowerCase() < tokenB.toLowerCase()) {
    return {
      token0: tokenA,
      token1: tokenB,
    }
  }

  return {
    token0: tokenB,
    token1: tokenA,
  }
}

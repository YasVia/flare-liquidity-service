import { flareClient } from './flareClient'
import { poolStateAbi } from '../contracts/v3Abi'

export async function getPoolState(pool: `0x${string}`) {
  const [slot0, tickSpacing] = await Promise.all([
    flareClient.readContract({
      address: pool,
      abi: poolStateAbi,
      functionName: 'slot0',
    }),
    flareClient.readContract({
      address: pool,
      abi: poolStateAbi,
      functionName: 'tickSpacing',
    }),
  ])

  return {
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    tickSpacing,
  }
}

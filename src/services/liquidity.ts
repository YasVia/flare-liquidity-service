import { flareClient } from './flareClient'
import { FLARE_CONTRACTS } from '../contracts/flare'
import { factoryAbi } from '../contracts/v3Abi'

export async function getPoolAddress(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  fee: number,
) {
  const pool = await flareClient.readContract({
    address: FLARE_CONTRACTS.v3CoreFactoryAddress,
    abi: factoryAbi,
    functionName: 'getPool',
    args: [tokenA, tokenB, fee],
  })

  return pool
}

export async function ensurePool(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  fee: number,
) {
  const existingPool = await getPoolAddress(tokenA, tokenB, fee)

  if (existingPool !== '0x0000000000000000000000000000000000000000') {
    return {
      created: false,
      pool: existingPool,
    }
  }

  return {
    created: false,
    pool: null,
    message: 'Pool does not exist. Creation requires wallet transaction.',
  }
}

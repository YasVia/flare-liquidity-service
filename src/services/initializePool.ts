import { encodeFunctionData } from 'viem'
import { poolAbi } from '../contracts/v3Abi'

export function buildInitializePoolCalldata(
  pool: `0x${string}`,
  sqrtPriceX96: bigint,
) {
  return {
    to: pool,
    data: encodeFunctionData({
      abi: poolAbi,
      functionName: 'initialize',
      args: [sqrtPriceX96],
    }),
  }
}

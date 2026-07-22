import { FLARE_CONTRACTS } from '../config/contracts'
import { flareClient } from './flareClient'
import { quoterV2Abi } from '../contracts/v3Abi'

export async function quoteExactInputSingle(params: {
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  amountIn: bigint
  fee: number
}) {
  return flareClient.simulateContract({
    address: FLARE_CONTRACTS.quoterV2Address,
    abi: quoterV2Abi,
    functionName: 'quoteExactInputSingle',
    args: [
      {
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amountIn: params.amountIn,
        fee: params.fee,
        sqrtPriceLimitX96: 0n,
      },
    ],
  })
}

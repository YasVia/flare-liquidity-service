import { encodeFunctionData } from 'viem'
import { FLARE_CONTRACTS } from '../contracts/flare'
import { positionManagerAbi } from '../contracts/v3Abi'
import { sortTokens } from './tokenOrder'

export function buildMintPositionCalldata(params: {
  token0: `0x${string}`
  token1: `0x${string}`
  fee: number
  tickLower: number
  tickUpper: number
  amount0Desired: bigint
  amount1Desired: bigint
  amount0Min: bigint
  amount1Min: bigint
  recipient: `0x${string}`
  deadline: bigint
}) {
  const { token0, token1 } = sortTokens(
    params.token0,
    params.token1,
  )

  return {
    to: FLARE_CONTRACTS.nonfungibleTokenPositionManagerAddress,
    data: encodeFunctionData({
      abi: positionManagerAbi,
      functionName: 'mint',
      args: [
        {
          token0,
          token1,
          fee: params.fee,
          tickLower: params.tickLower,
          tickUpper: params.tickUpper,
          amount0Desired: params.amount0Desired,
          amount1Desired: params.amount1Desired,
          amount0Min: params.amount0Min,
          amount1Min: params.amount1Min,
          recipient: params.recipient,
          deadline: params.deadline,
        },
      ],
    }),
  }
}

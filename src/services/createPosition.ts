import { getPoolAddress } from './liquidity'
import { getPoolState } from './poolState'
import { getTickRange } from './tickMath'
import { buildPosition } from './positionBuilder'
import { buildMintPositionCalldata } from './mintPosition'
import { Token } from '@uniswap/sdk-core'

export async function createPosition(params: {
  token0: `0x${string}`
  token1: `0x${string}`
  token0Decimals: number
  token1Decimals: number
  token0Symbol: string
  token1Symbol: string
  fee: number
  amount0: bigint
  amount1: bigint
  recipient: `0x${string}`
  deadline: bigint
}) {
  const pool = await getPoolAddress(
    params.token0,
    params.token1,
    params.fee,
  )

  if (pool === '0x0000000000000000000000000000000000000000') {
    return {
      error: 'POOL_NOT_FOUND',
      message: 'Create and initialize pool first',
    }
  }

  const state = await getPoolState(pool)

  const range = getTickRange(
    state.tick,
    Number(state.tickSpacing),
  )

  const token0 = new Token(
    14,
    params.token0,
    params.token0Decimals,
    params.token0Symbol,
  )

  const token1 = new Token(
    14,
    params.token1,
    params.token1Decimals,
    params.token1Symbol,
  )

  const position = buildPosition({
    token0,
    token1,
    fee: params.fee,
    sqrtPriceX96: state.sqrtPriceX96,
    tickCurrent: state.tick,
    tickLower: range.tickLower,
    tickUpper: range.tickUpper,
    amount0: params.amount0,
    amount1: params.amount1,
  })

  const mint = buildMintPositionCalldata({
    token0: params.token0,
    token1: params.token1,
    fee: params.fee,
    tickLower: range.tickLower,
    tickUpper: range.tickUpper,
    amount0Desired: BigInt(position.amount0),
    amount1Desired: BigInt(position.amount1),
    amount0Min: 0n,
    amount1Min: 0n,
    recipient: params.recipient,
    deadline: params.deadline,
  })

  return {
    pool,
    ...range,
    ...position,
    mint,
  }
}

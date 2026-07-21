import { Token } from '@uniswap/sdk-core'
import { Pool, Position } from '@uniswap/v3-sdk'

export function buildPosition(params: {
  token0: Token
  token1: Token
  fee: number
  sqrtPriceX96: bigint
  tickCurrent: number
  tickLower: number
  tickUpper: number
  amount0: bigint
  amount1: bigint
}) {
  const pool = new Pool(
    params.token0,
    params.token1,
    params.fee,
    params.sqrtPriceX96.toString(),
    0,
    params.tickCurrent,
  )

  const position = Position.fromAmounts({
    pool,
    tickLower: params.tickLower,
    tickUpper: params.tickUpper,
    amount0: params.amount0.toString(),
    amount1: params.amount1.toString(),
    useFullPrecision: true,
  })

  return {
    liquidity: position.liquidity.toString(),
    amount0: position.amount0.quotient.toString(),
    amount1: position.amount1.quotient.toString(),
  }
}

import { Hono } from 'hono'
import { Token } from '@uniswap/sdk-core'
import { buildPosition } from '../services/positionBuilder'
import { getTickRange } from '../services/tickMath'

export const positionBuildRoutes = new Hono()

positionBuildRoutes.post('/', async (c) => {
  const body = await c.req.json()

  const token0 = new Token(
    14,
    body.token0,
    body.token0Decimals,
    body.token0Symbol,
  )

  const token1 = new Token(
    14,
    body.token1,
    body.token1Decimals,
    body.token1Symbol,
  )

  const range = getTickRange(
    Number(body.tickCurrent),
    Number(body.tickSpacing),
  )

  const result = buildPosition({
    token0,
    token1,
    fee: Number(body.fee),
    sqrtPriceX96: BigInt(body.sqrtPriceX96),
    tickCurrent: Number(body.tickCurrent),
    tickLower: range.tickLower,
    tickUpper: range.tickUpper,
    amount0: BigInt(body.amount0),
    amount1: BigInt(body.amount1),
  })

  return c.json({
    ...range,
    ...result,
  })
})

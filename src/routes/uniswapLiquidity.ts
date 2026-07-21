import { Hono } from 'hono'
import { createPosition } from '../services/createPosition'

export const uniswapLiquidityRoutes = new Hono()

uniswapLiquidityRoutes.post(
  '/uniswap.liquidity.v2.LiquidityService/CreatePosition',
  async (c) => {
    try {
      const body = await c.req.json()

      const result = await createPosition({
        ...body,
        fee: Number(body.fee),
        initialPrice: Number(body.initialPrice ?? 0),
        amount0: BigInt(body.amount0),
        amount1: BigInt(body.amount1),
        deadline: BigInt(body.deadline),
      })

      return c.json(result)
    } catch (error) {
      return c.json({
        error: 'CREATE_POSITION_FAILED',
        message: error instanceof Error ? error.message : 'unknown',
      }, 400)
    }
  },
)

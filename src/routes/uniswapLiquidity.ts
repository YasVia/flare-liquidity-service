import { Hono } from 'hono'
import { createPosition } from '../services/createPosition'

export const uniswapLiquidityRoutes = new Hono()

async function handleCreatePosition(c: any) {
  try {
    let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

    const result = await createPosition({
      ...body,
      fee: Number(body.fee ?? 0),
      initialPrice: Number(body.initialPrice ?? 0),
      amount0: BigInt(body.amount0 ?? 0),
      amount1: BigInt(body.amount1 ?? 0),
      deadline: BigInt(
        body.deadline ??
        Math.floor(Date.now() / 1000) + 3600
      ),
    })

    return c.json(result)
  } catch (error) {
    return c.json({
      error: 'CREATE_POSITION_FAILED',
      message:
        error instanceof Error
          ? error.message
          : 'unknown',
    }, 400)
  }
}

uniswapLiquidityRoutes.post(
  '/uniswap.liquidity.v2.LiquidityService/CreatePosition',
  handleCreatePosition,
)

uniswapLiquidityRoutes.post(
  '/CreatePosition',
  handleCreatePosition,
)

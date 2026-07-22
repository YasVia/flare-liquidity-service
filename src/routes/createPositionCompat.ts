import { Hono } from 'hono'
import { createPosition } from '../services/createPosition'

export const createPositionCompatRoutes = new Hono()

createPositionCompatRoutes.post('/CreatePosition', async (c) => {
  const body = await c.req.json()

  try {
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
      error: 'POSITION_BUILD_FAILED',
      message:
        error instanceof Error
          ? error.message
          : 'unknown',
    }, 400)
  }
})

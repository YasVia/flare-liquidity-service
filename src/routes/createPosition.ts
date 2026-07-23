import { Hono } from 'hono'
import { createPosition } from '../services/createPosition'

export const createPositionRoutes = new Hono()

createPositionRoutes.post('/', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  try {
    const result = await createPosition({
      ...body,
      fee: Number(body.fee),
      initialPrice: Number(body.initialPrice),
      amount0: BigInt(body.amount0),
      amount1: BigInt(body.amount1),
      deadline: BigInt(body.deadline),
    })

    return c.json(result)
  } catch (error) {
    return c.json({
      error: 'POSITION_BUILD_FAILED',
      message: error instanceof Error ? error.message : 'unknown error',
    }, 400)
  }
})

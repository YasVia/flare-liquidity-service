import { Hono } from 'hono'
import { createPosition } from '../services/createPosition'

export const createPositionRoutes = new Hono()

createPositionRoutes.post('/', async (c) => {
  const body = await c.req.json()

  const result = await createPosition({
    ...body,
    fee: Number(body.fee),
    amount0: BigInt(body.amount0),
    amount1: BigInt(body.amount1),
    deadline: BigInt(body.deadline),
  })

  return c.json(result)
})

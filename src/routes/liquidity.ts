import { Hono } from 'hono'
import { ensurePool } from '../services/liquidity'

export const liquidityRoutes = new Hono()

liquidityRoutes.post('/check-pool', async (c) => {
  const body = await c.req.json()

  const result = await ensurePool(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json(result)
})

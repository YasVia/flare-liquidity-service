import { Hono } from 'hono'
import { ensurePool } from '../services/liquidity'

export const liquidityRoutes = new Hono()

liquidityRoutes.post('/check-pool', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const result = await ensurePool(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json(result)
})

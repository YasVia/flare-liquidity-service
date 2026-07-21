import { Hono } from 'hono'
import { buildInitializePoolCalldata } from '../services/initializePool'

export const initializePoolRoutes = new Hono()

initializePoolRoutes.post('/', async (c) => {
  const body = await c.req.json()

  const tx = buildInitializePoolCalldata(
    body.pool,
    BigInt(body.sqrtPriceX96),
  )

  return c.json({
    ...tx,
    sqrtPriceX96: body.sqrtPriceX96,
  })
})

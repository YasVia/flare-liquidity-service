import { Hono } from 'hono'
import { getPoolAddress } from '../services/liquidity'

export const poolAddressRoutes = new Hono()

poolAddressRoutes.post('/', async (c) => {
  const body = await c.req.json()

  const pool = await getPoolAddress(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json({
    pool,
  })
})

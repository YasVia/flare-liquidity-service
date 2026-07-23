import { Hono } from 'hono'
import { getPoolAddress } from '../services/poolReader'

export const poolAddressRoutes = new Hono()

poolAddressRoutes.post('/', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const pool = await getPoolAddress(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json({
    pool,
  })
})

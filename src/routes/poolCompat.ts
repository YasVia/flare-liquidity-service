import { Hono } from 'hono'
import { getPoolAddress } from '../services/poolReader'
import { getPoolState } from '../services/poolStateReader'

export const poolCompatRoutes = new Hono()

poolCompatRoutes.post('/GetPoolAddress', async (c) => {
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

poolCompatRoutes.post('/GetPoolState', async (c) => {
  const body = await c.req.json()

  const state = await getPoolState(
    body.pool ?? body.address,
  )

  return c.json({
    state,
  })
})

import { Hono } from 'hono'
import { getPoolState } from '../services/poolState'

export const poolStateRoutes = new Hono()

poolStateRoutes.post('/', async (c) => {
  const body = await c.req.json()

  try {
    const result = await getPoolState(body.pool)

    return c.json({
      sqrtPriceX96: result.sqrtPriceX96.toString(),
      tick: result.tick,
      tickSpacing: result.tickSpacing,
    })
  } catch (error) {
    return c.json({
      error: 'Invalid pool address or pool does not exist',
    }, 400)
  }
})

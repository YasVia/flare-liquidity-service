import { Hono } from 'hono'
import { getPoolState } from '../services/poolStateReader'

export const poolStateRoutes = new Hono()

poolStateRoutes.get('/:address', async (c) => {
  try {
    const address = c.req.param('address') as `0x${string}`

    const state = await getPoolState(address)

    return c.json(state)
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      500,
    )
  }
})

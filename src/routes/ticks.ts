import { Hono } from 'hono'
import { getTicks } from '../services/tickReader'

export const tickRoutes = new Hono()

tickRoutes.get('/:address', async (c) => {
  try {
    const address = c.req.param('address') as `0x${string}`

    const word = Number(
      c.req.query('word') ?? 0,
    )

    const ticks = await getTicks(
      address,
      word,
    )

    return c.json({
      ticks,
    })
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

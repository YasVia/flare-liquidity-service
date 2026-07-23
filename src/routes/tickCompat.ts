import { Hono } from 'hono'
import { getTicks } from '../services/tickReader'

export const tickCompatRoutes = new Hono()

tickCompatRoutes.post('/GetTicks', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const ticks = await getTicks(
    body.pool ?? body.address,
    Number(body.word ?? 0),
  )

  return c.json({
    ticks,
  })
})

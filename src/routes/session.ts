import { Hono } from 'hono'

export const sessionRoutes = new Hono()

sessionRoutes.post('/InitSession', async (c) => {
  return c.json({
    sessionId: null,
  })
})

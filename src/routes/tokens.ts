import { Hono } from 'hono'
import { searchTokens } from '../services/tokenSearch'

export const tokenRoutes = new Hono()

tokenRoutes.post('/search', async (c) => {
  const body = await c.req.json()

  const query = body.query ?? ''

  return c.json({
    tokens: searchTokens(query),
  })
})

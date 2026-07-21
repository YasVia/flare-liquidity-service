import { Hono } from 'hono'
import { searchTokens } from '../services/tokenSearch'
import { FLARE_TOKENS } from '../data/tokens'

export const tokenRoutes = new Hono()

tokenRoutes.post('/search', async (c) => {
  const body = await c.req.json()

  const query = body.query ?? ''

  return c.json({
    tokens: searchTokens(query),
  })
})



tokenRoutes.post('/data.v1.SearchService/SearchTokens', async (c) => {
  const body = await c.req.json()

  const query =
    body.query ??
    body.searchTerm ??
    ''

  return c.json({
    tokens: searchTokens(query),
  })
})

tokenRoutes.get('/', (c) => {
  return c.json({
    tokens: FLARE_TOKENS,
  })
})

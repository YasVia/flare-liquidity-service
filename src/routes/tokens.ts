import { Hono } from 'hono'
import { searchTokens } from '../services/tokenSearch'
import { FLARE_TOKENS } from '../data/tokens'

export const tokenRoutes = new Hono()

function result(query: string) {
  return searchTokens(query)
}

tokenRoutes.post('/SearchTokens', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  return c.json({
    tokens: result(
      body.query ??
      body.searchTerm ??
      ''
    ),
  })
})

tokenRoutes.post('/data.v1.SearchService/SearchTokens', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  return c.json({
    tokens: result(
      body.query ??
      body.searchTerm ??
      ''
    ),
  })
})

tokenRoutes.post('/search', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  return c.json({
    tokens: result(body.query ?? ''),
  })
})

tokenRoutes.post('/GetTokens', async (c) => {
  return c.json({
    tokens: FLARE_TOKENS,
  })
})

tokenRoutes.get('/', (c) => {
  return c.json({
    tokens: FLARE_TOKENS,
  })
})

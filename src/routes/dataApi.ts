import { Hono } from 'hono'
import { FLARE_TOKENS } from '../data/tokens'

export const dataApiRoutes = new Hono()

dataApiRoutes.post('/GetTokenPrices', async (c) => {
  const body = await c.req.json()

  console.log('GetTokenPrices', body)

  return c.json({
    prices: [],
  })
})

dataApiRoutes.post('/GetTokenMetadata', async (c) => {
  const body = await c.req.json()

  const addresses = body.tokenAddresses ?? []

  return c.json({
    tokens: FLARE_TOKENS.filter((t) =>
      addresses.includes(t.address)
    ),
  })
})

dataApiRoutes.post('/SearchTokens', async (c) => {
  const body = await c.req.json()

  const q = String(body.query ?? '').toLowerCase()

  return c.json({
    tokens: FLARE_TOKENS.filter((t) =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    ),
  })
})

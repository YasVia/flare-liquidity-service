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


dataApiRoutes.post('/ConvertFiat', async (c) => {
  const body = await c.req.json()

  console.log('ConvertFiat', body)

  return c.json({
    convertedAmount: body.amount ?? 0,
    currency: body.currency ?? 'USD',
  })
})


dataApiRoutes.post('/GetWalletBalances', async (c) => {
  const body = await c.req.json()

  console.log('GetWalletBalances', body)

  return c.json({
    balances: [],
  })
})


dataApiRoutes.post('/ListPools', async (c) => {
  const body = await c.req.json()

  console.log('ListPools', body)

  return c.json({
    pools: [],
  })
})


dataApiRoutes.post('/GetPortfolio', async (c) => {
  const body = await c.req.json()

  console.log('GetPortfolio', body)

  return c.json({
    positions: [],
    balances: [],
  })
})


dataApiRoutes.post('/ListTransactions', async (c) => {
  const body = await c.req.json()

  console.log('ListTransactions', body)

  return c.json({
    transactions: [],
  })
})

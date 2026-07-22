import { Hono } from 'hono'

export const dataApiRoutes = new Hono()

dataApiRoutes.post('/GetTokenPrices', async (c) => {
  const body = await c.req.json()

  console.log('GET TOKEN PRICES', body)

  return c.json({
    prices: [],
  })
})

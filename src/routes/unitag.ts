import { Hono } from 'hono'

export const unitagRoutes = new Hono()

unitagRoutes.post('/GetAddress', async (c) => {
  return c.json({
    address: null,
  })
})

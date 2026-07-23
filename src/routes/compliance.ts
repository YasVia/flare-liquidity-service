import { Hono } from 'hono'

export const complianceRoutes = new Hono()

complianceRoutes.post('/ScreenAddress', async (c) => {
  const body = await c.req.json()

  console.log('ScreenAddress', body)

  return c.json({
    result: {
      isSanctioned: false,
      riskLevel: 'LOW',
    },
  })
})

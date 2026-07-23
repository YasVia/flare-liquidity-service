import { Hono } from 'hono'

export const complianceRoutes = new Hono()

complianceRoutes.post('/ScreenAddress', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('ScreenAddress', body)

  return c.json({
    result: {
      isSanctioned: false,
      riskLevel: 'LOW',
    },
  })
})

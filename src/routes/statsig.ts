import { Hono } from 'hono'

export const statsigRoutes = new Hono()

statsigRoutes.all('/*', async (c) => {
  const path = c.req.path.replace(/^\/v1\/statsig-proxy/, '/v1')

  console.log('Statsig request:', {
    method: c.req.method,
    path,
  })

  // Minimal Statsig compatible response
  if (path.includes('/initialize')) {
    return c.json({
      dynamic_configs: {},
      feature_gates: {},
      layer_configs: {},
      time: Date.now(),
    })
  }

  if (path.includes('/rgstr')) {
    return c.json({
      success: true,
    })
  }

  return c.json({
    success: true,
  })
})
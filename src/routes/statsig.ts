import { Hono } from 'hono'

export const statsigRoutes = new Hono()

const TARGET = 'https://gating.interface.gateway.uniswap.org'

statsigRoutes.all('/*', async (c) => {
  const path = c.req.path.replace(/^\/v1\/statsig-proxy/, '/v1')
  const url = `${TARGET}${path}${new URL(c.req.url).search}`

  const response = await fetch(url, {
    method: c.req.method,
    headers: c.req.header(),
    body:
      c.req.method === 'GET' || c.req.method === 'HEAD'
        ? undefined
        : await c.req.raw.arrayBuffer(),
  })

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  })
})

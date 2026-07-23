import { Hono } from 'hono'

export const amplitudeRoutes = new Hono()

amplitudeRoutes.post('*', async (c) => {
  const body = await c.req.text()

  const upstream = await fetch(
    'https://interface.gateway.uniswap.org/v1/amplitude-proxy',
    {
      method: 'POST',
      headers: {
        'content-type': c.req.header('content-type') ?? 'application/json',
      },
      body,
    },
  )

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/json',
    },
  })
})

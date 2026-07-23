import { Hono } from 'hono'

export const privyRoutes = new Hono()

const TARGET = 'https://auth.privy.io'

privyRoutes.all('/*', async (c) => {
  const path = c.req.path.replace(/^\/privy/, '')

  const response = await fetch(
    `${TARGET}${path}${new URL(c.req.url).search}`,
    {
      method: c.req.method,
      headers: Object.fromEntries(
        Array.from(c.req.raw.headers.entries()).filter(
          ([k]) => !['host','content-length'].includes(k.toLowerCase())
        )
      ),
      body:
        c.req.method === 'GET' || c.req.method === 'HEAD'
          ? undefined
          : await c.req.raw.arrayBuffer(),
    },
  )

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  })
})

import { Hono } from 'hono'

export const walletconnectRoutes = new Hono()

walletconnectRoutes.get('/wallets', async (c) => {
  const query = new URL(c.req.url).search

  const response = await fetch(
    `https://explorer-api.walletconnect.com/v3/wallets${query}`,
  )

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'content-type':
        response.headers.get('content-type') ?? 'application/json',
      'access-control-allow-origin': '*',
    },
  })
})

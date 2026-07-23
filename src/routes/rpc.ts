import { Hono } from 'hono'

export const rpcRoutes = new Hono()

rpcRoutes.post('/:chainId', async (c) => {
  try {
    const body = await c.req.json()

    const response = await fetch(
      'https://flare-api.flare.network/ext/C/rpc',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )

    const data = await response.json()

    return c.json(data)
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'rpc error',
      },
      500,
    )
  }
})

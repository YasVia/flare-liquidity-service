import { Hono } from 'hono'

export const rpcRoutes = new Hono()

rpcRoutes.post('/:chainId', async (c) => {
  try {
    const body = await c.req.text()

    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, 15000)

    console.log('RPC REQUEST', c.req.path, body)

    const response = await fetch(
      'https://flare-api.flare.network/ext/C/rpc',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body,
        signal: controller.signal,
      },
    )

    clearTimeout(timeout)

    const json = await response.json()

    console.log('RPC RESPONSE STATUS', response.status)
    console.log('RPC RESPONSE JSON', json)

    if (json === null) {
      return c.json(
        {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'upstream returned null',
          },
        },
        502,
      )
    }

    return c.json(json, response.status as any)
  } catch (error) {
    console.error('RPC ERROR', error)

    return c.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message:
            error instanceof Error
              ? error.message
              : 'RPC proxy error',
        },
        id: null,
      },
      500,
    )
  }
})
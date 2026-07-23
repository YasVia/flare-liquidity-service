import { Hono } from 'hono'

export const rpcRoutes = new Hono()

rpcRoutes.post('/:chainId', async (c) => {
  try {
    const body = await c.req.text()

    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, 15000)

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

    const text = await response.text()

    return new Response(text, {
      status: response.status,
      headers: {
        'content-type':
          response.headers.get('content-type') ??
          'application/json',
      },
    })
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
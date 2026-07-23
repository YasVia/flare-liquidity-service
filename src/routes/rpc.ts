import { Hono } from 'hono'

export const rpcRoutes = new Hono()

const RPC_MAP: Record<string, string> = {
  '1': 'https://flare-api.flare.network/ext/C/rpc',
}

rpcRoutes.post('/:chainId', async (c) => {
  try {
    const chainId = c.req.param('chainId')

    const target =
      RPC_MAP[chainId] ??
      RPC_MAP['1']

    const body = await c.req.text()

    const controller = new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, 15000)

    const response = await fetch(target, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const text = await response.text()

    return new Response(text, {
      status: response.status,
      headers: {
        'content-type':
          response.headers.get('content-type') ??
          'application/json',
        'access-control-allow-origin': '*',
      },
    })

  } catch (error) {
    console.error('RPC ERROR', error)

    return c.json(
      {
        error: 'RPC_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'unknown error',
      },
      502,
    )
  }
})

import { Hono } from 'hono'

export const liquidityCompatRoutes = new Hono()



liquidityCompatRoutes.post(
  '/PoolInfo',
  async (c) => {
    let body: any = {}

    try {
      body = await c.req.json()
    } catch {
      console.log('EMPTY JSON BODY', c.req.path)
    }

    console.log('POOL INFO', body)

    return c.json({
      pool: null,
      exists: false,
      token0: body.token0 ?? null,
      token1: body.token1 ?? null,
      fee: body.fee ?? null,
    })
  },
)

liquidityCompatRoutes.post(
  '/GetPool',
  async (c) => {
    let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

    console.log('GET POOL', body)

    return c.json({
      pool: null,
    })
  },
)

liquidityCompatRoutes.post(
  '/GetPosition',
  async (c) => {
    let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

    console.log('GET POSITION', body)

    return c.json({
      position: null,
    })
  },
)

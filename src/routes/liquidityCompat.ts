import { Hono } from 'hono'

export const liquidityCompatRoutes = new Hono()

liquidityCompatRoutes.post(
  '/GetPool',
  async (c) => {
    const body = await c.req.json()

    console.log('GET POOL', body)

    return c.json({
      pool: null,
    })
  },
)

liquidityCompatRoutes.post(
  '/GetPosition',
  async (c) => {
    const body = await c.req.json()

    console.log('GET POSITION', body)

    return c.json({
      position: null,
    })
  },
)

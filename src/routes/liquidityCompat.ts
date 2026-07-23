import { Hono } from 'hono'

export const liquidityCompatRoutes = new Hono()

liquidityCompatRoutes.post(
  '/GetPool',
  async (c) => {
    let body = {}
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
    let body = {}
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

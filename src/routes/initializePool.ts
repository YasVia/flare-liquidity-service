import { Hono } from 'hono'
import { buildInitializePoolCalldata } from '../services/initializePool'

export const initializePoolRoutes = new Hono()

initializePoolRoutes.post('/', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const tx = buildInitializePoolCalldata(
    body.pool,
    BigInt(body.sqrtPriceX96),
  )

  return c.json({
    ...tx,
    sqrtPriceX96: body.sqrtPriceX96,
  })
})

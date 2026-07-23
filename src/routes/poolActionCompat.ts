import { Hono } from 'hono'
import { buildCreatePoolCalldata } from '../services/createPool'
import { buildInitializePoolCalldata } from '../services/initializePool'

export const poolActionCompatRoutes = new Hono()

poolActionCompatRoutes.post('/CreatePool', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  return c.json(
    buildCreatePoolCalldata(
      body.tokenA,
      body.tokenB,
      Number(body.fee),
    ),
  )
})

poolActionCompatRoutes.post('/InitializePool', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  return c.json({
    ...buildInitializePoolCalldata(
      body.pool,
      BigInt(body.sqrtPriceX96),
    ),
    sqrtPriceX96: body.sqrtPriceX96,
  })
})

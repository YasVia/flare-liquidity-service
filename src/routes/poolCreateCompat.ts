import { Hono } from 'hono'
import { buildCreatePoolCalldata } from '../services/createPool'
import { buildInitializePoolCalldata } from '../services/initializePool'

export const poolCreateCompatRoutes = new Hono()

poolCreateCompatRoutes.post('/CreatePool', async (c) => {
  let body: any = {}
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

poolCreateCompatRoutes.post('/InitializePool', async (c) => {
  let body: any = {}
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

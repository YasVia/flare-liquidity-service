import { Hono } from 'hono'
import { ensurePool } from '../services/liquidity'

export const liquidityRoutes = new Hono()

liquidityRoutes.post('/check-pool', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const result = await ensurePool(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json(result)
})


liquidityRoutes.post('/PoolInfo', async (c) => {
  const body = await c.req.json().catch(() => ({}))

  console.log('PoolInfo', body)

  return c.json({
    pool: {
      id: body.poolId ?? body.address ?? '',
      address: body.address ?? '',
      token0: null,
      token1: null,
      feeTier: 3000,
      liquidity: "0",
    },
  })
})

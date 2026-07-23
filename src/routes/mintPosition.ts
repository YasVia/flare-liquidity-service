import { Hono } from 'hono'
import { buildMintPositionCalldata } from '../services/mintPosition'

export const mintPositionRoutes = new Hono()

mintPositionRoutes.post('/', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const tx = buildMintPositionCalldata({
    ...body,
    fee: Number(body.fee),
    amount0Desired: BigInt(body.amount0Desired),
    amount1Desired: BigInt(body.amount1Desired),
    amount0Min: BigInt(body.amount0Min),
    amount1Min: BigInt(body.amount1Min),
    deadline: BigInt(body.deadline),
  })

  return c.json(tx)
})

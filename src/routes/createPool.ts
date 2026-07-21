import { Hono } from 'hono'
import { buildCreatePoolCalldata } from '../services/createPool'

export const createPoolRoutes = new Hono()

createPoolRoutes.post('/', async (c) => {
  const body = await c.req.json()

  const tx = buildCreatePoolCalldata(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json(tx)
})

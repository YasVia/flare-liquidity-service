import { Hono } from 'hono'
import { buildCreatePoolCalldata } from '../services/createPool'

export const createPoolRoutes = new Hono()

createPoolRoutes.post('/', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const tx = buildCreatePoolCalldata(
    body.tokenA,
    body.tokenB,
    Number(body.fee),
  )

  return c.json(tx)
})

import { Hono } from 'hono'
import {
  buildMulticallCalldata,
  getMulticallAddress,
} from '../services/multicallBuilder'

export const multicallCompatRoutes = new Hono()

multicallCompatRoutes.post('/Multicall', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const data = buildMulticallCalldata(
    body.calls ?? [],
  )

  return c.json({
    to: getMulticallAddress(),
    data,
    value: '0',
  })
})

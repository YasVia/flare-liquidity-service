import { Hono } from 'hono'
import {
  buildMulticallCalldata,
  getMulticallAddress,
} from '../services/multicallBuilder'

export const multicallCompatRoutes = new Hono()

multicallCompatRoutes.post('/Multicall', async (c) => {
  const body = await c.req.json()

  const data = buildMulticallCalldata(
    body.calls ?? [],
  )

  return c.json({
    to: getMulticallAddress(),
    data,
    value: '0',
  })
})

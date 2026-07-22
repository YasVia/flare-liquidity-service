import { Hono } from 'hono'
import { buildApproveCalldata } from '../services/approveBuilder'
import { FLARE_CONTRACTS } from '../config/contracts'

export const approveCompatRoutes = new Hono()

approveCompatRoutes.post('/Approve', async (c) => {
  const body = await c.req.json()

  const data = buildApproveCalldata({
    spender: FLARE_CONTRACTS.positionManagerAddress,
    amount: BigInt(body.amount ?? 0),
  })

  return c.json({
    to: body.token,
    data,
    value: '0',
  })
})

import { Hono } from 'hono'
import { buildApproveCalldata } from '../services/approveBuilder'
import { FLARE_CONTRACTS } from '../config/contracts'

export const approveCompatRoutes = new Hono()

approveCompatRoutes.post('/Approve', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

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

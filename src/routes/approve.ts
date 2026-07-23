import { Hono } from 'hono'
import { buildApproveCalldata } from '../services/approveBuilder'
import { FLARE_CONTRACTS } from '../config/contracts'

export const approveRoutes = new Hono()

approveRoutes.post('/', async (c) => {
  try {
    let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

    const data = buildApproveCalldata({
      spender:
        body.spender ??
        FLARE_CONTRACTS.positionManagerAddress,
      amount: BigInt(body.amount),
    })

    return c.json({
      to: body.token,
      data,
      value: '0',
    })
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      500,
    )
  }
})

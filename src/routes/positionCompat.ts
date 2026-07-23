import { Hono } from 'hono'
import { buildMintCalldata } from '../services/positionBuilder'
import { FLARE_CONTRACTS } from '../config/contracts'

export const positionCompatRoutes = new Hono()

positionCompatRoutes.post('/BuildMint', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const data = buildMintCalldata({
    token0: body.token0,
    token1: body.token1,
    fee: Number(body.fee),
    tickLower: Number(body.tickLower),
    tickUpper: Number(body.tickUpper),
    amount0Desired: BigInt(body.amount0Desired),
    amount1Desired: BigInt(body.amount1Desired),
    recipient: body.recipient,
    deadline: BigInt(body.deadline),
  })

  return c.json({
    to: FLARE_CONTRACTS.positionManagerAddress,
    data,
    value: '0',
  })
})

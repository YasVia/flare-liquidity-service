import { Hono } from 'hono'
import { buildMintCalldata } from '../services/positionBuilder'

export const positionBuildRoutes = new Hono()

positionBuildRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const calldata = buildMintCalldata({
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
      to: '0xe69b854a30D04c4DDf1ecCB7c30291184154c72D',
      data: calldata,
      value: '0',
    })
  } catch (error) {
    return c.json({
      error: error instanceof Error ? error.message : String(error),
    }, 500)
  }
})

import { Hono } from 'hono'
import { getPoolAddress } from '../services/liquidity'
import { quoteExactInputSingle } from '../services/quote'

export const tradingRoutes = new Hono()

tradingRoutes.post('/check_delegation', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('CHECK DELEGATION', body)

  const result: Record<string, any> = {}

  for (const address of body.walletAddresses ?? []) {
    result[address] = {}

    for (const chainId of body.chainIds ?? []) {
      result[address][chainId] = {
        currentDelegationAddress: null,
        latestDelegationAddress: null,
        isWalletDelegatedToUniswap: false,
      }
    }
  }

  return c.json({
    delegationDetails: result,
  })
})


tradingRoutes.post('/quote', async (c) => {
  let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const pool = await getPoolAddress(
    body.tokenIn,
    body.tokenOut,
    body.fee,
  )

  if (
    pool === '0x0000000000000000000000000000000000000000'
  ) {
    return c.json(
      {
        error: 'POOL_NOT_FOUND',
        message: 'No V3 pool exists for this token pair and fee',
        tokenIn: body.tokenIn,
        tokenOut: body.tokenOut,
        fee: body.fee,
      },
      400,
    )
  }

  const result = await quoteExactInputSingle({
    tokenIn: body.tokenIn,
    tokenOut: body.tokenOut,
    amountIn: BigInt(body.amountIn),
    fee: body.fee,
  })

  return c.json({
    quote: result.result,
  })
})

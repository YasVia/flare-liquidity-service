import { Hono } from 'hono'
import { quoteExactInputSingle } from '../services/quote'

export const tradingRoutes = new Hono()

tradingRoutes.post('/check_delegation', async (c) => {
  const body = await c.req.json()

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
  const body = await c.req.json()

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

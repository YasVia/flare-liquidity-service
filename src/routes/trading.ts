import { Hono } from 'hono'

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

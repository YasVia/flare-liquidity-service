import { Hono } from 'hono'

export const graphqlRoutes = new Hono()

graphqlRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const operationName = body.operationName ?? ''
    
    console.log('GRAPHQL', operationName)

    switch (operationName) {
      case 'SearchTokens':
      case 'Token':
        return c.json({
          data: {
            tokens: [
              {
                address: '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d',
                chainId: 14,
                symbol: 'WFLR',
                name: 'Wrapped Flare',
                decimals: 18,
              },
              {
                address: '0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6',
                chainId: 14,
                symbol: 'USDC',
                name: 'USD Coin',
                decimals: 6,
              },
            ],
          },
        })

      case 'PoolPriceHistory':
        return c.json({
          data: {
            poolPriceHistory: [],
          },
        })

      case 'AllV4Ticks':
        return c.json({
          data: {
            ticks: [],
          },
        })

      default:
        return c.json({
          data: {},
        })
    }
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : 'unknown error',
      },
      500,
    )
  }
})

import { Hono } from 'hono'
import { searchTokens } from '../services/tokenSearch'

export const graphqlRoutes = new Hono()

graphqlRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()

    const operationName = body.operationName ?? ''
    
    console.log('GRAPHQL', operationName)

    switch (operationName) {
      case 'SearchTokens': {
        const query =
          body.variables?.search ??
          body.variables?.query ??
          ''

        return c.json({
          data: {
            tokens: searchTokens(query),
          },
        })
      }

      case 'Token': {
        const address =
          body.variables?.address ??
          ''

        return c.json({
          data: {
            tokens: searchTokens(address),
          },
        })
      }

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

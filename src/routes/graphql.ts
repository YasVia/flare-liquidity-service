import { Hono } from 'hono'
import { searchTokens } from '../services/tokenSearch'
import { getPoolState } from '../services/poolStateReader'
import { getTicks } from '../services/tickReader'

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

      case 'PoolPriceHistory': {
        const pool = body.variables?.pool

        if (!pool) {
          return c.json({
            data: {
              poolPriceHistory: [],
            },
          })
        }

        const state = await getPoolState(pool)

        return c.json({
          data: {
            poolPriceHistory: [
              {
                sqrtPriceX96: state.slot0[0].toString(),
                tick: state.slot0[1],
              },
            ],
          },
        })
      }

      case 'AllV4Ticks': {
        const pool = body.variables?.pool

        if (!pool) {
          return c.json({
            data: {
              ticks: [],
            },
          })
        }

        const ticks = await getTicks(pool)

        return c.json({
          data: {
            ticks,
          },
        })
      }

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

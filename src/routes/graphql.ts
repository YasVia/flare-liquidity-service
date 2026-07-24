import { Hono } from 'hono'
import { searchTokens } from '../services/tokenSearch'
import { getPoolState } from '../services/poolStateReader'
import { getTicks } from '../services/tickReader'

export const graphqlRoutes = new Hono()

graphqlRoutes.post('/', async (c) => {
  try {
    const rawBody = await c.req.text()

    if (!rawBody) {
      console.log('GRAPHQL EMPTY BODY')
      return c.json({
        data: {},
      })
    }

    let body: any

    try {
      body = JSON.parse(rawBody)
    } catch (error) {
      console.log('GRAPHQL INVALID JSON', {
        rawBody,
        error: error instanceof Error ? error.message : error,
      })

      return c.json({
        data: {},
      })
    }

    const operationName = body.operationName ?? ''
    
    console.log('GRAPHQL OPERATION', operationName)
    console.log('GRAPHQL VARIABLES', JSON.stringify(body.variables ?? {}, null, 2))
    console.log('GRAPHQL QUERY', body.query ?? '')

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


      case 'V3Pool': {
        const address =
          body.variables?.address ?? ''

        const chain =
          body.variables?.chain ?? ''

        if (!address) {
          return c.json({
            data: {
              v3Pool: null,
            },
          })
        }

        return c.json({
          data: {
            v3Pool: {
              id: address,
              address,
              protocolVersion: 'V3',
              feeTier: 3000,
              token0Supply: 0,
              token1Supply: 0,
              txCount: 0,
              token0: null,
              token1: null,
              totalLiquidity: {
                value: 0,
              },
              volume24h: {
                value: 0,
              },
            },
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

      default: {
        console.log('GRAPHQL UNKNOWN OPERATION', operationName)

        return c.json({
          data: {
            token: null,
            tokens: [],
            pool: null,
            pools: [],
            v3Pool: null,
            positions: [],
            portfolio: {
              positions: [],
              balances: [],
            },
            account: null,
          },
        })
      }
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

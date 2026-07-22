import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { config } from './config'
import { liquidityRoutes } from './routes/liquidity'
import { createPoolRoutes } from './routes/createPool'
import { initializePoolRoutes } from './routes/initializePool'
import { mintPositionRoutes } from './routes/mintPosition'
import { poolStateRoutes } from './routes/poolState'
import { tickRoutes } from './routes/ticks'
import { approveRoutes } from './routes/approve'
import { multicallRoutes } from './routes/multicall'
import { poolAddressRoutes } from './routes/poolAddress'
import { positionBuildRoutes } from './routes/positionBuild'
import { createPositionRoutes } from './routes/createPosition'
import { tokenRoutes } from './routes/tokens'
import { uniswapLiquidityRoutes } from './routes/uniswapLiquidity'
import { dataApiRoutes } from './routes/dataApi'
import { graphqlRoutes } from './routes/graphql'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    service: 'flare-liquidity-service',
    status: 'ok',
  })
})

app.route('/liquidity', liquidityRoutes)
app.route('/pool/create', createPoolRoutes)
app.route('/pool/initialize', initializePoolRoutes)
app.route('/position/mint', mintPositionRoutes)
app.route('/pool/state', poolStateRoutes)
app.route('/pool/ticks', tickRoutes)
app.route('/position/approve', approveRoutes)
app.route('/position/multicall', multicallRoutes)
app.route('/pool/address', poolAddressRoutes)
app.route('/position/build', positionBuildRoutes)
app.route('/position/create', createPositionRoutes)
app.route('/tokens', tokenRoutes)
app.route('/', uniswapLiquidityRoutes)
app.route('/data.v1.DataApiService', dataApiRoutes)
app.route('/v1/graphql', graphqlRoutes)

serve({
  fetch: app.fetch,
  port: config.port,
})

console.log(`Listening on ${config.port}`)

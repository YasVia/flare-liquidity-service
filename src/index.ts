import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { config } from './config'
import { liquidityRoutes } from './routes/liquidity'
import { createPoolRoutes } from './routes/createPool'
import { initializePoolRoutes } from './routes/initializePool'
import { mintPositionRoutes } from './routes/mintPosition'
import { poolStateRoutes } from './routes/poolState'
import { poolAddressRoutes } from './routes/poolAddress'
import { positionBuildRoutes } from './routes/positionBuild'
import { createPositionRoutes } from './routes/createPosition'
import { tokenRoutes } from './routes/tokens'
import { uniswapLiquidityRoutes } from './routes/uniswapLiquidity'

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
app.route('/pool/address', poolAddressRoutes)
app.route('/position/build', positionBuildRoutes)
app.route('/position/create', createPositionRoutes)
app.route('/tokens', tokenRoutes)
app.route('/', uniswapLiquidityRoutes)

serve({
  fetch: app.fetch,
  port: config.port,
})

console.log(`Listening on ${config.port}`)

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
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
import { tradingRoutes } from './routes/trading'
import { liquidityCompatRoutes } from './routes/liquidityCompat'
import { uniswapLiquidityCompatRoutes } from './routes/uniswapLiquidityCompat'
import { poolCompatRoutes } from './routes/poolCompat'
import { tickCompatRoutes } from './routes/tickCompat'
import { positionCompatRoutes } from './routes/positionCompat'
import { approveCompatRoutes } from './routes/approveCompat'
import { poolActionCompatRoutes } from './routes/poolActionCompat'
import { multicallCompatRoutes } from './routes/multicallCompat'
import { poolCreateCompatRoutes } from './routes/poolCreateCompat'
import { createPositionCompatRoutes } from './routes/createPositionCompat'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'https://iranvault.online',
    ],
    allowMethods: [
      'GET',
      'POST',
      'OPTIONS',
    ],
    allowHeaders: [
      'Content-Type',
      'Authorization',
    ],
  }),
)

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
app.route('/wallet', tradingRoutes)
app.route('/uniswap.liquidity.v1.LiquidityService', liquidityCompatRoutes)
app.route('/uniswap.liquidity.v2.LiquidityService', uniswapLiquidityCompatRoutes)
app.route('/pool', poolCompatRoutes)
app.route('/ticks', tickCompatRoutes)
app.route('/position', positionCompatRoutes)
app.route('/approve', approveCompatRoutes)
app.route('/pool-action', poolActionCompatRoutes)
app.route('/multicall', multicallCompatRoutes)
app.route('/pool-create', poolCreateCompatRoutes)
app.route('/create-position', createPositionCompatRoutes)

serve({
  fetch: app.fetch,
  port: config.port,
})

console.log(`Listening on ${config.port}`)

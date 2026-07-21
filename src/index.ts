import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { config } from './config'
import { liquidityRoutes } from './routes/liquidity'
import { createPoolRoutes } from './routes/createPool'
import { initializePoolRoutes } from './routes/initializePool'
import { mintPositionRoutes } from './routes/mintPosition'
import { poolStateRoutes } from './routes/poolState'
import { poolAddressRoutes } from './routes/poolAddress'

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

serve({
  fetch: app.fetch,
  port: config.port,
})

console.log(`Listening on ${config.port}`)

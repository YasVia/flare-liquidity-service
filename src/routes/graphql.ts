import { Hono } from 'hono'

export const graphqlRoutes = new Hono()

graphqlRoutes.post('/', async (c) => {
  const body = await c.req.json()

  console.log('GRAPHQL QUERY', body.query)

  return c.json({
    data: {},
  })
})

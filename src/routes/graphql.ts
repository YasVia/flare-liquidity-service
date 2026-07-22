import { Hono } from 'hono'

export const graphqlRoutes = new Hono()

graphqlRoutes.post('/', async (c) => {
  const body = await c.req.json()

  const query = body.query ?? ''

  console.log('GRAPHQL', query)

  if (query.includes('Token')) {
    return c.json({
      data: {
        tokens: [],
      },
    })
  }

  if (query.includes('Pool')) {
    return c.json({
      data: {
        pool: null,
      },
    })
  }

  return c.json({
    data: {},
  })
})

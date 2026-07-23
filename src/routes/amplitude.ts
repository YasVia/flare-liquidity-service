import { Hono } from 'hono'

export const amplitudeRoutes = new Hono()

amplitudeRoutes.post('*', async (c) => {
  const body = await c.req.text()

  console.log('Amplitude event:', body.slice(0, 500))

  return c.json({
    code: 200,
    events_ingested: true,
  })
})
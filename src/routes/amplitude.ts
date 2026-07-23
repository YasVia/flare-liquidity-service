import { Hono } from 'hono'

export const amplitudeRoutes = new Hono()

amplitudeRoutes.post('*', async (c) => {
  const body = await c.req.text()

  console.log('AMPLITUDE EVENT', body.slice(0, 500))

  return c.json({
    code: 200,
    server_upload_time: Date.now(),
  })
})

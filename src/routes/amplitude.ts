import { Hono } from 'hono'

export const amplitudeRoutes = new Hono()

amplitudeRoutes.post('*', async (c) => {
  const body = await c.req.text()

  console.log('AMPLITUDE EVENT', body.slice(0, 500))

  return new Response(
    JSON.stringify({
      code: 200,
      server_upload_time: Date.now(),
      events_ingested: true,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true',
      },
    },
  )
})

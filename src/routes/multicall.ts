import { Hono } from 'hono'
import {
  buildMulticallCalldata,
  getMulticallAddress,
} from '../services/multicallBuilder'

export const multicallRoutes = new Hono()

multicallRoutes.post('/', async (c) => {
  try {
    let body = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

    const data = buildMulticallCalldata(
      body.calls,
    )

    return c.json({
      to: getMulticallAddress(),
      data,
      value: '0',
    })
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      500,
    )
  }
})

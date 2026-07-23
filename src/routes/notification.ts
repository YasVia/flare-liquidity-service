import { Hono } from 'hono'

export const notificationRoutes = new Hono()

notificationRoutes.post('/GetNotifications', async (c) => {
  return c.json({
    notifications: [],
  })
})

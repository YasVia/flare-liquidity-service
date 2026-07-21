import { createPublicClient, http } from 'viem'
import { config } from '../config'

export const flareClient = createPublicClient({
  transport: http(config.flareRpcUrl),
})

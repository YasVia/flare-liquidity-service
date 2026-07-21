import { flareClient } from './services/flareClient'

const block = await flareClient.getBlockNumber()

console.log('Flare block:', block.toString())

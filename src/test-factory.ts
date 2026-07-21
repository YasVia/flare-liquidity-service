import { flareClient } from './services/flareClient'
import { FLARE_CONTRACTS } from './contracts/flare'
import { factoryAbi } from './contracts/factoryAbi'

const result = await flareClient.readContract({
  address: FLARE_CONTRACTS.v3CoreFactoryAddress,
  abi: factoryAbi,
  functionName: 'getPool',
  args: [
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    3000,
  ],
})

console.log('Pool:', result)

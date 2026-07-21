import { createPublicClient, http } from 'viem'
import { config } from '../config'
import { FLARE_CONTRACTS } from '../config/contracts'

const tickLensAbi = [
  {
    type: 'function',
    name: 'getPopulatedTicksInWord',
    stateMutability: 'view',
    inputs: [
      {
        name: 'pool',
        type: 'address',
      },
      {
        name: 'tickBitmapIndex',
        type: 'int16',
      },
    ],
    outputs: [
      {
        name: 'populatedTicks',
        type: 'tuple[]',
        components: [
          {
            name: 'tick',
            type: 'int24',
          },
          {
            name: 'liquidityGross',
            type: 'uint128',
          },
          {
            name: 'liquidityNet',
            type: 'int128',
          },
        ],
      },
    ],
  },
] as const

const client = createPublicClient({
  transport: http(config.flareRpcUrl),
})

export async function getTicks(
  pool: `0x${string}`,
  word: number = 0,
) {
  return client.readContract({
    address: FLARE_CONTRACTS.tickLensAddress,
    abi: tickLensAbi,
    functionName: 'getPopulatedTicksInWord',
    args: [
      pool,
      word,
    ],
  })
}

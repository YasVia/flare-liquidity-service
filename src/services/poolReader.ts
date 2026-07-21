import { createPublicClient, http, getAddress } from 'viem'
import { config } from '../config'
import { FLARE_CONTRACTS } from '../config/contracts'

const factoryAbi = [
  {
    type: 'function',
    name: 'getPool',
    stateMutability: 'view',
    inputs: [
      {
        name: 'tokenA',
        type: 'address',
      },
      {
        name: 'tokenB',
        type: 'address',
      },
      {
        name: 'fee',
        type: 'uint24',
      },
    ],
    outputs: [
      {
        name: 'pool',
        type: 'address',
      },
    ],
  },
] as const

const client = createPublicClient({
  transport: http(config.flareRpcUrl),
})

export async function getPoolAddress(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  fee: number,
) {
  const pool = await client.readContract({
    address: FLARE_CONTRACTS.v3CoreFactoryAddress,
    abi: factoryAbi,
    functionName: 'getPool',
    args: [
      getAddress(tokenA),
      getAddress(tokenB),
      fee,
    ],
  })

  return pool
}

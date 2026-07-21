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
  const token0 = getAddress(tokenA.toLowerCase() < tokenB.toLowerCase() ? tokenA : tokenB)
  const token1 = getAddress(tokenA.toLowerCase() < tokenB.toLowerCase() ? tokenB : tokenA)

  const pool = await client.readContract({
    address: FLARE_CONTRACTS.v3CoreFactoryAddress,
    abi: factoryAbi,
    functionName: 'getPool',
    args: [
      token0,
      token1,
      fee,
    ],
  })

  return pool
}

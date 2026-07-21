import { createPublicClient, http } from 'viem'
import { config } from '../config'

const poolAbi = [
  {
    type: 'function',
    name: 'slot0',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' },
      { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' },
      { name: 'feeProtocol', type: 'uint8' },
      { name: 'unlocked', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'liquidity',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint128',
      },
    ],
  },
  {
    type: 'function',
    name: 'token0',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    type: 'function',
    name: 'token1',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
  },
  {
    type: 'function',
    name: 'fee',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint24',
      },
    ],
  },
] as const

const client = createPublicClient({
  transport: http(config.flareRpcUrl),
})

export async function getPoolState(address: `0x${string}`) {
  const [
    slot0,
    liquidity,
    token0,
    token1,
    fee,
  ] = await Promise.all([
    client.readContract({
      address,
      abi: poolAbi,
      functionName: 'slot0',
    }),
    client.readContract({
      address,
      abi: poolAbi,
      functionName: 'liquidity',
    }),
    client.readContract({
      address,
      abi: poolAbi,
      functionName: 'token0',
    }),
    client.readContract({
      address,
      abi: poolAbi,
      functionName: 'token1',
    }),
    client.readContract({
      address,
      abi: poolAbi,
      functionName: 'fee',
    }),
  ])

  return {
    slot0,
    liquidity,
    token0,
    token1,
    fee,
  }
}

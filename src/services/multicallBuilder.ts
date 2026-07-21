import { encodeFunctionData } from 'viem'
import { FLARE_CONTRACTS } from '../config/contracts'

const multicallAbi = [
  {
    type: 'function',
    name: 'aggregate',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        components: [
          {
            name: 'target',
            type: 'address',
          },
          {
            name: 'callData',
            type: 'bytes',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'blockNumber',
        type: 'uint256',
      },
      {
        name: 'returnData',
        type: 'bytes[]',
      },
    ],
  },
] as const

export function buildMulticallCalldata(
  calls: {
    to: `0x${string}`
    data: `0x${string}`
  }[],
) {
  return encodeFunctionData({
    abi: multicallAbi,
    functionName: 'aggregate',
    args: [
      calls.map((call) => ({
        target: call.to,
        callData: call.data,
      })),
    ],
  })
}

export function getMulticallAddress() {
  return FLARE_CONTRACTS.multicall2Address
}

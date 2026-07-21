import { encodeFunctionData } from 'viem'

const erc20Abi = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'spender',
        type: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
  },
] as const

export function buildApproveCalldata(params: {
  spender: `0x${string}`
  amount: bigint
}) {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [
      params.spender,
      params.amount,
    ],
  })
}

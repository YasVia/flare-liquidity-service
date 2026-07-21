import { encodeFunctionData } from 'viem'
import { FLARE_CONTRACTS } from '../contracts/flare'
import { factoryAbi } from '../contracts/v3Abi'

export function buildCreatePoolCalldata(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  fee: number,
) {
  return {
    to: FLARE_CONTRACTS.v3CoreFactoryAddress,
    data: encodeFunctionData({
      abi: factoryAbi,
      functionName: 'createPool',
      args: [
        tokenA,
        tokenB,
        fee,
      ],
    }),
  }
}

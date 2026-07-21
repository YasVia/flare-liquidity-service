import 'dotenv/config'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { config } from '../config'
import { FLARE_CONTRACTS } from '../contracts/flare'
import { factoryAbi } from '../contracts/v3Abi'

const account = privateKeyToAccount(
  config.privateKey,
)

const wallet = createWalletClient({
  account,
  transport: http(config.flareRpcUrl),
})

const tokenA =
  '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d'

const tokenB =
  '0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6'

const hash = await wallet.writeContract({
  chain: null,
  address: FLARE_CONTRACTS.v3CoreFactoryAddress,
  abi: factoryAbi,
  functionName: 'createPool',
  args: [
    tokenA,
    tokenB,
    500,
  ],
})

console.log('tx:', hash)

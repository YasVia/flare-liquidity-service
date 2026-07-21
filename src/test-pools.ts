import { flareClient } from './services/flareClient'
import { FLARE_CONTRACTS } from './contracts/flare'
import { factoryAbi } from './contracts/factoryAbi'

const WFLR = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d'
const USDC = '0xFbDa5F676cB37624f28265A144A48B0d6e87d3b6'
const USDT0 = '0xe7cd86e13AC4309349F30B3435a9d337750fC82D'

const pairs = [
  ['WFLR/USDC 500', WFLR, USDC, 500],
  ['WFLR/USDC 3000', WFLR, USDC, 3000],
  ['WFLR/USDT0 500', WFLR, USDT0, 500],
  ['WFLR/USDT0 3000', WFLR, USDT0, 3000],
] as const

for (const [name, tokenA, tokenB, fee] of pairs) {
  const pool = await flareClient.readContract({
    address: FLARE_CONTRACTS.v3CoreFactoryAddress,
    abi: factoryAbi,
    functionName: 'getPool',
    args: [tokenA, tokenB, fee],
  })

  console.log(name, pool)
}

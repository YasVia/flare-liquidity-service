import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT || 3000),
  flareRpcUrl:
    process.env.FLARE_RPC_URL ||
    'https://rpc.ankr.com/flare',
} as const

import { Hono } from 'hono'
import { FLARE_TOKENS } from '../data/tokens'
import { flareClient } from '../services/flareClient'

export const dataApiRoutes = new Hono()

dataApiRoutes.post('/GetTokenPrices', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('GetTokenPrices', body)

  const tokens = body.tokenAddresses ?? []

  const prices = tokens.map((address: string) => ({
    address,
    price: '0',
    currency: 'USD',
  }))

  return c.json({
    prices,
  })
})

dataApiRoutes.post('/GetTokenMetadata', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const addresses = body.tokenAddresses ?? []

  return c.json({
    tokens: FLARE_TOKENS.filter((t) =>
      addresses.includes(t.address)
    ),
  })
})

dataApiRoutes.post('/SearchTokens', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  const q = String(body.query ?? '').toLowerCase()

  return c.json({
    tokens: FLARE_TOKENS.filter((t) =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    ),
  })
})


dataApiRoutes.post('/ConvertFiat', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('ConvertFiat', body)

  return c.json({
    convertedAmount: body.amount ?? 0,
    currency: body.currency ?? 'USD',
  })
})


dataApiRoutes.post('/GetWalletBalances', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('GetWalletBalances', body)

  const address = body.walletAddress ?? body.address

  if (!address) {
    return c.json({
      balances: [],
    })
  }

  const balances = []

  for (const token of FLARE_TOKENS) {
    try {
      const balance = await flareClient.readContract({
        address: token.address,
        abi: [
          {
            type: 'function',
            name: 'balanceOf',
            stateMutability: 'view',
            inputs: [
              {
                name: 'account',
                type: 'address',
              },
            ],
            outputs: [
              {
                type: 'uint256',
              },
            ],
          },
        ],
        functionName: 'balanceOf',
        args: [address],
      })

      balances.push({
        token,
        balance: balance.toString(),
      })

    } catch {
      continue
    }
  }

  return c.json({
    balances,
  })
})


dataApiRoutes.post('/ListPools', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('ListPools', body)

  return c.json({
    pools: [],
  })
})


dataApiRoutes.post('/GetPortfolio', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('GetPortfolio', body)

  return c.json({
    positions: [],
    balances: [],
  })
})


dataApiRoutes.post('/ListTransactions', async (c) => {
  let body: any = {}
  try {
    body = await c.req.json()
  } catch {
    console.log('EMPTY JSON BODY', c.req.path)
  }

  console.log('ListTransactions', body)

  return c.json({
    transactions: [],
  })
})

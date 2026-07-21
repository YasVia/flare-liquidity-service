import { priceToSqrtPriceX96 } from './services/priceMath'

console.log(
  priceToSqrtPriceX96(
    1,
    18,
    6,
  ).toString(),
)

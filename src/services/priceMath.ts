const Q96 = 2n ** 96n

export function priceToSqrtPriceX96(
  price: number,
  decimals0: number,
  decimals1: number,
) {
  const adjustedPrice =
    price * 10 ** (decimals1 - decimals0)

  const sqrt = Math.sqrt(adjustedPrice)

  return BigInt(
    Math.floor(sqrt * Number(Q96)),
  )
}

import { TickMath } from '@uniswap/v3-sdk'

export function getTickRange(
  currentTick: number,
  tickSpacing: number,
  rangeMultiplier = 10,
) {
  const nearestTick =
    Math.floor(currentTick / tickSpacing) * tickSpacing

  const tickLower =
    nearestTick - tickSpacing * rangeMultiplier

  const tickUpper =
    nearestTick + tickSpacing * rangeMultiplier

  return {
    tickLower: TickMath.MIN_TICK < tickLower ? tickLower : TickMath.MIN_TICK,
    tickUpper: TickMath.MAX_TICK > tickUpper ? tickUpper : TickMath.MAX_TICK,
  }
}

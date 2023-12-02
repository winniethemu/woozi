/**
 * Generate a random number between [min, max)
 */
export function random(min: number, max: number) {
  const delta = Math.floor((max - min) * Math.random());
  return min + delta;
}

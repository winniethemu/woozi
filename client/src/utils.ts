export function range(max: number, min: number = 0, step: number = 1) {
  const result = [];
  for (let i = min; i < max; i += step) {
    result.push(i);
  }
  return result;
}

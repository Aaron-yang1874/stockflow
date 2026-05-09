export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

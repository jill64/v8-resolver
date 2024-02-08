export const toOffset = (
  position: { line: number; column: number },
  lineLengths: number[]
): number =>
  lineLengths.slice(0, position.line).reduce((acc, curr) => acc + curr + 1, 0) +
  position.column

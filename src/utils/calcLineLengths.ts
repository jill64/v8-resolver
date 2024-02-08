export const calcLineLengths = (source: string | undefined | null): number[] =>
  source?.split('\n').map((line) => line.length) ?? []

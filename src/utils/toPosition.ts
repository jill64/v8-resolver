export const toPosition = (
  offset: number,
  lineLengths: number[]
): { line: number; column: number } =>
  lineLengths.reduce(
    (prev, curr, index) => {
      if (prev.done) {
        return prev
      }

      if (prev.acc + curr >= offset) {
        return {
          line: index,
          column: offset - prev.acc,
          acc: 0,
          done: true
        }
      }

      return {
        line: 0,
        column: 0,
        acc: prev.acc + curr + 1,
        done: false
      }
    },
    {
      line: 0,
      column: 0,
      acc: 0,
      done: false
    }
  )

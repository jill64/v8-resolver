export class PositionConverter {
  private lineLengths

  constructor(lineLengths: number[]) {
    this.lineLengths = lineLengths
  }

  toPosition(offset: number): { line: number; column: number } {
    const position = this.lineLengths.reduce(
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

    return position
  }

  toOffset(position: { line: number; column: number }): number {
    const offset =
      this.lineLengths
        .slice(0, position.line)
        .reduce((acc, curr) => acc + curr + 1, 0) + position.column

    return offset
  }
}

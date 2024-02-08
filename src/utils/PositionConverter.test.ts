import { expect, test } from 'vitest'
import { PositionConverter } from './PositionConverter.js'

test('PositionConverter', () => {
  const convert = new PositionConverter([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

  expect(convert.toPosition(0).line).toBe(0)
  expect(convert.toPosition(0).column).toBe(0)
  expect(convert.toOffset({ line: 0, column: 0 })).toBe(0)

  expect(convert.toPosition(1).line).toBe(1)
  expect(convert.toPosition(1).column).toBe(0)
  expect(convert.toOffset({ line: 1, column: 0 })).toBe(1)

  expect(convert.toPosition(2).line).toBe(1)
  expect(convert.toPosition(2).column).toBe(1)
  expect(convert.toOffset({ line: 1, column: 1 })).toBe(2)

  expect(convert.toPosition(3).line).toBe(2)
  expect(convert.toPosition(3).column).toBe(0)
  expect(convert.toOffset({ line: 2, column: 0 })).toBe(3)

  expect(convert.toPosition(4).line).toBe(2)
  expect(convert.toPosition(4).column).toBe(1)
  expect(convert.toOffset({ line: 2, column: 1 })).toBe(4)
})

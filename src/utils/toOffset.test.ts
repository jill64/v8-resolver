import { expect, test } from 'vitest'
import { toOffset } from './toOffset.js'

test('toOffset', () => {
  const lengths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  expect(toOffset({ line: 0, column: 0 }, lengths)).toBe(0)
  expect(toOffset({ line: 1, column: 0 }, lengths)).toBe(1)
  expect(toOffset({ line: 1, column: 1 }, lengths)).toBe(2)
  expect(toOffset({ line: 2, column: 0 }, lengths)).toBe(3)
  expect(toOffset({ line: 2, column: 1 }, lengths)).toBe(4)
})

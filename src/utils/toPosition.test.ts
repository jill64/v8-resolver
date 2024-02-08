import { expect, test } from 'vitest'
import { toPosition } from './toPosition.js'

test('toPosition', () => {
  const lengths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  expect(toPosition(0, lengths).line).toBe(0)
  expect(toPosition(0, lengths).column).toBe(0)

  expect(toPosition(1, lengths).line).toBe(1)
  expect(toPosition(1, lengths).column).toBe(0)

  expect(toPosition(2, lengths).line).toBe(1)
  expect(toPosition(2, lengths).column).toBe(1)

  expect(toPosition(3, lengths).line).toBe(2)
  expect(toPosition(3, lengths).column).toBe(0)

  expect(toPosition(4, lengths).line).toBe(2)
  expect(toPosition(4, lengths).column).toBe(1)
})

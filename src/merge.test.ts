import { expect, test } from 'vitest'
import { merge } from './merge.js'

test('merge', () => {
  expect(merge([])).toEqual([])

  expect(
    merge([
      {
        url: 'a',
        scriptId: '123',
        source: '',
        functions: []
      }
    ])
  ).toEqual([
    {
      url: 'a',
      scriptId: '123',
      source: '',
      functions: []
    }
  ])

  expect(
    merge([
      {
        url: 'a',
        scriptId: '123',
        source: '',
        functions: [
          {
            functionName: 'fn1',
            isBlockCoverage: true,
            ranges: [
              {
                startOffset: 0,
                endOffset: 1,
                count: 2
              }
            ]
          }
        ]
      },
      {
        url: 'a',
        scriptId: '123',
        source: '',
        functions: [
          {
            functionName: 'fn1',
            isBlockCoverage: true,
            ranges: [
              {
                startOffset: 0,
                endOffset: 1,
                count: 3
              },
              {
                startOffset: 3,
                endOffset: 4,
                count: 5
              }
            ]
          },
          {
            functionName: 'fn2',
            isBlockCoverage: false,
            ranges: []
          }
        ]
      }
    ])
  ).toEqual([
    {
      url: 'a',
      scriptId: '123',
      source: '',
      functions: [
        {
          functionName: 'fn1',
          isBlockCoverage: true,
          ranges: [
            {
              startOffset: 0,
              endOffset: 1,
              count: 5
            },
            {
              startOffset: 3,
              endOffset: 4,
              count: 5
            }
          ]
        },
        {
          functionName: 'fn2',
          isBlockCoverage: false,
          ranges: []
        }
      ]
    }
  ])
})

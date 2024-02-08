import { array, boolean, number, optional, scanner, string } from 'typescanner'

export const isV8Coverage = scanner({
  url: string,
  scriptId: string,
  source: optional(string),
  functions: array(
    scanner({
      functionName: string,
      isBlockCoverage: boolean,
      ranges: array(
        scanner({
          count: number,
          startOffset: number,
          endOffset: number
        })
      )
    })
  )
})

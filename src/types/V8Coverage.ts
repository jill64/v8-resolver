export type V8Coverage = {
  url: string
  scriptId: string
  source?: string
  functions: {
    functionName: string
    isBlockCoverage: boolean
    ranges: {
      count: number
      startOffset: number
      endOffset: number
    }[]
  }[]
}

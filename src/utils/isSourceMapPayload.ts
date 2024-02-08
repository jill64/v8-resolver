import { array, number, optional, scanner, string } from 'typescanner'

export const isSourceMapPayload = scanner({
  file: string,
  version: number,
  sources: array(string),
  sourcesContent: array(string),
  names: array(string),
  mappings: string,
  sourceRoot: optional(string)
})

import { array, number, optional, scanner, string } from 'typescanner'
import { GuardType } from '../types/GuardType.js'
import { isV8Coverage } from './isV8Coverage.js'

const isSourceMapPayload = scanner({
  file: string,
  version: number,
  sources: array(string),
  sourcesContent: array(string),
  names: array(string),
  mappings: string,
  sourceRoot: string
})

const isSourceMapCacheValue = scanner({
  url: string,
  data: isSourceMapPayload,
  lineLengths: array(number)
})

/**
 * @see https://nodejs.org/docs/latest/api/cli.html#source-map-cache
 */
export const isNodeV8Coverage = scanner({
  result: array(isV8Coverage),
  timestamp: number,
  'source-map-cache': optional(
    (
      x
    ): x is {
      [absoluteSourcePath: string]: GuardType<typeof isSourceMapCacheValue>
    } =>
      typeof x === 'object' && x
        ? Object.values(x).every(isSourceMapCacheValue)
        : false
  )
})

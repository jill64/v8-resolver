import { SourceMapPayload } from 'node:module'
import { V8Coverage } from './V8Coverage.js'

/**
 * @see https://nodejs.org/docs/latest/api/cli.html#source-map-cache
 */
export type NodeV8Coverage = {
  result: V8Coverage[]
  timestamp: number
  'source-map-cache'?: {
    [absoluteSourcePath: string]: {
      url: string
      data: SourceMapPayload
      lineLengths: number[]
    }
  }
}

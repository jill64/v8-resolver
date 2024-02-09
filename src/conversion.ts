import { SourceMap, SourceMapPayload } from 'node:module'
import { V8Coverage } from './index.js'
import { calcLineLengths } from './utils/calcLineLengths.js'
import { fetchFile } from './utils/fetchFile.js'
import { nonNullable } from './utils/nonNullable.js'
import { toOffset } from './utils/toOffset.js'
import { toPosition } from './utils/toPosition.js'

export const conversion = async (
  coverage: V8Coverage,
  sourceMap: SourceMapPayload,
  lineLengths?: number[]
): Promise<V8Coverage[]> => {
  const generatedLineLengths = lineLengths ?? calcLineLengths(coverage.source)

  const map = new SourceMap(sourceMap)

  const result = coverage.functions.flatMap((fn, fnIndex) =>
    fn.ranges.map(async (range, rangeIndex) => {
      const scriptId = `${coverage.scriptId}${fnIndex}${rangeIndex}`

      if (fn.functionName === '') {
        return {
          ...coverage,
          scriptId,
          functions: [
            {
              ...fn,
              ranges: [range]
            }
          ]
        }
      }

      const start = toPosition(range.startOffset, generatedLineLengths)
      const end = toPosition(range.endOffset, generatedLineLengths)

      const startMapping = map.findEntry(start.line, start.column)
      const endMapping = map.findEntry(end.line, end.column)

      if (!startMapping || !endMapping) {
        return null
      }

      const startSourceIndex = map.payload.sources.findIndex(
        (x) => x === startMapping.originalSource
      )

      const endSourceIndex = map.payload.sources.findIndex(
        (x) => x === endMapping.originalSource
      )

      if (startSourceIndex === -1 || endSourceIndex === -1) {
        return null
      }

      const originalStart = toOffset(
        {
          line: startMapping.originalLine,
          column: startMapping.originalColumn
        },
        calcLineLengths(map.payload.sourcesContent[startSourceIndex])
      )

      const originalEnd = toOffset(
        {
          line: endMapping.originalLine,
          column: endMapping.originalColumn
        },
        calcLineLengths(map.payload.sourcesContent[endSourceIndex])
      )

      const url = startMapping.originalSource
      const source = await fetchFile(url)

      return {
        url,
        scriptId,
        source,
        functions: [
          {
            functionName: fn.functionName,
            isBlockCoverage: fn.isBlockCoverage,
            ranges: [
              {
                startOffset: originalStart,
                endOffset: originalEnd,
                count: range.count
              }
            ]
          }
        ]
      } satisfies V8Coverage
    })
  )

  const converted = await Promise.all(result)

  return converted.filter(nonNullable)
}

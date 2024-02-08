import { SourceMap, SourceMapPayload } from 'node:module'
import { V8Coverage } from './index.js'
import { calcLineLengths } from './utils/calcLineLengths.js'
import { nonNullable } from './utils/nonNullable.js'
import { toOffset } from './utils/toOffset.js'
import { toPosition } from './utils/toPosition.js'

export const conversion = async (
  coverage: V8Coverage,
  sourceMap: SourceMapPayload
): Promise<V8Coverage[]> => {
  const generatedLineLengths = calcLineLengths(coverage.source)

  // TODO: Open issue in @types/node
  const map = new SourceMap(
    sourceMap,
    // @ts-expect-error wrong type
    generatedLineLengths
  )

  const converted = coverage.functions.flatMap((fn) =>
    fn.ranges
      .map((range) => {
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

        return {
          url: startMapping.originalSource,
          scriptId: coverage.scriptId,
          source: coverage.source,
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
      .filter(nonNullable)
  )

  return converted
}

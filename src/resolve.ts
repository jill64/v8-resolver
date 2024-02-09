import { conversion } from './conversion.js'
import { V8Coverage } from './index.js'
import { search } from './search.js'
import { NodeV8Coverage } from './types/NodeV8Coverage.js'
import { fetchFile } from './utils/fetchFile.js'

export const resolve = async (
  coverage: NodeV8Coverage,
  options?: {
    root?: string
  }
): Promise<V8Coverage[]> => {
  const { result, 'source-map-cache': cache } = coverage
  const { root } = options ?? {}

  const promises = result.map(async (coverage) => {
    const source = coverage.source || (await fetchFile(coverage.url))

    if (!source) {
      return []
    }

    const filled = {
      ...coverage,
      source
    }

    const cached = cache?.[filled.url]
    const sourceMap = cached?.data ?? (await search(filled))

    if (!sourceMap) {
      return []
    }

    return conversion({
      coverage: filled,
      sourceMap,
      lineLengths: cached?.lineLengths,
      root
    })
  })

  const converted = await Promise.all(promises)
  const resolved = converted.flat()

  return resolved
}

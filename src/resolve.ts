import { conversion } from './conversion.js'
import { V8Coverage } from './index.js'
import { search } from './search.js'
import { NodeV8Coverage } from './types/NodeV8Coverage.js'
import { nonNullable } from './utils/nonNullable.js'

export const resolve = async (
  coverage: NodeV8Coverage
): Promise<V8Coverage[]> => {
  const { result, 'source-map-cache': cache } = coverage

  const promises = result.map(async (coverage) => {
    const sourceMap = cache?.[coverage.url]?.data ?? (await search(coverage))

    if (!sourceMap) {
      return null
    }

    return conversion(coverage, sourceMap)
  })

  const converted = await Promise.all(promises)
  const resolved = converted.filter(nonNullable)

  return resolved
}

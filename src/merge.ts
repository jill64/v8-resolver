import { V8Coverage } from './index.js'

type Dict = {
  [url: string]: Omit<V8Coverage, 'url'>
}

export const merge = (converted: V8Coverage[]): V8Coverage[] => {
  const dict: Dict = {}

  converted.forEach((cov) => {
    const dictItem = dict[cov.url]

    if (!dictItem) {
      dict[cov.url] = cov
      return
    }

    const dictFunctions = dict[cov.url].functions

    cov.functions.forEach((fn) => {
      const fnIndex = dictFunctions.findIndex(
        (x) => x.functionName === fn.functionName
      )

      if (fnIndex === -1) {
        dictFunctions.push(fn)
        return
      }

      const matchDictFn = dictFunctions[fnIndex]

      fn.ranges.forEach((range) => {
        const rangeIndex = matchDictFn.ranges.findIndex(
          (x) =>
            x.startOffset === range.startOffset &&
            x.endOffset === range.endOffset
        )

        if (rangeIndex === -1) {
          matchDictFn.ranges.push(range)
          return
        }

        matchDictFn.ranges[rangeIndex].count += range.count
      })
    })
    return
  })

  const merged = Object.entries(dict).map(([url, value]) => ({
    url,
    ...value
  }))

  return merged
}

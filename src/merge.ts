import { V8Coverage } from './index.js'

type Dict = {
  [url: string]: Omit<V8Coverage, 'url'>
}

export const merge = (
  converted: V8Coverage[],
  options?: {
    depth?: 'url' | 'function'
  }
): V8Coverage[] => {
  const { depth = 'function' } = options ?? {}

  const dict = converted.reduce((prev, curr) => {
    if (!prev[curr.url]) {
      return {
        ...prev,
        [curr.url]: curr
      }
    }

    if (depth === 'url') {
      return {
        ...prev,
        [curr.url]: {
          ...prev[curr.url],
          functions: [...prev[curr.url].functions, ...curr.functions]
        }
      }
    }

    const functions = curr.functions.reduce((acc, cur) => {
      if (!acc.some((fn) => fn.functionName === cur.functionName)) {
        return [...acc, cur]
      }

      const index = acc.findIndex((fn) => fn.functionName === cur.functionName)

      return [
        ...acc.slice(0, index),
        {
          ...acc[index],
          ranges: [...acc[index].ranges, ...cur.ranges]
        },
        ...acc.slice(index + 1)
      ]
    }, prev[curr.url].functions)

    return {
      ...prev,
      [curr.url]: {
        ...prev[curr.url],
        functions
      }
    }
  }, {} as Dict)

  const merged = Object.entries(dict).map(([url, value]) => ({
    url,
    ...value
  }))

  return merged
}

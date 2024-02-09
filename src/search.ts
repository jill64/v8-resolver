import { attempt } from '@jill64/attempt'
import { SourceMapPayload } from 'node:module'
import { V8Coverage } from './index.js'
import { isSourceMapPayload } from './utils/isSourceMapPayload.js'

export const search = async (
  coverage: V8Coverage
): Promise<SourceMapPayload | null> => {
  const url = coverage.source?.match(/\/\/# sourceMappingURL=(.*)/)?.[1]

  if (!url) {
    return null
  }

  const res = await attempt(() => fetch(url), null)

  if (!res?.ok) {
    return null
  }

  const json = await attempt(() => res.json() as unknown, null)

  if (!isSourceMapPayload(json)) {
    return null
  }

  return {
    ...json,
    sourceRoot: json.sourceRoot ?? coverage.url
  }
}

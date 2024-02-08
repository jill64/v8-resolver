import { attempt } from '@jill64/attempt'
import { readFile } from 'node:fs/promises'
import { SourceMapPayload } from 'node:module'
import { V8Coverage } from './index.js'
import { isSourceMapPayload } from './utils/isSourceMapPayload.js'

export const search = async (
  coverage: V8Coverage
): Promise<SourceMapPayload | null> => {
  const source =
    coverage.source ||
    (await attempt(() => readFile(new URL(coverage.url), 'utf-8'), null))

  if (!source) {
    return null
  }

  const url = source?.match(/\/\/# sourceMappingURL=(.*)/)?.[1]

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

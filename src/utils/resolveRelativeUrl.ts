import { attempt } from '@jill64/attempt'
import path from 'node:path'
import process from 'node:process'

const fileSchema = 'file://'

export const resolveRelativeUrl = (
  url: string,
  base: string,
  root = process.cwd()
): string => {
  if (!url.startsWith('./') && !url.startsWith('../')) {
    return url
  }

  const baseURL = attempt(() => new URL(base), null)

  const validBase = base.startsWith(fileSchema)
    ? base.slice(fileSchema.length)
    : (base.startsWith('http://') || base.startsWith('https://')) &&
        baseURL?.hostname === 'localhost'
      ? path.resolve(root, '.svelte-kit', 'output', 'client', baseURL.pathname)
      : base

  const resolved = `${fileSchema}${path.resolve(validBase, '../', url)}`

  return resolved
}

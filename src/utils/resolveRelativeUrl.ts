import { attempt } from '@jill64/attempt'
import path from 'node:path'
import process from 'node:process'

const fileSchema = 'file://'

export const resolveRelativeUrl = (url: string, base: string): string => {
  const validBase = base.startsWith(fileSchema)
    ? base
    : (base.startsWith('http') || base.startsWith('https')) &&
        attempt(() => new URL(base).host === 'localhost', false)
      ? path.resolve(process.cwd(), '.svelte-kit', 'output', 'client')
      : base.startsWith('/')
        ? `${fileSchema}${base}`
        : base

  const resolved =
    url.startsWith('./') || url.startsWith('../')
      ? path.resolve(validBase, url)
      : url

  return resolved
}

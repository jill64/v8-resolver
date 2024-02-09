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

  const validBase = base.startsWith(fileSchema)
    ? base.slice(fileSchema.length)
    : (base.startsWith('http') || base.startsWith('https')) &&
        new URL(base).hostname === 'localhost'
      ? path.join(
          root,
          '.svelte-kit',
          'output',
          'client',
          new URL(base).pathname
        )
      : base

  const resolved = `${fileSchema}${path.resolve(validBase, url)}`

  return resolved
}

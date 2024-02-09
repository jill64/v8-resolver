import path from 'node:path'
import process from 'node:process'

const fileSchema = 'file://'

export const resolveRelativeUrl = (url: string, base: string): string => {
  if (!url.startsWith('./') && !url.startsWith('../')) {
    return url
  }

  const validBase = base.startsWith(fileSchema)
    ? base.slice(fileSchema.length)
    : (base.startsWith('http') || base.startsWith('https')) &&
        new URL(base).hostname === 'localhost'
      ? path.join(process.cwd(), '.svelte-kit', 'output', 'client', base)
      : base

  const resolved = `${fileSchema}${path.resolve(validBase, url)}`

  return resolved
}

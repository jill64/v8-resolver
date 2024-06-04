import { attempt } from '@jill64/attempt'
import path from 'node:path'
import process from 'node:process'

const fileSchema = 'file://'

export const resolveRelativeUrl = (
  url: string,
  base: string,
  root = process.cwd()
): string => {
  if (!url.startsWith(`.${path.sep}`) && !url.startsWith(`..${path.sep}`)) {
    return url
  }

  const validBase = base.startsWith(fileSchema)
    ? base.slice(fileSchema.length)
    : base.startsWith('http://') || base.startsWith('https://')
      ? path.join(root, attempt(() => new URL(base), null)?.pathname ?? '')
      : base

  const resolved = `${fileSchema}${path.join(
    validBase,
    `${path.sep}..${path.sep}`,
    url
  )}`

  return resolved
}

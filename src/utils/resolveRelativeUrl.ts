import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const fileSchema = 'file://'

const findRoot = async (cwd: string, depth = 0): Promise<string> => {
  if (depth > 2) {
    return ''
  }

  if (existsSync(path.join(cwd, '.svelte-kit'))) {
    return cwd
  }

  const list = await readdir(cwd, {
    withFileTypes: true
  })

  const root = list.find(
    (dirent) => dirent.isDirectory() && dirent.name === '.svelte-kit'
  )

  if (root) {
    return root.path
  }

  for (const item of list) {
    if (item.isDirectory()) {
      const result = await findRoot(path.join(item.path, item.name), depth + 1)

      if (result) {
        return result
      }
    }
  }

  throw new Error('Could not find root')
}

export const resolveRelativeUrl = async (
  url: string,
  base: string
): Promise<string> => {
  if (!url.startsWith('./') && !url.startsWith('../')) {
    return url
  }

  const validBase = base.startsWith(fileSchema)
    ? base.slice(fileSchema.length)
    : (base.startsWith('http') || base.startsWith('https')) &&
        new URL(base).hostname === 'localhost'
      ? path.join(
          await findRoot(process.cwd()),
          '.svelte-kit',
          'output',
          'client',
          base
        )
      : base

  console.log({ validBase })

  const resolved = `${fileSchema}${path.resolve(validBase, url)}`

  return resolved
}

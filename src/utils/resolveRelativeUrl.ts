import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const fileSchema = 'file://'

const findRoot = async (): Promise<string> => {
  const cwd = process.cwd()

  if (existsSync(path.join(cwd, '.svelte-kit'))) {
    return cwd
  }

  const list = await readdir(cwd, {
    withFileTypes: true
  })

  const root = list.find(
    (dirent) => dirent.isDirectory() && dirent.name === '.svelte-kit'
  )

  if (!root) {
    throw new Error('Could not find root directory')
  }

  return root.path
}

export const resolveRelativeUrl = async (
  url: string,
  base: string
): Promise<string> => {
  const validBase = base.startsWith(fileSchema)
    ? base
    : base.startsWith('http') || base.startsWith('https')
      ? path.join(await findRoot(), '.svelte-kit', 'output', 'client', base)
      : base.startsWith('/')
        ? `${fileSchema}${base}`
        : base

  const resolved =
    url.startsWith('./') || url.startsWith('../')
      ? path.resolve(validBase, url)
      : url

  return resolved
}

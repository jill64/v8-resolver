import { attempt } from '@jill64/attempt'
import { readFile } from 'fs/promises'

const memo = new Map<string, string>()

export const fetchFile = async (url: string) => {
  if (memo.has(url)) {
    return memo.get(url)
  }

  const file = await attempt(() => readFile(new URL(url), 'utf-8'), '')
  memo.set(url, file)

  return file
}

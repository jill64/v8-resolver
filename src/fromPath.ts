import { readFile } from 'fs/promises'
import { resolve } from './resolve.js'

export const fromPath = async (path: string) => {
  const source = await readFile(path, 'utf-8')
  const coverage = JSON.parse(source)
  return resolve(coverage)
}

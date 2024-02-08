import { readFile } from 'fs/promises'
import { resolve } from './resolve.js'
import { isNodeV8Coverage } from './utils/isNodeV8Coverage.js'

export const fromPath = async (path: string) => {
  const source = await readFile(path, 'utf-8')
  const coverage = JSON.parse(source) as unknown

  if (!isNodeV8Coverage(coverage)) {
    throw new Error('Invalid coverage file.')
  }

  return resolve(coverage)
}

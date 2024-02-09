import { spawn } from 'node:child_process'
import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import v8 from 'node:v8'
import { test } from 'vitest'
import { NodeV8Coverage, resolve } from '../src/index'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const out = path.resolve(__dirname, './demo/coverage')
const execPath = path.resolve(__dirname, './demo/scripts/exec.js')

test('integration', async () => {
  await rm(out, { recursive: true, force: true })

  process.env.NODE_V8_COVERAGE = out

  const sub = spawn('node', [execPath], {
    shell: true,
    stdio: 'inherit'
  })

  await new Promise((resolve) => sub.once('close', resolve))

  v8.stopCoverage()

  const list = await readdir(out)
  const str = await readFile(path.join(out, list[0]), 'utf-8')
  const json = JSON.parse(str) as NodeV8Coverage
  const filtered = {
    ...json,
    result: json.result.filter(
      (x) =>
        x.url && !x.url.includes('/node_modules/') && !x.url.startsWith('node:')
    )
  }

  await writeFile(
    path.join(out, 'filtered.json'),
    JSON.stringify(filtered, null, 2)
  )

  const resolved = await resolve(filtered)

  await writeFile(
    path.join(out, 'resolved.json'),
    JSON.stringify(resolved, null, 2)
  )
})

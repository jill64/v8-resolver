import { spawn } from 'node:child_process'
import { readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import v8 from 'node:v8'
import { test } from 'vitest'
import { NodeV8Coverage, resolve } from '../src/index'
import { expect } from 'vitest'

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

  expect(resolved).toEqual([
    {
      scriptId: '10400',
      url: 'file:///Users/jill/v8-resolver/test/demo/dist/bundle.js',
      functions: [
        {
          functionName: '',
          ranges: [
            {
              startOffset: 0,
              endOffset: 129,
              count: 1
            }
          ],
          isBlockCoverage: true
        }
      ],
      source:
        'var e=(r,n)=>r+n;var u=(r,n)=>r-n;var s=r=>{let n=e(r,1);return u(n,1)};export{s as natural};\n//# sourceMappingURL=bundle.js.map\n'
    },
    {
      url: 'file:///Users/jill/v8-resolver/test/demo/src/add.ts',
      scriptId: '10410',
      source:
        'export const add = (a: number, b: number): number => {\n  return a + b\n}\n',
      functions: [
        {
          functionName: 'e',
          isBlockCoverage: true,
          ranges: [
            {
              startOffset: 19,
              endOffset: 68,
              count: 1
            }
          ]
        }
      ]
    },
    {
      url: 'file:///Users/jill/v8-resolver/test/demo/src/sub.ts',
      scriptId: '10420',
      source:
        'export const sub = (a: number, b: number): number => {\n  return a - b\n}\n',
      functions: [
        {
          functionName: 'u',
          isBlockCoverage: true,
          ranges: [
            {
              startOffset: 19,
              endOffset: 68,
              count: 1
            }
          ]
        }
      ]
    },
    {
      url: 'file:///Users/jill/v8-resolver/test/demo/src/index.ts',
      scriptId: '10430',
      source:
        "import { add } from './add'\nimport { sub } from './sub'\n\nexport const natural = (n: number): number => {\n  const res = add(n, 1)\n  return sub(res, 1)\n}\n",
      functions: [
        {
          functionName: 's',
          isBlockCoverage: true,
          ranges: [
            {
              startOffset: 81,
              endOffset: 150,
              count: 1
            }
          ]
        }
      ]
    }
  ])
})

import { expect, test } from 'vitest'
import { conversion } from './conversion.js'

// https://github.com/mryhryki/example-sourcemap/blob/blog/dist/index.js

const generated = `function o(){throw console.log("START"),new Error("DUMMY")}try{o()}catch(r){console.error("ERROR:",r)}
//# sourceMappingURL=index.js.map`

test('conversion', async () => {
  const result = await conversion(
    {
      url: 'mock://generated/file.js',
      scriptId: '123',
      source: generated,
      functions: [
        {
          functionName: 'show',
          isBlockCoverage: true,
          ranges: [
            {
              startOffset: 13,
              endOffset: 13 + 26,
              count: 1
            }
          ]
        }
      ]
    },
    {
      version: 3,
      file: 'mock://generated/file.js',
      sources: ['../src/main.ts', '../src/datetime.ts'],
      sourcesContent: [
        "export function main(): void {\n  console.log('START')\n  throw new Error('DUMMY')\n}\n\n",
        'import {main} from "./main";\n\ntry {\n  main()\n} catch (err) {\n  console.error(\'ERROR:\', err)\n}\n'
      ],
      mappings:
        'AAAO,SAASA,GAAa,CAC3B,cAAQ,IAAI,OAAO,EACb,IAAI,MAAM,OAAO,CACzB,CCDA,GAAI,CACFC,EAAK,CACP,OAASC,EAAP,CACA,QAAQ,MAAM,SAAUA,CAAG,CAC7B',
      names: ['main', 'main', 'err'],
      sourceRoot: ''
    }
  )

  const resultFns = result.map((x) => x.functions)

  expect(resultFns).toEqual([
    [
      {
        functionName: 'show',
        isBlockCoverage: true,
        ranges: [{ startOffset: 33, endOffset: 52, count: 1 }]
      }
    ]
  ])
})

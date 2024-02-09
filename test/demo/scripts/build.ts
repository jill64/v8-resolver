import { build } from 'esbuild'

build({
  entryPoints: ['test/demo/src/index.ts'],
  bundle: true,
  outfile: 'test/demo/dist/bundle.js',
  minify: true,
  sourcemap: true,
  platform: 'neutral',
  format: 'esm'
})

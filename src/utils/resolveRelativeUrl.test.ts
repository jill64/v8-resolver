import { sep } from 'node:path'
import { expect, test } from 'vitest'
import { resolveRelativeUrl } from './resolveRelativeUrl.js'

test('resolveRelativeUrl', async () => {
  expect(resolveRelativeUrl(`.${sep}foo`, 'file:///bar')).toBe(
    `file://${sep}foo`
  )
  expect(resolveRelativeUrl(`..${sep}foo`, 'file:///bar')).toBe(
    `file://${sep}foo`
  )
  expect(resolveRelativeUrl('foo', 'file:///bar')).toBe('foo')
})

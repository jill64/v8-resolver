import { expect, test } from 'vitest'
import { resolveRelativeUrl } from './resolveRelativeUrl.js'

test('resolveRelativeUrl', async () => {
  expect(resolveRelativeUrl('./foo', 'file:///bar')).toBe('file:///foo')
  expect(resolveRelativeUrl('../foo', 'file:///bar')).toBe('file:///foo')
  expect(resolveRelativeUrl('foo', 'file:///bar')).toBe('foo')
})

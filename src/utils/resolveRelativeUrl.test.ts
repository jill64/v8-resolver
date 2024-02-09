import { expect, test } from 'vitest'
import { resolveRelativeUrl } from './resolveRelativeUrl.js'

test('resolveRelativeUrl', async () => {
  expect(await resolveRelativeUrl('./foo', 'file:///bar')).toBe(
    'file:///bar/foo'
  )
  expect(await resolveRelativeUrl('../foo', 'file:///bar')).toBe('file:///foo')
  expect(await resolveRelativeUrl('foo', 'file:///bar')).toBe('foo')
})

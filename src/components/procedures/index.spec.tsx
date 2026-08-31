import { expect, test } from 'vitest'

import procedures from '.'

test('registers components for the ordinary procedure types', () => {
  expect(procedures).toHaveProperty('nomination')
  expect(procedures).toHaveProperty('vote')
  expect(procedures).toHaveProperty('erc20Vote')
  expect(Object.keys(procedures)).toHaveLength(3)
})

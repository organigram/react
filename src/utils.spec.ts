import { expect, test } from 'vitest'
import type { OrganJson, ProcedureJson } from '@organigram/js'

import { isUserInSourceOrgan } from './utils'

const chairman = '0x0000000000000000000000000000000000000c01'
const holder = '0x0000000000000000000000000000000000000c02'

const organs = [
  {
    address: chairman,
    entries: [{ address: chairman }]
  }
] as OrganJson[]

const procedure = {
  deciders: chairman
} as ProcedureJson

test('recognizes only members of the procedure role organ', () => {
  expect(isUserInSourceOrgan('deciders', organs, procedure, chairman)).toBe(true)
  expect(isUserInSourceOrgan('deciders', organs, procedure, holder)).toBe(false)
})

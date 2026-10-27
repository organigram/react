import { NominationProcedure } from '@organigram/js'
import { render } from 'vitest-browser-react'
import { expect, test } from 'vitest'

import procedures from '.'
import Wrapper from '../../../test/Wrapper'

test('registers components for the ordinary procedure types', () => {
  expect(procedures).toHaveProperty('nomination')
  expect(procedures).toHaveProperty('vote')
  expect(procedures).toHaveProperty('erc20Vote')
  expect(Object.keys(procedures)).toHaveLength(3)
})

test('rejects an unmoderated nomination without using moderation', async () => {
  const procedure = new NominationProcedure({
    address: '0x0000000000000000000000000000000000000001',
    deciders: '0x0000000000000000000000000000000000000002',
    withModeration: false
  })
  const Proposal = procedures.nomination.Proposal

  const { getByText } = await render(
    <Proposal
      procedure={procedure}
      proposal={{ key: '1', presented: true, blocked: false, applied: false }}
      accountInOrgans={{ deciders: true }}
      wrapTransaction={() => undefined}
      t={key => key}
    />,
    { wrapper: Wrapper }
  )

  await expect.element(getByText('Approve')).toBeInTheDocument()
  await expect.element(document.querySelector('.reject-proposal')).toBeInTheDocument()
})

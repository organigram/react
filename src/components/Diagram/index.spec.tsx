import { Organigram } from '@organigram/js'
import { render } from 'vitest-browser-react'
import { test, expect } from 'vitest'

import { Diagram } from '.'
import { getOrganNodeIconKind, MemberCount } from './OrganNode'
import Wrapper from '../../../test/Wrapper'

test('Mount', async () => {
  const organigram = new Organigram()
  const { getByText } = await render(
    <Diagram {...{ organigram, style: { height: '100vh' } }} />,
    { wrapper: Wrapper }
  )
  await expect.element(getByText('Board of directors')).toBeInTheDocument()
})

test('keeps distinct nodes when two organs have the same name', async () => {
  const firstAddress = '0x0000000000000000000000000000000000000001'
  const secondAddress = '0x0000000000000000000000000000000000000002'
  const organigram = new Organigram({
    organs: [
      { address: firstAddress, name: 'Board of directors' },
      { address: secondAddress, name: 'Board of directors' }
    ],
    procedures: [],
    assets: []
  })

  await render(
    <Diagram organigram={organigram} style={{ height: '100vh' }} />,
    {
      wrapper: Wrapper
    }
  )

  await expect
    .element(document.querySelector(`[data-id="organ-${firstAddress}"]`))
    .toBeInTheDocument()
  await expect
    .element(document.querySelector(`[data-id="organ-${secondAddress}"]`))
    .toBeInTheDocument()
})

test('translates known organ and procedure names at render time', async () => {
  const organigram = new Organigram({
    organs: [
      {
        address: '0x0000000000000000000000000000000000000001',
        name: 'Chairman'
      }
    ],
    procedures: [
      {
        address: '0x0000000000000000000000000000000000000002',
        name: 'Transfer shares',
        typeName: 'nomination',
        deciders: '0x0000000000000000000000000000000000000001',
        data: '{}'
      }
    ],
    assets: []
  })

  const { getByText } = await render(
    <Diagram
      organigram={organigram}
      style={{ height: '100vh' }}
      translateLabel={key =>
        ({
          Chairman: 'Président',
          'Transfer shares': 'Enregistrer le transfert de titres'
        })[key] ?? key
      }
    />,
    { wrapper: Wrapper }
  )

  await expect.element(getByText('Président')).toBeInTheDocument()
  await expect
    .element(getByText('Enregistrer le transfert de titres'))
    .toBeInTheDocument()
})

test('shows user avatars and their count for organ members', async () => {
  const userAddress = '0x0000000000000000000000000000000000000010'
  const organigram = new Organigram({
    organs: [{
      address: '0x0000000000000000000000000000000000000001',
      name: 'Board of directors',
      entries: [{ index: '1', address: userAddress, cid: '' }]
    }],
    procedures: [],
    assets: []
  })

  const { getByText } = await render(
    <Diagram
      organigram={organigram}
      style={{ height: '100vh' }}
      entryUsers={{
        [userAddress]: {
          name: 'Alice Martin',
          image: 'https://lh3.googleusercontent.com/a/example'
        }
      }}
    />,
    { wrapper: Wrapper }
  )

  await expect
    .element(document.querySelector('img[alt="Alice Martin"]'))
    .toBeInTheDocument()
  await expect.element(getByText('1 member')).toBeInTheDocument()
  await expect.element(document.querySelector('#organ-Board of directors-entry-count')).not.toBeInTheDocument()
})

test('pluralizes the number of organ members', async () => {
  const organ = new Organigram().toJson().organs[0]!
  const { getByText } = await render(
    <MemberCount organ={organ} count={2} />,
    { wrapper: Wrapper }
  )

  await expect.element(getByText('2 members')).toBeInTheDocument()
})

test('uses a blockie when a user does not have a profile image', async () => {
  const userAddress = '0x4100000000000000000000000000000000000010'
  const organigram = new Organigram({
    organs: [{
      address: '0x0000000000000000000000000000000000000001',
      name: 'Board of directors',
      entries: [{ index: '1', address: userAddress, cid: '' }]
    }],
    procedures: [],
    assets: []
  })

  await render(
    <Diagram
      organigram={organigram}
      style={{ height: '100vh' }}
      entryUsers={{ [userAddress]: {} }}
    />,
    { wrapper: Wrapper }
  )

  const blockie = document.querySelector(`img[alt="${userAddress}"]`)
  await expect.element(blockie).toBeInTheDocument()
  await expect.element(blockie).toHaveAttribute('src', expect.stringContaining('data:image'))
  await expect.element(document.querySelector('#organ-Board of directors-entry-count')).not.toBeInTheDocument()
})

test('selects the organ icon from its role and capabilities', () => {
  const baseOrgan = new Organigram({
    organs: [{
      address: '0x0000000000000000000000000000000000000001',
      name: 'Board of directors'
    }],
    procedures: [],
    assets: []
  }).toJson().organs[0]!

  expect(getOrganNodeIconKind({
    organ: baseOrgan,
    hasUserEntries: false,
    isMaster: true
  })).toBe('master')
  expect(getOrganNodeIconKind({
    organ: baseOrgan,
    hasUserEntries: true,
    isMaster: false
  })).toBe('people')
  expect(getOrganNodeIconKind({
    organ: {
      ...baseOrgan,
      permissions: [{
        permissionAddress: '0x0000000000000000000000000000000000000002',
        permissionValue: 0x40
      }]
    },
    hasUserEntries: false,
    isMaster: false
  })).toBe('funds')
  expect(getOrganNodeIconKind({
    organ: baseOrgan,
    hasUserEntries: false,
    isMaster: false
  })).toBe('documents')
})

test('aligns a source-only procedure with its sole organ', async () => {
  const organAddress = '0x0000000000000000000000000000000000000021'
  const procedureAddress = '0x0000000000000000000000000000000000000022'
  const organigram = new Organigram({
    organs: [
      {
        address: organAddress,
        name: 'Chairman',
        permissions: []
      }
    ],
    procedures: [
      {
        address: procedureAddress,
        name: 'Discuss strategy',
        typeName: 'vote',
        deciders: organAddress,
        data: '{}'
      }
    ],
    assets: []
  })

  await render(
    <Diagram organigram={organigram} style={{ height: '100vh' }} />,
    {
      wrapper: Wrapper
    }
  )

  const organNode = document.querySelector(`[data-id="organ-${organAddress}"]`)
  const procedureNode = document.querySelector(
    `[data-id="procedure-${procedureAddress}"]`
  )
  await expect.element(organNode).toBeInTheDocument()
  await expect.element(procedureNode).toBeInTheDocument()
  await expect
    .poll(() => {
      const organBounds = organNode!.getBoundingClientRect()
      const procedureBounds = procedureNode!.getBoundingClientRect()
      const organCenter = organBounds.left + organBounds.width / 2
      const procedureCenter = procedureBounds.left + procedureBounds.width / 2
      return Math.abs(organCenter - procedureCenter)
    })
    .toBeLessThanOrEqual(2)
})

test('translates known asset names at render time', async () => {
  const organigram = new Organigram({
    organs: [],
    procedures: [],
    assets: [
      {
        address: '0x0000000000000000000000000000000000000003',
        name: 'Shares',
        symbol: 'SHR'
      }
    ]
  })

  const { getByText } = await render(
    <Diagram
      organigram={organigram}
      style={{ height: '100vh' }}
      translateLabel={key => (key === 'Shares' ? 'Actions' : key)}
    />,
    { wrapper: Wrapper }
  )

  await expect.element(getByText('Actions')).toBeInTheDocument()
})

test('draws a governed share settlement from the procedure to the asset', async () => {
  const tokenAddress = '0x0000000000000000000000000000000000000003'
  const procedureAddress = '0x0000000000000000000000000000000000000004'
  const organigram = new Organigram({
    organs: [],
    procedures: [
      {
        address: procedureAddress,
        name: 'Approve share transfer',
        typeName: 'nomination',
        deciders: '',
        proposers: '',
        data: '{}'
      }
    ],
    assets: [
      {
        address: tokenAddress,
        name: 'Shares',
        symbol: 'SHR',
        kind: 'equity',
        decisionProcedure: procedureAddress
      }
    ]
  })

  await render(
    <Diagram organigram={organigram} style={{ height: '100vh' }} />,
    { wrapper: Wrapper }
  )

  await expect
    .element(document.querySelector('.react-flow__edge-text'))
    .not.toBeInTheDocument()
  await expect
    .element(document.querySelector(`[data-id="asset-${tokenAddress}"]`))
    .toBeInTheDocument()
})

import { expect, test } from 'vitest'
import { type OrganigramJson } from '@organigram/js'

import { projectOrganigramToClassicForest } from './classic'

const createBaseOrganigram = (): OrganigramJson => ({
  id: 'test-organigram',
  slug: 'test-organigram',
  name: 'Test organigram',
  description: 'Test',
  edgeType: 'default',
  nodePositions: {},
  chainId: '31337',
  organs: [],
  procedures: [],
  assets: []
})

const createProcedure = (
  overrides: Partial<OrganigramJson['procedures'][number]>
) =>
  ({
    isDeployed: false,
    address: 'procedure',
    deciders: '',
    typeName: 'nomination',
    name: 'Procedure',
    description: '',
    cid: '',
    chainId: '31337',
    data: '{}',
    proposers: '',
    moderators: '',
    withModeration: false,
    forwarder: '',
    type: {
      name: 'Nomination',
      description: '',
      icon: '',
      fields: []
    },
    organigramId: 'test-organigram',
    ...overrides
  }) as OrganigramJson['procedures'][number]

test('projects a classic org chart hierarchy from organ membership permissions', () => {
  const organigram = createBaseOrganigram()
  const parent = {
    address: 'parent',
    name: 'Parent',
    isDeployed: false,
    description: '',
    cid: '',
    entries: [{ index: '1', address: '0xparent', cid: '' }],
    permissions: [],
    chainId: '31337',
    organigramId: 'test-organigram',
    balance: '0'
  }
  const child = {
    address: 'child',
    name: 'Child',
    isDeployed: false,
    description: '',
    cid: '',
    entries: [{ index: '2', address: '0xchild', cid: '' }],
    permissions: [
      {
        permissionAddress: 'membership-procedure',
        permissionValue: 0x0004
      }
    ],
    chainId: '31337',
    organigramId: 'test-organigram',
    balance: '0'
  }

  organigram.organs = [parent, child]
  organigram.procedures = [
    createProcedure({
      address: 'membership-procedure',
      name: 'Manage child members',
      deciders: 'parent',
      proposers: 'parent'
    })
  ]

  const forest = projectOrganigramToClassicForest(organigram)

  expect(forest).toHaveLength(1)
  expect(forest[0]?.organ.name).toBe('Parent')
  expect(forest[0]?.children).toHaveLength(1)
  expect(forest[0]?.children[0]?.organ.name).toBe('Child')
  expect(forest[0]?.children[0]?.entries[0]?.address).toBe('0xchild')
})

test('keeps ambiguous or cyclic hierarchy candidates as roots', () => {
  const organigram = createBaseOrganigram()
  const organA = {
    address: 'a',
    name: 'A',
    isDeployed: false,
    description: '',
    cid: '',
    entries: [],
    permissions: [{ permissionAddress: 'proc-b', permissionValue: 0x0004 }],
    chainId: '31337',
    organigramId: 'test-organigram',
    balance: '0'
  }
  const organB = {
    address: 'b',
    name: 'B',
    isDeployed: false,
    description: '',
    cid: '',
    entries: [],
    permissions: [{ permissionAddress: 'proc-a', permissionValue: 0x0004 }],
    chainId: '31337',
    organigramId: 'test-organigram',
    balance: '0'
  }
  const organC = {
    address: 'c',
    name: 'C',
    isDeployed: false,
    description: '',
    cid: '',
    entries: [],
    permissions: [
      { permissionAddress: 'proc-a', permissionValue: 0x0004 },
      { permissionAddress: 'proc-b', permissionValue: 0x0004 }
    ],
    chainId: '31337',
    organigramId: 'test-organigram',
    balance: '0'
  }

  organigram.organs = [organA, organB, organC]
  organigram.procedures = [
    createProcedure({
      address: 'proc-a',
      name: 'Proc A',
      deciders: 'a',
      proposers: 'a'
    }),
    createProcedure({
      address: 'proc-b',
      name: 'Proc B',
      deciders: 'b',
      proposers: 'b'
    })
  ]

  const forest = projectOrganigramToClassicForest(organigram)
  const rootNames = forest.map(node => node.organ.name)

  expect(rootNames).toContain('B')
  expect(rootNames).toContain('C')
  expect(rootNames).not.toContain('A')
  expect(
    forest.find(node => node.organ.name === 'B')?.children[0]?.organ.name
  ).toBe('A')
})

test('filters out entries without an address in classic view projection', () => {
  const organigram = createBaseOrganigram()

  organigram.organs = [
    {
      address: 'organ-a',
      name: 'Organ A',
      isDeployed: false,
      description: '',
      cid: '',
      entries: [
        { index: '1', address: '', cid: 'cid-only' },
        { index: '2', address: '   ', cid: '' },
        { index: '3', address: '0xkept', cid: '' }
      ],
      permissions: [],
      chainId: '31337',
      organigramId: 'test-organigram',
      balance: '0'
    }
  ]

  const forest = projectOrganigramToClassicForest(organigram)

  expect(forest).toHaveLength(1)
  expect(forest[0]?.entries).toHaveLength(1)
  expect(forest[0]?.entries[0]?.address).toBe('0xkept')
})

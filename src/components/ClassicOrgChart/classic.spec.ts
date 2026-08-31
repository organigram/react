import { Organigram } from '@organigram/js'
import { expect, test } from 'vitest'

import { projectOrganigramToClassicForest } from './classic'

test('places an equity movement register under its decision organ', () => {
  const presidentAddress = '0x0000000000000000000000000000000000000021'
  const registerAddress = '0x0000000000000000000000000000000000000022'
  const shareAddress = '0x0000000000000000000000000000000000000023'
  const procedureAddress = '0x0000000000000000000000000000000000000024'
  const organigram = new Organigram({
    organs: [
      { address: presidentAddress, name: 'President', permissions: [] },
      { address: registerAddress, name: 'Share transfer register', permissions: [] }
    ],
    assets: [
      {
        address: shareAddress,
        name: 'Shares',
        symbol: 'SHR',
        kind: 'equity',
        decisionProcedure: procedureAddress
      }
    ],
    procedures: [
      {
        address: procedureAddress,
        name: 'Approve share transfer',
        typeName: 'nomination',
        deciders: presidentAddress,
        data: JSON.stringify({ equityTransferRegister: registerAddress })
      }
    ]
  })

  const forest = projectOrganigramToClassicForest(organigram)

  expect(forest).toHaveLength(1)
  expect(forest[0]?.organ.address).toBe(presidentAddress)
  expect(forest[0]?.children.map(child => child.organ.address)).toEqual([
    registerAddress
  ])
})

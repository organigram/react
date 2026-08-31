import { Organigram } from '@organigram/js'
import { render } from 'vitest-browser-react'
import { test, expect } from 'vitest'

import { Diagram } from '.'
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

test('shows the procedure settling and recording a SASU share transfer', async () => {
  const presidentAddress = '0x0000000000000000000000000000000000000011'
  const registerAddress = '0x0000000000000000000000000000000000000012'
  const shareAddress = '0x0000000000000000000000000000000000000013'
  const procedureAddress = '0x0000000000000000000000000000000000000014'
  const organigram = new Organigram({
    organs: [
      { address: presidentAddress, name: 'President', permissions: [] },
      {
        address: registerAddress,
        name: 'Share transfer register',
        permissions: []
      }
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

  await render(
    <Diagram organigram={organigram} style={{ height: '100vh' }} />,
    { wrapper: Wrapper }
  )

  await expect
    .element(document.querySelector('.react-flow__edge-text'))
    .not.toBeInTheDocument()
  await expect
    .poll(() => document.querySelectorAll('.react-flow__edge').length)
    .toBe(3)
})

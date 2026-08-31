import type { Edge, Node } from 'react-flow-renderer'
import { expect, test } from 'vitest'

import { autodistribute } from './layout'

const makeNode = (id: string, type: 'organ' | 'procedure'): Node => ({
  id,
  type,
  position: { x: 0, y: 0 },
  data: {}
})

test('groups organs that only participate in one shared procedure', () => {
  const nodes = [
    ...Array.from({ length: 8 }, (_, index) => makeNode(`o${index}`, 'organ')),
    ...Array.from({ length: 8 }, (_, index) =>
      makeNode(`p${index}`, 'procedure')
    ),
    ...Array.from({ length: 8 }, (_, index) => makeNode(`t${index}`, 'organ'))
  ]
  const connections = [
    ['o0', 'p3'],
    ['o1', 'p3'],
    ['o2', 'p2'],
    ['o3', 'p1'],
    ['o4', 'p3'],
    ['o5', 'p4'],
    ['o6', 'p3'],
    ['o7', 'p4'],
    ['p0', 't1'],
    ['p0', 't6'],
    ['p1', 't3'],
    ['p2', 't4'],
    ['p2', 't3'],
    ['p2', 't7'],
    ['p3', 't3'],
    ['p3', 't2'],
    ['p4', 't7'],
    ['p4', 't5'],
    ['p4', 't4'],
    ['p5', 't2'],
    ['p5', 't3'],
    ['p6', 't2'],
    ['p6', 't3'],
    ['p7', 't1']
  ] as const
  const edges: Edge[] = connections.map(([source, target], index) => ({
    id: `edge-${index}`,
    source,
    target
  }))

  const distributed = autodistribute(nodes, edges, 'TB')
  const centerX = new Map(
    distributed.map(node => [node.id, node.position.x + 144])
  )
  const procedureCenter = centerX.get('p3') ?? 0

  for (const organId of ['o0', 'o1', 'o4', 'o6']) {
    expect(Math.abs((centerX.get(organId) ?? 0) - procedureCenter)).toBeLessThanOrEqual(
      700
    )
  }
  expect(nodes.every(node => node.position.x === 0 && node.position.y === 0)).toBe(
    true
  )
})

test('always places a decider before its procedure, even when another edge points back to it', () => {
  const nodes = [
    makeNode('president', 'organ'),
    makeNode('approve-accounts', 'procedure')
  ]
  const edges: Edge[] = [
    {
      id: 'decider',
      source: 'president',
      target: 'approve-accounts',
      data: { layoutRole: 'decider' }
    },
    {
      id: 'target',
      source: 'approve-accounts',
      target: 'president'
    }
  ]

  const distributed = autodistribute(nodes, edges, 'TB')
  const positions = new Map(distributed.map(node => [node.id, node.position]))

  expect(positions.get('president')!.y).toBeLessThan(
    positions.get('approve-accounts')!.y
  )
})

test('orders adjacent ranks to avoid crossing independent relations', () => {
  const nodes = [
    makeNode('left-source', 'organ'),
    makeNode('right-source', 'organ'),
    makeNode('left-target', 'procedure'),
    makeNode('right-target', 'procedure')
  ]
  const edges: Edge[] = [
    { id: 'left-to-right', source: 'left-source', target: 'right-target' },
    { id: 'right-to-left', source: 'right-source', target: 'left-target' }
  ]

  const distributed = autodistribute(nodes, edges, 'TB')
  const centerX = new Map(
    distributed.map(node => [node.id, node.position.x + 144])
  )
  const sourceOrder =
    (centerX.get('left-source') ?? 0) - (centerX.get('right-source') ?? 0)
  const targetOrder =
    (centerX.get('right-target') ?? 0) - (centerX.get('left-target') ?? 0)

  expect(sourceOrder * targetOrder).toBeGreaterThan(0)
})

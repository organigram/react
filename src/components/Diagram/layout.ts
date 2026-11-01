import dagre from 'dagre'
import type { Edge, Node, Position } from 'react-flow-renderer'

const nodeWidth = 288
const procedureNodeHeight = 48
const organNodeHeight = 104
const nodeSeparation = 48
const rankSeparation = 80
const gridUnitSize = 16
const layoutSweeps = 6
const crossingOptimizationPasses = 4
const exclusiveRelationWeight = 4
const deciderRelationWeight = 100

type LayoutEdgeRole = 'decider'

const getLayoutEdgeRole = (edge: Edge): LayoutEdgeRole | undefined =>
  (edge.data as { layoutRole?: LayoutEdgeRole } | undefined)?.layoutRole

type PositionedNode = {
  id: string
  height: number
  width: number
  rankCoordinate: number
}

const nodeHeight = (node: Node): number =>
  node.type === 'procedure' ? procedureNodeHeight : organNodeHeight

const median = (values: number[]): number => {
  if (values.length === 0) return 0
  const sortedValues = [...values].sort((left, right) => left - right)
  return sortedValues[Math.floor(sortedValues.length / 2)] ?? 0
}

const compactRanks = (
  positionedNodes: PositionedNode[],
  edges: Edge[],
  isHorizontal: boolean,
  perpendicularCoordinates: Map<string, number>
): void => {
  const nodeIds = new Set(positionedNodes.map(node => node.id))
  const adjacency = new Map<string, Set<string>>()

  positionedNodes.forEach(node => adjacency.set(node.id, new Set()))
  edges.forEach(edge => {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) return
    adjacency.get(edge.source)?.add(edge.target)
    adjacency.get(edge.target)?.add(edge.source)
  })

  const ranks = Array.from(
    positionedNodes.reduce<Map<number, PositionedNode[]>>((result, node) => {
      const rank = result.get(node.rankCoordinate) ?? []
      rank.push(node)
      result.set(node.rankCoordinate, rank)
      return result
    }, new Map())
  )
    .sort(([left], [right]) => left - right)
    .map(([, rank]) => rank)

  for (let sweep = 0; sweep < layoutSweeps; sweep += 1) {
    const orderedRanks = sweep % 2 === 0 ? ranks : [...ranks].reverse()

    orderedRanks.forEach(rank => {
      const rankNodeIds = new Set(rank.map(node => node.id))
      const desiredCoordinate = (node: PositionedNode): number => {
        const neighbours = Array.from(adjacency.get(node.id) ?? []).filter(
          neighbourId => !rankNodeIds.has(neighbourId)
        )
        if (neighbours.length === 0) {
          return perpendicularCoordinates.get(node.id) ?? 0
        }
        return (
          neighbours.reduce(
            (sum, neighbourId) =>
              sum + (perpendicularCoordinates.get(neighbourId) ?? 0),
            0
          ) / neighbours.length
        )
      }

      rank.sort((left, right) => {
        const desiredDifference =
          desiredCoordinate(left) - desiredCoordinate(right)
        if (desiredDifference !== 0) return desiredDifference

        const currentDifference =
          (perpendicularCoordinates.get(left.id) ?? 0) -
          (perpendicularCoordinates.get(right.id) ?? 0)
        return currentDifference !== 0
          ? currentDifference
          : left.id.localeCompare(right.id)
      })

      let cursor = 0
      rank.forEach(node => {
        const size = isHorizontal ? node.height : node.width
        perpendicularCoordinates.set(node.id, cursor + size / 2)
        cursor += size + nodeSeparation
      })

      const alignmentDeltas = rank.flatMap(node =>
        Array.from(adjacency.get(node.id) ?? []).flatMap(neighbourId => {
          if (rankNodeIds.has(neighbourId)) return []
          const nodeCoordinate = perpendicularCoordinates.get(node.id)
          const neighbourCoordinate = perpendicularCoordinates.get(neighbourId)
          if (nodeCoordinate == null || neighbourCoordinate == null) return []

          const repetitions =
            adjacency.get(node.id)?.size === 1 ||
            adjacency.get(neighbourId)?.size === 1
              ? exclusiveRelationWeight
              : 1
          return Array.from(
            { length: repetitions },
            () => neighbourCoordinate - nodeCoordinate
          )
        })
      )
      const rankShift = median(alignmentDeltas)
      rank.forEach(node => {
        perpendicularCoordinates.set(
          node.id,
          (perpendicularCoordinates.get(node.id) ?? 0) + rankShift
        )
      })
    })
  }
}

type EdgeSegment = {
  source: string
  target: string
  start: number
  end: number
  startCoordinate: number
  endCoordinate: number
}

const getEdgeSegments = (
  edges: Edge[],
  primaryCoordinates: Map<string, number>,
  perpendicularCoordinates: Map<string, number>
): EdgeSegment[] =>
  edges.flatMap(edge => {
    const sourcePrimary = primaryCoordinates.get(edge.source)
    const targetPrimary = primaryCoordinates.get(edge.target)
    const sourcePerpendicular = perpendicularCoordinates.get(edge.source)
    const targetPerpendicular = perpendicularCoordinates.get(edge.target)
    if (
      sourcePrimary == null ||
      targetPrimary == null ||
      sourcePerpendicular == null ||
      targetPerpendicular == null ||
      sourcePrimary === targetPrimary
    ) {
      return []
    }
    return sourcePrimary < targetPrimary
      ? [{
          source: edge.source,
          target: edge.target,
          start: sourcePrimary,
          end: targetPrimary,
          startCoordinate: sourcePerpendicular,
          endCoordinate: targetPerpendicular
        }]
      : [{
          source: edge.source,
          target: edge.target,
          start: targetPrimary,
          end: sourcePrimary,
          startCoordinate: targetPerpendicular,
          endCoordinate: sourcePerpendicular
        }]
  })

const coordinateAt = (segment: EdgeSegment, primary: number): number =>
  segment.startCoordinate +
  ((primary - segment.start) / (segment.end - segment.start)) *
    (segment.endCoordinate - segment.startCoordinate)

const countEdgeCrossings = (
  edges: Edge[],
  primaryCoordinates: Map<string, number>,
  perpendicularCoordinates: Map<string, number>
): number => {
  const segments = getEdgeSegments(
    edges,
    primaryCoordinates,
    perpendicularCoordinates
  )
  let crossings = 0

  for (let leftIndex = 0; leftIndex < segments.length; leftIndex += 1) {
    const left = segments[leftIndex]!
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < segments.length;
      rightIndex += 1
    ) {
      const right = segments[rightIndex]!
      if (
        left.source === right.source ||
        left.source === right.target ||
        left.target === right.source ||
        left.target === right.target
      ) {
        continue
      }
      const overlapStart = Math.max(left.start, right.start)
      const overlapEnd = Math.min(left.end, right.end)
      if (overlapEnd <= overlapStart) continue

      const differenceAtStart =
        coordinateAt(left, overlapStart) - coordinateAt(right, overlapStart)
      const differenceAtEnd =
        coordinateAt(left, overlapEnd) - coordinateAt(right, overlapEnd)
      if (differenceAtStart * differenceAtEnd < 0) crossings += 1
    }
  }
  return crossings
}

const repositionRank = (
  rank: PositionedNode[],
  isHorizontal: boolean,
  perpendicularCoordinates: Map<string, number>
): void => {
  const start = Math.min(
    ...rank.map(node => {
      const size = isHorizontal ? node.height : node.width
      return (perpendicularCoordinates.get(node.id) ?? 0) - size / 2
    })
  )
  let cursor = start
  rank.forEach(node => {
    const size = isHorizontal ? node.height : node.width
    perpendicularCoordinates.set(node.id, cursor + size / 2)
    cursor += size + nodeSeparation
  })
}

const minimizeEdgeCrossings = (
  positionedNodes: PositionedNode[],
  edges: Edge[],
  isHorizontal: boolean,
  primaryCoordinates: Map<string, number>,
  perpendicularCoordinates: Map<string, number>
): void => {
  const ranks = Array.from(
    positionedNodes.reduce<Map<number, PositionedNode[]>>((result, node) => {
      const rank = result.get(node.rankCoordinate) ?? []
      rank.push(node)
      result.set(node.rankCoordinate, rank)
      return result
    }, new Map())
  )
    .sort(([left], [right]) => left - right)
    .map(([, rank]) =>
      [...rank].sort(
        (left, right) =>
          (perpendicularCoordinates.get(left.id) ?? 0) -
          (perpendicularCoordinates.get(right.id) ?? 0)
      )
    )

  let score = countEdgeCrossings(
    edges,
    primaryCoordinates,
    perpendicularCoordinates
  )
  for (let pass = 0; pass < crossingOptimizationPasses; pass += 1) {
    let improved = false
    for (const rank of ranks) {
      for (let index = 0; index < rank.length - 1; index += 1) {
        const left = rank[index]!
        const right = rank[index + 1]!
        const previousCoordinates = new Map(
          rank.map(node => [node.id, perpendicularCoordinates.get(node.id)])
        )
        rank[index] = right
        rank[index + 1] = left
        repositionRank(rank, isHorizontal, perpendicularCoordinates)
        const nextScore = countEdgeCrossings(
          edges,
          primaryCoordinates,
          perpendicularCoordinates
        )
        if (nextScore < score) {
          score = nextScore
          improved = true
        } else {
          rank[index] = left
          rank[index + 1] = right
          previousCoordinates.forEach((coordinate, nodeId) => {
            if (coordinate != null) {
              perpendicularCoordinates.set(nodeId, coordinate)
            }
          })
        }
      }
    }
    if (!improved) return
  }
}

const enforceDeciderPrecedence = (
  nodes: Node[],
  edges: Edge[],
  primaryCoordinates: Map<string, number>
): void => {
  const nodesById = new Map(nodes.map(node => [node.id, node]))

  edges
    .filter(edge => getLayoutEdgeRole(edge) === 'decider')
    .forEach(edge => {
      const source = nodesById.get(edge.source)
      const target = nodesById.get(edge.target)
      const sourceCoordinate = primaryCoordinates.get(edge.source)
      const targetCoordinate = primaryCoordinates.get(edge.target)
      if (
        source == null ||
        target == null ||
        sourceCoordinate == null ||
        targetCoordinate == null
      ) {
        return
      }

      const requiredSourceCoordinate =
        targetCoordinate - (nodeHeight(source) + nodeHeight(target)) / 2 - rankSeparation
      if (sourceCoordinate > requiredSourceCoordinate) {
        primaryCoordinates.set(edge.source, requiredSourceCoordinate)
      }
    })
}

export const autodistribute = (
  nodes: Node[],
  edges: Edge[],
  direction: string
): Node[] => {
  const isHorizontal = direction === 'LR'
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
    acyclicer: 'greedy'
  })

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight(node)
    })
  })

  const nodeIds = new Set(nodes.map(node => node.id))
  const uniqueEdges = Array.from(
    edges
      .filter(
        edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
      )
      .reduce<Map<string, Edge>>((result, edge) => {
        result.set(`${edge.source}\u0000${edge.target}`, edge)
        return result
      }, new Map())
      .values()
  ).sort((left, right) =>
    `${left.source}\u0000${left.target}`.localeCompare(
      `${right.source}\u0000${right.target}`
    )
  )
  const incidentCounts = uniqueEdges.reduce<Map<string, number>>(
    (result, edge) => {
      result.set(edge.source, (result.get(edge.source) ?? 0) + 1)
      result.set(edge.target, (result.get(edge.target) ?? 0) + 1)
      return result
    },
    new Map()
  )

  uniqueEdges.forEach(edge => {
    const isExclusiveRelation =
      incidentCounts.get(edge.source) === 1 ||
      incidentCounts.get(edge.target) === 1
    dagreGraph.setEdge(edge.source, edge.target, {
      weight:
        getLayoutEdgeRole(edge) === 'decider'
          ? deciderRelationWeight
          : isExclusiveRelation
            ? exclusiveRelationWeight
            : 1
    })
  })

  dagre.layout(dagreGraph)

  const primaryCoordinates = new Map(
    nodes.map(node => {
      const position = dagreGraph.node(node.id) as { x: number; y: number }
      return [node.id, isHorizontal ? position.x : position.y] as const
    })
  )
  enforceDeciderPrecedence(nodes, uniqueEdges, primaryCoordinates)

  const positionedNodes = nodes.map(node => {
    const position = dagreGraph.node(node.id) as {
      x: number
      y: number
      width: number
      height: number
    }
    return {
      id: node.id,
      width: position.width,
      height: position.height,
      rankCoordinate: primaryCoordinates.get(node.id) ??
        (isHorizontal ? position.x : position.y)
    }
  })
  const perpendicularCoordinates = new Map(
    nodes.map(node => {
      const position = dagreGraph.node(node.id) as { x: number; y: number }
      return [node.id, isHorizontal ? position.y : position.x] as const
    })
  )

  compactRanks(
    positionedNodes,
    uniqueEdges,
    isHorizontal,
    perpendicularCoordinates
  )
  minimizeEdgeCrossings(
    positionedNodes,
    uniqueEdges,
    isHorizontal,
    primaryCoordinates,
    perpendicularCoordinates
  )

  return nodes.map(node => {
    const position = dagreGraph.node(node.id) as { x: number; y: number }
    const height = nodeHeight(node)
    const perpendicularCoordinate =
      perpendicularCoordinates.get(node.id) ??
      (isHorizontal ? position.y : position.x)
    const primaryCoordinate =
      primaryCoordinates.get(node.id) ?? (isHorizontal ? position.x : position.y)
    const x = isHorizontal
      ? primaryCoordinate - nodeWidth / 2
      : perpendicularCoordinate - nodeWidth / 2
    const y = isHorizontal
      ? perpendicularCoordinate - height / 2
      : primaryCoordinate - height / 2

    return {
      ...node,
      targetPosition: (isHorizontal ? 'left' : 'top') as Position,
      sourcePosition: (isHorizontal ? 'right' : 'bottom') as Position,
      position: {
        x: Math.floor(x / gridUnitSize) * gridUnitSize,
        y: Math.floor(y / gridUnitSize) * gridUnitSize
      }
    }
  })
}

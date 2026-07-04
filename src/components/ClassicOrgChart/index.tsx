import React, { useMemo } from 'react'
import {
  type OrganEntry,
  type OrganigramJson,
  type OrganJson
} from '@organigram/js'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import NoSsr from '@mui/material/NoSsr'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import dagre from 'dagre'
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes
} from 'react-flow-renderer'

import { workspaceNavHeight } from '../../theme'
import {
  projectOrganigramToClassicForest,
  type ClassicOrgChartNode
} from './classic'

const leafNodeHeight = 48
const classicNodeHeight = 80
const organNodeWidth = 280
const entryNodeWidth = 220

const makeTestId = (id: string): string => id
const toTestIdSegment = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'

type ClassicNodeData =
  | {
      type: 'organ'
      organ: ClassicOrgChartNode['organ']
      entryCount: number
      onClick?: ((organ: OrganJson) => void) | undefined
    }
  | {
      type: 'entry'
      entry: OrganEntry
    }

const getEntryLabel = (entry: OrganEntry): string => {
  const name = entry.name?.trim?.() ?? ''
  if (name !== '') {
    return name
  }

  if (entry.address != null && entry.address !== '') {
    return entry.address
  }

  if (entry.cid != null && entry.cid !== '') {
    return entry.cid
  }

  return entry.index
}

const ClassicOrganNode: React.FC<NodeProps<ClassicNodeData>> = ({ data }) => {
  if (data.type !== 'organ') {
    return null
  }

  return (
    <>
      <Paper
        elevation={0}
        id={makeTestId(
          `classic-org-chart-organ-${toTestIdSegment(data.organ.name)}`
        )}
        sx={{
          width: `${organNodeWidth}px`,
          height: `${classicNodeHeight}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: '18px',
          background:
            'linear-gradient(180deg, rgba(243,248,255,1) 0%, rgba(255,255,255,1) 100%)',
          px: 2.5,
          py: 2,
          cursor: data.onClick == null ? 'default' : 'pointer',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)'
        }}
        onClick={() => {
          data.onClick?.(data.organ)
        }}
      >
        <Typography variant='subtitle1' fontWeight={700}>
          {data.organ.name}
        </Typography>
        <Typography variant='caption' color='text.secondary'>
          {data.entryCount} {data.entryCount === 1 ? 'entry' : 'entries'}
        </Typography>
      </Paper>
      <Handle
        type='target'
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      <Handle
        type='source'
        position={Position.Bottom}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    </>
  )
}

const ClassicEntryLeafNode: React.FC<NodeProps<ClassicNodeData>> = ({
  data
}) => {
  if (data.type !== 'entry') {
    return null
  }

  const label = getEntryLabel(data.entry)

  return (
    <>
      <Box sx={{ height: classicNodeHeight }}>
        <Paper
          elevation={0}
          sx={{
            width: `${entryNodeWidth}px`,
            height: `${leafNodeHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '999px',
            border: '1px solid',
            borderColor: 'grey.300',
            backgroundColor: 'background.paper',
            px: 1.5,
            py: 1,
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)'
          }}
        >
          <Grid container justifyContent='center' alignItems='center'>
            <Chip
              id={makeTestId(
                `classic-org-chart-entry-${toTestIdSegment(label)}`
              )}
              size='small'
              variant='outlined'
              label={label}
              sx={{
                maxWidth: '100%',
                border: 'none',
                backgroundColor: 'transparent',
                '& .MuiChip-label': {
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }}
            />
          </Grid>
        </Paper>
      </Box>
      <Handle
        type='target'
        position={Position.Top}
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    </>
  )
}

const nodeTypes: NodeTypes = {
  classicOrgan: ClassicOrganNode as React.FC<NodeProps>,
  classicEntry: ClassicEntryLeafNode as React.FC<NodeProps>
}

const layoutClassicNodes = (nodes: Node[], edges: Edge[]): Node[] => {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: 'TB',
    nodesep: 48,
    ranksep: 80,
    marginx: 24,
    marginy: 24
  })

  nodes.forEach(node => {
    graph.setNode(node.id, {
      width: node.type === 'classicEntry' ? entryNodeWidth : organNodeWidth,
      height: classicNodeHeight
    })
  })

  edges.forEach(edge => {
    graph.setEdge(edge.source, edge.target)
  })

  dagre.layout(graph)

  return nodes.map(node => {
    const positionedNode = graph.node(node.id)
    const width = node.type === 'classicEntry' ? entryNodeWidth : organNodeWidth

    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition:
        node.type === 'classicEntry' ? undefined : Position.Bottom,
      position: {
        x: positionedNode.x - width / 2,
        y: positionedNode.y - classicNodeHeight / 2
      }
    }
  })
}

const buildClassicFlow = ({
  forest,
  onClickOrgan
}: {
  forest: ClassicOrgChartNode[]
  onClickOrgan?: (organ: OrganJson) => void
}): {
  nodes: Node<ClassicNodeData>[]
  edges: Edge[]
} => {
  const nodes: Node<ClassicNodeData>[] = []
  const edges: Edge[] = []

  const visitNode = (node: ClassicOrgChartNode, parentNodeId?: string) => {
    const organNodeId = `classic-organ-${node.organ.address}`

    nodes.push({
      id: organNodeId,
      type: 'classicOrgan',
      data: {
        type: 'organ',
        organ: node.organ,
        entryCount: node.entries.length,
        onClick: onClickOrgan
      },
      position: { x: 0, y: 0 }
    })

    if (parentNodeId != null) {
      edges.push({
        id: `classic-edge-${parentNodeId}-${organNodeId}`,
        source: parentNodeId,
        target: organNodeId,
        type: 'smoothstep',
        animated: false
      })
    }

    node.children.forEach(child => {
      visitNode(child, organNodeId)
    })

    node.entries.forEach(entry => {
      const entryNodeId = `classic-entry-${node.organ.address}-${entry.index}`

      nodes.push({
        id: entryNodeId,
        type: 'classicEntry',
        data: {
          type: 'entry',
          entry
        },
        position: { x: 0, y: 0 }
      })

      edges.push({
        id: `classic-edge-${organNodeId}-${entryNodeId}`,
        source: organNodeId,
        target: entryNodeId,
        type: 'smoothstep',
        animated: false
      })
    })
  }

  forest.forEach(node => {
    visitNode(node)
  })

  return {
    nodes: layoutClassicNodes(nodes, edges),
    edges
  }
}

export interface ClassicOrgChartProps {
  organigram: OrganigramJson | null
  controls?: boolean
  isTabletOrAbove?: boolean
  onClickOrgan?: (organ: OrganJson) => void
  style?: Record<string, unknown>
}

export const ClassicOrgChart: React.FC<ClassicOrgChartProps> = ({
  organigram,
  controls = true,
  isTabletOrAbove = true,
  onClickOrgan,
  style
}) => {
  const forest = useMemo(
    () =>
      organigram == null ? [] : projectOrganigramToClassicForest(organigram),
    [organigram]
  )
  const flow = useMemo(
    () =>
      buildClassicFlow({
        forest,
        onClickOrgan
      }),
    [forest, onClickOrgan]
  )

  if (organigram == null) {
    return null
  }

  return (
    <Box
      id={makeTestId('classic-org-chart')}
      sx={{
        height: `calc(100vh - ${isTabletOrAbove ? workspaceNavHeight : 0}px)`,
        background:
          'linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 38%)',
        ...style
      }}
    >
      <NoSsr>
        <ReactFlow
          nodes={flow.nodes}
          edges={flow.edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          selectNodesOnDrag={false}
          zoomOnScroll
          zoomOnPinch
          panOnScroll
          fitView
          defaultZoom={0.9}
          minZoom={0.2}
          maxZoom={1.5}
        >
          <Background gap={16} />
          {controls === true && <Controls showInteractive={false} />}
        </ReactFlow>
      </NoSsr>
    </Box>
  )
}

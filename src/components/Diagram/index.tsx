import React, { useState, useCallback, useMemo } from 'react'
import {
  OrganigramJson,
  OrganJson,
  AssetJson,
  ProcedureJson,
  getPermissionsSet,
  getSourcesAndTargets,
  Organ,
  Procedure,
  SourceOrgan,
  TargetOrgan,
  type Asset,
  Organigram
} from '@organigram/js'
import { Signer } from 'ethers'
import dagre from 'dagre'
import ReactFlow, {
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  type Node,
  type Edge,
  type Position,
  Background,
  type ReactFlowProps,
  type NodeChange,
  type Connection,
  type EdgeChange,
  type NodeProps,
  type NodeTypes
} from 'react-flow-renderer'
import { NoSsr } from '@mui/material'

import { useLayers } from '../../hooks/useLayers'
import { mobileNavHeight } from '../../theme'
import { ProcedureNode } from './ProcedureNode'
import { OrganNode } from './OrganNode'
import { AssetNode } from './AssetNode'

export interface DiagramProps {
  nodeTypes?: NodeTypes
  direction?: string
  organigram: OrganigramJson | null
  style?: Record<string, unknown>
  controls?: boolean
  options?: ReactFlowProps
  signer?: Signer | null
  isTabletOrAbove?: boolean
  onClickOrgan: (organ: OrganJson) => void
  onClickAsset: (asset: AssetJson) => void
  onClickProcedure: (procedure: ProcedureJson) => void
  onOrganDeployed?: (organ: OrganJson) => void
  onAssetDeployed?: (asset: AssetJson) => void
  onProcedureDeployed?: (procedure: ProcedureJson) => void
}

export const defaultNodeTypes = {
  procedure: ProcedureNode as React.FC<NodeProps<{ procedure: Procedure }>>,
  organ: OrganNode as React.FC<NodeProps<{ organ: Organ }>>,
  asset: AssetNode as React.FC<NodeProps<{ asset: Asset }>>
}
const nodeWidth = 256
const procedureNodeHeight = 48
const organNodeHeight = 104
const gridUnitSize = 16
const snapGrid: [number, number] = [gridUnitSize, gridUnitSize]

const autodistribute: (
  nodes: Node[],
  edges: Edge[],
  direction: string
) => Node[] = (nodes, edges, direction) => {
  const isHorizontal = direction === 'LR'
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })

  nodes.forEach((node: Node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: node.type === 'procedure' ? procedureNodeHeight : organNodeHeight
    })
  })

  edges.forEach((edge: Edge) => {
    if (edge != null) dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node: Node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = (isHorizontal ? 'left' : 'top') as Position
    node.sourcePosition = (isHorizontal ? 'right' : 'bottom') as Position
    node.position = {
      x: Math.floor((nodeWithPosition.x - nodeWidth / 2) / 16) * 16,
      y:
        Math.floor(
          (nodeWithPosition.y -
            (node.type === 'procedure'
              ? procedureNodeHeight
              : organNodeHeight) /
              2) /
            16
        ) * 16
    }

    return node
  })

  return nodes
}

export const Diagram: React.FC<DiagramProps> = ({
  nodeTypes = defaultNodeTypes,
  direction = 'TB',
  organigram,
  style,
  controls,
  options,
  isTabletOrAbove,
  onClickOrgan,
  onClickProcedure,
  onClickAsset
}) => {
  const organigramWithSourcesAndTargets = new Organigram(
    getSourcesAndTargets(organigram!)
  )

  const [layers] = useLayers()
  const organsNodes = useMemo(
    () =>
      organigramWithSourcesAndTargets?.organs?.map(organ => ({
        id: `organ-${organ.address}`,
        type: 'organ',
        position: { x: 0, y: 0 },
        data: { organ, onClick: onClickOrgan }
      })) ?? [],
    [organigramWithSourcesAndTargets?.organs, onClickOrgan]
  )

  const proceduresNodes = useMemo(
    () =>
      organigramWithSourcesAndTargets?.procedures?.map(procedure => ({
        id: `procedure-${procedure.address}`,
        type: 'procedure',
        position: { x: 0, y: 0 },
        data: { procedure, onClick: onClickProcedure }
      })) ?? [],
    [organigramWithSourcesAndTargets?.procedures, onClickProcedure]
  )

  const assetsNodes = useMemo(
    () =>
      organigramWithSourcesAndTargets?.assets?.map(asset => ({
        id: `asset-${asset.address}`,
        type: 'asset',
        position: { x: 0, y: 0 },
        data: { asset, onClick: onClickAsset }
      })) ?? [],
    [organigramWithSourcesAndTargets?.assets, onClickAsset]
  )

  const initialEdges = useMemo(
    () =>
      (proceduresNodes
        ?.map((procedureNode, index) => {
          const procedure = procedureNode.data.procedure
          if (procedure == null) {
            return null
          }
          const procedureSources =
            procedure.sourceOrgans
              ?.filter(sourceOrgan =>
                // layers[0].showAdminPermissions &&
                sourceOrgan.organAddress != null &&
                procedure.targetOrgans?.find(
                  (targetOrgan: TargetOrgan) =>
                    getPermissionsSet(targetOrgan.permissionValue).findIndex(
                      i =>
                        [
                          'ALL_PERMISSIONS',
                          'ADD_PERMISSIONS',
                          'REMOVE_PERMISSIONS'
                        ].includes(i)
                    ) >= 0
                ) != null
                  ? true
                  : layers[0].showEntriesPermissions &&
                      procedure.targetOrgans?.find(
                        (targetOrgan: TargetOrgan) =>
                          getPermissionsSet(
                            targetOrgan.permissionValue
                          ).findIndex(i =>
                            [
                              'ALL_ENTRIES',
                              'ADD_ENTRIES',
                              'REMOVE_ENTRIES'
                            ].includes(i)
                          ) >= 0
                      ) != null
                    ? true
                    : layers[0].showAssetsPermissions &&
                      procedure.targetOrgans?.find(
                        (targetOrgan: TargetOrgan) =>
                          getPermissionsSet(
                            targetOrgan.permissionValue
                          ).findIndex(i =>
                            [
                              'DEPOSIT_ETHER',
                              'WITHDRAW_ETHER',
                              'DEPOSIT_COINS',
                              'WITHDRAW_COINS',
                              'DEPOSIT_COLLECTIBLES',
                              'WITHDRAW_COLLECTIBLES'
                            ].includes(i)
                          ) >= 0
                      ) != null
              )
              ?.map((sourceOrgan: SourceOrgan, idx: number) => {
                const sourceNode = organsNodes?.find(
                  organNode =>
                    organNode?.data?.organ?.address === sourceOrgan.organAddress
                )
                if (sourceNode != null) {
                  return {
                    id: `procedure-${index}-source-${idx}`,
                    source: sourceNode.id,
                    target: procedureNode.id
                  }
                }
                return null
              })
              .filter(s => s != null) ?? []
          const erc20Asset = procedure.sourceOrgans?.find(
            source => source.assetAddress != null
          )
          const tokenSource =
            erc20Asset == null
              ? []
              : [
                  {
                    id: `procedure-${index}-source-token`,
                    source: assetsNodes.find(
                      node =>
                        node.data.asset.address === erc20Asset.assetAddress
                    )?.id,
                    target: procedureNode.id
                  }
                ]
          const procedureDestinations =
            procedure.targetOrgans
              ?.filter((targetOrgan: TargetOrgan) =>
                layers[0].showAdminPermissions &&
                getPermissionsSet(targetOrgan.permissionValue).findIndex(i =>
                  [
                    'ALL_PERMISSIONS',
                    'ADD_PERMISSIONS',
                    'REMOVE_PERMISSIONS'
                  ].includes(i)
                ) >= 0
                  ? true
                  : layers[0].showEntriesPermissions &&
                      getPermissionsSet(targetOrgan.permissionValue).findIndex(
                        i =>
                          [
                            'ALL_ENTRIES',
                            'ADD_ENTRIES',
                            'REMOVE_ENTRIES'
                          ].includes(i)
                      ) >= 0
                    ? true
                    : getPermissionsSet(targetOrgan.permissionValue).findIndex(
                        i =>
                          [
                            'DEPOSIT_ETHER',
                            'WITHDRAW_ETHER',
                            'DEPOSIT_COINS',
                            'WITHDRAW_COINS',
                            'DEPOSIT_COLLECTIBLES',
                            'WITHDRAW_COLLECTIBLES'
                          ].includes(i)
                      ) >= 0
              )
              ?.map((targetOrgan: TargetOrgan, idx: number) => {
                const destinationNode = organsNodes?.find(
                  organNode =>
                    organNode?.data?.organ?.address === targetOrgan.organAddress
                )
                if (destinationNode != null) {
                  return {
                    id: `procedure-${index}-target-${idx}`,
                    source: procedureNode.id,
                    target: destinationNode.id,
                    animated: true
                  }
                }
                return null
              }) ?? []
          return [...procedureSources, ...tokenSource, ...procedureDestinations]
        })
        .flat() as Edge[]) ?? [],
    [layers, organsNodes, proceduresNodes, assetsNodes]
  )

  const distributedNodes = autodistribute(
    [...organsNodes, ...proceduresNodes, ...assetsNodes],
    [...initialEdges],
    direction
  )
  const [nodes, setNodes] = useState(distributedNodes)
  const [edges, setEdges] = useState(initialEdges)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds: Node[]) =>
        applyNodeChanges(
          changes.filter(c => c != null),
          nds
        )
      )
    },
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds: Edge[]) => applyEdgeChanges(changes, eds))
    },
    [setEdges]
  )
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds: Edge[]) => addEdge(connection, eds))
    },
    [setEdges]
  )

  // useEffect(() => {
  //   const distributedNodes = autodistribute(
  //     [...organsNodes, ...proceduresNodes, ...assetsNodes],
  //     initialEdges,
  //     direction
  //   )
  //   setNodes([...distributedNodes])
  //   setEdges(initialEdges)
  // }, [])
  return (
    <NoSsr>
      <ReactFlow
        {...{
          nodes: nodes.map(n => ({
            ...n,
            data: {
              ...n.data,
              position: n.position
            }
          })),
          edges,
          onNodesChange,
          onEdgesChange,
          onConnect,
          nodeTypes,
          snapGrid,
          snapToGrid: true,
          minZoom: 0.1,
          style,
          fitView: true,
          ...options
        }}
      >
        <Background gap={16} />
        {controls === true && (
          <Controls
            showInteractive={false}
            style={{
              top: isTabletOrAbove
                ? '24px'
                : `calc(24px + ${mobileNavHeight.toString()}px)`,
              right: isTabletOrAbove ? '48px' : '4vw',
              left: 'unset',
              height: '81px'
            }}
          />
        )}
      </ReactFlow>
    </NoSsr>
  )
}

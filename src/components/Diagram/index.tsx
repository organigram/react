import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
  OrganJson,
  AssetJson,
  ProcedureJson,
  getPermissionsSet,
  Organ,
  Procedure,
  defaultOrganigramEdgeType,
  type OrganigramEdgeType,
  type OrganigramNodePositions,
  type Asset,
  type OrganigramJson
} from '@organigram/js'
import ReactFlow, {
  Controls,
  ConnectionLineType,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  type Node,
  type Edge,
  Background,
  type ReactFlowProps,
  type NodeChange,
  type Connection,
  type EdgeChange,
  type NodeProps,
  type NodeDragHandler,
  type NodeTypes
} from 'react-flow-renderer'
import NoSsr from '@mui/material/NoSsr'

import {
  defaultDiagramDisplayOptions,
  type DiagramDisplayOptions
} from '../../hooks/useDiagramDisplayOptions'
import { mobileNavHeight } from '../../theme'
import { ProcedureNode } from './ProcedureNode'
import { OrganNode } from './OrganNode'
import { AssetNode } from './AssetNode'
import { autodistribute } from './layout'

/**
 * Props accepted by the default `Diagram` component.
 */
export interface DiagramProps {
  nodeTypes?: NodeTypes
  direction?: string
  edgeType?: OrganigramEdgeType
  organigram: OrganigramJson | null
  onNodePositionsChange?: (nodePositions: OrganigramNodePositions) => void
  style?: Record<string, unknown>
  controls?: boolean
  options?: ReactFlowProps
  isTabletOrAbove?: boolean
  onClickOrgan?: (organ: OrganJson) => void
  onClickAsset?: (asset: AssetJson) => void
  onClickProcedure?: (procedure: ProcedureJson) => void
  onOrganDeployed?: (organ: OrganJson) => void
  onAssetDeployed?: (asset: AssetJson) => void
  onProcedureDeployed?: (procedure: ProcedureJson) => void
  translateLabel?: (label: string) => string
  displayOptions?: DiagramDisplayOptions
}

/**
 * Default React Flow node registry used by the diagram component.
 */
export const defaultNodeTypes = {
  procedure: ProcedureNode as React.FC<NodeProps<{ procedure: Procedure }>>,
  organ: OrganNode as React.FC<NodeProps<{ organ: Organ }>>,
  asset: AssetNode as React.FC<NodeProps<{ asset: Asset }>>
}
const gridUnitSize = 16
const snapGrid: [number, number] = [gridUnitSize, gridUnitSize]

const getOrganPositionKey = (address: string): string => `organ:${address}`
const getProcedurePositionKey = (address: string): string =>
  `procedure:${address}`
const getAssetPositionKey = (address: string): string => `asset:${address}`

const getConnectionLineType = (
  edgeType: OrganigramEdgeType
): ConnectionLineType => {
  switch (edgeType) {
    case 'default':
      return ConnectionLineType.Bezier
    case 'straight':
      return ConnectionLineType.Straight
    case 'step':
      return ConnectionLineType.Step
    // case 'simplebezier':
    //   return ConnectionLineType.SimpleBezier
    case 'smoothstep':
    default:
      return ConnectionLineType.SmoothStep
  }
}

const applyStoredNodePositions = (
  nodes: Node[],
  storedNodePositions: OrganigramNodePositions
): Node[] =>
  nodes.map(node => {
    const positionKey = (node.data as { positionKey?: string } | undefined)
      ?.positionKey
    const storedPosition =
      positionKey == null ? undefined : storedNodePositions[positionKey]

    return storedPosition == null
      ? node
      : {
          ...node,
          position: storedPosition
        }
  })

/**
 * Render an organigram as a React Flow diagram with automatic layout.
 *
 * @param props Diagram configuration, callbacks, and the serialized organigram to render.
 */
export const Diagram: React.FC<DiagramProps> = ({
  nodeTypes = defaultNodeTypes,
  direction = 'TB',
  edgeType,
  organigram,
  onNodePositionsChange,
  style,
  controls,
  options,
  isTabletOrAbove,
  onClickOrgan,
  onClickProcedure,
  onClickAsset,
  translateLabel,
  displayOptions = defaultDiagramDisplayOptions
}) => {
  const {
    defaultEdgeOptions: optionDefaultEdgeOptions,
    connectionLineType: optionConnectionLineType,
    ...reactFlowOptions
  } = options ?? {}
  const selectedEdgeType =
    (optionDefaultEdgeOptions?.type as OrganigramEdgeType | undefined) ??
    edgeType ??
    organigram?.edgeType ??
    defaultOrganigramEdgeType
  const storedNodePositions = useMemo(
    () => organigram?.nodePositions ?? {},
    [organigram?.nodePositions]
  )
  const organsNodes = useMemo(
    () =>
      organigram?.organs?.map(organ => ({
        id: `organ-${organ.address}`,
        type: 'organ',
        position: storedNodePositions[getOrganPositionKey(organ.address)] ?? {
          x: 0,
          y: 0
        },
        data: {
          organ,
          onClick: onClickOrgan,
          translateLabel,
          positionKey: getOrganPositionKey(organ.address)
        }
      })) ?? [],
    [organigram?.organs, onClickOrgan, storedNodePositions, translateLabel]
  )

  const proceduresNodes = useMemo(
    () =>
      organigram?.procedures?.map(procedure => ({
        id: `procedure-${procedure.address}`,
        type: 'procedure',
        position: storedNodePositions[
          getProcedurePositionKey(procedure.address)
        ] ?? {
          x: 0,
          y: 0
        },
        data: {
          procedure,
          onClick: onClickProcedure,
          translateLabel,
          organigram,
          positionKey: getProcedurePositionKey(procedure.address)
        }
      })) ?? [],
    [organigram, onClickProcedure, storedNodePositions, translateLabel]
  )

  const assetsNodes = useMemo(
    () =>
      organigram?.assets?.map(asset => ({
        id: `asset-${asset.address}`,
        type: 'asset',
        position: storedNodePositions[getAssetPositionKey(asset.address)] ?? {
          x: 0,
          y: 0
        },
        data: {
          asset,
          onClick: onClickAsset,
          translateLabel,
          positionKey: getAssetPositionKey(asset.address)
        }
      })) ?? [],
    [organigram?.assets, onClickAsset, storedNodePositions, translateLabel]
  )

  const initialEdges = useMemo(
    () =>
      (proceduresNodes
        ?.map((procedureNode, index) => {
          const procedure = procedureNode.data.procedure
          if (procedure == null) {
            return null
          }
          const targetPermissions =
            organsNodes?.flatMap(organNode => {
              const organ = organNode.data?.organ
              if (!organ?.permissions) return []
              return organ.permissions
                .filter(
                  permission =>
                    permission.permissionAddress === procedure.address
                )
                .map(permission => ({
                  organAddress: organ.address,
                  permissionValue: permission.permissionValue
                }))
            }) ?? []
          const hasAdminPermissions = targetPermissions.some(targetOrgan =>
            getPermissionsSet(targetOrgan.permissionValue).some(i =>
              [
                'ALL_PERMISSIONS',
                'ADD_PERMISSIONS',
                'REMOVE_PERMISSIONS'
              ].includes(i)
            )
          )
          const hasEntriesPermissions = targetPermissions.some(targetOrgan =>
            getPermissionsSet(targetOrgan.permissionValue).some(i =>
              ['ALL_ENTRIES', 'ADD_ENTRIES', 'REMOVE_ENTRIES'].includes(i)
            )
          )
          const hasAssetsPermissions = targetPermissions.some(targetOrgan =>
            getPermissionsSet(targetOrgan.permissionValue).some(i =>
              [
                'DEPOSIT_ETHER',
                'WITHDRAW_ETHER',
                'DEPOSIT_COINS',
                'WITHDRAW_COINS',
                'DEPOSIT_COLLECTIBLES',
                'WITHDRAW_COLLECTIBLES'
              ].includes(i)
            )
          )
          const governingAssets = (organigram?.assets ?? []).filter(
            asset =>
              asset.kind === 'equity' &&
              asset.decisionProcedure?.toLowerCase() ===
                procedure.address.toLowerCase()
          )
          const shouldShowSources =
            hasAdminPermissions ||
            (displayOptions.showEntriesPermissions && hasEntriesPermissions) ||
            (displayOptions.showAssetsPermissions && hasAssetsPermissions) ||
            governingAssets.length > 0
          const sourceOrganAddresses = Array.from(
            new Set(
              [
                procedure.deciders,
                procedure.proposers,
                procedure.moderators
              ].filter(Boolean) as string[]
            )
          )
          const procedureSources = shouldShowSources
            ? sourceOrganAddresses
                .map((sourceAddress, idx) => {
                  const sourceNode = organsNodes?.find(
                    organNode =>
                      organNode?.data?.organ?.address === sourceAddress
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
                .filter(s => s != null)
            : []
          const procedureData = JSON.parse(procedure.data ?? '{}')
          const tokenAssets = Array.from(
            new Set(
              [procedureData.erc20].filter(
                (address): address is string =>
                  typeof address === 'string' && address !== ''
              )
            )
          )
          const tokenSource = tokenAssets.flatMap((tokenAsset, tokenIndex) => {
            const assetNode = assetsNodes.find(
              node => node.data.asset.address === tokenAsset
            )
            return assetNode == null
              ? []
              : [
                  {
                    id: `procedure-${index}-source-token-${tokenIndex}`,
                    source: assetNode.id,
                    target: procedureNode.id
                  }
                ]
          })
          const settlementDestinations = governingAssets.flatMap(
            (asset, assetIndex) => {
              const assetNode = assetsNodes.find(
                node => node.data.asset.address === asset.address
              )
              return assetNode == null
                ? []
                : [
                    {
                      id: `procedure-${index}-settlement-${assetIndex}`,
                      source: procedureNode.id,
                      target: assetNode.id,
                      animated: true
                    }
                  ]
            }
          )
          const registerDestinations = governingAssets.flatMap(
            (asset, assetIndex) => {
              const assetNode = assetsNodes.find(
                node => node.data.asset.address === asset.address
              )
              const registerNode = organsNodes.find(
                node =>
                  node.data.organ.address ===
                  procedureData.equityTransferRegister
              )
              return assetNode == null || registerNode == null
                ? []
                : [
                    {
                      id: `procedure-${index}-register-${assetIndex}`,
                      source: procedureNode.id,
                      target: registerNode.id,
                      animated: true
                    }
                  ]
            }
          )
          const procedureDestinations =
            targetPermissions
              ?.filter(targetOrgan =>
                displayOptions.showAdminPermissions &&
                getPermissionsSet(targetOrgan.permissionValue).findIndex(i =>
                  [
                    'ALL_PERMISSIONS',
                    'ADD_PERMISSIONS',
                    'REMOVE_PERMISSIONS'
                  ].includes(i)
                ) >= 0
                  ? true
                  : displayOptions.showEntriesPermissions &&
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
              ?.map((targetOrgan, idx: number) => {
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
          return [
            ...procedureSources,
            ...tokenSource,
            ...procedureDestinations,
            ...settlementDestinations,
            ...registerDestinations
          ]
        })
        .flat() as Edge[]) ?? [],
    [
      displayOptions,
      organsNodes,
      proceduresNodes,
      assetsNodes,
      organigram?.assets
    ]
  )

  const layoutEdges = useMemo(() => {
    const edgesByEndpoints = new Map<string, Edge>()
    const addLayoutEdge = (edge: Edge) => {
      const key = `${edge.source}\u0000${edge.target}`
      const existingEdge = edgesByEndpoints.get(key)
      if (
        existingEdge == null ||
        (edge.data as { layoutRole?: string } | undefined)?.layoutRole ===
          'decider'
      ) {
        edgesByEndpoints.set(key, edge)
      }
    }

    initialEdges.forEach(addLayoutEdge)
    proceduresNodes.forEach((procedureNode, procedureIndex) => {
      const procedure = procedureNode.data.procedure
      const sourceRoles = [
        { address: procedure.deciders, layoutRole: 'decider' as const },
        { address: procedure.proposers },
        { address: procedure.moderators }
      ]
      sourceRoles.forEach(({ address: sourceAddress, layoutRole }) => {
        if (sourceAddress == null || sourceAddress === '') return
        const sourceNode = organsNodes.find(
          organNode => organNode.data.organ.address === sourceAddress
        )
        if (sourceNode == null) return
        addLayoutEdge({
          id: `layout-procedure-${procedureIndex}-source-${sourceAddress}`,
          source: sourceNode.id,
          target: procedureNode.id,
          ...(layoutRole == null ? {} : { data: { layoutRole } })
        })
      })

      organsNodes.forEach((organNode, organIndex) => {
        if (
          !organNode.data.organ.permissions?.some(
            permission => permission.permissionAddress === procedure.address
          )
        ) {
          return
        }
        addLayoutEdge({
          id: `layout-procedure-${procedureIndex}-target-${organIndex}`,
          source: procedureNode.id,
          target: organNode.id
        })
      })
    })

    return Array.from(edgesByEndpoints.values())
  }, [initialEdges, organsNodes, proceduresNodes])

  const distributedNodes = useMemo(
    () =>
      applyStoredNodePositions(
        autodistribute(
          [...organsNodes, ...proceduresNodes, ...assetsNodes],
          layoutEdges,
          direction
        ),
        storedNodePositions
      ),
    [
      organsNodes,
      proceduresNodes,
      assetsNodes,
      layoutEdges,
      direction,
      storedNodePositions
    ]
  )
  const [nodes, setNodes] = useState(() => distributedNodes)
  const [edges, setEdges] = useState(initialEdges)

  const getCurrentNodePositions = useCallback(
    (currentNodes: Node[]): OrganigramNodePositions =>
      Object.fromEntries(
        currentNodes.flatMap(node => {
          const positionKey = (
            node.data as { positionKey?: string } | undefined
          )?.positionKey

          if (positionKey == null) {
            return []
          }

          return [[positionKey, { x: node.position.x, y: node.position.y }]]
        })
      ),
    []
  )

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
  const onNodeDragStop = useCallback<NodeDragHandler>(
    (_event, draggedNode, currentNodes) => {
      if (onNodePositionsChange == null) {
        return
      }

      onNodePositionsChange(
        getCurrentNodePositions(
          currentNodes.map(node =>
            node.id === draggedNode.id
              ? {
                  ...node,
                  position: draggedNode.position
                }
              : node
          )
        )
      )
    },
    [getCurrentNodePositions, onNodePositionsChange]
  )

  useEffect(() => {
    setNodes([...distributedNodes])
    setEdges(initialEdges)
  }, [distributedNodes, initialEdges])

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
          onNodeDragStop,
          onConnect,
          nodeTypes,
          snapGrid,
          snapToGrid: true,
          minZoom: 0.1,
          style,
          fitView: true,
          ...reactFlowOptions,
          defaultEdgeOptions: {
            ...optionDefaultEdgeOptions,
            type: selectedEdgeType
          },
          connectionLineType:
            optionConnectionLineType ?? getConnectionLineType(selectedEdgeType)
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

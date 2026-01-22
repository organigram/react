import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getPermissionsSet } from '@organigram/js';
import dagre from 'dagre';
import ReactFlow, { Controls, applyEdgeChanges, applyNodeChanges, addEdge, Background } from 'react-flow-renderer';
import { NoSsr } from '@mui/material';
import { useLayers } from '../../hooks/diagram';
import { mobileNavHeight } from '../../ui';
import { ProcedureNode } from './ProcedureNode';
import { OrganNode } from './OrganNode';
import { AssetNode } from './AssetNode';
export const defaultNodeTypes = {
    procedure: ProcedureNode,
    organ: OrganNode,
    asset: AssetNode
};
const nodeWidth = 256;
const procedureNodeHeight = 48;
const organNodeHeight = 104;
const gridUnitSize = 16;
const snapGrid = [gridUnitSize, gridUnitSize];
const autodistribute = (nodes, edges, direction) => {
    const isHorizontal = direction === 'LR';
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, {
            width: nodeWidth,
            height: node.type === 'procedure' ? procedureNodeHeight : organNodeHeight
        });
    });
    edges.forEach((edge) => {
        if (edge != null)
            dagreGraph.setEdge(edge.source, edge.target);
    });
    dagre.layout(dagreGraph);
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = (isHorizontal ? 'left' : 'top');
        node.sourcePosition = (isHorizontal ? 'right' : 'bottom');
        node.position = {
            x: Math.floor((nodeWithPosition.x - nodeWidth / 2) / 16) * 16,
            y: Math.floor((nodeWithPosition.y -
                (node.type === 'procedure'
                    ? procedureNodeHeight
                    : organNodeHeight) /
                    2) /
                16) * 16
        };
        return node;
    });
    return nodes;
};
export const Diagram = ({ nodeTypes = defaultNodeTypes, direction, organigram, style, controls, options, signer, isTabletOrAbove, onClickOrgan, onClickProcedure, onClickAsset }) => {
    const [layers] = useLayers();
    const organsNodes = useMemo(() => organigram?.organs?.map((organ, index) => ({
        id: `organ-${index}`,
        type: 'organ',
        position: { x: 0, y: 0 },
        data: { organ, onClick: onClickOrgan }
    })) ?? [], [organigram?.organs, onClickOrgan]);
    const proceduresNodes = useMemo(() => organigram?.procedures?.map((procedure, index) => ({
        id: `procedure-${index}`,
        type: 'procedure',
        position: { x: 0, y: 0 },
        data: { procedure, onClick: onClickProcedure }
    })) ?? [], [organigram?.procedures, onClickProcedure]);
    const assetsNodes = useMemo(() => organigram?.assets?.map((asset, index) => ({
        id: `asset-${index}`,
        type: 'asset',
        position: { x: 0, y: 0 },
        data: { asset, onClick: onClickAsset }
    })) ?? [], [organigram?.assets, onClickAsset]);
    const initialEdges = useMemo(() => proceduresNodes
        ?.map((procedureNode, index) => {
        const procedure = procedureNode.data.procedure;
        if (procedure == null) {
            return null;
        }
        const procedureSources = procedure.sourceOrgans
            ?.filter(sourceOrgan => sourceOrgan.organId != null &&
            procedure.targetOrgans.find((targetOrgan) => getPermissionsSet(targetOrgan.permissions).findIndex(i => [
                'ALL_PROCEDURES',
                'ADD_PROCEDURES',
                'REMOVE_PROCEDURES'
            ].includes(i)) >= 0) != null
            ? true
            : layers[0].showEntriesPermissions &&
                procedure.targetOrgans.find((targetOrgan) => getPermissionsSet(targetOrgan.permissions).findIndex(i => [
                    'ALL_ENTRIES',
                    'ADD_ENTRIES',
                    'REMOVE_ENTRIES'
                ].includes(i)) >= 0) != null
                ? true
                : layers[0].showAssetsPermissions &&
                    procedure.targetOrgans.find((targetOrgan) => getPermissionsSet(targetOrgan.permissions).findIndex(i => [
                        'DEPOSIT_ETHER',
                        'WITHDRAW_ETHER',
                        'DEPOSIT_COINS',
                        'WITHDRAW_COINS',
                        'DEPOSIT_COLLECTIBLES',
                        'WITHDRAW_COLLECTIBLES'
                    ].includes(i)) >= 0) != null)
            ?.map((sourceOrgan, idx) => {
            const sourceNode = organsNodes?.find(organNode => organNode?.data?.organ?.id === sourceOrgan.organId);
            if (sourceNode != null) {
                return {
                    id: `procedure-${index}-source-${idx}`,
                    source: sourceNode.id,
                    target: procedureNode.id
                };
            }
            return null;
        })
            .filter(s => s != null) ?? [];
        const erc20Asset = procedure.sourceOrgans.find(source => source.assetId != null);
        const tokenSource = erc20Asset == null
            ? []
            : [
                {
                    id: `procedure-${index}-source-token`,
                    source: assetsNodes.find(node => node.data.asset.id === erc20Asset.assetId)?.id,
                    target: procedureNode.id
                }
            ];
        const procedureDestinations = procedure.targetOrgans
            ?.filter((targetOrgan) => layers[0].showAdminPermissions &&
            getPermissionsSet(targetOrgan.permissions).findIndex(i => [
                'ALL_PROCEDURES',
                'ADD_PROCEDURES',
                'REMOVE_PROCEDURES'
            ].includes(i)) >= 0
            ? true
            : layers[0].showEntriesPermissions &&
                getPermissionsSet(targetOrgan.permissions).findIndex(i => [
                    'ALL_ENTRIES',
                    'ADD_ENTRIES',
                    'REMOVE_ENTRIES'
                ].includes(i)) >= 0
                ? true
                : getPermissionsSet(targetOrgan.permissions).findIndex(i => [
                    'DEPOSIT_ETHER',
                    'WITHDRAW_ETHER',
                    'DEPOSIT_COINS',
                    'WITHDRAW_COINS',
                    'DEPOSIT_COLLECTIBLES',
                    'WITHDRAW_COLLECTIBLES'
                ].includes(i)) >= 0)
            ?.map((targetOrgan, idx) => {
            const destinationNode = organsNodes?.find(organNode => organNode?.data?.organ?.id === targetOrgan.organId);
            if (destinationNode != null) {
                return {
                    id: `procedure-${index}-target-${idx}`,
                    source: procedureNode.id,
                    target: destinationNode.id,
                    animated: true
                };
            }
            return null;
        }) ?? [];
        return [...procedureSources, ...tokenSource, ...procedureDestinations];
    })
        .flat() ?? [], [layers, organsNodes, proceduresNodes, assetsNodes]);
    const distributedNodes = autodistribute([...organsNodes, ...proceduresNodes, ...assetsNodes], [...initialEdges], direction);
    const [nodes, setNodes] = useState(distributedNodes);
    const [edges, setEdges] = useState(initialEdges);
    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes.filter(c => c != null), nds));
    }, [setNodes]);
    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, [setEdges]);
    const onConnect = useCallback((connection) => {
        setEdges((eds) => addEdge(connection, eds));
    }, [setEdges]);
    useEffect(() => {
        const distributedNodes = autodistribute([...organsNodes, ...proceduresNodes, ...assetsNodes], initialEdges, direction);
        setNodes([...distributedNodes]);
        setEdges(initialEdges);
    }, [direction, initialEdges, organsNodes, proceduresNodes, assetsNodes]);
    return (_jsx(NoSsr, { children: _jsxs(ReactFlow, { nodes: nodes.map(n => ({
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
            ...options, children: [_jsx(Background, { gap: 16 }), controls === true && (_jsx(Controls, { showInteractive: false, style: {
                        top: isTabletOrAbove
                            ? '24px'
                            : `calc(24px + ${mobileNavHeight.toString()}px)`,
                        right: isTabletOrAbove ? '48px' : '4vw',
                        left: 'unset',
                        height: '81px'
                    } }))] }) }));
};

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const js_1 = require("@organigram/js");
const dagre_1 = __importDefault(require("dagre"));
const react_flow_renderer_1 = __importStar(require("react-flow-renderer"));
const diagram_1 = require("../../hooks/diagram");
const ui_1 = require("../../ui");
const nodeWidth = 256;
const procedureNodeHeight = 48;
const organNodeHeight = 104;
const gridUnitSize = 16;
const snapGrid = [gridUnitSize, gridUnitSize];
const autodistribute = (nodes, edges, direction) => {
    const isHorizontal = direction === 'LR';
    const dagreGraph = new dagre_1.default.graphlib.Graph();
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
    dagre_1.default.layout(dagreGraph);
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
const Diagram = ({ direction, nodeTypes, organigram, style, controls, options, signer }) => {
    const isTabletOrAbove = (0, ui_1.useBreakpoint)('sm');
    const [layers] = (0, diagram_1.useLayers)();
    const organsNodes = (0, react_1.useMemo)(() => organigram?.organs?.map((organ, index) => ({
        id: `organ-${index}`,
        type: 'organ',
        position: { x: 0, y: 0 },
        data: { organ }
    })) ?? [], [organigram?.organs]);
    const proceduresNodes = (0, react_1.useMemo)(() => organigram?.procedures?.map((procedure, index) => ({
        id: `procedure-${index}`,
        type: 'procedure',
        position: { x: 0, y: 0 },
        data: { procedure }
    })) ?? [], [organigram?.procedures]);
    const assetsNodes = (0, react_1.useMemo)(() => organigram?.assets?.map((asset, index) => ({
        id: `asset-${index}`,
        type: 'asset',
        position: { x: 0, y: 0 },
        data: { asset }
    })) ?? [], [organigram?.assets]);
    const initialEdges = (0, react_1.useMemo)(() => proceduresNodes
        ?.map((procedureNode, index) => {
        const procedure = procedureNode.data.procedure;
        if (procedure == null) {
            return null;
        }
        const procedureSources = procedure.sourceOrgans
            ?.filter(sourceOrgan => 
        // layers[0].showAdminPermissions &&
        sourceOrgan.organId != null &&
            procedure.targetOrgans.find((targetOrgan) => (0, js_1.getPermissionsSet)(targetOrgan.permissions).findIndex(i => [
                'ALL_PROCEDURES',
                'ADD_PROCEDURES',
                'REMOVE_PROCEDURES'
            ].includes(i)) >= 0) != null
            ? true
            : layers[0].showEntriesPermissions &&
                procedure.targetOrgans.find((targetOrgan) => (0, js_1.getPermissionsSet)(targetOrgan.permissions).findIndex(i => [
                    'ALL_ENTRIES',
                    'ADD_ENTRIES',
                    'REMOVE_ENTRIES'
                ].includes(i)) >= 0) != null
                ? true
                : layers[0].showAssetsPermissions &&
                    procedure.targetOrgans.find((targetOrgan) => (0, js_1.getPermissionsSet)(targetOrgan.permissions).findIndex(i => [
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
            (0, js_1.getPermissionsSet)(targetOrgan.permissions).findIndex(i => [
                'ALL_PROCEDURES',
                'ADD_PROCEDURES',
                'REMOVE_PROCEDURES'
            ].includes(i)) >= 0
            ? true
            : layers[0].showEntriesPermissions &&
                (0, js_1.getPermissionsSet)(targetOrgan.permissions).findIndex(i => [
                    'ALL_ENTRIES',
                    'ADD_ENTRIES',
                    'REMOVE_ENTRIES'
                ].includes(i)) >= 0
                ? true
                : (0, js_1.getPermissionsSet)(targetOrgan.permissions).findIndex(i => [
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
    const [nodes, setNodes] = (0, react_1.useState)(distributedNodes);
    const [edges, setEdges] = (0, react_1.useState)(initialEdges);
    const onNodesChange = (0, react_1.useCallback)((changes) => {
        setNodes((nds) => (0, react_flow_renderer_1.applyNodeChanges)(changes.filter(c => c != null), nds));
    }, [setNodes]);
    const onEdgesChange = (0, react_1.useCallback)((changes) => {
        setEdges((eds) => (0, react_flow_renderer_1.applyEdgeChanges)(changes, eds));
    }, [setEdges]);
    const onConnect = (0, react_1.useCallback)((connection) => {
        setEdges((eds) => (0, react_flow_renderer_1.addEdge)(connection, eds));
    }, [setEdges]);
    (0, react_1.useEffect)(() => {
        const distributedNodes = autodistribute([...organsNodes, ...proceduresNodes, ...assetsNodes], initialEdges, direction);
        setNodes([...distributedNodes]);
        setEdges(initialEdges);
    }, [direction, initialEdges, organsNodes, proceduresNodes, assetsNodes]);
    return (react_1.default.createElement(react_flow_renderer_1.default, { nodes: nodes.map(n => ({
            ...n,
            data: { ...n.data, position: n.position }
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
        ...options },
        react_1.default.createElement(react_flow_renderer_1.Background, { gap: 16 }),
        controls === true && (react_1.default.createElement(react_flow_renderer_1.Controls, { showInteractive: false, style: {
                top: isTabletOrAbove
                    ? '24px'
                    : `calc(24px + ${ui_1.mobileNavHeight.toString()}px)`,
                right: isTabletOrAbove ? '48px' : '4vw',
                left: 'unset',
                height: '81px'
            } }))));
};
exports.default = Diagram;

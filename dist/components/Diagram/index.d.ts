import React from 'react';
import { type Asset } from '@organigram/js';
import { Signer } from 'ethers';
import { type ReactFlowProps, type NodeProps, type NodeTypes } from 'react-flow-renderer';
import { DiagramProcedure } from './ProcedureNode';
import { DiagramOrgan } from './OrganNode';
import { DiagramAsset } from './AssetNode';
export type SourceOrgan = {
    organId: string;
    procedureId: string;
    assetId?: string;
};
export type TargetOrgan = SourceOrgan & {
    permissions: number;
};
export interface DiagramOrganigram {
    organs: DiagramOrgan[];
    procedures: DiagramProcedure[];
    assets: DiagramAsset[];
}
export interface DiagramProps {
    nodeTypes?: NodeTypes;
    direction: string;
    organigram: DiagramOrganigram | null;
    style?: Record<string, unknown>;
    controls?: boolean;
    options?: ReactFlowProps;
    signer?: Signer | null;
    isTabletOrAbove?: boolean;
    onClickOrgan: (procedure: DiagramOrgan) => void;
    onClickProcedure: (procedure: DiagramProcedure) => void;
    onClickAsset: (procedure: DiagramAsset) => void;
}
export declare const defaultNodeTypes: {
    procedure: React.FC<NodeProps<{
        procedure: DiagramProcedure;
    }>>;
    organ: React.FC<NodeProps<{
        organ: DiagramOrgan;
    }>>;
    asset: React.FC<NodeProps<{
        asset: Asset;
    }>>;
};
export declare const Diagram: React.FC<DiagramProps>;

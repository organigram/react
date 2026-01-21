import React from 'react';
import { EnhancedProcedure, Organ, OrganEntry, type Asset, type Procedure } from '@organigram/js';
import { type NodeTypes, type ReactFlowProps } from 'react-flow-renderer';
import { Signer } from 'ethers';
export type SourceOrgan = {
    organId: string;
    procedureId: string;
    assetId: string;
};
export type TargetOrgan = SourceOrgan & {
    permissions: number;
};
export type DiagramOrgan = {
    id: string;
    name: string;
    description: string;
    entries: OrganEntry[];
    address?: string;
    deployed?: Organ;
};
export type DiagramAsset = Asset & {
    id: string;
};
export type DiagramProcedure = Procedure & {
    id: string;
    name: string;
    sourceOrgans: SourceOrgan[];
    targetOrgans: TargetOrgan[];
    deployed?: EnhancedProcedure;
};
export interface DiagramOrganigram {
    organs: DiagramOrgan[];
    procedures: DiagramProcedure[];
    assets: DiagramAsset[];
}
export interface DiagramProps {
    direction: string;
    nodeTypes: NodeTypes;
    organigram: DiagramOrganigram | null;
    style?: Record<string, unknown>;
    controls?: boolean;
    options?: ReactFlowProps;
    signer?: Signer | null;
    isTabletOrAbove?: boolean;
}
export declare const Diagram: React.FC<DiagramProps>;

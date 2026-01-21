import React from 'react';
import { Signer } from 'ethers';
import { type ReactFlowProps } from 'react-flow-renderer';
import { DiagramProcedure } from './ProcedureNode';
import { DiagramOrgan } from './OrganNode';
import { DiagramAsset } from './AssetNode';
export type SourceOrgan = {
    organId: string;
    procedureId: string;
    assetId: string;
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
    direction: string;
    organigram: DiagramOrganigram | null;
    style?: Record<string, unknown>;
    controls?: boolean;
    options?: ReactFlowProps;
    signer?: Signer | null;
    isTabletOrAbove?: boolean;
}
export declare const Diagram: React.FC<DiagramProps>;

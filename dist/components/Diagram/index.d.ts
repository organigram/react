import { default as React } from 'react';
import { EnhancedProcedure, Organ, Organigram, Procedure, Asset } from '@organigram/js';
import { Signer } from 'ethers';
import { ReactFlowProps, NodeProps, NodeTypes } from 'react-flow-renderer';
export interface OrganigramInput {
    organs: Organ[];
    procedures: Procedure[];
    assets: Asset[];
}
export interface DiagramProps {
    nodeTypes?: NodeTypes;
    direction?: string;
    organigram: Organigram | null;
    style?: Record<string, unknown>;
    controls?: boolean;
    options?: ReactFlowProps;
    signer?: Signer | null;
    isTabletOrAbove?: boolean;
    onClickOrgan: (organ: Organ) => void;
    onClickAsset: (asset: Asset) => void;
    onClickProcedure: (procedure: EnhancedProcedure) => void;
    onOrganDeployed?: (organ: Organ) => void;
    onAssetDeployed?: (asset: Asset) => void;
    onProcedureDeployed?: (procedure: EnhancedProcedure) => void;
}
export declare const defaultNodeTypes: {
    procedure: React.FC<NodeProps<{
        procedure: Procedure;
    }>>;
    organ: React.FC<NodeProps<{
        organ: Organ;
    }>>;
    asset: React.FC<NodeProps<{
        asset: Asset;
    }>>;
};
export declare const Diagram: React.FC<DiagramProps>;

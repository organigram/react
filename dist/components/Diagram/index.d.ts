import { default as React } from 'react';
import { OrganJson, AssetJson, ProcedureJson, Organ, Procedure, Asset, Organigram } from '@organigram/js';
import { Signer } from 'ethers';
import { ReactFlowProps, NodeProps, NodeTypes } from 'react-flow-renderer';
export interface DiagramProps {
    nodeTypes?: NodeTypes;
    direction?: string;
    organigram: Organigram | null;
    style?: Record<string, unknown>;
    controls?: boolean;
    options?: ReactFlowProps;
    signer?: Signer | null;
    isTabletOrAbove?: boolean;
    onClickOrgan: (organ: OrganJson) => void;
    onClickAsset: (asset: AssetJson) => void;
    onClickProcedure: (procedure: ProcedureJson) => void;
    onOrganDeployed?: (organ: OrganJson) => void;
    onAssetDeployed?: (asset: AssetJson) => void;
    onProcedureDeployed?: (procedure: ProcedureJson) => void;
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

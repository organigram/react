import { default as React } from 'react';
import { Organigram, ProcedureWithSourcesAndTargets } from '@organigram/js';
import { Signer } from 'ethers';
import { NodeProps } from 'react-flow-renderer';
export interface ProcedureNodeProps {
    hideHandles?: boolean;
    signer?: Signer | null;
    organigram?: Organigram;
}
export declare const ProcedureNode: React.FC<Partial<NodeProps<{
    procedure: ProcedureWithSourcesAndTargets;
    onClick?: (procedure: ProcedureWithSourcesAndTargets) => void;
}>> & ProcedureNodeProps>;

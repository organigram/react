import React from 'react';
import { EnhancedProcedure, Procedure } from '@organigram/js';
import { Signer } from 'ethers';
import { NodeProps } from 'react-flow-renderer';
import { DiagramOrganigram, SourceOrgan, TargetOrgan } from '.';
export type DiagramProcedure = Partial<Procedure> & {
    id: string;
    name: string;
    sourceOrgans: SourceOrgan[];
    targetOrgans: TargetOrgan[];
    deployed?: EnhancedProcedure;
};
export interface ProcedureNodeProps {
    hideHandles?: boolean;
    signer?: Signer | null;
    organigram?: DiagramOrganigram;
}
export declare const ProcedureNode: React.FC<Partial<NodeProps<{
    procedure: DiagramProcedure;
    onClick?: (procedure: DiagramProcedure) => void;
}>> & ProcedureNodeProps>;

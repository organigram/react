import React from 'react';
import { Position } from 'react-flow-renderer';
import { DiagramProcedure, DiagramOrganigram } from '.';
import { Signer } from 'ethers';
export interface ProcedureNodeProps {
    ProcedureIcon: React.FC<{
        style: any;
    }>;
    data: {
        procedure: DiagramProcedure;
    };
    sourcePosition?: Position;
    targetPosition?: Position;
    hideHandles?: boolean;
    onClick?: () => void;
    signer?: Signer | null;
    organigram: DiagramOrganigram;
}
export declare const ProcedureNode: React.FC<ProcedureNodeProps>;

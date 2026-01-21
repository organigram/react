import React from 'react';
import { Signer } from 'ethers';
import { Position } from 'react-flow-renderer';
import { DiagramOrgan } from '.';
export interface OrganNodeProps {
    SummitIcon: React.FC<{
        style: any;
    }>;
    data: {
        organ: DiagramOrgan;
        position?: {
            x: number;
            y: number;
        };
    };
    sourcePosition?: Position;
    targetPosition?: Position;
    hideHandles?: boolean;
    signer?: Signer | null;
    onClick?: () => void;
}
export declare const EntryCount: React.FC<{
    organ: DiagramOrgan;
    signer?: Signer | null;
}>;
export declare const OrganNode: React.FC<OrganNodeProps>;

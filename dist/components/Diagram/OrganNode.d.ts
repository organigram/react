import React from 'react';
import { Organ, OrganEntry } from '@organigram/js';
import { Signer } from 'ethers';
import { NodeProps } from 'react-flow-renderer';
export type DiagramOrgan = {
    id: string;
    name: string;
    description: string;
    entries: OrganEntry[];
    address?: string;
    deployed?: Organ;
};
export interface OrganNodeProps {
    data: {
        organ: DiagramOrgan;
        position?: {
            x: number;
            y: number;
        };
        onClick?: () => void;
    };
    hideHandles?: boolean;
    signer?: Signer | null;
}
export declare const EntryCount: React.FC<{
    organ: DiagramOrgan;
    signer?: Signer | null;
}>;
export declare const OrganNode: React.FC<NodeProps & OrganNodeProps>;

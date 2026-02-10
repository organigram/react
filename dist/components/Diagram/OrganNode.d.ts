import { default as React } from 'react';
import { Organ, OrganJson } from '@organigram/js';
import { Signer } from 'ethers';
import { NodeProps } from 'react-flow-renderer';
export interface OrganNodeProps {
    data: {
        organ: Organ;
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
    organ: OrganJson;
    signer?: Signer | null;
}>;
export declare const OrganNode: React.FC<Partial<NodeProps> & OrganNodeProps>;

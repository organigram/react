import { default as React } from 'react';
import { Organ, OrganJson } from '@organigram/js';
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
}
export declare const EntryCount: React.FC<{
    organ: OrganJson;
}>;
export declare const OrganNode: React.FC<Partial<NodeProps> & OrganNodeProps>;

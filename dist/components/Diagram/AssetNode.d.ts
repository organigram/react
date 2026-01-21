import React from 'react';
import { Asset } from '@organigram/js';
import { NodeProps } from 'react-flow-renderer';
export type DiagramAsset = Asset & {
    id: string;
    address: string;
    name: string;
};
export interface AssetNodeProps {
    Token: React.FC<{
        style: any;
    }>;
    data: {
        asset: DiagramAsset;
    };
    hideHandles?: boolean;
    onClick: (asset: DiagramAsset) => void;
}
export declare const AssetNode: React.FC<NodeProps & AssetNodeProps>;

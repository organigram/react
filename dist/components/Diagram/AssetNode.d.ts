import React from 'react';
import { Asset } from '@organigram/js';
import { NodeProps } from 'react-flow-renderer';
export type DiagramAsset = Partial<Asset> & {
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
        onClick?: (asset: DiagramAsset) => void;
    };
    hideHandles?: boolean;
}
export declare const AssetNode: React.FC<NodeProps & AssetNodeProps>;

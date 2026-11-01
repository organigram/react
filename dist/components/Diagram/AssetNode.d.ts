import { default as React } from 'react';
import { Asset } from '@organigram/js';
import { NodeProps } from 'react-flow-renderer';
export interface AssetNodeProps {
    Token: React.FC<{
        style: any;
    }>;
    data: {
        asset: Asset;
        onClick?: (asset: Asset) => void;
        translateLabel?: (label: string) => string;
    };
    hideHandles?: boolean;
}
export declare const AssetNode: React.FC<NodeProps & AssetNodeProps>;

import React from 'react';
import { Position } from 'react-flow-renderer';
export interface Asset {
    address: string;
    name: string;
}
export interface AssetNodeProps {
    Token: React.FC<{
        style: any;
    }>;
    data: {
        asset: Asset;
    };
    sourcePosition?: Position;
    targetPosition?: Position;
    hideHandles?: boolean;
    onClick: (asset: Asset) => void;
}
export declare const AssetNode: React.FC<AssetNodeProps>;

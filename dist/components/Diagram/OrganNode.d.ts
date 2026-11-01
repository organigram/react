import { default as React } from 'react';
import { Organ, OrganJson } from '@organigram/js';
import { NodeProps } from 'react-flow-renderer';
export interface OrganNodeProps {
    data: {
        organ: Organ;
        entryUsers?: Record<string, DiagramEntryUser>;
        position?: {
            x: number;
            y: number;
        };
        isMaster?: boolean;
        onClick?: () => void;
        translateLabel?: (label: string) => string;
    };
    hideHandles?: boolean;
}
export type DiagramEntryUser = {
    image?: string | null;
    name?: string | null;
};
export declare const EntryCount: React.FC<{
    organ: OrganJson;
    translateLabel?: (label: string) => string;
}>;
export declare const MemberCount: React.FC<{
    organ: OrganJson;
    count: number;
    translateLabel?: (label: string) => string;
}>;
export type OrganNodeIconKind = 'master' | 'people' | 'funds' | 'documents';
export declare const getOrganNodeIconKind: ({ organ, hasUserEntries, isMaster }: {
    organ: OrganJson;
    hasUserEntries: boolean;
    isMaster: boolean;
}) => OrganNodeIconKind;
export declare const OrganNode: React.FC<Partial<NodeProps> & OrganNodeProps>;

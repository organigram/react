import { default as React } from 'react';
import { OrganigramJson, ProcedureJson } from '@organigram/js';
import { NodeProps } from 'react-flow-renderer';
export interface ProcedureNodeProps {
    hideHandles?: boolean;
    organigram?: OrganigramJson;
}
export declare const ProcedureNode: React.FC<Partial<NodeProps<{
    procedure: ProcedureJson;
    onClick?: (procedure: ProcedureJson) => void;
    organigram?: OrganigramJson;
}>> & ProcedureNodeProps>;

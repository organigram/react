import { OrganigramJson } from '@organigram/js';
import { WorkspaceAgentOrganigramPreview } from './types';
export type WorkspaceAgentPreviewLabels = {
    preview: string;
    confirmationNotice: string;
    organ: string;
    newOrgan: string;
    newProcedure: string;
    newAsset: string;
    newEntry: string;
    entry: string;
    organType: string;
    procedureType: string;
    assetType: string;
    cancel: string;
    confirm: string;
};
declare const defaultPreviewLabels: WorkspaceAgentPreviewLabels;
export declare const WorkspaceAgentPreview: React.FC<{
    preview: WorkspaceAgentOrganigramPreview;
    currentOrganigram: OrganigramJson | null;
    canConfirm: boolean;
    saving: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    labels?: Partial<WorkspaceAgentPreviewLabels>;
}>;
export { defaultPreviewLabels };

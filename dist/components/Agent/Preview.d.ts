import { OrganigramJson } from '@organigram/js';
import { OrganigramPreview } from './types';
export type PreviewLabels = {
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
declare const defaultPreviewLabels: PreviewLabels;
export declare const AgentPreview: React.FC<{
    preview: OrganigramPreview;
    currentOrganigram: OrganigramJson | null;
    canConfirm: boolean;
    saving: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    labels?: Partial<PreviewLabels>;
}>;
export { defaultPreviewLabels };

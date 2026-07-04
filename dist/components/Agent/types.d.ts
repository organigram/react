import { OrganigramJson } from '@organigram/js';
export type WorkspaceAgentMessage = {
    role: 'user' | 'assistant';
    content: string;
};
export type WorkspaceAgentThreadSource = 'workspace' | 'hero';
export type WorkspaceAgentCitation = {
    type: 'workspace' | 'organigram' | 'organ' | 'procedure' | 'asset' | 'notification' | 'file';
    id: string;
    label: string;
};
export type WorkspaceAgentMergeOrganigramPreview = {
    type: 'organigram';
    organigramId: string;
    persistence: 'merge-additive';
    summary: string[];
    organigram: OrganigramJson;
};
export type WorkspaceAgentNewOrganigramPreview = {
    type: 'new-organigram';
    persistence: 'create';
    summary: string[];
    organigram: OrganigramJson;
};
export type WorkspaceAgentOrganigramPreview = WorkspaceAgentMergeOrganigramPreview | WorkspaceAgentNewOrganigramPreview;
export type WorkspaceAgentResponse = {
    threadId?: string;
    message: string;
    citations: WorkspaceAgentCitation[];
    preview?: WorkspaceAgentOrganigramPreview;
};
export type WorkspaceAgentStoredMessage = WorkspaceAgentMessage & {
    id: string;
    createdAt: string;
    response?: WorkspaceAgentResponse;
};
export type WorkspaceAgentThread = {
    id: string;
    title: string;
    source: WorkspaceAgentThreadSource;
    currentOrganigramId?: string | null;
    createdAt: string;
    updatedAt: string;
    messages: WorkspaceAgentStoredMessage[];
};

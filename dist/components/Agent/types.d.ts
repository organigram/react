import { OrganigramJson } from '@organigram/js';
export type Message = {
    role: 'user' | 'assistant';
    content: string;
};
export type ThreadSource = 'workspace' | 'hero';
export type Citation = {
    type: 'workspace' | 'organigram' | 'organ' | 'procedure' | 'asset' | 'notification' | 'file';
    id: string;
    label: string;
};
export type MergeOrganigramPreview = {
    type: 'organigram';
    organigramId: string;
    persistence: 'merge-additive';
    summary: string[];
    organigram: OrganigramJson;
};
export type NewOrganigramPreview = {
    type: 'new-organigram';
    persistence: 'create';
    summary: string[];
    organigram: OrganigramJson;
};
export type OrganigramPreview = MergeOrganigramPreview | NewOrganigramPreview;
export type Response = {
    threadId?: string;
    message: string;
    citations: Citation[];
    preview?: OrganigramPreview;
};
export type StoredMessage = Message & {
    id: string;
    createdAt: string;
    response?: Response;
};
export type Thread = {
    id: string;
    title: string;
    source: ThreadSource;
    currentOrganigramId?: string | null;
    createdAt: string;
    updatedAt: string;
    messages: StoredMessage[];
};

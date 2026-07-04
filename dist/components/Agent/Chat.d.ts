export type WorkspaceAgentChatRole = 'user' | 'assistant';
export declare const WorkspaceAgentChatMessage: React.FC<{
    role: WorkspaceAgentChatRole;
    content: string;
    streaming?: boolean;
    thinkingLabel?: string;
}>;
export declare const WorkspaceAgentStreamBox: React.FC<{
    content: string;
    thinkingLabel?: string;
}>;

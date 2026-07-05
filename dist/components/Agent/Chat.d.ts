export type ChatRole = 'user' | 'assistant';
export declare const ChatMessage: React.FC<{
    role: ChatRole;
    content: string;
    streaming?: boolean;
    thinkingLabel?: string;
}>;
export declare const StreamBox: React.FC<{
    content: string;
    thinkingLabel?: string;
}>;

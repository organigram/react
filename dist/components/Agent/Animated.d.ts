import { CSSProperties, ReactNode } from 'react';
type WorkspaceAgentAnimatedProps = {
    visible?: boolean;
    delay?: number;
    children: ReactNode;
    translateY?: number;
    cursor?: CSSProperties['cursor'];
};
export declare const WorkspaceAgentAnimated: React.FC<WorkspaceAgentAnimatedProps>;
export {};

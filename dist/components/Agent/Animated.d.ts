import { CSSProperties, ReactNode } from 'react';
type AnimatedProps = {
    visible?: boolean;
    delay?: number;
    children: ReactNode;
    translateY?: number;
    cursor?: CSSProperties['cursor'];
    unmountOnExit?: boolean;
};
export declare const Animated: React.FC<AnimatedProps>;
export {};

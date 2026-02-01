import { default as React } from 'react';
import { VoteProcedure } from '@organigram/js';
declare const vote: {
    Proposal: React.FC<import('./Election').ElectionComponentProps>;
    Component: ({ procedure }: {
        procedure: VoteProcedure;
    }) => import("react/jsx-runtime").JSX.Element;
};
export default vote;

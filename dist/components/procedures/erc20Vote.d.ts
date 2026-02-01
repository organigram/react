import { default as React } from 'react';
import { ERC20VoteProcedure } from '@organigram/js';
declare const erc20Vote: {
    Component: ({ procedure }: {
        procedure: ERC20VoteProcedure;
    }) => import("react/jsx-runtime").JSX.Element;
    Proposal: React.FC<import('./Election').ElectionComponentProps>;
};
export default erc20Vote;

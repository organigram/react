import { default as React } from 'react';
import { ERC20VoteProcedure, ProcedureProposal, TransactionOptions, VoteProcedure } from '@organigram/js';
import { ethers } from 'ethers';
export interface ElectionComponentProps {
    procedure: ERC20VoteProcedure | VoteProcedure;
    proposal: ProcedureProposal;
    accountInOrgans: {
        proposers?: boolean;
        moderators?: boolean;
        deciders?: boolean;
    };
    wrapTransaction: TransactionOptions['onTransaction'];
    t: (key: string) => string;
    signer?: ethers.Signer | null;
}
export declare const ElectionComponent: React.FC<ElectionComponentProps>;

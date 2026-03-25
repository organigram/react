import { default as React } from 'react';
import { ERC20VoteProcedure, ProcedureProposal, TransactionOptions, VoteProcedure } from '@organigram/js';
import { PublicClient, WalletClient } from 'viem';
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
    publicClient?: PublicClient | null;
    walletClient?: WalletClient | null;
}
export declare const ElectionComponent: React.FC<ElectionComponentProps>;

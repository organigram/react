import { ProcedureProposal, NominationProcedure, TransactionOptions } from '@organigram/js';
import { PublicClient, WalletClient } from 'viem';
export declare const NominationProcedureComponent: ({ procedure }: {
    procedure: NominationProcedure;
}) => import("react/jsx-runtime").JSX.Element;
export interface NominationProposalProps {
    procedure: NominationProcedure;
    proposal: ProcedureProposal;
    accountInOrgans?: {
        proposers?: boolean;
        moderators?: boolean;
        deciders?: boolean;
    };
    wrapTransaction: TransactionOptions['onTransaction'];
    t: (key: string, options?: any) => string;
    publicClient?: PublicClient | null;
    walletClient?: WalletClient | null;
}
declare const vote: {
    Component: ({ procedure }: {
        procedure: NominationProcedure;
    }) => import("react/jsx-runtime").JSX.Element;
    Proposal: ({ procedure, proposal, accountInOrgans, wrapTransaction, t, publicClient, walletClient }: NominationProposalProps) => import("react/jsx-runtime").JSX.Element;
};
export default vote;

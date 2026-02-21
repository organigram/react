import { ProcedureProposal, NominationProcedure, TransactionOptions } from '@organigram/js';
import { ethers } from 'ethers';
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
    signer: ethers.Signer | null;
}
declare const vote: {
    Component: ({ procedure }: {
        procedure: NominationProcedure;
    }) => import("react/jsx-runtime").JSX.Element;
    Proposal: ({ procedure, proposal, accountInOrgans, wrapTransaction, t, signer }: NominationProposalProps) => import("react/jsx-runtime").JSX.Element;
};
export default vote;

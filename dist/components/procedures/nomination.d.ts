import { ProcedureProposal, NominationProcedure, type TransactionOptions } from '@organigram/js';
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
}
declare const vote: {
    Component: ({ procedure }: {
        procedure: NominationProcedure;
    }) => import("react/jsx-runtime").JSX.Element;
    Proposal: ({ procedure, proposal, accountInOrgans, wrapTransaction, t }: NominationProposalProps) => import("react/jsx-runtime").JSX.Element;
};
export default vote;

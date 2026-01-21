declare const procedures: {
    nomination: {
        Component: ({ procedure }: {
            procedure: import("@organigram/js").NominationProcedure;
        }) => import("react/jsx-runtime").JSX.Element;
        Proposal: ({ procedure, proposal, accountInOrgans, wrapTransaction, t }: import("./nomination").NominationProposalProps) => import("react/jsx-runtime").JSX.Element;
    };
    vote: {
        Proposal: import("react").FC<import("./Election").ElectionComponentProps>;
        Component: ({ procedure }: {
            procedure: import("@organigram/js").VoteProcedure;
        }) => import("react/jsx-runtime").JSX.Element;
    };
    erc20Vote: {
        Component: ({ procedure }: {
            procedure: import("@organigram/js").ERC20VoteProcedure;
        }) => import("react/jsx-runtime").JSX.Element;
        Proposal: import("react").FC<import("./Election").ElectionComponentProps>;
    };
};
export default procedures;

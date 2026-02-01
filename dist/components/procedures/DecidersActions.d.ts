import { default as React } from 'react';
import { AccountInOrgans, ERC20VoteProcedure, ProcedureProposal, VoteProcedure } from '@organigram/js';
import { ElectionComponentProps } from './Election';
export interface DecidersActionsProps {
    procedure: ERC20VoteProcedure | VoteProcedure;
    accountInOrgans: AccountInOrgans;
    proposal: ProcedureProposal;
    wrapTransaction: () => void;
}
export declare const DecidersActions: React.FC<ElectionComponentProps>;

import { ProcedureProposal, ProcedureJson, OrganigramJson, OrganJson } from '@organigram/js';
import { Signer } from 'ethers';
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | '';
export declare const filterProposals: (filter: ProposalFilter, proposals: ProcedureProposal[]) => ProcedureProposal[];
export declare const useDeployedProcedure: (options: {
    procedure?: ProcedureJson;
    organigram: OrganigramJson;
    signer?: Signer | null;
}) => ProcedureJson | undefined;
export declare const isUserInSourceOrgan: (sourceOrganType: string, organs: OrganJson[], deployedProcedure?: ProcedureJson, wallet?: string) => boolean;

import { ProcedureProposal, ProcedureJson, OrganJson, SourceOrganTypeName } from '@organigram/js';
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | '';
export declare const filterProposals: (filter: ProposalFilter, proposals: ProcedureProposal[]) => ProcedureProposal[];
export declare const isUserInSourceOrgan: (sourceOrganType: SourceOrganTypeName, organs: OrganJson[], deployedProcedure?: ProcedureJson, userAddress?: string) => boolean;

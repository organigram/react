import { ProcedureProposal, ProcedureJson, OrganJson, ProcedureRoleTypeName } from '@organigram/js';
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | '';
export declare const filterProposals: (filter: ProposalFilter, proposals: ProcedureProposal[]) => ProcedureProposal[];
export declare const isUserInSourceOrgan: (roleType: ProcedureRoleTypeName, organs: OrganJson[], deployedProcedure?: ProcedureJson, userAddress?: string) => boolean;

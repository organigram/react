import { Procedure as DeployedProcedure, EnhancedProcedure, ProcedureProposal, Organigram, Organ, Procedure } from '@organigram/js';
import { Signer } from 'ethers';
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | '';
export declare const filterProposals: (filter: ProposalFilter, proposals: ProcedureProposal[]) => ProcedureProposal[];
export declare const useDeployedProcedure: (options: {
    procedure?: EnhancedProcedure;
    organigram: Organigram;
    signer?: Signer | null;
}) => Procedure | undefined;
export declare const isUserInSourceOrgan: (sourceOrganType: string, organs: Organ[], deployedProcedure?: DeployedProcedure, wallet?: string) => boolean;

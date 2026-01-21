import { type Procedure as DeployedProcedure, type ProcedureProposal } from '@organigram/js';
import { Signer } from 'ethers';
import { DiagramOrganigram } from '../components/Diagram';
import { DiagramProcedure } from '../components/Diagram/ProcedureNode';
import { DiagramOrgan } from '../components/Diagram/OrganNode';
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | '';
export declare const filterProposals: (filter: ProposalFilter, proposals: ProcedureProposal[]) => ProcedureProposal[];
export declare const useDeployedProcedure: (options: {
    procedure?: DiagramProcedure;
    organigram: DiagramOrganigram;
    signer?: Signer | null;
}) => DiagramProcedure | undefined;
export declare const isUserInSourceOrgan: (sourceOrganType: string, organs: DiagramOrgan[], deployedProcedure?: DeployedProcedure, wallet?: string) => boolean;

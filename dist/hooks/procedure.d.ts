import { type Procedure as DeployedProcedure, type ProcedureProposal } from '@organigram/js';
import { Signer } from 'ethers';
import { DiagramOrgan, DiagramProcedure, OrganigramDiagram } from '../components/Diagram';
export type ProposalFilter = 'current' | 'drafts' | 'passed' | 'blocked' | '';
export declare const filterProposals: (filter: ProposalFilter, proposals: ProcedureProposal[]) => ProcedureProposal[];
export declare const useDeployedProcedure: (options: {
    procedure?: DiagramProcedure;
    organigram: OrganigramDiagram;
    signer: Signer;
}) => DiagramProcedure | undefined;
export declare const isUserInSourceOrgan: (sourceOrganType: string, organs: DiagramOrgan[], deployedProcedure?: DeployedProcedure, wallet?: string) => boolean;

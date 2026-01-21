import { type Organ, OrganigramClient } from '@organigram/js';
import { DiagramOrganigram } from '../components/Diagram';
import { Signer } from 'ethers';
import { DiagramOrgan } from '../components/Diagram/OrganNode';
export declare const getDeployedOrganData: (organAddress?: string | null, client?: OrganigramClient | null) => Promise<Organ | undefined>;
export declare const useDeployedOrgan: ({ organ, signer }: {
    organ?: DiagramOrgan | null;
    signer?: Signer | null;
}) => DiagramOrgan | undefined;
export declare const useDeployedOrgans: ({ organigram, signer }: {
    organigram: DiagramOrganigram;
    signer?: Signer | null;
}) => DiagramOrgan[];

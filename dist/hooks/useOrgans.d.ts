import { Organ, Organigram, OrganigramClient, OrganWithSourcesAndTargets } from '@organigram/js';
import { Signer } from 'ethers';
export declare const getDeployedOrganData: (organAddress?: string | null, client?: OrganigramClient | null) => Promise<Organ | undefined>;
export declare const getOrganSourcesAndTargets: (organ: Organ, organigram: Organigram) => OrganWithSourcesAndTargets;
export declare const useDeployedOrgan: ({ organ, signer }: {
    organ?: Organ | null;
    signer?: Signer | null;
}) => Organ | undefined;
export declare const useDeployedOrgans: ({ organigram, signer }: {
    organigram: Organigram;
    signer?: Signer | null;
}) => Organ[];

import { OrganigramClient, OrganigramJson, OrganJson } from '@organigram/js';
import { Signer } from 'ethers';
export declare const getDeployedOrganData: (organAddress?: string | null, client?: OrganigramClient | null) => Promise<OrganJson | undefined>;
export declare const useDeployedOrgans: ({ organigram, signer }: {
    organigram: OrganigramJson;
    signer?: Signer | null;
}) => OrganJson[];

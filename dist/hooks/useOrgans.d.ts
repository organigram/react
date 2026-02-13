import { OrganigramClient, OrganJson } from '@organigram/js';
export declare const getDeployedOrganData: (organAddress?: string | null, client?: OrganigramClient | null) => Promise<OrganJson | undefined>;

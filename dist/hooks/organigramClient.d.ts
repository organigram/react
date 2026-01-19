import { OrganigramClient, type ProcedureType, type Organ, type Procedure } from '@organigram/js';
import { TransactionOptions } from '@organigram/js';
import { Signer } from 'ethers';
export declare const organigramIdState: import("recoil").RecoilState<string>;
export type CreateOrgan = (metadataCid: string, index?: number) => Promise<Organ>;
export type CreateProcedure = (type: string, options: TransactionOptions, metadataCid: string, proposers: string, moderators: string, deciders: string, withModeration: boolean, forwarder: string, ...args: unknown[]) => Promise<Procedure & {
    type: ProcedureType;
}>;
export interface UseOrganigramClient {
    organigramClient: OrganigramClient | null;
    createOrgan: CreateOrgan;
    createProcedure: CreateProcedure;
    isLoading: boolean;
    chainId?: string;
}
export declare const useOrganigramClient: (signer: Signer, handleTransaction?: () => void) => UseOrganigramClient;

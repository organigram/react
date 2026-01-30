import { TransactionOptions, OrganigramClient, type ProcedureType, type Organ, type Procedure } from '@organigram/js';
import { ethers, Signer } from 'ethers';
export declare const organigramIdState: import("recoil").RecoilState<string>;
export type CreateOrgan = (metadataCid: string, salt: string, index?: number) => Promise<Organ>;
export type CreateProcedure = (type: string, options: TransactionOptions, metadataCid: string, proposers: string, moderators: string, deciders: string, withModeration: boolean, forwarder: string, salt: string, ...args: unknown[]) => Promise<Procedure & {
    type: ProcedureType;
}>;
export interface OrganigramClientContext {
    organigramClient: OrganigramClient | null;
    createOrgan: CreateOrgan;
    createProcedure: CreateProcedure;
    isLoading: boolean;
    chainId?: string;
}
export declare const useOrganigramClient: (signer?: Signer | null, handleTransaction?: (tx: ethers.TransactionResponse, description: string) => void) => OrganigramClientContext;
